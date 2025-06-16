
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { usePostMutations } from "./usePostMutations";
import { useReactionMutations } from "./useReactionMutations";
import { useCommentMutations } from "./useCommentMutations";
import { processPostsData } from "@/utils/postDataProcessing";
import { Post } from "@/types/posts";

export * from "@/types/posts";

export function usePosts() {
  const { user } = useAuth();
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const { createPostMutation, updatePostMutation, deletePostMutation } = usePostMutations();
  const { toggleReactionMutation, toggleCommentLikeMutation } = useReactionMutations();
  const { createCommentMutation, createReplyMutation } = useCommentMutations();

  const toggleExpandComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const fetchPosts = async (): Promise<Post[]> => {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        reactions:post_reactions(*),
        comments:comments(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return processPostsData(posts, user);
  };

  const createPost = useCallback(async (content: string, imageFile: File | null): Promise<void> => {
    await createPostMutation.mutateAsync({ content, imageFile });
  }, [createPostMutation]);

  const updatePost = useCallback(async (postId: string, content: string, imageFile: File | null): Promise<void> => {
    await updatePostMutation.mutateAsync({ postId, content, imageFile });
  }, [updatePostMutation]);

  const deletePost = useCallback(async (postId: string): Promise<void> => {
    await deletePostMutation.mutateAsync(postId);
  }, [deletePostMutation]);

  const toggleReaction = useCallback(async (postId: string, reactionType: string): Promise<void> => {
    await toggleReactionMutation.mutateAsync({ postId, reactionType });
  }, [toggleReactionMutation]);

  const toggleCommentLike = useCallback(async (commentId: string): Promise<void> => {
    await toggleCommentLikeMutation.mutateAsync(commentId);
  }, [toggleCommentLikeMutation]);

  const createComment = useCallback(async (postId: string, content: string): Promise<void> => {
    await createCommentMutation.mutateAsync({ postId, content });
  }, [createCommentMutation]);

  const createReply = useCallback(async (commentId: string, content: string, postId: string): Promise<void> => {
    await createReplyMutation.mutateAsync({ commentId, content, postId });
  }, [createReplyMutation]);

  // Get posts from the query
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  return {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    toggleCommentLike,
    createComment,
    createReply,
    expandedComments,
    toggleExpandComments,
  };
}
