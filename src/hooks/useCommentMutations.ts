
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function useCommentMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (params: { postId: string, content: string }) => {
      const { postId, content } = params;
      if (!user) throw new Error("You must be logged in to comment");

      const { data, error } = await supabase
        .from('comments')
        .insert([
          { post_id: postId, user_id: user.id, content }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your comment has been added.",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createReplyMutation = useMutation({
    mutationFn: async (params: { commentId: string, content: string, postId: string }) => {
      const { commentId, content, postId } = params;
      if (!user) throw new Error("You must be logged in to reply");

      const { data, error } = await supabase
        .from('comments')
        .insert([
          { post_id: postId, parent_id: commentId, user_id: user.id, content }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your reply has been added.",
      });
    },
    onError: (error) => {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    createCommentMutation,
    createReplyMutation
  };
}
