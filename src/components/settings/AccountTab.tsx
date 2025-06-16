
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Mail, Shield } from "lucide-react";
import { useUnifiedProfile } from "@/hooks/useUnifiedProfile";

interface AccountTabProps {
  user: any;
  signOut: () => void;
}

export function AccountTab({ user, signOut }: AccountTabProps) {
  const { profile } = useUnifiedProfile();
  const accountCreated = new Date(user?.created_at || Date.now());
  const daysSinceCreation = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Mail size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email Address</div>
                <div className="font-medium">{user?.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Calendar size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="font-medium">{accountCreated.toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Shield size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Account Status</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Active
                  </Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <User size={16} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="font-medium">
                  {profile?.username ? `@${profile.username}` : 'Not set'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Account Age</h4>
                <p className="text-sm text-green-600 dark:text-green-500">
                  {daysSinceCreation} days as a member
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {daysSinceCreation}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
          <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Shield size={16} className="text-orange-600 dark:text-orange-400" />
            </div>
            Account Actions
          </CardTitle>
          <CardDescription>
            Manage your account access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-800 dark:hover:bg-orange-900/20"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
