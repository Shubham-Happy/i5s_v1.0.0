
import React from "react";
import { PostItem } from "@/components/posts/PostItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Post, Comment } from "@/hooks/usePosts";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onToggleReaction: (postId: string, reactionType: string) => Promise<void>;
  onToggleCommentLike: (commentId: string) => Promise<void>;
  onCreateComment: (postId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, postId: string) => Promise<void>;
  onUpdatePost?: (postId: string, content: string, imageFile: File | null) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

export function PostList({ 
  posts, 
  isLoading, 
  onToggleReaction,
  onToggleCommentLike,
  onCreateComment,
  onCreateReply,
  onUpdatePost,
  onDeletePost
}: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onToggleReaction={onToggleReaction}
          onToggleCommentLike={onToggleCommentLike}
          onCreateComment={onCreateComment}
          onCreateReply={onCreateReply}
          onUpdatePost={onUpdatePost}
          onDeletePost={onDeletePost}
        />
      ))}
    </div>
  );
}
