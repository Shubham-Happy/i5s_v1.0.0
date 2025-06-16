import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Eye, MessageCircle, FileText, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  details?: string;
  user?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export function UserActivityMonitor() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setIsLoading(true);
      
      // Fetch recent posts as activities
      const { data: recentPosts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          created_at,
          content
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (postsError) throw postsError;

      // Fetch user profiles separately
      const userIds = [...new Set([
        ...(recentPosts || []).map(post => post.user_id)
      ])];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a profiles map for easy lookup
      const profilesMap = new Map(
        (profiles || []).map(profile => [profile.id, profile])
      );

      const postActivities: UserActivity[] = (recentPosts || []).map(post => ({
        id: `post-${post.id}`,
        user_id: post.user_id,
        action: 'created_post',
        timestamp: post.created_at,
        details: post.content?.substring(0, 50) + '...',
        user: profilesMap.get(post.user_id)
      }));

      // Fetch recent articles as activities
      const { data: recentArticles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          id,
          user_id,
          created_at,
          title
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (articlesError) throw articlesError;

      const articleActivities: UserActivity[] = (recentArticles || []).map(article => ({
        id: `article-${article.id}`,
        user_id: article.user_id,
        action: 'published_article',
        timestamp: article.created_at,
        details: article.title,
        user: profilesMap.get(article.user_id)
      }));

      // Combine and sort activities
      const allActivities = [...postActivities, ...articleActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      setActivities(allActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created_post':
        return <MessageCircle size={16} className="text-blue-600" />;
      case 'published_article':
        return <FileText size={16} className="text-green-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getActivityLabel = (action: string) => {
    switch (action) {
      case 'created_post':
        return 'Posted';
      case 'published_article':
        return 'Published Article';
      default:
        return 'Activity';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
          <Activity size={20} className="text-green-600 dark:text-green-400" />
          Live User Activity
        </CardTitle>
        <CardDescription>
          Real-time monitoring of user actions across the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user?.avatar_url || ''} />
                  <AvatarFallback className="bg-green-100 text-green-600">
                    {activity.user?.full_name?.[0] || activity.user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.action)}
                    <span className="font-medium text-sm">
                      {activity.user?.full_name || activity.user?.username || 'Unknown User'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getActivityLabel(activity.action)}
                    </span>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {activity.details}
                    </p>
                  )}
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {formatTimeAgo(activity.timestamp)}
                </Badge>
              </div>
            ))}
            
            {activities.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Activity size={48} className="mx-auto mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
