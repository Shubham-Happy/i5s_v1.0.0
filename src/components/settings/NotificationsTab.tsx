
import { NotificationPermissionManager } from "@/components/notifications/NotificationPermissionManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  return (
    <div className="space-y-6">
      {/* Browser Notifications */}
      <NotificationPermissionManager />

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Activity Notifications</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="follow-notifications">New Followers</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone follows you
                  </p>
                </div>
                <Switch
                  id="follow-notifications"
                  checked={followNotifications}
                  onCheckedChange={setFollowNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comment-notifications">Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone comments on your posts
                  </p>
                </div>
                <Switch
                  id="comment-notifications"
                  checked={commentNotifications}
                  onCheckedChange={setCommentNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="like-notifications">Likes</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone likes your posts
                  </p>
                </div>
                <Switch
                  id="like-notifications"
                  checked={likeNotifications}
                  onCheckedChange={setLikeNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="message-notifications">Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    When you receive new messages
                  </p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={messageNotifications}
                  onCheckedChange={setMessageNotifications}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
