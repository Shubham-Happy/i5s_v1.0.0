
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function useReactionMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const toggleReactionMutation = useMutation({
    mutationFn: async (params: { postId: string, reactionType: string }) => {
      const { postId, reactionType } = params;
      if (!user) throw new Error("You must be logged in to react to posts");

      // Check if user already has a reaction
      const { data: existingReaction, error: findError } = await supabase
        .from('post_reactions')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (findError) throw findError;

      if (existingReaction) {
        // If clicking the same reaction, remove it
        if (existingReaction.reaction_type === reactionType) {
          const { error: deleteError } = await supabase
            .from('post_reactions')
            .delete()
            .eq('id', existingReaction.id);

          if (deleteError) throw deleteError;
          return { action: 'removed', reactionType };
        } else {
          // If changing reaction type, update it
          const { error: updateError } = await supabase
            .from('post_reactions')
            .update({ reaction_type: reactionType })
            .eq('id', existingReaction.id);

          if (updateError) throw updateError;
          return { action: 'updated', reactionType };
        }
      } else {
        // Create new reaction
        const { error: insertError } = await supabase
          .from('post_reactions')
          .insert([
            { post_id: postId, user_id: user.id, reaction_type: reactionType }
          ]);

        if (insertError) throw insertError;
        return { action: 'added', reactionType };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error toggling reaction:", error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleCommentLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error("You must be logged in to like comments");

      // Check if user already liked this comment
      const { data: existingLike, error: findError } = await supabase
        .from('comment_likes')
        .select()
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
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
            { comment_id: commentId, user_id: user.id }
          ]);

        if (insertError) throw insertError;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
    toggleReactionMutation,
    toggleCommentLikeMutation
  };
}
