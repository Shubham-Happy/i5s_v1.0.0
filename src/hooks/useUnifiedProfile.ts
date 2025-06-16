
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface UnifiedProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  status: string | null;
  Phone: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const useUnifiedProfile = (userId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchProfile = async () => {
    if (!targetUserId) {
      console.log("useUnifiedProfile: No target user ID available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("useUnifiedProfile: Fetching profile for user:", targetUserId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error("useUnifiedProfile: Error fetching profile:", error);
        setError(error.message);
        return;
      }

      if (!data) {
        console.log("useUnifiedProfile: No profile data found");
        setError("Profile not found");
        return;
      }

      console.log("useUnifiedProfile: Profile data fetched:", data);
      
      // Ensure all required fields are present, even if null
      // Safely access location, website, and cover_image fields that may not exist in the type
      const profileData: UnifiedProfile = {
        id: data.id,
        full_name: data.full_name,
        username: data.username,
        avatar_url: data.avatar_url,
        cover_image: (data as any).cover_image || null,
        status: data.status,
        Phone: data.Phone,
        bio: data.bio,
        location: (data as any).location || null,
        website: (data as any).website || null,
        is_admin: data.is_admin,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setProfile(profileData);
    } catch (err) {
      console.error("useUnifiedProfile: Error in fetchProfile:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UnifiedProfile>) => {
    if (!targetUserId) {
      console.error("useUnifiedProfile: No user ID available for update");
      toast({
        title: "Error",
        description: "No user ID available for update",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("useUnifiedProfile: Updating profile with:", updates);
      
      // Create clean updates object with proper field mapping
      const cleanUpdates: any = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle phone field mapping - form sends 'phone' but DB expects 'Phone'
          if (key === 'phone') {
            cleanUpdates['Phone'] = value;
          } else if (key !== 'id' && key !== 'created_at') {
            cleanUpdates[key] = value;
          }
        }
      });

      console.log("useUnifiedProfile: Clean updates to send:", cleanUpdates);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error("useUnifiedProfile: Update error:", error);
        throw error;
      }

      console.log("useUnifiedProfile: Profile updated successfully:", data);
      
      // Ensure all required fields are present in the updated data
      // Safely access location, website, and cover_image fields that may not exist in the type
      const updatedProfileData: UnifiedProfile = {
        id: data.id,
        full_name: data.full_name,
        username: data.username,
        avatar_url: data.avatar_url,
        cover_image: (data as any).cover_image || null,
        status: data.status,
        Phone: data.Phone,
        bio: data.bio,
        location: (data as any).location || null,
        website: (data as any).website || null,
        is_admin: data.is_admin,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setProfile(updatedProfileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return true;
    } catch (error) {
      console.error("useUnifiedProfile: Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log("useUnifiedProfile: Effect triggered, targetUserId:", targetUserId);
    fetchProfile();
  }, [targetUserId]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};
