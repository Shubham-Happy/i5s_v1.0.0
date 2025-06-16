import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, ExternalLink, Edit, UserPlus, UserCheck, MessageSquare } from "lucide-react";
import { ExtendedProfile } from "@/types/profile";
import { useFollowUser } from "@/hooks/usePeople";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface ProfileHeaderProps {
  user: ExtendedProfile;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile }) => {
  const navigate = useNavigate();
  const { followUser, isFollowing } = useFollowUser();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followers || 0);
  const [followingCount, setFollowingCount] = useState(user.following || 0);

  useEffect(() => {
    // Fetch the latest follower and following counts when the component loads
    const fetchCounts = async () => {
      if (!user.id) return;
      
      try {
        // Fetch follower count
        const { count: followers, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);
        
        if (followersError) throw followersError;
        
        // Fetch following count
        const { count: following, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id);
        
        if (followingError) throw followingError;
        
        // Check if current user is following this profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id && !isOwnProfile) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', session.user.id)
            .eq('following_id', user.id)
            .maybeSingle();
            
          setIsFollowed(!!followData);
        }
        
        // Update counts
        setFollowerCount(followers || 0);
        setFollowingCount(following || 0);
      } catch (error) {
        console.error("Error fetching follower/following counts:", error);
      }
    };
    
    fetchCounts();
    
    // Set up real-time subscription for follow changes
    if (user.id) {
      const channel = supabase
        .channel(`follows_${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'follows',
          filter: `following_id=eq.${user.id}`
        }, () => {
          // Refresh follower count when a change occurs
          fetchCounts();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user.id, isOwnProfile]);

  // Helper function to get user's display name
  const getUserDisplayName = () => {
    return user.name || user.full_name || user.username || "User";
  };

  const handleFollow = async () => {
    try {
      // Optimistic UI update
      setIsFollowed(!isFollowed);
      setFollowerCount(isFollowed ? followerCount - 1 : followerCount + 1);
      
      await followUser(user.id);
      
      toast({
        title: isFollowed ? "Unfollowed" : "Following",
        description: isFollowed 
          ? `You have unfollowed ${getUserDisplayName()}` 
          : `You are now following ${getUserDisplayName()}`,
      });
    } catch (error) {
      // Revert on error
      setIsFollowed(!isFollowed);
      setFollowerCount(isFollowed ? followerCount + 1 : followerCount - 1);
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = async () => {
    if (!user.id) return;
    
    setIsMessageLoading(true);
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }
      
      const currentUserId = sessionData.session.user.id;
      
      // Check if a conversation already exists between the two users
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${user.id}),and(user1_id.eq.${user.id},user2_id.eq.${currentUserId})`)
        .single();
      
      let conversationId;
      
      if (existingConversation) {
        // Use existing conversation
        conversationId = existingConversation.id;
      } else {
        // Create a new conversation
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            user1_id: currentUserId,
            user2_id: user.id,
            unread_count: 0
          })
          .select('id')
          .single();
        
        if (error) throw error;
        conversationId = newConversation?.id;
      }
      
      // Redirect to messages page with the conversation open
      navigate("/messages", { 
        state: { 
          conversationId,
          recipientId: user.id,
          recipientName: getUserDisplayName(),
          recipientAvatar: user.avatar_url
        } 
      });
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Unable to start conversation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsMessageLoading(false);
    }
  };

  const formattedJoinDate = user.joined
    ? new Date(user.joined).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="mb-6">
      {/* Cover image */}
      <div className="h-64 w-full rounded-xl bg-gradient-to-r from-statusnow-purple/20 to-statusnow-purple-light/10 overflow-hidden">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Profile cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-statusnow-purple/30 to-statusnow-purple-light/20" />
        )}
      </div>

      {/* Profile details */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-4 -mt-8 md:-mt-12 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <UserAvatar 
            user={user} 
            size="xl"
            className="h-24 w-24 md:h-32 md:w-32 border-4 border-background"
          />
          <div className="mt-2 md:mt-0 md:mb-2">
            <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
            <p className="text-muted-foreground">{user.bio || "No bio provided"}</p>
            <div className="flex items-center flex-wrap gap-3 mt-2">
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{user.website.startsWith('http') ? new URL(user.website).hostname : user.website}</span>
                </a>
              )}
              {user.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{user.location}</span>
                </span>
              )}
              {user.joined && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined {formattedJoinDate}</span>
                </span>
              )}
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </a>
              )}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1">
                <span className="font-bold">{followerCount}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{followingCount}</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{user.articles || 0}</span>
                <span className="text-sm text-muted-foreground">Articles</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          {isOwnProfile ? (
            <Button variant="outline" asChild>
              <Link to="/settings">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          ) : (
            <>
              <Button variant={isFollowed ? "secondary" : "outline"} onClick={handleFollow} disabled={isFollowing}>
                {isFollowed ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" /> Following
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Follow
                  </>
                )}
              </Button>
              <Button onClick={handleMessage} disabled={isMessageLoading}>
                <MessageSquare className="mr-2 h-4 w-4" /> Message
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
