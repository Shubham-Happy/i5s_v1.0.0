
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Bell, Send, Users, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  recipient_type: 'all' | 'admins' | 'specific';
  created_at: string;
  sent_count: number;
}

export function SystemNotifications() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const [newNotification, setNewNotification] = useState({
    type: 'info' as const,
    title: '',
    message: '',
    recipient_type: 'all' as const
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll create some sample system notifications
      // In a real app, you'd have a system_notifications table
      const sampleNotifications: SystemNotification[] = [
        {
          id: '1',
          type: 'info',
          title: 'Platform Maintenance',
          message: 'Scheduled maintenance will occur this weekend from 2-4 AM EST.',
          recipient_type: 'all',
          created_at: new Date().toISOString(),
          sent_count: 245
        },
        {
          id: '2',
          type: 'success',
          title: 'New Feature Release',
          message: 'We have released new messaging features for better communication.',
          recipient_type: 'all',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sent_count: 198
        },
        {
          id: '3',
          type: 'warning',
          title: 'Security Update Required',
          message: 'Please update your passwords for enhanced security.',
          recipient_type: 'all',
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          sent_count: 156
        }
      ];
      
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load system notifications.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSystemNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Get users based on recipient type
      let targetUsers = [];
      
      if (newNotification.recipient_type === 'all') {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id');
        
        if (error) throw error;
        targetUsers = users || [];
      } else if (newNotification.recipient_type === 'admins') {
        const { data: admins, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_admin', true);
        
        if (error) throw error;
        targetUsers = admins || [];
      }

      // Create notifications for each user
      const notificationPromises = targetUsers.map(user => 
        supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            type: 'system',
            content: newNotification.message,
            link: null
          })
      );

      await Promise.all(notificationPromises);

      // Add to our local state (in a real app, this would be stored in a system_notifications table)
      const newSystemNotification: SystemNotification = {
        id: Date.now().toString(),
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        recipient_type: newNotification.recipient_type,
        created_at: new Date().toISOString(),
        sent_count: targetUsers.length
      };

      setNotifications([newSystemNotification, ...notifications]);

      // Reset form
      setNewNotification({
        type: 'info',
        title: '',
        message: '',
        recipient_type: 'all'
      });

      toast({
        title: "Notification Sent",
        description: `System notification sent to ${targetUsers.length} users.`,
      });

    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send system notification.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800 border-0">Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-0">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-0">Error</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-0">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New Notification */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <Send size={20} />
            Send System Notification
          </CardTitle>
          <CardDescription>
            Send important notifications to users across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-type">Notification Type</Label>
              <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="recipient-type">Recipients</Label>
              <Select value={newNotification.recipient_type} onValueChange={(value: any) => setNewNotification({...newNotification, recipient_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admins">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notification-title">Title</Label>
            <Input
              id="notification-title"
              placeholder="Enter notification title..."
              value={newNotification.title}
              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="notification-message">Message</Label>
            <Textarea
              id="notification-message"
              placeholder="Enter notification message..."
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              rows={4}
            />
          </div>
          
          <Button 
            onClick={sendSystemNotification} 
            disabled={isSending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <Bell size={20} />
            Recent System Notifications
          </CardTitle>
          <CardDescription>
            Previously sent system-wide notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="w-8 h-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No system notifications sent yet.
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card key={notification.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {getNotificationBadge(notification.type)}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Sent to {notification.sent_count} users
                              </span>
                              <span>
                                {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.recipient_type === 'all' ? 'All Users' : 'Admins Only'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
