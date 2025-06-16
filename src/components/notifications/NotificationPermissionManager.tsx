
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Check, X } from "lucide-react";
import { notificationService } from "@/services/notificationService";
import { toast } from "@/hooks/use-toast";

export function NotificationPermissionManager() {
  const [permissionStatus, setPermissionStatus] = useState(notificationService.getPermissionStatus());
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Update permission status on component mount
    setPermissionStatus(notificationService.getPermissionStatus());
  }, []);

  const handleRequestPermission = async () => {
    if (!notificationService.isSupported()) {
      toast({
        title: "Not Supported",
        description: "Notifications are not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    setIsRequesting(true);
    try {
      const permission = await notificationService.requestPermission();
      setPermissionStatus(notificationService.getPermissionStatus());
      
      if (permission === 'granted') {
        toast({
          title: "Permission Granted",
          description: "You'll now receive notifications from StatusNow.",
        });
        
        // Send a test notification
        await notificationService.sendSystemNotification(
          "Notifications Enabled",
          "You'll now receive updates about your activity on StatusNow!"
        );
      } else {
        toast({
          title: "Permission Denied",
          description: "You can enable notifications later in your browser settings.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error requesting permission:", error);
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendSystemNotification(
        "Test Notification",
        "This is a test notification from StatusNow!"
      );
      toast({
        title: "Test Sent",
        description: "Check if you received the test notification.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive"
      });
    }
  };

  if (!notificationService.isSupported()) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <BellOff size={20} />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support notifications.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`${
      permissionStatus.granted 
        ? "border-green-200" 
        : permissionStatus.denied 
        ? "border-red-200"
        : "border-blue-200"
    }`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${
          permissionStatus.granted 
            ? "text-green-700" 
            : permissionStatus.denied 
            ? "text-red-700"
            : "text-blue-700"
        }`}>
          {permissionStatus.granted ? (
            <>
              <Check size={20} />
              Notifications Enabled
            </>
          ) : permissionStatus.denied ? (
            <>
              <X size={20} />
              Notifications Blocked
            </>
          ) : (
            <>
              <Bell size={20} />
              Enable Notifications
            </>
          )}
        </CardTitle>
        <CardDescription>
          {permissionStatus.granted
            ? "You're receiving notifications from StatusNow."
            : permissionStatus.denied
            ? "Notifications are blocked. You can enable them in your browser settings."
            : "Get notified about new messages, followers, and activity."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {permissionStatus.default && (
          <Button 
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="w-full"
          >
            {isRequesting ? (
              <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Button>
        )}
        
        {permissionStatus.granted && (
          <Button 
            onClick={handleTestNotification}
            variant="outline"
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        )}
        
        {permissionStatus.denied && (
          <div className="text-sm text-muted-foreground">
            To enable notifications, click the lock icon in your browser's address bar and allow notifications for this site.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
