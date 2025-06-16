
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function CreateArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    cover_image: ""
  });

  if (!user) {
    return (
      <div className={cn(
        "py-8",
        isMobile ? "px-4" : "container max-w-4xl mx-auto px-4"
      )}>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to create an article.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate reading time (rough estimate: 200 words per minute)
      const wordCount = formData.content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || formData.content.substring(0, 200) + "...",
        cover_image: formData.cover_image.trim() || null,
        user_id: user.id,
        published_at: new Date().toISOString(),
        reading_time: `${readingTime} min`
      };

      console.log("Creating article with data:", articleData);
      
      const { data, error } = await supabase
        .from("articles")
        .insert([articleData])
        .select()
        .single();

      if (error) {
        console.error("Error creating article:", error);
        throw error;
      }

      console.log("Article created successfully:", data);

      toast({
        title: "Article Created",
        description: "Your article has been published successfully!",
      });

      navigate(`/articles/${data.id}`);
    } catch (error: any) {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={cn(
      "py-6",
      isMobile ? "px-4" : "container max-w-4xl mx-auto px-4"
    )}>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-green/10 rounded-lg">
            <FileText className="h-6 w-6 text-slate-green" />
          </div>
          <div>
            <h1 className={cn(
              "font-bold text-slate-green",
              isMobile ? "text-xl" : "text-2xl md:text-3xl"
            )}>
              Create New Article
            </h1>
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>
              Share your insights and knowledge with the community
            </p>
          </div>
        </div>
      </div>

      <Card className="border-gold-light/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-green/5 to-gold-light/5">
          <CardTitle className="text-slate-green">Article Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your article
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(
          "pt-6",
          isMobile && "px-4"
        )}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-green font-medium">
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter article title..."
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="border-gold-light/40 focus:border-slate-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-slate-green font-medium">
                Summary
              </Label>
              <Textarea
                id="summary"
                placeholder="Brief description of your article (optional)..."
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                className="h-20 border-gold-light/40 focus:border-slate-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image" className="text-slate-green font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover Image URL
              </Label>
              <Input
                id="cover_image"
                type="url"
                placeholder="https://example.com/image.jpg (optional)"
                value={formData.cover_image}
                onChange={(e) => handleInputChange("cover_image", e.target.value)}
                className="border-gold-light/40 focus:border-slate-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-slate-green font-medium">
                Content *
              </Label>
              <Textarea
                id="content"
                placeholder="Write your article content here..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                required
                className={cn(
                  "border-gold-light/40 focus:border-slate-green",
                  isMobile ? "min-h-[250px]" : "min-h-[300px]"
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={cn(
                  "bg-gradient-to-r from-slate-green to-gold-medium hover:from-slate-green/90 hover:to-gold-medium/90 text-slate-100 font-semibold",
                  isMobile ? "px-6 w-full" : "px-8"
                )}
              >
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
