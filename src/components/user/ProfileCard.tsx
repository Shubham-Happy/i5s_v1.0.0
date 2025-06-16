import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    username?: string;
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
  };
  compact?: boolean;
  onFollowClick?: () => void;
}

export function ProfileCard({ user, compact = false, onFollowClick }: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize isFollowing state from the user prop
    setIsFollowing(!!user.isFollowing);
    
    // Get current user session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    getSession();
    
    // Fetch follower and following counts
    const fetchCounts = async () => {
      if (!user.id) return;
      
      try {
        // Get follower count
        const { count: followers } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);
          
        setFollowersCount(followers || 0);
        
        // Get following count
        const { count: following } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id);
          
        setFollowingCount(following || 0);
      } catch (error) {
        console.error("Error fetching follower/following counts:", error);
      }
    };
    
    fetchCounts();
  }, [user.id, user.isFollowing]);
  
  useEffect(() => {
    // Check if current user is following this user
    const checkFollowStatus = async () => {
      if (!currentUserId || !user.id || currentUserId === user.id) return;
      
      try {
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', user.id)
          .maybeSingle();
          
        setIsFollowing(!!followData);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    checkFollowStatus();
  }, [currentUserId, user.id]);
  
  useEffect(() => {
    // Subscribe to real-time follow updates
    if (user.id) {
      const channel = supabase
        .channel(`follow-updates-${user.id}`)
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'follows',
            filter: `following_id=eq.${user.id}`,
          },
          () => {
            // Refresh follower count
            fetchFollowerCount();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user.id]);
  
  const fetchFollowerCount = async () => {
    if (!user.id) return;
    
    try {
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);
      
      setFollowersCount(count || 0);
    } catch (error) {
      console.error("Error fetching follower count:", error);
    }
  };
  
  const handleFollowClick = async () => {
    if (isProcessing) return;
    
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to follow users",
        variant: "destructive",
      });
      return;
    }
    
    if (currentUserId === user.id) {
      toast({
        title: "Invalid action",
        description: "You cannot follow yourself",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Optimistic UI update
    const prevFollowing = isFollowing;
    const prevFollowersCount = followersCount;
    
    setIsFollowing(!isFollowing);
    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', user.id);
          
        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: user.id
          });
          
        if (error) throw error;
      }
      
      // Call the onFollowClick handler if provided
      if (onFollowClick) {
        onFollowClick();
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(prevFollowing);
      setFollowersCount(prevFollowersCount);
      console.error("Error toggling follow:", error);
      
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessageClick = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (currentUserId === user.id) {
      toast({
        title: "Invalid action",
        description: "You cannot message yourself",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${user.id}),and(user1_id.eq.${user.id},user2_id.eq.${currentUserId})`)
        .maybeSingle();

      if (checkError) throw checkError;

      let conversationId: string;

      if (existingConv) {
        // Use existing conversation
        conversationId = existingConv.id;
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: currentUserId < user.id ? currentUserId : user.id,
            user2_id: currentUserId < user.id ? user.id : currentUserId,
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

      // Navigate to messages page with conversation info
      navigate('/messages', {
        state: {
          conversationId,
          recipientId: user.id,
          recipientName: user.name,
          recipientAvatar: user.avatar
        }
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className={cn(
      "border rounded-lg overflow-hidden bg-card text-card-foreground",
      compact ? "shadow-none" : "shadow-sm"
    )}>
      {!compact && user.coverImage && (
        <div className="h-28 w-full bg-muted">
          <img
            src={user.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <div className={cn(
        "p-5",
        !compact && user.coverImage && "-mt-12 relative"
      )}>
        <div className="flex items-start justify-between">
          <Avatar className={cn(
            "border-4 border-background",
            compact ? "h-12 w-12" : "h-24 w-24" 
          )}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          {!compact && currentUserId !== user.id && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMessageClick}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={handleFollowClick}
                disabled={isProcessing}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          )}
        </div>
        
        <div className={cn("mt-3", compact && "flex-1")}>
          <Link to={`/profile/${user.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg">{user.name}</h3>
          </Link>
          {user.username && (
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          )}
          
          {user.headline && (
            <p className={cn("mt-2", compact ? "line-clamp-2" : "")}>{user.headline}</p>
          )}
          
          {user.bio && (
            <p className={cn("mt-2 text-sm text-muted-foreground", compact ? "line-clamp-2" : "line-clamp-3")}>
              {user.bio}
            </p>
          )}
          
          {user.website && (
            <div className="flex items-center mt-2 text-sm">
              <LinkIcon size={14} className="mr-1 text-muted-foreground" />
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {user.skills && user.skills.length > 0 && !compact && (
            <div className="mt-4 flex flex-wrap gap-1">
              {user.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {compact && currentUserId !== user.id && (
          <div className="mt-3 flex justify-between items-center">
            {user.skills && user.skills.length > 0 && (
              <div className="flex gap-1 overflow-hidden">
                {user.skills.slice(0, 2).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{user.skills.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleMessageClick}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleFollowClick} 
                variant={isFollowing ? "secondary" : "default"}
                disabled={isProcessing}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        )}
        
        {!compact && (
          <div className="flex gap-4 mt-4 pt-4 border-t">
            <Link to={`/profile/${user.id}/followers`} className="hover:underline">
              <span className="font-semibold">{followersCount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">Followers</span>
            </Link>
            <Link to={`/profile/${user.id}/following`} className="hover:underline">
              <span className="font-semibold">{followingCount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">Following</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
