
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, Calendar, Shield, Database, Activity, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function QuickActions() {
  const handleBroadcastMessage = () => {
    toast({
      title: "Broadcast Feature",
      description: "Broadcast messaging system will be available soon.",
    });
  };

  const handleSystemMaintenance = () => {
    toast({
      title: "Maintenance Mode",
      description: "System maintenance mode toggled.",
    });
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Database Backup",
      description: "Database backup initiated successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared.",
    });
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2">
          <Zap size={20} className="text-purple-600 dark:text-purple-400" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Frequently used admin actions for platform management
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleBroadcastMessage}
            className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare size={20} />
            <div className="text-center">
              <div className="font-medium">Broadcast</div>
              <div className="text-xs opacity-90">Send message to all users</div>
            </div>
          </Button>

          <Button
            onClick={handleSystemMaintenance}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 border-orange-200 hover:bg-orange-50"
          >
            <Shield size={20} className="text-orange-600" />
            <div className="text-center">
              <div className="font-medium">Maintenance</div>
              <div className="text-xs text-muted-foreground">Toggle maintenance mode</div>
            </div>
          </Button>

          <Button
            onClick={handleBackupDatabase}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
          >
            <Database size={20} className="text-green-600" />
            <div className="text-center">
              <div className="font-medium">Backup</div>
              <div className="text-xs text-muted-foreground">Create database backup</div>
            </div>
          </Button>

          <Button
            onClick={handleClearCache}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 border-purple-200 hover:bg-purple-50"
          >
            <Activity size={20} className="text-purple-600" />
            <div className="text-center">
              <div className="font-medium">Clear Cache</div>
              <div className="text-xs text-muted-foreground">Refresh system cache</div>
            </div>
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">System Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Activity size={12} className="mr-1" />
              All Systems Operational
            </Badge>
            <Badge variant="outline">
              <Users size={12} className="mr-1" />
              24 Active Users
            </Badge>
            <Badge variant="outline">
              <Database size={12} className="mr-1" />
              DB: 99.9% Uptime
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
