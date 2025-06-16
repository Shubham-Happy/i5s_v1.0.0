
import { supabase } from "@/integrations/supabase/client";

export const useContentAnalytics = () => {
  const incrementContentView = async (contentId: string, contentType: 'article' | 'post', userId: string) => {
    try {
      console.log(`Incrementing ${contentType} view:`, contentId);
      
      const { error } = await supabase.rpc('increment_content_view', {
        p_content_id: contentId,
        p_content_type: contentType,
        p_user_id: userId
      });

      if (error) {
        console.error("Error incrementing content view:", error);
      }
    } catch (error) {
      console.error("Error in incrementContentView:", error);
    }
  };

  const updateContentStats = async (
    contentId: string, 
    contentType: 'article' | 'post', 
    userId: string,
    stats: { likes?: number; comments?: number; shares?: number }
  ) => {
    try {
      console.log(`Updating ${contentType} stats:`, contentId, stats);
      
      const { error } = await supabase
        .from('content_analytics')
        .upsert({
          content_id: contentId,
          content_type: contentType,
          user_id: userId,
          ...stats,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error updating content stats:", error);
      }
    } catch (error) {
      console.error("Error in updateContentStats:", error);
    }
  };

  return {
    incrementContentView,
    updateContentStats,
  };
};
