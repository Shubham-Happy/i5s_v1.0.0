
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserPost {
  id: string;
  content: string;
  image_url: string | null; // Changed to match Post type requirement
  created_at: string;
  updated_at: string;
  user_id: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  reactions?: any[];
  comments?: any[];
}

export const useUserPosts = (userId?: string) => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("useUserPosts: Fetching posts for user:", userId);

        // First, fetch the user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            reactions:post_reactions(*),
            comments(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error("useUserPosts: Error fetching posts:", postsError);
          setError(postsError.message);
          return;
        }

        // Then, fetch the user's profile separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error("useUserPosts: Error fetching profile:", profileError);
          // Don't fail completely if profile fetch fails, just use fallback data
        }

        console.log("useUserPosts: Posts fetched:", postsData);
        console.log("useUserPosts: Profile fetched:", profileData);

        // Transform posts data to include author information
        const transformedPosts = postsData?.map(post => {
          // Create a more robust author name
          let authorName = "User"; // Default fallback
          
          if (profileData) {
            if (profileData.full_name) {
              authorName = profileData.full_name;
            } else if (profileData.username) {
              authorName = profileData.username;
            } else {
              // If we have a profile but no name/username, use "User"
              authorName = "User";
            }
          }

          return {
            ...post,
            image_url: post.image_url || null, // Ensure it's explicitly null if undefined
            author: {
              id: userId,
              name: authorName,
              avatar: profileData?.avatar_url
            }
          };
        }) || [];

        console.log("useUserPosts: Transformed posts with author info:", transformedPosts);
        setPosts(transformedPosts);
      } catch (err) {
        console.error("useUserPosts: Error in fetchUserPosts:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return {
    posts,
    isLoading,
    error,
  };
};
