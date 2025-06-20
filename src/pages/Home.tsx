import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { ABTestedPostList } from "@/components/posts/ABTestedPostList";
import { usePosts } from "@/hooks/usePosts";
import { BetaBanner } from "@/components/ui/BetaBanner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TrendingUp, Sparkles, ArrowRight, Star, MessageCircle, Rocket, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  href,
  color
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
}) => <Link to={href} className="group">
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={cn("p-3 rounded-xl w-fit", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-slate-green transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex items-center mt-3 text-slate-green group-hover:translate-x-1 transition-transform">
            <span className="text-sm font-medium">Get started</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>;
export default function Home() {
  const isMobile = useIsMobile();
  const {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    toggleCommentLike,
    createComment,
    createReply
  } = usePosts();
  const handleCreatePost = async (content: string, imageFile: File | null) => {
    await createPost(content, imageFile);
  };
  const quickActions = [{
    icon: Rocket,
    title: "Launch Startup",
    description: "Turn your idea into reality with our startup toolkit",
    href: "/startups/launch",
    color: "bg-gradient-to-r from-emerald-500 to-emerald-600"
  }, {
    icon: FileText,
    title: "Write Article",
    description: "Share your knowledge and insights with the community",
    href: "/articles/new",
    color: "bg-gradient-to-r from-purple-500 to-purple-600"
  }, {
    icon: Plus,
    title: "Post Job",
    description: "Find talented people for your startup or company",
    href: "/jobs/new",
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  }];
  return <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-green via-emerald-500 to-gold-medium" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="relative p-8 md:p-12 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Welcome to cozync</h1>
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Where innovation meets opportunity. Connect, collaborate, and grow your entrepreneurial journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 transition-all duration-300">
              <Link to="/startups/launch">
                <Rocket className="h-5 w-5 mr-2" />
                Launch Your Startup
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gold-light/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gold-medium" />
                <CardTitle className="text-lg">Share Your Journey</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CreatePostForm onCreatePost={handleCreatePost} />
            </CardContent>
          </Card>
          
          {/* Posts Feed */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-6 pt-0">
                  <ABTestedPostList posts={posts} isLoading={isLoading} onToggleReaction={toggleReaction} onToggleCommentLike={toggleCommentLike} onCreateComment={createComment} onCreateReply={createReply} onUpdatePost={updatePost} onDeletePost={deletePost} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Beta Banner */}
          <BetaBanner />

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gold-medium" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {quickActions.map((action, index) => <QuickActionCard key={index} {...action} />)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}