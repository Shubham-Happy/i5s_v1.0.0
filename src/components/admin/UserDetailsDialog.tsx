
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  MessageCircle, 
  Activity,
  Heart,
  Users,
  Briefcase,
  GraduationCap,
  Shield
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserData {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  status: string | null;
  Phone: string | null;
  bio: string | null;
}

interface UserActivity {
  id: string;
  type: string;
  content: string;
  created_at: string;
  details?: any;
}

interface UserDetailsDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    reactions: 0,
    followers: 0,
    following: 0,
    articles: 0,
    jobApplications: 0
  });
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && user) {
      fetchUserData();
    }
  }, [open, user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user stats
      const [
        postsResult,
        commentsResult,
        reactionsResult,
        followersResult,
        followingResult,
        articlesResult,
        jobApplicationsResult,
        educationResult,
        experienceResult
      ] = await Promise.all([
        supabase.from('posts').select('id').eq('user_id', user.id),
        supabase.from('comments').select('id').eq('user_id', user.id),
        supabase.from('post_reactions').select('id').eq('user_id', user.id),
        supabase.from('follows').select('id').eq('following_id', user.id),
        supabase.from('follows').select('id').eq('follower_id', user.id),
        supabase.from('articles').select('id').eq('user_id', user.id),
        supabase.from('job_applications').select('id').eq('user_id', user.id),
        supabase.from('user_education').select('*').eq('user_id', user.id).order('start_year', { ascending: false }),
        supabase.from('user_experience').select('*').eq('user_id', user.id).order('start_date', { ascending: false })
      ]);

      setStats({
        posts: postsResult.data?.length || 0,
        comments: commentsResult.data?.length || 0,
        reactions: reactionsResult.data?.length || 0,
        followers: followersResult.data?.length || 0,
        following: followingResult.data?.length || 0,
        articles: articlesResult.data?.length || 0,
        jobApplications: jobApplicationsResult.data?.length || 0
      });

      setEducation(educationResult.data || []);
      setExperience(experienceResult.data || []);

      // Fetch recent activities
      await fetchUserActivities();
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const activities: UserActivity[] = [];

      // Get recent posts
      const { data: posts } = await supabase
        .from('posts')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (posts) {
        posts.forEach(post => {
          activities.push({
            id: `post-${post.id}`,
            type: 'post',
            content: `Created a post: ${post.content.substring(0, 100)}...`,
            created_at: post.created_at
          });
        });
      }

      // Get recent comments
      const { data: comments } = await supabase
        .from('comments')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (comments) {
        comments.forEach(comment => {
          activities.push({
            id: `comment-${comment.id}`,
            type: 'comment',
            content: `Commented: ${comment.content.substring(0, 100)}...`,
            created_at: comment.created_at
          });
        });
      }

      // Get recent articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (articles) {
        articles.forEach(article => {
          activities.push({
            id: `article-${article.id}`,
            type: 'article',
            content: `Published article: ${article.title}`,
            created_at: article.created_at
          });
        });
      }

      // Sort activities by date
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setActivities(activities.slice(0, 10));
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'article':
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
              ) : (
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {(user.full_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.full_name || 'Unnamed User'}</h2>
              <p className="text-sm text-muted-foreground">@{user.username || 'no-username'}</p>
            </div>
            {user.is_admin && (
              <Badge className="bg-purple-100 text-purple-800">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.Phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.Phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {formatDistanceToNow(new Date(user.created_at))} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">
                      {user.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                {user.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest user actions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="w-8 h-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.created_at))} ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No recent activity found</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <div className="grid gap-4">
              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {experience.length > 0 ? (
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-purple-200 pl-4">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                          </p>
                          {exp.description && (
                            <p className="text-sm mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No work experience added</p>
                  )}
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {education.length > 0 ? (
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="border-l-2 border-purple-200 pl-4">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                          <p className="text-xs text-muted-foreground">
                            {edu.start_year} - {edu.end_year}
                          </p>
                          {edu.description && (
                            <p className="text-sm mt-2">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No education information added</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.comments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reactions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.articles}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.followers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Following</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.following}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.jobApplications}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
