import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { UserSelectDialog } from "@/components/messages/UserSelectDialog";
import { useMessagesOptimized } from "@/hooks/useMessagesOptimized";
import { PenSquare, Inbox, Archive, Star, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Messages() {
  const {
    conversations,
    activeConversation,
    messages,
    newMessage,
    searchQuery,
    activeTab,
    setSearchQuery,
    setNewMessage,
    setActiveTab,
    isComposing,
    isLoading,
    handleSendMessage,
    handleSelectConversation,
    setActiveConversation,
    setMessages,
    fetchConversations,
    toggleStarredConversation,
    toggleArchivedConversation,
  } = useMessagesOptimized();
  
  const location = useLocation();
  const isMobile = useIsMobile();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUserSelectDialog, setShowUserSelectDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  // Handle direct message link from a profile page
  useEffect(() => {
    const handleDirectMessage = async () => {
      if (isProcessing) return;
      
      if (location.state?.conversationId || location.state?.recipientId) {
        setIsProcessing(true);
        try {
          const { conversationId, recipientId, recipientName, recipientAvatar } = location.state;
          
          // Get current user first
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session) {
            toast({
              title: "Authentication required",
              description: "You must be logged in to send messages",
              variant: "destructive",
            });
            return;
          }
          
          setCurrentUserId(sessionData.session.user.id);
          
          // Wait for conversations to load
          if (isLoading) {
            return;
          }
          
          // Find the conversation in the list or create a representation of it
          const existingConv = conversations.find(conv => 
            conv.id === conversationId || 
            (conv.user.id === recipientId && recipientId)
          );
          
          if (existingConv) {
            handleSelectConversation(existingConv);
          } else if (recipientId && recipientName) {
            const tempConversation = {
              id: conversationId || `temp-${recipientId}`,
              user: {
                id: recipientId,
                name: recipientName || "User",
                avatar: recipientAvatar || "",
                status: "offline" as const
              },
              lastMessage: {
                text: "Start a conversation",
                time: "",
                isRead: true,
                isSent: false
              },
              unread: 0,
              isStarred: false,
              isArchived: false
            };
            
            setActiveConversation(tempConversation);
            setMessages([]);
          }
          
          await fetchConversations();
        } catch (error) {
          console.error("Error handling direct message:", error);
          toast({
            title: "Error",
            description: "Failed to start conversation. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    handleDirectMessage();
  }, [location.state, conversations, isLoading, handleSelectConversation, setActiveConversation, setMessages, fetchConversations]);
  
  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setCurrentUserId(session.user.id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleNewConversation = () => {
    setShowUserSelectDialog(true);
  };

  const handleUserSelect = async (userId: string, userName: string, userAvatar: string) => {
    if (!currentUserId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to start a conversation.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let conversationId: string;
      
      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: currentUserId < userId ? currentUserId : userId,
            user2_id: currentUserId < userId ? userId : currentUserId,
            last_message_text: null,
            last_message_time: null,
            last_message_sender_id: null,
            unread_count: 0
          })
          .select()
          .single();
          
        if (createError) throw createError;
        if (!newConv) throw new Error("Failed to create conversation");
        
        conversationId = newConv.id;
      }
      
      const conversationForUI = {
        id: conversationId,
        user: {
          id: userId,
          name: userName,
          avatar: userAvatar,
          status: 'offline' as const,
        },
        lastMessage: {
          text: "Start a conversation",
          time: "",
          isRead: true,
          isSent: false,
        },
        unread: 0,
        isStarred: false,
        isArchived: false,
      };
      
      setActiveConversation(conversationForUI);
      setMessages([]);
      await fetchConversations();
      
      toast({
        title: "Conversation started",
        description: `You can now start chatting with ${userName}.`,
      });
    } catch (err) {
      console.error("Error creating conversation:", err);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStarred = () => {
    if (activeConversation) {
      toggleStarredConversation(activeConversation.id);
    }
  };

  const handleToggleArchived = () => {
    if (activeConversation) {
      toggleArchivedConversation(activeConversation.id);
    }
  };

  const handleBackToConversations = () => {
    if (isMobile) {
      setActiveConversation(null);
      setShowSidebar(true);
    }
  };

  useEffect(() => {
    setShowSidebar(!isMobile || !activeConversation);
  }, [isMobile, activeConversation]);

  return (
    <div className="container-wide">
      <div className="flex flex-col lg:flex-row bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)]">
        {/* Enhanced Sidebar - responsive */}
        <div className={`w-full lg:w-80 border-r border-border/50 ${
          isMobile && activeConversation && !showSidebar ? 'hidden' : 'flex'
        } flex-col`}>
          <div className="padding-responsive border-b border-border/50 flex justify-between items-center bg-card/80 backdrop-blur-sm">
            <h1 className="heading-responsive font-bold text-primary">Messages</h1>
            <Button size="sm" onClick={handleNewConversation} className="btn-enhanced">
              <PenSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Compose</span>
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'starred' | 'archived')}>
            <div className="px-2 pt-2 sm:px-4 sm:pt-4">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                  <Inbox className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
                <TabsTrigger value="starred" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Starred</span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                  <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Archived</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <ScrollArea className="flex-1">
            <ConversationList 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={(conv) => {
                handleSelectConversation(conv);
                if (isMobile) setShowSidebar(false);
              }}
              onToggleStarred={toggleStarredConversation}
              onToggleArchived={toggleArchivedConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoading}
              currentTab={activeTab}
            />
          </ScrollArea>
        </div>
        
        {/* Enhanced Main message area */}
        <div className={`flex-1 flex flex-col ${
          isMobile && !activeConversation ? 'hidden lg:flex' : 'flex'
        }`}>
          {activeConversation ? (
            <>
              {/* Mobile back button */}
              {isMobile && (
                <div className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-sm lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToConversations}
                    className="focus-ring"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Conversations
                  </Button>
                </div>
              )}
              
              <MessageHeader 
                user={activeConversation.user} 
                isStarred={activeConversation.isStarred}
                isArchived={activeConversation.isArchived}
                onToggleStarred={handleToggleStarred}
                onToggleArchived={handleToggleArchived}
              />
              <MessageList 
                messages={messages} 
                currentUserId={currentUserId || ""} 
                recipientUser={activeConversation.user}
                isComposing={isComposing}
              />
              <MessageInput 
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center padding-responsive text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6 animate-pulse">
                <PenSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="heading-responsive font-medium mb-4 text-primary">Select a conversation</h3>
              <p className="text-responsive text-muted-foreground max-w-sm mb-8 leading-relaxed">
                Choose an existing conversation or start a new one to begin messaging
              </p>
              <Button onClick={handleNewConversation} className="btn-enhanced">
                <PenSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          )}
        </div>
      </div>

      <UserSelectDialog
        open={showUserSelectDialog}
        onOpenChange={setShowUserSelectDialog}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
}
