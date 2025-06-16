
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";

export interface Notification {
  id: string;
  type: string; // 'like', 'comment', 'follow', 'mention', 'system', 'message'
  content: string;
  time: string;
  read: boolean;
  link?: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        console.log("No session found");
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }
      
      // Fetch notifications without join
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('time', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      if (notificationsData && notificationsData.length > 0) {
        // Get unique actor user IDs
        const actorUserIds = Array.from(new Set(
          notificationsData
            .filter(n => n.actor_user_id)
            .map(n => n.actor_user_id)
        ));
        
        // Fetch actor profiles separately if there are any
        let actorProfiles: any[] = [];
        if (actorUserIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', actorUserIds);
          
          actorProfiles = profilesData || [];
        }
        
        // Map notifications with actor information
        const formattedNotifications: Notification[] = notificationsData.map((notification: any) => {
          let actor = undefined;
          
          if (notification.actor_user_id) {
            const actorProfile = actorProfiles.find(p => p.id === notification.actor_user_id);
            if (actorProfile) {
              actor = {
                id: actorProfile.id,
                name: actorProfile.full_name || 'Unknown User',
                avatar: actorProfile.avatar_url
              };
            }
          }
          
          return {
            id: notification.id,
            type: notification.type,
            content: notification.content,
            time: notification.time,
            read: notification.read,
            link: notification.link,
            actor
          };
        });
        
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      setNotifications([]);
      setUnreadCount(0);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Update in database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        console.error("Error marking notification as read:", error);
        // Revert local state on error
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: false } 
              : notification
          )
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      // Update local state immediately
      const previousNotifications = notifications;
      const previousUnreadCount = unreadCount;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      // Update in database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.session.user.id)
        .eq('read', false);
      
      if (error) {
        console.error("Error marking all notifications as read:", error);
        // Revert on error
        setNotifications(previousNotifications);
        setUnreadCount(previousUnreadCount);
        toast({
          title: "Error",
          description: "Failed to mark notifications as read.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "All notifications marked as read.",
        });
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Set up real-time subscription for new notifications
  const setupSubscription = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return null;

      const channel = supabase
        .channel('notifications-changes')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.session.user.id}`
          }, 
          async payload => {
            console.log("New notification received:", payload);
            const newNotification = payload.new as any;
            
            // Fetch actor information for the new notification
            let actorInfo = null;
            if (newNotification.actor_user_id) {
              const { data: actorData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('id', newNotification.actor_user_id)
                .single();
              
              if (actorData) {
                actorInfo = {
                  id: actorData.id,
                  name: actorData.full_name || 'Unknown User',
                  avatar: actorData.avatar_url
                };
              }
            }
            
            // Create formatted notification
            const formattedNotification: Notification = {
              id: newNotification.id,
              type: newNotification.type,
              content: newNotification.content,
              time: newNotification.time,
              read: newNotification.read,
              link: newNotification.link,
              actor: actorInfo
            };
            
            setNotifications(prev => [formattedNotification, ...prev]);
            if (!newNotification.read) {
              setUnreadCount(prev => prev + 1);
            }
            
            // Send browser notification
            sendBrowserNotification(formattedNotification);
            
            // Show toast for new notification
            toast({
              title: "New notification",
              description: newNotification.content,
            });
          }
        )
        .subscribe();
      
      return channel;
    } catch (error) {
      console.error("Error setting up notification subscription:", error);
      return null;
    }
  }, []);

  // Send browser notification based on type
  const sendBrowserNotification = async (notification: Notification) => {
    try {
      const actorName = notification.actor?.name || 'Someone';
      
      switch (notification.type) {
        case 'follow':
          await notificationService.sendFollowerNotification(actorName);
          break;
        case 'like':
          await notificationService.sendLikeNotification(actorName, 'your post');
          break;
        case 'comment':
          await notificationService.sendCommentNotification(actorName, 'your post');
          break;
        case 'message':
          await notificationService.sendMessageNotification(actorName, notification.content);
          break;
        case 'system':
          await notificationService.sendSystemNotification('System Notification', notification.content);
          break;
        default:
          await notificationService.sendSystemNotification('New Notification', notification.content);
      }
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up subscription
    setupSubscription().then(channel => {
      // Store channel reference for cleanup
      if (channel) {
        return () => {
          supabase.removeChannel(channel);
        };
      }
    });
  }, [fetchNotifications, setupSubscription]);

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    setupSubscription
  };
}
