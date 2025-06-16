
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, UserPlus, Heart, MessageSquare, AtSign, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "@/hooks/use-toast";

export function NotificationCenter() {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  // Fetch notifications when the component mounts
  useEffect(() => {
    refreshNotifications().catch(error => {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive"
      });
    });
  }, [refreshNotifications]);

  // Function to render notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  // Function to format the notification time
  const formatNotificationTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // less than a day
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 10080) { // less than a week
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        {[1, 2, 3, 4].map((index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications && notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </h2>
            {notifications.some(n => !n.read) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>
          
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                !notification.read && "bg-muted/20 border-primary/20"
              )}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {notification.actor ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                      <AvatarFallback className="bg-gradient-to-br from-slate-green to-gold-medium text-white">
                        {notification.actor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-green to-gold-medium flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-sm truncate">
                        {notification.actor?.name || "System"}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatNotificationTime(notification.time)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {notification.link && (
                        <Link 
                          to={notification.link} 
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View details
                          <span>→</span>
                        </Link>
                      )}
                      
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-green to-gold-medium rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">You're all caught up!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You have no new notifications at the moment. When you get likes, comments, or follows, they'll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
