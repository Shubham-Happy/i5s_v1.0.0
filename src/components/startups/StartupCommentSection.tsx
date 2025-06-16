
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, Heart, Reply } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { StartupComment } from "@/hooks/useStartupComments";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface StartupCommentSectionProps {
  startupId: string;
  comments: StartupComment[];
  onCreateComment: (startupId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, startupId: string) => Promise<void>;
  onToggleCommentLike?: (commentId: string) => Promise<void>;
}

interface StartupCommentItemProps {
  comment: StartupComment;
  isReply?: boolean;
  onToggleCommentLike?: (commentId: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, startupId: string) => Promise<void>;
  startupId: string;
  isSubmitting: boolean;
}

function StartupCommentItem({ 
  comment, 
  isReply = false, 
  onToggleCommentLike,
  onCreateReply,
  startupId,
  isSubmitting
}: StartupCommentItemProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleStartReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;

    try {
      await onCreateReply(commentId, replyContent.trim(), startupId);
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarImage src={comment.user.avatar_url} />
          <AvatarFallback>{getInitials(comment.user.full_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div className={cn("font-medium", isReply ? "text-xs" : "text-sm")}>
                {comment.user.full_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </div>
            </div>
            <p className={cn("mt-1", isReply ? "text-xs" : "text-sm")}>
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {onToggleCommentLike && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs h-6 px-2",
                  comment.user_has_liked && "text-red-500"
                )}
                onClick={() => handleToggleLike(comment.id)}
              >
                <Heart className={cn(
                  "h-3 w-3 mr-1", 
                  comment.user_has_liked && "fill-current"
                )} />
                {comment.likes_count || 0}
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
            <div className="mt-4 pl-6 border-l-2 border-muted">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || isSubmitting}
                      className="gold-button"
                    >
                      {isSubmitting ? "Posting..." : "Reply"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Display replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-2 space-y-2">
              {comment.replies.map((reply: StartupComment) => (
                <StartupCommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  onToggleCommentLike={onToggleCommentLike}
                  onCreateReply={onCreateReply}
                  startupId={startupId}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StartupCommentSection({ 
  startupId, 
  comments, 
  onCreateComment, 
  onCreateReply,
  onToggleCommentLike
}: StartupCommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("StartupCommentSection - user:", user);
  console.log("StartupCommentSection - startupId:", startupId);
  console.log("StartupCommentSection - comments:", comments);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    console.log("Submitting comment:", newComment);
    setIsSubmitting(true);
    try {
      await onCreateComment(startupId, newComment.trim());
      setNewComment("");
      console.log("Comment submitted successfully");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter top-level comments (no parent_id)
  const topLevelComments = comments.filter(comment => !comment.parent_id);

  return (
    <div className="space-y-6">
      {/* Authentication status debug */}
      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        Debug: User authenticated: {user ? 'Yes' : 'No'} | Startup ID: {startupId || 'Missing'}
      </div>

      {/* Comment Form */}
      {user ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {getInitials(user.user_metadata?.full_name || user.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your thoughts about this startup..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="gold-button"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Please log in to post comments and join the discussion.
            </p>
            <Button asChild className="gold-button">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No comments yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts about this startup!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <StartupCommentItem
                  comment={comment}
                  onToggleCommentLike={onToggleCommentLike}
                  onCreateReply={onCreateReply}
                  startupId={startupId}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
