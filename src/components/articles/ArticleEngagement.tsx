
import { useState, useEffect } from "react";
import { Heart, Share2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ArticleEngagementProps {
  articleId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialComments?: number;
  url: string;
  title: string;
  compact?: boolean;
  onCommentClick?: () => void;
}

export function ArticleEngagement({ 
  articleId,
  initialLikes,
  initialLiked,
  initialComments,
  url,
  title,
  compact = false,
  onCommentClick
}: ArticleEngagementProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialLiked || false);
  const [comments, setComments] = useState(initialComments || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch engagement data on component mount and when articleId changes
  useEffect(() => {
    const fetchEngagementData = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        
        // Get total like count
        const { count: likeCount, error: likeCountError } = await supabase
          .from('article_likes')
          .select('*', { count: 'exact', head: true })
          .eq('article_id', articleId);

        if (likeCountError) {
          console.error("Error fetching like count:", likeCountError);
        } else {
          setLikes(likeCount || 0);
        }

        // Get comment count
        const { count: commentCount, error: commentCountError } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('article_id', articleId);

        if (commentCountError) {
          console.error("Error fetching comment count:", commentCountError);
        } else {
          setComments(commentCount || 0);
        }

        // Check if current user has liked this article
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userLike, error: userLikeError } = await supabase
            .from('article_likes')
            .select('*')
            .eq('article_id', articleId)
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (userLikeError) {
            console.error("Error checking user like:", userLikeError);
          } else {
            setIsLiked(!!userLike);
          }
        }
      } catch (error) {
        console.error("Error fetching engagement data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEngagementData();
  }, [articleId]);

  const handleLike = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to like articles.",
          variant: "destructive"
        });
        return;
      }

      if (isLiked) {
        // Unlike the article
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.user.id);

        if (error) throw error;

        setIsLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
        toast({
          title: "Removed like",
          description: "You've removed your like from this article.",
        });
      } else {
        // Like the article
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: session.user.id
          });

        if (error) {
          // Check if it's a duplicate key error (user already liked)
          if (error.code === '23505') {
            // Refresh the state to get current data
            const { data: userLike } = await supabase
              .from('article_likes')
              .select('*')
              .eq('article_id', articleId)
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            setIsLiked(!!userLike);
            return;
          }
          throw error;
        }

        setIsLiked(true);
        setLikes(prev => prev + 1);
        toast({
          title: "Article liked",
          description: "You've liked this article.",
        });
      }

      // Invalidate all related queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article-comments", articleId] });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-8 w-16 bg-muted rounded"></div>
        <div className="h-8 w-16 bg-muted rounded"></div>
        <div className="h-8 w-16 bg-muted rounded"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`px-2 gold-hover ${isLiked ? "text-gold-accent bg-gold/10" : ""}`}
          onClick={handleLike}
          disabled={isProcessing}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes > 0 ? likes : ""}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2 gold-hover"
          onClick={onCommentClick}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{comments > 0 ? comments : ""}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2 gold-hover"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`gold-border gold-hover ${isLiked ? "bg-gold/10 text-gold-accent border-gold-accent" : ""}`}
          onClick={handleLike}
          disabled={isProcessing}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gold-border gold-hover"
          onClick={onCommentClick}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>{comments}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gold-border gold-hover"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
}
