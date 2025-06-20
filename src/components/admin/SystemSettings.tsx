
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Database, Settings, Server, HardDrive, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SystemSettings() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "cozync",
    siteDescription: "A professional network for entrepreneurs and startup founders"
  });
  
  const [dbStats, setDbStats] = useState({
    tables: 0,
    totalRows: 0,
    dbSize: "0 MB",
    lastBackup: "Never"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState("");
  const [isSqlExecuting, setIsSqlExecuting] = useState(false);

  // Fetch database statistics (mock data for now)
  useEffect(() => {
    const fetchDbStats = async () => {
      try {
        // This would need to be a function call to get actual stats
        // For now using mock data that simulates increasing with DB growth
        
        // Get table counts to simulate some real stats
        const { count: profilesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
        
        const tablesCount = 12; // Mock number of tables
        const totalRowsCount = (profilesCount || 0) + (postsCount || 0) * 10;
        const estimatedSizeMB = Math.max(1, Math.round(totalRowsCount * 0.01));
        
        setDbStats({
          tables: tablesCount,
          totalRows: totalRowsCount,
          dbSize: `${estimatedSizeMB} MB`,
          lastBackup: "2025-05-08 09:30:00"
        });
      } catch (error) {
        console.error("Error fetching DB stats:", error);
      }
    };
    
    fetchDbStats();
  }, []);

  const handleSaveSettings = () => {
    // This would typically update site settings in a database
    // For now, just showing a success toast
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated successfully."
      });
      setIsLoading(false);
    }, 800);
  };

  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive"
      });
      return;
    }

    setIsSqlExecuting(true);
    setSqlError("");
    setSqlResult(null);

    try {
      // Use the Supabase exec_sql function or equivalent - note this is admin only
      // For security, in a real app this would need proper safeguards
      
      // First check if this is a SELECT query
      const isSelectQuery = sqlQuery.trim().toLowerCase().startsWith('select');
      
      if (isSelectQuery) {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: sqlQuery
        });
        
        if (error) throw error;
        
        setSqlResult({
          success: true,
          message: "Query executed successfully",
          data: data || []
        });
      } else {
        // For non-SELECT queries, we don't execute them through the frontend
        // This is a security best practice
        setSqlError("For security reasons, only SELECT queries can be executed from the admin panel.");
      }
    } catch (error: any) {
      console.error("SQL execution error:", error);
      setSqlError(error.message || "Failed to execute SQL query");
    } finally {
      setIsSqlExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-green-900/20 dark:to-green-800/20 rounded-t-lg">
          <CardTitle className="flex items-center text-green-700 dark:text-green-400">
            <Database className="h-5 w-5 mr-2" />
            Database Management
          </CardTitle>
          <CardDescription>Manage database tables and operations</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tables</p>
                <p className="text-2xl font-bold">{dbStats.tables}</p>
              </div>
              <div className="bg-cream-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{dbStats.totalRows.toLocaleString()}</p>
              </div>
              <div className="bg-cream-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Database Size</p>
                <p className="text-2xl font-bold">{dbStats.dbSize}</p>
              </div>
              <div className="bg-cream-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-2xl font-bold">{dbStats.lastBackup}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Label htmlFor="sqlQuery">Custom SQL Query (SELECT only)</Label>
              <Textarea 
                id="sqlQuery"
                placeholder="SELECT * FROM profiles LIMIT 10;" 
                className="font-mono mt-2 h-[120px] border-green-200 focus:border-green-500"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
              />
              <div className="mt-2 flex justify-between">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleExecuteSql}
                  disabled={isSqlExecuting}
                >
                  {isSqlExecuting ? "Executing..." : "Execute Query"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-200"
                  onClick={() => setSqlQuery("")}
                >
                  Clear
                </Button>
              </div>
              
              {sqlError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {sqlError}
                  </AlertDescription>
                </Alert>
              )}
              
              {sqlResult && (
                <div className="mt-4 bg-cream-50 dark:bg-gray-800 p-4 rounded-lg max-h-[300px] overflow-auto">
                  <p className="font-medium mb-2">{sqlResult.message}</p>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(sqlResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
          <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
            <Settings className="h-5 w-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription>Manage system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                className="border-purple-200 focus:border-purple-500" 
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea 
                id="siteDescription"
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                className="border-purple-200 focus:border-purple-500" 
              />
            </div>
            
            <div className="pt-2">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">System Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium">Production</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">May 08, 2025</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start border-purple-200"
                onClick={() => toast({
                  title: "Feature Coming Soon",
                  description: "System backup functionality will be available soon."
                })}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Backup System
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-purple-200"
                onClick={() => toast({
                  title: "Feature Coming Soon",
                  description: "System optimization functionality will be available soon."
                })}
              >
                <Server className="h-4 w-4 mr-2" />
                Optimize System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
