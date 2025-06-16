
import React, { useEffect, useRef } from "react";
import { Paperclip, Image, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  disabled?: boolean;
}

export function MessageInput({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage,
  disabled = false
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Handle keyboard shortcuts for sending messages
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !disabled) {
        console.log("Sending message via Enter key:", newMessage.trim());
        handleSendMessage();
      }
    }
  };

  const handleSendClick = () => {
    if (newMessage.trim() && !disabled) {
      console.log("Sending message via button click:", newMessage.trim());
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-end gap-2">
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            onClick={() => toast({
              title: "Attach file",
              description: "Feature coming soon: File attachments",
            })}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            onClick={() => toast({
              title: "Add image",
              description: "Feature coming soon: Image attachments",
            })}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            onClick={() => toast({
              title: "Add emoji",
              description: "Feature coming soon: Emoji picker",
            })}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={disabled ? "Select a conversation to start messaging..." : "Type a message..."}
            className="resize-none min-h-[60px] pr-12"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2"
            onClick={handleSendClick}
            disabled={!newMessage.trim() || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
