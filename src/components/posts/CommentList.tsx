
import React from "react";
import { Comment } from "@/hooks/usePosts";
import { ArticleComment } from "@/hooks/useArticleComments";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[] | ArticleComment[];
  articleId?: string;
  onToggleCommentLike?: (commentId: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CommentList({ 
  comments, 
  articleId,
  onToggleCommentLike, 
  onCreateReply, 
  isSubmitting 
}: CommentListProps) {
  // For article comments, use the root comments (they already have nested replies)
  // For post comments, filter top-level comments (no parent_id)
  const topLevelComments = articleId 
    ? comments.filter(comment => !comment.parent_id) 
    : comments.filter(comment => !comment.parent_id);
  
  // Function to get replies for a comment (for post comments)
  const getRepliesForComment = (commentId: string) => {
    return comments.filter(comment => comment.parent_id === commentId);
  };

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pl-2">
      {topLevelComments.map((comment) => {
        const replies = articleId ? (comment.replies || []) : getRepliesForComment(comment.id);
        
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            onToggleCommentLike={onToggleCommentLike}
            onCreateReply={onCreateReply}
            isSubmitting={isSubmitting}
            replies={replies}
          />
        );
      })}
    </div>
  );
}
