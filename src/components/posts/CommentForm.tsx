
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentFormProps {
  onSubmitComment: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmitComment, isSubmitting }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onSubmitComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Write a comment..."
          className="resize-none min-h-[60px]"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button 
            type="submit" 
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
