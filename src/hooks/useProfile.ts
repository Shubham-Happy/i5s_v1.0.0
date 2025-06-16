
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useUnifiedProfile, UnifiedProfile } from "@/hooks/useUnifiedProfile";

export interface Education {
  id: string;
  school: string;
  degree: string;
  logo?: string;
  startYear: string;
  endYear: string;
  description?: string;
  activities?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expires: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  joined: string;
  followers: number;
  following: number;
  articles: number;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
}

export const useProfile = (userId?: string) => {
  const { profile: unifiedProfile, isLoading, updateProfile: updateUnifiedProfile } = useUnifiedProfile(userId);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    const transformProfile = async () => {
      if (!unifiedProfile) {
        setProfile(null);
        return;
      }

      try {
        // Get current session to determine if this is the current user
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        setIsCurrentUser(currentUserId === unifiedProfile.id);
        
        // Check if current user is following this profile
        if (currentUserId && unifiedProfile.id !== currentUserId) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUserId)
            .eq('following_id', unifiedProfile.id)
            .maybeSingle();
          
          setIsFollowing(!!followData);
        }
        
        // Get follower count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', unifiedProfile.id);
        
        // Get following count
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', unifiedProfile.id);
        
        // Get articles count
        const { count: articlesCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', unifiedProfile.id);
        
        // Transform unified profile to UserProfile interface
        const userData: UserProfile = {
          id: unifiedProfile.id,
          name: unifiedProfile.full_name || 'Unnamed User',
          username: unifiedProfile.username || undefined,
          avatar: unifiedProfile.avatar_url || undefined,
          coverImage: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
          headline: unifiedProfile.status || "User on the platform",
          bio: unifiedProfile.bio || unifiedProfile.status || "This user hasn't added a bio yet.",
          location: "Unknown location",
          phone: unifiedProfile.Phone || undefined,
          email: currentUserId === unifiedProfile.id ? session?.user?.email || undefined : undefined,
          joined: unifiedProfile.created_at,
          followers: followersCount || 0,
          following: followingCount || 0,
          articles: articlesCount || 0,
          skills: ["Networking", "Product Development", "User Experience"],
          experience: [],
          education: [],
          certifications: []
        };
        
        setProfile(userData);
        
      } catch (error) {
        console.error("Error transforming profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      }
    };
    
    transformProfile();
  }, [unifiedProfile]);
  
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!profile || !isCurrentUser) {
      toast({
        title: "Error",
        description: "You can only edit your own profile.",
        variant: "destructive"
      });
      return;
    }
    
    const unifiedUpdates: Partial<UnifiedProfile> = {
      full_name: profileData.name,
      username: profileData.username,
      avatar_url: profileData.avatar,
      status: profileData.headline,
      bio: profileData.bio,
      Phone: profileData.phone,
    };
    
    const success = await updateUnifiedProfile(unifiedUpdates);
    return success;
  };
  
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile || !isCurrentUser) {
      toast({
        title: "Error",
        description: "You can only upload avatar for your own profile.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}-${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      await updateProfile({ avatar: publicUrl });
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully.",
      });
      
      setUploadProgress(0);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive"
      });
      setUploadProgress(0);
      return null;
    }
  };
  
  const toggleFollow = async () => {
    if (!profile || isCurrentUser) {
      toast({
        title: "Error",
        description: isCurrentUser ? "You cannot follow yourself." : "Failed to follow user.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (!currentUserId) {
        toast({
          title: "Error",
          description: "You need to be logged in to follow users.",
          variant: "destructive"
        });
        return;
      }
      
      if (isFollowing) {
        // Unfollow: Delete the record
        const { error: unfollowError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', profile.id);
        
        if (unfollowError) throw unfollowError;
        
        setIsFollowing(false);
        setProfile({
          ...profile,
          followers: profile.followers - 1
        });
        
        toast({
          title: "Unfollowed",
          description: `You have unfollowed ${profile.name}.`,
        });
      } else {
        // Follow: Insert a new record
        const { error: followError } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: profile.id
          });
        
        if (followError) throw followError;
        
        setIsFollowing(true);
        setProfile({
          ...profile,
          followers: profile.followers + 1
        });
        
        toast({
          title: "Following",
          description: `You are now following ${profile.name}.`,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to process follow request.",
        variant: "destructive"
      });
    }
  };
  
  return {
    profile,
    isCurrentUser,
    isLoading,
    isFollowing,
    uploadProgress,
    updateProfile,
    uploadAvatar,
    toggleFollow
  };
};
