import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  followers?: number;
  following?: number;
  isFollowing?: boolean;
  is_following?: boolean;
  status?: string;
  company?: string;
}

export const fetchPeople = async (searchQuery: string = ''): Promise<User[]> => {
  try {
    let query = supabase
      .from('profiles')
      .select('*');

    // Add search filter if provided
    if (searchQuery.trim()) {
      query = query.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
    }

    const { data: profiles, error } = await query;

    if (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    
    // Get follow counts and status for each profile
    const usersWithFollowData = await Promise.all(profiles.map(async (profile) => {
      // Get follower count
      const { data: followerData, error: followerError } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', profile.id);
      
      const followerCount = followerData?.length || 0;
      
      // Get following count
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', profile.id);
        
      const followingCount = followingData?.length || 0;
        
      // Check if current user is following this profile
      let isFollowing = false;
      if (currentUserId && currentUserId !== profile.id) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', profile.id)
          .maybeSingle();
        
        isFollowing = !!followData;
      }
      
      return {
        id: profile.id,
        name: profile.full_name || profile.username || "User",
        username: profile.username,
        full_name: profile.full_name,
        avatar: profile.avatar_url,
        headline: profile.status || "",
        bio: profile.bio || "",
        location: "",
        website: "",
        skills: [],
        followers: followerCount,
        following: followingCount,
        isFollowing,
        is_following: isFollowing,
        status: profile.status,
        company: "",
      };
    }));
    
    // Filter out current user from results
    return usersWithFollowData.filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
};

export const fetchFollowing = async (searchQuery: string = ''): Promise<User[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return [];

    // Get users that current user is following using a join
    const { data: followsData, error } = await supabase
      .from('follows')
      .select(`
        following_id,
        profiles (
          id,
          username,
          full_name,
          avatar_url,
          status,
          bio
        )
      `)
      .eq('follower_id', session.user.id);

    if (error) {
      console.error("Error fetching following:", error);
      throw error;
    }

    if (!followsData) return [];

    // Filter out any null profiles and apply search filter
    let validFollows = followsData.filter(follow => follow.profiles !== null);

    if (searchQuery.trim()) {
      validFollows = validFollows.filter(follow => {
        const profile = follow.profiles as any;
        return profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               profile.username?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    const usersWithFollowData = await Promise.all(validFollows.map(async (follow) => {
      const profile = follow.profiles as any;
      
      const { data: followerData } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', profile.id);
      
      const { data: followingData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', profile.id);
        
      return {
        id: profile.id,
        name: profile.full_name || profile.username || "User",
        username: profile.username,
        full_name: profile.full_name,
        avatar: profile.avatar_url,
        headline: profile.status || "",
        bio: profile.bio || "",
        location: "",
        website: "",
        skills: [],
        followers: followerData?.length || 0,
        following: followingData?.length || 0,
        isFollowing: true,
        is_following: true,
        status: profile.status,
        company: "",
      };
    }));
    
    return usersWithFollowData;
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};

export const fetchFollowers = async (searchQuery: string = ''): Promise<User[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return [];

    // Get users that follow the current user using a join
    const { data: followsData, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        profiles (
          id,
          username,
          full_name,
          avatar_url,
          status,
          bio
        )
      `)
      .eq('following_id', session.user.id);

    if (error) {
      console.error("Error fetching followers:", error);
      throw error;
    }

    if (!followsData) return [];

    // Filter out any null profiles and apply search filter
    let validFollows = followsData.filter(follow => follow.profiles !== null);

    if (searchQuery.trim()) {
      validFollows = validFollows.filter(follow => {
        const profile = follow.profiles as any;
        return profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               profile.username?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    const currentUserId = session.user.id;

    const usersWithFollowData = await Promise.all(validFollows.map(async (follow) => {
      const profile = follow.profiles as any;
      
      const { data: followerData } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', profile.id);
      
      const { data: followingData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', profile.id);

      // Check if current user is following this follower back
      const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', profile.id)
        .maybeSingle();
        
      return {
        id: profile.id,
        name: profile.full_name || profile.username || "User",
        username: profile.username,
        full_name: profile.full_name,
        avatar: profile.avatar_url,
        headline: profile.status || "",
        bio: profile.bio || "",
        location: "",
        website: "",
        skills: [],
        followers: followerData?.length || 0,
        following: followingData?.length || 0,
        isFollowing: !!followData,
        is_following: !!followData,
        status: profile.status,
        company: "",
      };
    }));
    
    return usersWithFollowData;
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const fetchSuggestions = async (searchQuery: string = ''): Promise<User[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return [];

    const currentUserId = session.user.id;

    // Get users that current user is not following
    const { data: followingIds } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUserId);

    const followingIdsList = followingIds?.map(f => f.following_id) || [];

    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId);

    if (followingIdsList.length > 0) {
      query = query.not('id', 'in', `(${followingIdsList.join(',')})`);
    }

    const { data: profiles, error } = await query.limit(20);

    if (error) throw error;

    let filteredProfiles = profiles || [];

    // Apply search filter if provided
    if (searchQuery.trim()) {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const usersWithFollowData = await Promise.all(filteredProfiles.map(async (profile) => {
      const { data: followerData } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', profile.id);
      
      const { data: followingData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', profile.id);
        
      return {
        id: profile.id,
        name: profile.full_name || profile.username || "User",
        username: profile.username,
        full_name: profile.full_name,
        avatar: profile.avatar_url,
        headline: profile.status || "",
        bio: profile.bio || "",
        location: "",
        website: "",
        skills: [],
        followers: followerData?.length || 0,
        following: followingData?.length || 0,
        isFollowing: false,
        is_following: false,
        status: profile.status,
        company: "",
      };
    }));
    
    return usersWithFollowData;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const followUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users.",
        variant: "destructive",
      });
      return false;
    }
    
    const currentUserId = session.user.id;
    
    if (userId === currentUserId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', userId)
      .maybeSingle();

    if (existingFollow) {
      // Unfollow
      const { error: unfollowError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', userId);
        
      if (unfollowError) throw unfollowError;
      
      toast({
        title: "Unfollowed",
        description: "You are no longer following this user.",
      });
      
      return false;
    } else {
      // Follow
      const { error: followError } = await supabase
        .from('follows')
        .insert({
          follower_id: currentUserId,
          following_id: userId
        });
        
      if (followError) throw followError;
      
      toast({
        title: "Following",
        description: "You are now following this user.",
      });
      
      return true;
    }
  } catch (error) {
    console.error(`Error following user ${userId}:`, error);
    
    toast({
      title: "Failed to follow",
      description: "An error occurred. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};
