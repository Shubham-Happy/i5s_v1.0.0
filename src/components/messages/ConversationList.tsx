
import React from "react";
import { Search, Star, Archive, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Conversation } from "@/hooks/useMessages";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation?: Conversation;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onToggleStarred: (conversationId: string) => void;
  onToggleArchived: (conversationId: string) => void;
  isLoading?: boolean;
  currentTab: 'all' | 'starred' | 'archived';
}

export function ConversationList({
  conversations,
  activeConversation,
  searchQuery,
  setSearchQuery,
  onSelectConversation,
  onToggleStarred,
  onToggleArchived,
  isLoading = false,
  currentTab
}: ConversationListProps) {
  console.log("ConversationList render:", { conversations, isLoading, searchQuery, currentTab });

  if (isLoading) {
    return (
      <>
        <div className="relative p-4">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="h-[calc(100%-130px)] overflow-y-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  const getEmptyStateMessage = () => {
    if (searchQuery) {
      return {
        title: `No conversations found matching "${searchQuery}"`,
        subtitle: "Try adjusting your search terms"
      };
    }
    
    switch (currentTab) {
      case 'starred':
        return {
          title: "No starred conversations",
          subtitle: "Star important conversations to find them easily"
        };
      case 'archived':
        return {
          title: "No archived conversations",
          subtitle: "Archived conversations will appear here"
        };
      default:
        return {
          title: "No conversations yet",
          subtitle: "Start a new conversation to get started"
        };
    }
  };

  return (
    <>
      <div className="relative p-4">
        <Search className="absolute left-7 top-7 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search conversations..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => {
            console.log("Search query changed:", e.target.value);
            setSearchQuery(e.target.value);
          }}
        />
      </div>
      
      <div className="h-[calc(100%-130px)] overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                activeConversation?.id === conv.id ? "bg-muted" : ""
              }`}
              onClick={() => {
                console.log("Conversation clicked:", conv);
                onSelectConversation(conv);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                  <AvatarFallback>{conv.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    conv.user.status === "online"
                      ? "bg-green-500"
                      : conv.user.status === "away"
                      ? "bg-yellow-500"
                      : "bg-muted"
                  }`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{conv.user.name}</h4>
                    {conv.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    {conv.isArchived && <Archive className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">{conv.lastMessage.time}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onToggleStarred(conv.id);
                        }}>
                          <Star className="h-4 w-4 mr-2" />
                          {conv.isStarred ? 'Unstar' : 'Star'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onToggleArchived(conv.id);
                        }}>
                          <Archive className="h-4 w-4 mr-2" />
                          {conv.isArchived ? 'Unarchive' : 'Archive'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <p className={`text-sm truncate ${conv.unread > 0 ? "font-medium" : "text-muted-foreground"}`}>
                  {conv.lastMessage.isSent && "You: "}
                  {conv.lastMessage.text}
                </p>
              </div>
              
              {conv.unread > 0 && (
                <Badge className="rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center">
                  {conv.unread}
                </Badge>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{getEmptyStateMessage().title}</p>
            <p className="text-sm text-muted-foreground mt-1">{getEmptyStateMessage().subtitle}</p>
          </div>
        )}
      </div>
    </>
  );
}
