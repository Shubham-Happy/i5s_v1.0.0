
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Archive, MoreVertical, Phone, Video } from "lucide-react";
import { User } from "@/hooks/useMessages";

interface MessageHeaderProps {
  user: User;
  isStarred?: boolean;
  isArchived?: boolean;
  onToggleStarred?: () => void;
  onToggleArchived?: () => void;
}

export function MessageHeader({ 
  user, 
  isStarred = false, 
  isArchived = false,
  onToggleStarred,
  onToggleArchived 
}: MessageHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        {onToggleStarred && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleStarred}
            className={isStarred ? "text-yellow-500" : ""}
          >
            <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
          </Button>
        )}
        {onToggleArchived && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleArchived}
            className={isArchived ? "text-blue-500" : ""}
          >
            <Archive className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
