import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePeople, useFollowing, useFollowers, useSuggestions, useFollowUser } from "@/hooks/usePeople";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

export default function Network() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();

  const { people, isLoading: peopleLoading } = usePeople(searchQuery);
  const { following, isLoading: followingLoading } = useFollowing(searchQuery);
  const { followers, isLoading: followersLoading } = useFollowers(searchQuery);
  const { suggestions, isLoading: suggestionsLoading } = useSuggestions(searchQuery);
  const { followUser, isFollowing: isFollowingUser } = useFollowUser();

  const handleFollowToggle = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    followUser(userId);
  };

  const handleProfileClick = (userId: string) => {
    console.log("=== Network Profile Click Debug ===");
    console.log("Network: Target user ID:", userId);
    console.log("Network: Current user ID:", currentUser?.id);
    console.log("Network: Is same user?", userId === currentUser?.id);
    
    if (!userId) {
      console.error("Network: No user ID provided for profile navigation");
      return;
    }
    
    const targetRoute = `/profile/${userId}`;
    console.log("Network: Navigating to route:", targetRoute);
    
    // Force navigation to the specific user profile
    navigate(targetRoute, { replace: false });
  };

  const UserCard = ({ user, showFollowButton = true }: { user: any; showFollowButton?: boolean }) => {
    console.log("Network: Rendering UserCard for user ID:", user.id, "name:", user.name);
    
    const handleCardClick = (e: React.MouseEvent) => {
      console.log("Network: UserCard clicked for user ID:", user.id);
      handleProfileClick(user.id);
    };
    
    return (
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-statusnow-purple text-white">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{user.headline}</p>
                {user.location && (
                  <p className="text-xs text-muted-foreground truncate">{user.location}</p>
                )}
              </div>
            </div>
            {showFollowButton && (
              <Button
                variant={user.isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={(e) => handleFollowToggle(user.id, e)}
                disabled={isFollowingUser}
                className="ml-2 flex-shrink-0"
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="h-3 w-3 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {user.bio}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{user.followers || 0} followers</span>
            <span>{user.following || 0} following</span>
          </div>
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.slice(0, 2).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{user.skills.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  const LoadingGrid = () => (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    )}>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={cn(
      "py-6",
      isMobile ? "px-4" : "container max-w-6xl mx-auto px-4"
    )}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-statusnow-purple/10 rounded-lg">
            <Users className="h-6 w-6 text-statusnow-purple" />
          </div>
          <div>
            <h1 className={cn(
              "font-bold text-statusnow-purple",
              isMobile ? "text-xl" : "text-2xl md:text-3xl"
            )}>
              Network
            </h1>
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>
              Connect with professionals and grow your network
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search people..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn(
            "grid w-full",
            isMobile ? "grid-cols-2" : "grid-cols-4"
          )}>
            <TabsTrigger value="all">All People</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {peopleLoading ? (
              <LoadingGrid />
            ) : people.length > 0 ? (
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {people.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No people found"
                description={searchQuery ? "Try different search terms" : "Start connecting with professionals"}
                icon={Users}
              />
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            {suggestionsLoading ? (
              <LoadingGrid />
            ) : suggestions.length > 0 ? (
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {suggestions.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No suggestions available"
                description="We'll suggest people for you to connect with as you use the platform"
                icon={UserPlus}
              />
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            {followingLoading ? (
              <LoadingGrid />
            ) : following.length > 0 ? (
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {following.map((user) => (
                  <UserCard key={user.id} user={user} showFollowButton={false} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Not following anyone yet"
                description={searchQuery ? "No matching users found" : "Start following people to see them here"}
                icon={UserCheck}
              />
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-6">
            {followersLoading ? (
              <LoadingGrid />
            ) : followers.length > 0 ? (
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {followers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No followers yet"
                description={searchQuery ? "No matching followers found" : "Share great content to attract followers"}
                icon={Users}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
