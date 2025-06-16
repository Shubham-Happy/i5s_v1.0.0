
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Bell, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PrivacySecurityTabProps {
  user: any;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export function PrivacySecurityTab({ user }: PrivacySecurityTabProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        const savedSettings = localStorage.getItem(`notification_settings_${user?.id}`);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        }
        
      } catch (error) {
        console.error("Error loading notification settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Save to localStorage
      localStorage.setItem(`notification_settings_${user?.id}`, JSON.stringify(newSettings));
      
      toast({
        title: "Setting updated",
        description: "Your notification setting has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Update failed",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email address found for password reset.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  const notificationSettings = [
    {
      id: "emailNotifications" as keyof NotificationSettings,
      title: "Email Notifications",
      description: "Receive notifications via email",
      icon: Bell,
      value: settings.emailNotifications,
    },
    {
      id: "pushNotifications" as keyof NotificationSettings,
      title: "Push Notifications",
      description: "Receive push notifications in your browser",
      icon: Bell,
      value: settings.pushNotifications,
    },
    {
      id: "marketingEmails" as keyof NotificationSettings,
      title: "Marketing Emails",
      description: "Receive promotional emails and updates",
      icon: Bell,
      value: settings.marketingEmails,
    },
    {
      id: "weeklyDigest" as keyof NotificationSettings,
      title: "Weekly Digest",
      description: "Get a summary of your weekly activity",
      icon: Bell,
      value: settings.weeklyDigest,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Bell size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how and when you want to be notified about updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {notificationSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Icon size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">{setting.title}</div>
                    <div className="text-sm text-muted-foreground">{setting.description}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setting.value}
                    onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <Lock size={16} className="text-red-600 dark:text-red-400" />
            </div>
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium">Email Address</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Verified
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Lock size={16} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm text-muted-foreground">Change your account password</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Sending..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
