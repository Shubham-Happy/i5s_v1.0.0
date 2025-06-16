import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ExternalLink, Plus } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { PostList } from "@/components/posts/PostList";
import { SkillsExperience } from "./SkillsExperience";
import { ProfileAnalytics } from "./ProfileAnalytics";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { useUserExperience } from "@/hooks/useUserExperience";
import { useUserEducation } from "@/hooks/useUserEducation";
import { useUserPosts } from "@/hooks/useUserPosts";

interface ProfileTabsProps {
  user: any;
  isOwnProfile: boolean;
  articles: any[];
  isLoadingArticles: boolean;
}

export function ProfileTabs({ user, isOwnProfile, articles, isLoadingArticles }: ProfileTabsProps) {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const { experiences, isLoading: isLoadingExperience } = useUserExperience(user.id);
  const { education, isLoading: isLoadingEducation } = useUserEducation(user.id);
  const { posts, isLoading: isLoadingPosts } = useUserPosts(user.id);

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        {isOwnProfile && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
      </TabsList>

      <TabsContent value="about" className="mt-6">
        <SkillsExperience userId={user.id} isCurrentUser={isOwnProfile} />
      </TabsContent>

      <TabsContent value="posts" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              Recent posts and updates from {isOwnProfile ? "you" : user.name || "this user"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 bg-muted rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/6" />
                      </div>
                    </div>
                    <div className="h-32 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <PostList 
                posts={posts}
                isLoading={false}
                onToggleReaction={async () => {}} // Read-only for profile view
                onToggleCommentLike={async () => {}}
                onCreateComment={async () => {}}
                onCreateReply={async () => {}}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts yet.</p>
                {isOwnProfile && (
                  <p className="mt-2">Share your thoughts and updates with your network!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="articles" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>
              Published content and thought leadership pieces
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingArticles ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No articles published yet.</p>
                {isOwnProfile && (
                  <p className="mt-2">Start sharing your expertise by writing your first article!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experience" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Experience</CardTitle>
              <CardDescription>Professional work history and achievements</CardDescription>
            </div>
            {isOwnProfile && (
              <Button 
                onClick={() => setShowExperienceForm(true)}
                size="sm"
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {showExperienceForm && (
              <div className="mb-6">
                <ExperienceForm onClose={() => setShowExperienceForm(false)} />
              </div>
            )}
            
            {isLoadingExperience ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/6" />
                  </div>
                ))}
              </div>
            ) : experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {exp.logo && (
                          <img src={exp.logo} alt={exp.company} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(exp.start_date).toLocaleDateString()} - 
                            {exp.current ? ' Present' : ` ${exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}`}
                          </div>
                        </div>
                      </div>
                      {exp.current && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-sm text-muted-foreground">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No work experience added yet.</p>
                {isOwnProfile && (
                  <p className="mt-2">Add your professional experience to showcase your career journey!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="education" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Academic background and qualifications</CardDescription>
            </div>
            {isOwnProfile && (
              <Button 
                onClick={() => setShowEducationForm(true)}
                size="sm"
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {showEducationForm && (
              <div className="mb-6">
                <EducationForm onClose={() => setShowEducationForm(false)} />
              </div>
            )}
            
            {isLoadingEducation ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/6" />
                  </div>
                ))}
              </div>
            ) : education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {edu.logo && (
                        <img src={edu.logo} alt={edu.school} className="w-12 h-12 rounded object-cover" />
                      )}
                      <div>
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.school}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {edu.start_year} - {edu.end_year}
                        </div>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-sm text-muted-foreground">{edu.description}</p>
                    )}
                    {edu.activities && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Activities & Societies:</h4>
                        <p className="text-sm text-muted-foreground">{edu.activities}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No education background added yet.</p>
                {isOwnProfile && (
                  <p className="mt-2">Add your educational qualifications to complete your profile!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {isOwnProfile && (
        <TabsContent value="analytics" className="mt-6">
          <ProfileAnalytics userId={user.id} />
        </TabsContent>
      )}
    </Tabs>
  );
}
