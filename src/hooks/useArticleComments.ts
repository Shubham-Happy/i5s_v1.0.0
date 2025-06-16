
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  parent_id?: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
  likes_count?: number;
  user_has_liked?: boolean;
}

// Export ArticleComment as an alias for Comment to fix the import error
export type ArticleComment = Comment;

export const useArticleComments = (articleId: string) => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['article-comments', articleId],
    queryFn: async (): Promise<Comment[]> => {
      if (!articleId) return [];

      console.log("Fetching comments for article:", articleId);

      // First fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          user_id,
          created_at,
          parent_id
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        throw commentsError;
      }

      console.log("Raw comments data:", commentsData);

      if (!commentsData || commentsData.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
      
      // Fetch user profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Continue without profiles rather than failing completely
      }

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;

      // Transform and organize comments with like information
      const transformedComments = await Promise.all(commentsData.map(async (comment) => {
        const userProfile = profilesMap.get(comment.user_id);
        
        // Get like count for this comment
        const { count: likeCount } = await supabase
          .from('comment_likes')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id);

        // Check if current user has liked this comment
        let userHasLiked = false;
        if (currentUserId) {
          const { data: userLike } = await supabase
            .from('comment_likes')
            .select('*')
            .eq('comment_id', comment.id)
            .eq('user_id', currentUserId)
            .maybeSingle();
          
          userHasLiked = !!userLike;
        }

        return {
          id: comment.id,
          content: comment.content,
          user_id: comment.user_id,
          created_at: comment.created_at,
          parent_id: comment.parent_id,
          user: {
            id: comment.user_id,
            username: userProfile?.username || 'Anonymous',
            full_name: userProfile?.full_name || 'Anonymous User',
            avatar_url: userProfile?.avatar_url
          },
          likes_count: likeCount || 0,
          user_has_liked: userHasLiked
        };
      }));

      // Organize into parent-child structure
      const commentMap = new Map();
      const rootComments: Comment[] = [];

      // First pass: create all comments
      transformedComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Second pass: organize into tree structure
      transformedComments.forEach(comment => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });

      console.log("Organized comments:", rootComments);
      return rootComments;
    },
    enabled: !!articleId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('You must be logged in to comment');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          article_id: articleId,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-comments', articleId] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', articleId] });
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('You must be logged in to reply');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          article_id: articleId,
          user_id: session.user.id,
          parent_id: commentId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-comments', articleId] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', articleId] });
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    },
  });

  const toggleCommentLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('You must be logged in to like comments');
      }

      // Check if user already liked this comment
      const { data: existingLike, error: findError } = await supabase
        .from('comment_likes')
        .select()
        .eq('comment_id', commentId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (findError) throw findError;

      if (existingLike) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;
        return { action: 'removed' };
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert([
            { comment_id: commentId, user_id: session.user.id }
          ]);

        if (insertError) throw insertError;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-comments', articleId] });
      toast({
        title: "Success",
        description: "Comment like updated.",
      });
    },
    onError: (error) => {
      console.error("Error toggling comment like:", error);
      toast({
        title: "Error",
        description: "Failed to update comment like. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    createReply: (commentId: string, content: string) => 
      createReplyMutation.mutate({ commentId, content }),
    toggleCommentLike: toggleCommentLikeMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    isCreatingReply: createReplyMutation.isPending,
    isTogglingLike: toggleCommentLikeMutation.isPending,
  };
};
