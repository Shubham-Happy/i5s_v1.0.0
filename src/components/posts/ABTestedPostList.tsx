
import React from "react";
import { useExperiment } from "@/hooks/useExperiment";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PostList } from "@/components/posts/PostList";
import { Post } from "@/hooks/usePosts";

interface ABTestedPostListProps {
  posts: Post[];
  isLoading: boolean;
  onToggleReaction: (postId: string, reactionType: string) => Promise<void>;
  onToggleCommentLike: (commentId: string) => Promise<void>;
  onCreateComment: (postId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, postId: string) => Promise<void>;
  onUpdatePost?: (postId: string, content: string, imageFile: File | null) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

export function ABTestedPostList(props: ABTestedPostListProps) {
  const { 
    variant, 
    renderVariant, 
    trackConversion 
  } = useExperiment('post-layout', {
    variants: ['A', 'B'],
    // Optional weighted distribution (must sum to 1)
    weights: [0.5, 0.5],
    onExposure: (variant) => {
      console.log(`User exposed to post-layout variant ${variant}`);
    }
  });

  // Track when a user interacts with posts
  const handlePostInteraction = () => {
    trackConversion('post_interaction', { 
      source: 'post-list' 
    });
  };

  return (
    <div onClick={handlePostInteraction}>
      {renderVariant(
        // Variant A - Standard layout
        <PostList {...props} />,
        
        // Variant B - Layout with header and subtle card background
        <Card className="bg-background/50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Latest Posts
              <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Beta
              </span>
            </CardTitle>
          </CardHeader>
          <PostList {...props} />
        </Card>
      )}
      
      {/* For debugging only - shows which variant the user is seeing */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        You're viewing post layout variant: {variant}
      </div>
    </div>
  );
}
