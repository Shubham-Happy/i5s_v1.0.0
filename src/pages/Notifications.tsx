
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { NotificationPermissionManager } from "@/components/notifications/NotificationPermissionManager";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Notification time formatter
  const formatNotificationTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-green to-gold-medium rounded-lg flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with your latest activity</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refreshNotifications()}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <Button 
              onClick={() => markAllAsRead()}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notification Permission Manager */}
      <NotificationPermissionManager />
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4" aria-busy="true" aria-label="Loading notification skeleton">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => {
            let icon;
            let bgColor = 'bg-slate-100';
            
            switch (notification.type) {
              case 'like':
                icon = <span className="text-red-500">❤️</span>;
                bgColor = 'bg-red-50';
                break;
              case 'comment':
                icon = <span>💬</span>;
                bgColor = 'bg-blue-50';
                break;
              case 'follow':
                icon = <span>👋</span>;
                bgColor = 'bg-green-50';
                break;
              case 'mention':
                icon = <span>@</span>;
                bgColor = 'bg-purple-50';
                break;
              case 'system':
                icon = <Sparkles className="h-4 w-4 text-amber-500" />;
                bgColor = 'bg-yellow-50';
                break;
              case 'message':
                icon = <span>✉️</span>;
                bgColor = 'bg-indigo-50';
                break;
              default:
                icon = <Bell className="h-4 w-4" />;
            }
            
            return (
              <Card 
                key={notification.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  !notification.read && "bg-muted/20 border-primary/20"
                )}
                onClick={() => !notification.read && markAsRead(notification.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") !notification.read && markAsRead(notification.id); }}
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
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", bgColor)}>
                        {icon}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium text-sm">
                          {notification.actor?.name || "System"}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatNotificationTime(notification.time)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                        {notification.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {notification.link && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                            className="p-0 h-auto text-primary hover:text-primary/80"
                          >
                            <Link to={notification.link} className="flex items-center gap-1">
                              View details →
                            </Link>
                          </Button>
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
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-green to-gold-medium rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When you get notifications, they'll appear here. Notifications include likes on your posts, new followers, comments, and mentions.
            </p>
            <Button onClick={refreshNotifications} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check for updates
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
