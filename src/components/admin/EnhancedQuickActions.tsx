
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Shield, 
  Database, 
  Activity, 
  Zap, 
  Send,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function EnhancedQuickActions() {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const handleBroadcastMessage = async () => {
    if (!broadcastMessage.trim() || !broadcastSubject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and message for the broadcast.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Broadcast Sent",
      description: `Message "${broadcastSubject}" sent to all active users.`,
    });
    setBroadcastMessage("");
    setBroadcastSubject("");
    setIsBroadcastOpen(false);
  };

  const handleSystemMaintenance = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    toast({
      title: isMaintenanceMode ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
      description: isMaintenanceMode 
        ? "Platform is now accessible to all users." 
        : "Platform is now in maintenance mode. Only admins can access.",
      variant: isMaintenanceMode ? "default" : "destructive"
    });
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Database Backup Initiated",
      description: "Full database backup started. You will be notified when complete.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "User data export initiated. Download link will be sent to your email.",
    });
  };

  const handleSystemRestart = () => {
    toast({
      title: "System Restart",
      description: "System restart scheduled for the next maintenance window.",
      variant: "destructive"
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
          <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send size={20} />
                <div className="text-center">
                  <div className="font-medium">Broadcast</div>
                  <div className="text-xs opacity-90">Send message to all users</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Broadcast Message</DialogTitle>
                <DialogDescription>
                  Send an important message to all active users on the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter broadcast subject..."
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your broadcast message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsBroadcastOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBroadcastMessage} className="bg-blue-600 hover:bg-blue-700">
                    Send Broadcast
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleSystemMaintenance}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center gap-2 ${
              isMaintenanceMode 
                ? 'border-red-200 hover:bg-red-50 bg-red-50' 
                : 'border-orange-200 hover:bg-orange-50'
            }`}
          >
            <Shield size={20} className={isMaintenanceMode ? "text-red-600" : "text-orange-600"} />
            <div className="text-center">
              <div className="font-medium">
                {isMaintenanceMode ? "Exit Maintenance" : "Maintenance"}
              </div>
              <div className="text-xs text-muted-foreground">
                {isMaintenanceMode ? "Disable maintenance mode" : "Enable maintenance mode"}
              </div>
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
            <RefreshCw size={20} className="text-purple-600" />
            <div className="text-center">
              <div className="font-medium">Clear Cache</div>
              <div className="text-xs text-muted-foreground">Refresh system cache</div>
            </div>
          </Button>

          <Button
            onClick={handleExportData}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 border-indigo-200 hover:bg-indigo-50"
          >
            <Download size={20} className="text-indigo-600" />
            <div className="text-center">
              <div className="font-medium">Export Data</div>
              <div className="text-xs text-muted-foreground">Download user data</div>
            </div>
          </Button>

          <Button
            onClick={handleSystemRestart}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 border-red-200 hover:bg-red-50"
          >
            <Settings size={20} className="text-red-600" />
            <div className="text-center">
              <div className="font-medium">System Restart</div>
              <div className="text-xs text-muted-foreground">Schedule system restart</div>
            </div>
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Activity size={16} />
            System Status
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Activity size={12} className="mr-1" />
              All Systems Operational
            </Badge>
            <Badge variant="outline">
              <Users size={12} className="mr-1" />
              324 Active Users
            </Badge>
            <Badge variant="outline">
              <Database size={12} className="mr-1" />
              DB: 99.9% Uptime
            </Badge>
            {isMaintenanceMode && (
              <Badge variant="destructive">
                <Shield size={12} className="mr-1" />
                Maintenance Mode Active
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
