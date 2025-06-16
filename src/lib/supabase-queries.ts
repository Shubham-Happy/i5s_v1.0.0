
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";

/**
 * Fetches a user profile by ID using raw SQL query
 * This works around type issues when using the generated types
 */
export const fetchProfileById = async (userId: string): Promise<Profile | null> => {
  try {
    // Using a custom query to bypass type issues
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    // Type assertion to handle the return value
    return data as Profile;
  } catch (error) {
    console.error("Error in fetchProfileById:", error);
    return null;
  }
};

/**
 * Updates a user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null, error: Error | null }> => {
  try {
    // Using a custom query to bypass type issues
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return { data: null, error };
    }
    
    // Type assertion to handle the return value
    return { data: data as Profile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

/**
 * Counts the number of articles by a user
 */
export const countUserArticles = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting user articles:", error);
    return 0;
  }
};

/**
 * Counts followers for a user (placeholder)
 */
export const countUserFollowers = async (userId: string): Promise<number> => {
  // This would connect to a followers table in a real implementation
  return 0;
}

/**
 * Counts users followed by this user (placeholder)
 */
export const countUserFollowing = async (userId: string): Promise<number> => {
  // This would connect to a followers table in a real implementation
  return 0;
}
