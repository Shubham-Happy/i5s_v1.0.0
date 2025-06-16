
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
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

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'starred' | 'archived'>('all');
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
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
    
    setIsLoading(true);
    try {
      console.log("Fetching conversations for user:", currentUserId);
      
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
          is_archived_user2,
          created_at
        `)
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('last_message_time', { ascending: false, nullsFirst: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      console.log("Raw conversations data:", conversationsData);

      if (!conversationsData || conversationsData.length === 0) {
        console.log("No conversations found");
        setAllConversations([]);
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Get all unique user IDs from conversations
      const userIds = new Set<string>();
      conversationsData.forEach(conv => {
        const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
        userIds.add(otherUserId);
      });

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', Array.from(userIds));

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Profiles data:", profilesData);

      // Create a map of user profiles
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Transform conversations
      const transformedConversations: Conversation[] = conversationsData.map(conv => {
        const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
        const profile = profilesMap.get(otherUserId);
        const isUser1 = conv.user1_id === currentUserId;
        
        return {
          id: conv.id,
          user: {
            id: otherUserId,
            name: profile?.full_name || 'Unknown User',
            avatar: profile?.avatar_url || '',
            status: 'offline' as const,
          },
          lastMessage: {
            text: conv.last_message_text || 'No messages yet',
            time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            isRead: true,
            isSent: conv.last_message_sender_id === currentUserId,
          },
          unread: conv.last_message_sender_id !== currentUserId ? conv.unread_count : 0,
          isStarred: isUser1 ? conv.is_starred_user1 : conv.is_starred_user2,
          isArchived: isUser1 ? conv.is_archived_user1 : conv.is_archived_user2,
        };
      });

      console.log("Transformed conversations:", transformedConversations);
      setAllConversations(transformedConversations);
    } catch (error) {
      console.error("Error in fetchConversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  // Filter conversations based on active tab and search query
  useEffect(() => {
    let filtered = allConversations;

    // Filter by tab
    switch (activeTab) {
      case 'starred':
        filtered = filtered.filter(conv => conv.isStarred);
        break;
      case 'archived':
        filtered = filtered.filter(conv => conv.isArchived);
        break;
      case 'all':
      default:
        // For 'all' tab, exclude archived conversations
        filtered = filtered.filter(conv => !conv.isArchived);
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log("Filtered conversations:", { activeTab, searchQuery, filtered });
    setConversations(filtered);
  }, [allConversations, activeTab, searchQuery]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;
    
    try {
      console.log("Fetching messages for conversation:", conversationId);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId}),and(recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      console.log("Raw messages data:", messagesData);

      if (!messagesData) {
        setMessages([]);
        return;
      }

      // Filter messages that belong to the current conversation
      const activeConv = allConversations.find(conv => conv.id === conversationId);
      if (!activeConv) {
        setMessages([]);
        return;
      }

      const otherUserId = activeConv.user.id;
      const conversationMessages = messagesData.filter(msg => 
        (msg.sender_id === currentUserId && msg.recipient_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.recipient_id === currentUserId)
      );

      const transformedMessages: Message[] = conversationMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: msg.status === 'read',
        isSent: msg.sender_id === currentUserId,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
      }));

      console.log("Transformed messages:", transformedMessages);
      setMessages(transformedMessages);

      // Mark conversation as read
      await supabase.rpc('mark_conversation_read', {
        conversation_uuid: conversationId,
        user_uuid: currentUserId
      });

    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  }, [currentUserId, allConversations]);

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    console.log("Selecting conversation:", conversation);
    setActiveConversation(conversation);
    fetchMessages(conversation.id);
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation || !currentUserId) return;

    setIsComposing(true);
    try {
      console.log("Sending message:", { 
        text: newMessage, 
        to: activeConversation.user.id,
        from: currentUserId 
      });

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: activeConversation.user.id,
          text: newMessage.trim(),
          status: 'sent'
        });

      if (error) throw error;

      setNewMessage('');
      await fetchMessages(activeConversation.id);
      await fetchConversations();

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsComposing(false);
    }
  }, [newMessage, activeConversation, currentUserId, fetchMessages, fetchConversations]);

  const toggleStarredConversation = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const conversation = allConversations.find(conv => conv.id === conversationId);
      if (!conversation) return;

      // Determine if current user is user1 or user2
      const { data: convData, error: fetchError } = await supabase
        .from('conversations')
        .select('user1_id, user2_id, is_starred_user1, is_starred_user2')
        .eq('id', conversationId)
        .single();

      if (fetchError) throw fetchError;

      const isUser1 = convData.user1_id === currentUserId;
      const currentStarredStatus = isUser1 ? convData.is_starred_user1 : convData.is_starred_user2;
      const newStarredStatus = !currentStarredStatus;

      const updateData = isUser1 
        ? { is_starred_user1: newStarredStatus }
        : { is_starred_user2: newStarredStatus };

      const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (error) throw error;

      // Update local state
      setAllConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, isStarred: newStarredStatus }
            : conv
        )
      );

      // Update active conversation if it's the one being toggled
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => 
          prev ? { ...prev, isStarred: newStarredStatus } : null
        );
      }

      toast({
        title: newStarredStatus ? "Conversation starred" : "Conversation unstarred",
        description: newStarredStatus ? "Added to starred conversations" : "Removed from starred conversations",
      });

    } catch (error) {
      console.error("Error toggling starred status:", error);
      toast({
        title: "Error",
        description: "Failed to update starred status",
        variant: "destructive",
      });
    }
  }, [currentUserId, allConversations, activeConversation]);

  const toggleArchivedConversation = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const conversation = allConversations.find(conv => conv.id === conversationId);
      if (!conversation) return;

      // Determine if current user is user1 or user2
      const { data: convData, error: fetchError } = await supabase
        .from('conversations')
        .select('user1_id, user2_id, is_archived_user1, is_archived_user2')
        .eq('id', conversationId)
        .single();

      if (fetchError) throw fetchError;

      const isUser1 = convData.user1_id === currentUserId;
      const currentArchivedStatus = isUser1 ? convData.is_archived_user1 : convData.is_archived_user2;
      const newArchivedStatus = !currentArchivedStatus;

      const updateData = isUser1 
        ? { is_archived_user1: newArchivedStatus }
        : { is_archived_user2: newArchivedStatus };

      const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (error) throw error;

      // Update local state
      setAllConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, isArchived: newArchivedStatus }
            : conv
        )
      );

      // Update active conversation if it's the one being toggled
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => 
          prev ? { ...prev, isArchived: newArchivedStatus } : null
        );
      }

      // If we're archiving and currently on 'all' tab, or unarchiving and on 'archived' tab,
      // clear the active conversation since it will be filtered out
      if ((newArchivedStatus && activeTab === 'all') || (!newArchivedStatus && activeTab === 'archived')) {
        if (activeConversation?.id === conversationId) {
          setActiveConversation(null);
          setMessages([]);
        }
      }

      toast({
        title: newArchivedStatus ? "Conversation archived" : "Conversation unarchived",
        description: newArchivedStatus ? "Moved to archived conversations" : "Moved back to conversations",
      });

    } catch (error) {
      console.error("Error toggling archived status:", error);
      toast({
        title: "Error",
        description: "Failed to update archived status",
        variant: "destructive",
      });
    }
  }, [currentUserId, allConversations, activeConversation, activeTab]);

  return {
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
  };
}
