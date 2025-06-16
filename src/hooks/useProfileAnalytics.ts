
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface ProfileViewsData {
  date: string;
  views: number;
}

export interface ContentAnalytics {
  id: string;
  content_id: string;
  content_type: 'article' | 'post';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  title?: string;
}

export const useProfileAnalytics = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [profileViews, setProfileViews] = useState<ProfileViewsData[]>([]);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("useProfileAnalytics: Fetching analytics for user:", targetUserId);

        // Fetch profile views grouped by date (last 7 days)
        const { data: viewsData, error: viewsError } = await supabase
          .from('profile_views')
          .select('created_at')
          .eq('profile_user_id', targetUserId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true });

        if (viewsError) {
          console.error("Error fetching profile views:", viewsError);
          throw viewsError;
        }

        // Process views data by date
        const viewsByDate = viewsData?.reduce((acc: Record<string, number>, view) => {
          const date = new Date(view.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}) || {};

        const profileViewsArray = Object.entries(viewsByDate).map(([date, views]) => ({
          date,
          views: views as number
        }));

        setProfileViews(profileViewsArray);
        setTotalViews(viewsData?.length || 0);

        // Fetch content analytics
        const { data: contentData, error: contentError } = await supabase
          .from('content_analytics')
          .select('*')
          .eq('user_id', targetUserId)
          .order('views', { ascending: false });

        if (contentError) {
          console.error("Error fetching content analytics:", contentError);
          throw contentError;
        }

        // Fetch article titles for content analytics
        const articleIds = contentData?.filter(item => item.content_type === 'article').map(item => item.content_id) || [];
        const { data: articlesData } = await supabase
          .from('articles')
          .select('id, title')
          .in('id', articleIds);

        const articlesMap = articlesData?.reduce((acc: Record<string, string>, article) => {
          acc[article.id] = article.title;
          return acc;
        }, {}) || {};

        const enhancedContentData: ContentAnalytics[] = contentData?.map(item => ({
          id: item.id,
          content_id: item.content_id,
          content_type: item.content_type as 'article' | 'post',
          views: item.views || 0,
          likes: item.likes || 0,
          comments: item.comments || 0,
          shares: item.shares || 0,
          title: item.content_type === 'article' ? articlesMap[item.content_id] : `Post ${item.content_id.slice(0, 8)}`
        })) || [];

        setContentAnalytics(enhancedContentData);
        console.log("useProfileAnalytics: Analytics fetched successfully");

      } catch (err) {
        console.error("useProfileAnalytics: Error fetching analytics:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [targetUserId]);

  const trackProfileView = async (profileUserId: string, viewerUserId?: string) => {
    try {
      console.log("Tracking profile view for:", profileUserId);
      
      const { error } = await supabase.rpc('track_profile_view', {
        p_profile_user_id: profileUserId,
        p_viewer_user_id: viewerUserId || null
      });

      if (error) {
        console.error("Error tracking profile view:", error);
      }
    } catch (error) {
      console.error("Error in trackProfileView:", error);
    }
  };

  return {
    profileViews,
    contentAnalytics,
    totalViews,
    isLoading,
    error,
    trackProfileView,
  };
};
