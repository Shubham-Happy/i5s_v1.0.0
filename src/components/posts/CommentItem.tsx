
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/hooks/usePosts";
import { ArticleComment } from "@/hooks/useArticleComments";
import { formatDistanceToNow } from "date-fns";
import { Reply, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReplyForm } from "./ReplyForm";

interface CommentItemProps {
  comment: Comment | ArticleComment;
  isReply?: boolean;
  onToggleCommentLike?: (commentId: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string) => Promise<void>;
  isSubmitting: boolean;
  replies?: (Comment | ArticleComment)[];
}

export function CommentItem({ 
  comment, 
  isReply = false, 
  onToggleCommentLike, 
  onCreateReply,
  isSubmitting,
  replies = []
}: CommentItemProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleStartReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleSubmitReply = async (content: string) => {
    await onCreateReply(comment.id, content);
    setReplyingTo(null);
  };

  const handleToggleLike = async (commentId: string) => {
    if (onToggleCommentLike) {
      try {
        await onToggleCommentLike(commentId);
      } catch (error) {
        console.error("Error toggling comment like:", error);
      }
    }
  };

  // Type guard to check if comment has likes functionality
  const hasLikesFunctionality = (comment: any): comment is Comment | ArticleComment => {
    return 'likesCount' in comment || 'likes_count' in comment;
  };

  // Helper function to get like count (handling both post and article comments)
  const getLikeCount = (comment: any) => {
    if ('likesCount' in comment) return comment.likesCount || 0;
    if ('likes_count' in comment) return comment.likes_count || 0;
    return 0;
  };

  // Helper function to check if user has liked (handling both post and article comments)
  const getUserHasLiked = (comment: any) => {
    if ('userHasLiked' in comment) return comment.userHasLiked || false;
    if ('user_has_liked' in comment) return comment.user_has_liked || false;
    return false;
  };

  // Helper function to get user avatar
  const getUserAvatar = (user: any) => {
    return user?.avatar_url || user?.avatar || "";
  };

  // Helper function to get user name
  const getUserName = (user: any) => {
    return user?.full_name || user?.name || user?.username || "Unknown User";
  };

  // Helper function to get user initials
  const getUserInitials = (user: any) => {
    const name = getUserName(user);
    return name.charAt(0) || "U";
  };

  const likeCount = getLikeCount(comment);
  const userHasLiked = getUserHasLiked(comment);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarImage src={getUserAvatar(comment.user)} />
          <AvatarFallback>{getUserInitials(comment.user)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div className={cn("font-medium", isReply ? "text-xs" : "text-sm")}>
                {getUserName(comment.user)}
              </div>
              <div className="text-xs text-muted-foreground">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ""}
              </div>
            </div>
            <p className={cn("mt-1", isReply ? "text-xs" : "text-sm")}>
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {hasLikesFunctionality(comment) && onToggleCommentLike && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs h-6 px-2",
                  userHasLiked && "text-red-500"
                )}
                onClick={() => handleToggleLike(comment.id)}
              >
                <Heart className={cn(
                  "h-3 w-3 mr-1", 
                  userHasLiked && "fill-current"
                )} />
                {likeCount}
              </Button>
            )}
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => handleStartReply(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && !isReply && (
            <ReplyForm
              onSubmitReply={handleSubmitReply}
              onCancel={() => setReplyingTo(null)}
              isSubmitting={isSubmitting}
            />
          )}
          
          {/* Display replies */}
          {replies.length > 0 && (
            <div className="ml-4 mt-2 space-y-2">
              {replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  onToggleCommentLike={onToggleCommentLike}
                  onCreateReply={onCreateReply}
                  isSubmitting={isSubmitting}
                  replies={[]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
