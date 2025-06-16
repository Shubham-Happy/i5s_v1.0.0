
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  onSubmitReply: (content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ReplyForm({ onSubmitReply, onCancel, isSubmitting }: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      await onSubmitReply(replyContent);
      setReplyContent("");
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  return (
    <div className="mt-2">
      <Textarea
        placeholder="Write a reply..."
        className="resize-none min-h-[60px] text-sm"
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button 
          type="button" 
          size="sm"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          size="sm"
          onClick={handleSubmit}
          disabled={!replyContent.trim() || isSubmitting}
        >
          {isSubmitting ? "Replying..." : "Reply"}
        </Button>
      </div>
    </div>
  );
}
