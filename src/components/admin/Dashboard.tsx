
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bell, Building, CheckCircle, FileText, Shield, User, XCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnhancedDashboardStats } from "./EnhancedDashboardStats";
import { EnhancedQuickActions } from "./EnhancedQuickActions";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import { UserActivityMonitor } from "./UserActivityMonitor";
import { ContentModeration } from "./ContentModeration";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  counts: {
    users: number;
    posts: number;
    articles: number;
    jobs: number;
    startups: number;
    events: number;
  };
}

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_name?: string;
  icon_component: JSX.Element;
  icon_bg: string;
}

export function Dashboard({ counts }: DashboardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setIsLoading(true);
      try {
        // Fetch recent users
        const { data: recentUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, created_at, full_name, username')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (usersError) throw usersError;
        
        const { data: recentArticles, error: articlesError } = await supabase
          .from('articles')
          .select('id, created_at, title, user_id')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (articlesError) throw articlesError;
        
        const { data: recentStartups, error: startupsError } = await supabase
          .from('startups')
          .select('id, created_at, name')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (startupsError) throw startupsError;
        
        const allActivities: Activity[] = [
          ...(recentUsers || []).map(user => ({
            id: `user-${user.id}`,
            type: 'user',
            description: 'New user registered',
            entity_name: user.full_name || user.username || 'Unknown User',
            created_at: user.created_at,
            icon_component: <User className="h-4 w-4 text-purple-600" />,
            icon_bg: 'bg-purple-100'
          })),
          ...(recentArticles || []).map(article => ({
            id: `article-${article.id}`,
            type: 'article',
            description: 'New article published',
            entity_name: article.title,
            created_at: article.created_at,
            icon_component: <FileText className="h-4 w-4 text-green-600" />,
            icon_bg: 'bg-green-100'
          })),
          ...(recentStartups || []).map(startup => ({
            id: `startup-${startup.id}`,
            type: 'startup',
            description: 'New startup registered',
            entity_name: startup.name,
            created_at: startup.created_at,
            icon_component: <Building className="h-4 w-4 text-purple-600" />,
            icon_bg: 'bg-cream-100'
          }))
        ];
        
        allActivities.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setActivities(allActivities.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast({
          title: "Error",
          description: "Failed to load recent activity data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, []);
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, 'MMM d');
  };

  return (
    <div className="space-y-6">
      <EnhancedDashboardStats counts={counts} />
      
      <EnhancedQuickActions />
      
      <RealTimeAnalytics />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserActivityMonitor />
        <ContentModeration />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
              <Calendar className="h-5 w-5 mr-2" />
              Platform Activity Heatmap
            </CardTitle>
            <CardDescription>Daily activity overview</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = Math.floor(Math.random() * 5);
                  const today = new Date().getDate();
                  const isToday = (i + 1) === today;
                  
                  return (
                    <div 
                      key={i} 
                      className={`
                        h-7 w-full rounded-sm border 
                        ${isToday ? 'border-purple-400' : 'border-transparent'}
                        ${intensity === 0 ? 'bg-muted/30' : ''}
                        ${intensity === 1 ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
                        ${intensity === 2 ? 'bg-purple-200 dark:bg-purple-800/40' : ''}
                        ${intensity === 3 ? 'bg-purple-300 dark:bg-purple-700/50' : ''}
                        ${intensity === 4 ? 'bg-purple-400 dark:bg-purple-600/60' : ''}
                      `}
                      title={`${intensity} activities`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div 
                      key={level}
                      className={`
                        h-3 w-3 rounded-sm
                        ${level === 0 ? 'bg-muted/30' : ''}
                        ${level === 1 ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
                        ${level === 2 ? 'bg-purple-200 dark:bg-purple-800/40' : ''}
                        ${level === 3 ? 'bg-purple-300 dark:bg-purple-700/50' : ''}
                        ${level === 4 ? 'bg-purple-400 dark:bg-purple-600/60' : ''}
                      `}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
              <Bell className="h-5 w-5 mr-2" />
              Recent Activity
              <Badge className="ml-2 bg-green-100 text-green-700">Live</Badge>
            </CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-cream-100 dark:border-gray-800 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-40 bg-muted/50 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-5 w-12 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={activity.id} className={`flex items-center justify-between ${index < activities.length - 1 ? 'border-b border-cream-100 dark:border-gray-800 pb-2' : ''}`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${activity.icon_bg} flex items-center justify-center mr-3`}>
                          {activity.icon_component}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.entity_name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{formatTimeAgo(activity.created_at)}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent activity found
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-cream-50 dark:bg-gray-900/20 rounded-b-lg">
            <Button variant="ghost" className="w-full text-sm">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-purple-50 dark:from-purple-900/20 dark:to-green-900/20 rounded-t-lg">
          <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
            <Shield className="h-5 w-5 mr-2" />
            System Status
            <Badge className="ml-2 bg-green-100 text-green-700">All Systems Operational</Badge>
          </CardTitle>
          <CardDescription>Platform health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-cream-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">API Services</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-cream-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-cream-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Authentication</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-cream-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
