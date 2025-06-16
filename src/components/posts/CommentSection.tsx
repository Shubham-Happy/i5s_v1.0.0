
import React, { useState } from "react";
import { Comment } from "@/hooks/usePosts";
import { ArticleComment } from "@/hooks/useArticleComments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  postId?: string;
  articleId?: string;
  comments: Comment[] | ArticleComment[];
  onCreateComment: (id: string, content: string, articleId?: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, id: string, articleId?: string) => Promise<void>;
  onToggleCommentLike?: (commentId: string) => Promise<void>;
}

export function CommentSection({ 
  postId, 
  articleId,
  comments, 
  onCreateComment,
  onCreateReply,
  onToggleCommentLike
}: CommentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (content: string) => {
    try {
      setIsSubmitting(true);
      const targetId = postId || articleId || "";
      await onCreateComment(targetId, content, articleId);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string, content: string) => {
    try {
      setIsSubmitting(true);
      const targetId = postId || articleId || "";
      await onCreateReply(commentId, content, targetId, articleId);
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <CommentForm 
        onSubmitComment={handleSubmitComment}
        isSubmitting={isSubmitting}
      />

      <CommentList
        comments={comments}
        articleId={articleId}
        onToggleCommentLike={onToggleCommentLike}
        onCreateReply={handleSubmitReply}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
