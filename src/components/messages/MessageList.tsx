
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/hooks/useMessages";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  recipientUser: {
    id: string;
    name: string;
    avatar: string;
  };
  isComposing: boolean;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  recipientUser, 
  isComposing 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isComposing]);

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
      <div className="p-4 space-y-4">
        {/* Date separator */}
        <div className="flex items-center justify-center my-4">
          <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
            Today
          </div>
        </div>
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId !== currentUserId && (
              <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                <AvatarImage src={recipientUser.avatar} alt={recipientUser.name} />
                <AvatarFallback>{recipientUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.senderId === currentUserId
                  ? "bg-statusnow-purple rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              }`}
            >
              <p>{msg.text}</p>
              <div
                className={`text-xs mt-1 flex justify-end ${
                  msg.senderId === currentUserId ? "text-black/70" : "text-muted-foreground"
                }`}
              >
                {msg.time}
                {msg.senderId === currentUserId && (
                  <span className="ml-1">
                    {msg.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
            {msg.senderId === currentUserId && (
              <Avatar className="h-8 w-8 ml-2 flex-shrink-0 mt-1">
                <AvatarImage src="https://github.com/shadcn.png" alt="You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isComposing && (
          <div className="flex justify-start">
            <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
              <AvatarImage src={recipientUser.avatar} alt={recipientUser.name} />
              <AvatarFallback>{recipientUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-muted p-3 rounded-lg max-w-[80%] rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.6s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
