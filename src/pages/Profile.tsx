import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAbout } from "@/components/profile/ProfileAbout";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useUnifiedProfile } from "@/hooks/useUnifiedProfile";
import { useAuth } from "@/context/AuthContext";
import { useProfileAnalytics } from "@/hooks/useProfileAnalytics";

export default function Profile() {
  const { id: routeUserId } = useParams();
  const { user } = useAuth();
  
  console.log("=== Profile Component Debug ===");
  console.log("Profile: Route param 'id':", routeUserId);
  console.log("Profile: Current user ID:", user?.id);
  
  // If no user is logged in and no specific profile ID is provided, show auth prompt
  if (!user && !routeUserId) {
    return (
      <AuthPrompt 
        title="Profile Access Required"
        description="Please sign in to view and manage your profile"
      />
    );
  }
  
  // Determine which profile to show - the provided ID or current user's profile
  const targetUserId = routeUserId || user?.id;
  console.log("Profile: Final target user ID:", targetUserId);
  console.log("Profile: Using route param?", !!routeUserId);
  
  const { profile, isLoading, error } = useUnifiedProfile(targetUserId);
  const { trackProfileView } = useProfileAnalytics();
  
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);

  // Check if this is the user's own profile
  useEffect(() => {
    if (user && targetUserId) {
      const isOwn = user.id === targetUserId;
      setIsOwnProfile(isOwn);
      console.log("Profile: Is own profile:", isOwn, "Current user:", user.id, "Target:", targetUserId);
    }
  }, [user, targetUserId]);

  // Track profile view when component mounts
  useEffect(() => {
    if (targetUserId && !isOwnProfile && user?.id) {
      console.log("Profile: Tracking profile view for:", targetUserId, "by user:", user.id);
      trackProfileView(targetUserId, user.id);
    }
  }, [targetUserId, isOwnProfile, user?.id, trackProfileView]);

  // Fetch additional profile data (followers, following, articles count)
  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!targetUserId) return;

      try {
        console.log("Profile: Fetching profile stats for user:", targetUserId);

        // Get follower count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', targetUserId);

        // Get following count
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', targetUserId);

        // Get articles count
        const { count: articlesCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId);

        console.log("Profile: Stats fetched - Followers:", followersCount, "Following:", followingCount, "Articles:", articlesCount);

        setFollowerCount(followersCount || 0);
        setFollowingCount(followingCount || 0);
        setArticlesCount(articlesCount || 0);
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      }
    };

    fetchProfileStats();
  }, [targetUserId]);

  // Fetch user's articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (!targetUserId) return;
      
      setIsLoadingArticles(true);
      console.log("Profile: Fetching articles for user:", targetUserId);
      
      try {
        const { data: articlesData, error } = await supabase
          .from("articles")
          .select(`
            *,
            profiles:user_id (
              full_name,
              username,
              avatar_url
            )
          `)
          .eq("user_id", targetUserId)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching articles:", error);
          throw error;
        }

        console.log("Profile: Articles fetched:", articlesData);

        // Transform articles data to include author information
        const transformedArticles = articlesData?.map(article => ({
          ...article,
          author: {
            id: article.user_id,
            name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
            avatar: article.profiles?.avatar_url,
            role: "Author"
          },
          coverImage: article.cover_image,
          publishedAt: article.published_at,
          readingTime: article.reading_time || "5 min"
        })) || [];

        setArticles(transformedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [targetUserId]);

  if (isLoading) {
    return (
      <div className="container py-4 md:py-8 px-3 md:px-6">
        <div className="mb-6 md:mb-8 h-48 md:h-64 w-full rounded-xl bg-gradient-to-r from-gold/10 to-emerald/10 dark:from-slate-green/10 dark:to-slate-green/20 animate-pulse" />
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gold/20 dark:bg-slate-green/20 animate-pulse" />
          <div>
            <div className="h-5 md:h-6 w-32 md:w-48 bg-gold/20 dark:bg-slate-green/20 rounded animate-pulse mb-2" />
            <div className="h-3 md:h-4 w-20 md:w-32 bg-gold/20 dark:bg-slate-green/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-4 md:py-8 px-3 md:px-6">
        <Card className="border-gold/20 dark:border-slate-green/20">
          <CardHeader>
            <CardTitle>Profile not found</CardTitle>
            <CardDescription>
              {error || "The user profile you are looking for does not exist."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/home">
              <Button className="bg-gold-accent hover:bg-gold-dark dark:bg-slate-green dark:hover:bg-slate-green-dark">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Create extended profile data for components that expect it
  const extendedProfile = {
    ...profile,
    name: profile.full_name || profile.username || 'User',
    bio: profile.bio || profile.status || "This user hasn't added a bio yet.",
    location: "Unknown location",
    website: undefined,
    email: isOwnProfile ? user?.email : undefined,
    joined: profile.created_at,
    followers: followerCount,
    following: followingCount,
    articles: articlesCount,
    skills: ["Networking", "Product Development", "User Experience"],
    experience: [],
    education: [],
    certifications: [],
    coverImage: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
    is_admin: profile.is_admin || false
  };

  console.log("Profile: Rendering with profile data for user:", extendedProfile.id);
  console.log("Profile: Articles to display:", articles.length);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-3 md:py-8 px-3 md:px-6">
        <ProfileHeader user={extendedProfile} isOwnProfile={isOwnProfile} />

        <div className="mt-4 md:mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-4 md:gap-6">
          {/* Mobile: About section first */}
          <div className="order-1 lg:order-1 lg:col-span-1">
            <ProfileAbout user={extendedProfile} />
          </div>

          {/* Mobile: Tabs section second */}
          <div className="order-2 lg:order-2 lg:col-span-3">
            <ProfileTabs 
              user={extendedProfile} 
              isOwnProfile={isOwnProfile} 
              articles={articles}
              isLoadingArticles={isLoadingArticles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
