
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isRead: boolean;
  isSent: boolean;
  senderId: string;
  recipientId: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    isSent: boolean;
  };
  unread: number;
  isStarred: boolean;
  isArchived: boolean;
}

export const useMessagesOptimized = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'starred' | 'archived'>('all');
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user on mount
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

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          last_message_text,
          last_message_time,
          last_message_sender_id,
          unread_count,
          is_starred_user1,
          is_starred_user2,
          is_archived_user1,
          is_archived_user2
        `)
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('last_message_time', { ascending: false, nullsFirst: false });

      if (error) throw error;

      if (conversationsData && conversationsData.length > 0) {
        const otherUserIds = conversationsData.map(conv => 
          conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id
        );

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', otherUserIds);

        if (profilesError) throw profilesError;

        const profilesMap = profiles?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        const formattedConversations: Conversation[] = conversationsData.map(conv => {
          const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
          const otherUserProfile = profilesMap[otherUserId];
          const isStarred = conv.user1_id === currentUserId ? conv.is_starred_user1 : conv.is_starred_user2;
          const isArchived = conv.user1_id === currentUserId ? conv.is_archived_user1 : conv.is_archived_user2;

          return {
            id: conv.id,
            user: {
              id: otherUserId,
              name: otherUserProfile?.full_name || otherUserProfile?.username || 'Unknown User',
              avatar: otherUserProfile?.avatar_url || '',
              status: 'offline' as const
            },
            lastMessage: {
              text: conv.last_message_text || "No messages yet",
              time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString() : "",
              isRead: conv.last_message_sender_id !== currentUserId,
              isSent: conv.last_message_sender_id === currentUserId
            },
            unread: conv.last_message_sender_id !== currentUserId ? conv.unread_count : 0,
            isStarred: isStarred || false,
            isArchived: isArchived || false
          };
        });

        setConversations(formattedConversations);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  // Fetch conversations when currentUserId is available
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId, fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId || !currentUserId) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const otherUserId = conversation.user.id;

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = messagesData?.map(msg => ({
        id: msg.id,
        text: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString(),
        isRead: msg.status === 'read',
        isSent: msg.sender_id === currentUserId,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id
      })) || [];

      setMessages(formattedMessages);

      // Mark messages as read
      if (conversationId) {
        await supabase.rpc('mark_conversation_read', {
          conversation_uuid: conversationId,
          user_uuid: currentUserId
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  }, [conversations, currentUserId]);

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation.id);
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation || !currentUserId) return;

    setIsComposing(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: activeConversation.user.id,
          text: newMessage.trim(),
          status: 'sent'
        });

      if (error) throw error;

      setNewMessage("");
      await fetchMessages(activeConversation.id);
      await fetchConversations();

      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComposing(false);
    }
  }, [newMessage, activeConversation, currentUserId, fetchMessages, fetchConversations]);

  const toggleStarredConversation = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const isUser1 = currentUserId === conversation.user.id;
      const updateField = isUser1 ? 'is_starred_user2' : 'is_starred_user1';
      
      const { error } = await supabase
        .from('conversations')
        .update({ [updateField]: !conversation.isStarred })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, isStarred: !conv.isStarred }
            : conv
        )
      );

      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
      }

    } catch (error) {
      console.error("Error toggling starred status:", error);
      toast({
        title: "Error",
        description: "Failed to update conversation",
        variant: "destructive"
      });
    }
  }, [conversations, activeConversation, currentUserId]);

  const toggleArchivedConversation = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const isUser1 = currentUserId === conversation.user.id;
      const updateField = isUser1 ? 'is_archived_user2' : 'is_archived_user1';
      
      const { error } = await supabase
        .from('conversations')
        .update({ [updateField]: !conversation.isArchived })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, isArchived: !conv.isArchived }
            : conv
        )
      );

      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? { ...prev, isArchived: !prev.isArchived } : null);
      }

    } catch (error) {
      console.error("Error toggling archived status:", error);
      toast({
        title: "Error",
        description: "Failed to update conversation",
        variant: "destructive"
      });
    }
  }, [conversations, activeConversation, currentUserId]);

  // Memoize filtered conversations to prevent unnecessary re-renders
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = !searchQuery || 
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      switch (activeTab) {
        case 'starred':
          return matchesSearch && conv.isStarred;
        case 'archived':
          return matchesSearch && conv.isArchived;
        default:
          return matchesSearch && !conv.isArchived;
      }
    });
  }, [conversations, searchQuery, activeTab]);

  return {
    conversations: filteredConversations,
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
  };
};
