
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, DollarSign, Users, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStartup } from "@/hooks/useStartups";
import { useStartupComments } from "@/hooks/useStartupComments";
import { StartupCommentSection } from "@/components/startups/StartupCommentSection";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";

export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: startup, isLoading, error } = useStartup(id || "");
  const { 
    comments, 
    createComment, 
    createReply, 
    toggleCommentLike, 
    isCreatingComment, 
    isCreatingReply 
  } = useStartupComments(id || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    console.log("StartupDetail - startup ID:", id);
    console.log("StartupDetail - startup data:", startup);
    console.log("StartupDetail - comments:", comments);
  }, [id, startup, comments]);

  const handleCreateComment = async (startupId: string, content: string) => {
    console.log("Creating comment for startup:", startupId, "content:", content);
    try {
      await createComment(content);
      console.log("Comment created successfully");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to create comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateReply = async (commentId: string, content: string, startupId: string) => {
    console.log("Creating reply for comment:", commentId, "content:", content);
    try {
      await createReply(commentId, content);
      console.log("Reply created successfully");
    } catch (error) {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "Failed to create reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    console.log("Toggling like for comment:", commentId);
    try {
      await toggleCommentLike(commentId);
      console.log("Comment like toggled successfully");
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-12"></div>
          <div className="h-48 bg-muted rounded w-full mb-6"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="container max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Startup</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the startup you're looking for.
        </p>
        <Button asChild>
          <Link to="/startups">Back to Startups</Link>
        </Button>
      </div>
    );
  }

  // Make sure we have a valid startup ID before rendering comments
  if (!startup.id) {
    console.error("StartupDetail - No startup ID available");
    return (
      <div className="container max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid Startup</h2>
        <p className="text-muted-foreground mb-6">
          This startup doesn't have a valid ID.
        </p>
        <Button asChild>
          <Link to="/startups">Back to Startups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/startups">Startups</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="max-w-[150px] truncate">
              {startup.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <Link 
          to="/startups"
          className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Startups
        </Link>

        <div className="flex items-start gap-6 mb-6">
          {startup.logo && (
            <div className="flex-shrink-0">
              <img
                src={startup.logo}
                alt={`${startup.name} logo`}
                className="w-20 h-20 rounded-lg object-cover border border-gold/20"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{startup.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{startup.tagline}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {startup.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                {startup.funding_stage}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Founded {formatDate(startup.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-gold/10 text-gold-dark border-gold/30">
                {startup.category}
              </Badge>
              {startup.featured && (
                <Badge variant="default" className="bg-gradient-to-r from-slate-green to-gold-accent text-white">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="lg" className="gold-button">
              <Heart className="h-4 w-4 mr-2" />
              Upvote ({startup.votes})
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About {startup.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {startup.description}
            </p>
          </CardContent>
        </Card>

        {startup.founder && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={startup.founder.avatar} alt={startup.founder.name} />
                  <AvatarFallback className="bg-gradient-to-r from-slate-green to-gold-accent text-white">
                    {startup.founder.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Link to={`/profile/${startup.founder.id}`} className="font-medium text-lg hover:text-gold-accent transition-colors">
                    {startup.founder.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Founder & CEO
                  </p>
                </div>

                <Button variant="outline" size="sm" className="ml-auto gold-border gold-hover">
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8" id="comments">
          <h2 className="text-xl font-bold mb-4 text-gold-dark">Discussion ({comments.length})</h2>
          
          <StartupCommentSection 
            startupId={startup.id}
            comments={comments}
            onCreateComment={handleCreateComment}
            onCreateReply={handleCreateReply}
            onToggleCommentLike={handleToggleCommentLike}
          />
        </div>
      </div>
    </div>
  );
}
