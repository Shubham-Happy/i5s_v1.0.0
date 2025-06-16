
import React from "react";
import { PostItem } from "@/components/posts/PostItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/hooks/usePosts";
import { Flame } from "lucide-react";

interface TrendingPostListProps {
  posts: Post[];
  isLoading: boolean;
  onToggleReaction: (postId: string, reactionType: string) => Promise<void>;
  onToggleCommentLike: (commentId: string) => Promise<void>;
  onCreateComment: (postId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, postId: string) => Promise<void>;
  onUpdatePost?: (postId: string, content: string, imageFile: File | null) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

export function TrendingPostList({ 
  posts, 
  isLoading, 
  onToggleReaction,
  onToggleCommentLike,
  onCreateComment,
  onCreateReply,
  onUpdatePost,
  onDeletePost
}: TrendingPostListProps) {
  // Sort posts by engagement (likes + comments)
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      const aEngagement = (a.reactions?.length || 0) + (a.commentCount || 0);
      const bEngagement = (b.reactions?.length || 0) + (b.commentCount || 0);
      return bEngagement - aEngagement;
    });
  }, [posts]);

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

  if (sortedPosts.length === 0) {
    return (
      <div className="text-center p-8">
        <Flame className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No trending posts yet. Be the first to create engaging content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-primary">Trending Posts</h2>
      </div>
      {sortedPosts.map((post) => (
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
