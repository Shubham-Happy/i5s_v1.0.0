import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  FileText,
  Flag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContentItem {
  id: string;
  type: 'post' | 'article' | 'comment';
  content: string;
  user_id: string;
  created_at: string;
  title?: string;
  user?: {
    full_name?: string;
    username?: string;
  };
}

export function ContentModeration() {
  const [flaggedContent, setFlaggedContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [moderationNote, setModerationNote] = useState("");

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  const fetchFlaggedContent = async () => {
    try {
      setIsLoading(true);
      
      // Fetch recent posts that might need moderation
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          user_id,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (postsError) throw postsError;

      // Fetch recent articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          user_id,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (articlesError) throw articlesError;

      // Get all unique user IDs
      const userIds = [...new Set([
        ...(posts || []).map(post => post.user_id),
        ...(articles || []).map(article => article.user_id)
      ])];

      // Fetch user profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a profiles map for easy lookup
      const profilesMap = new Map(
        (profiles || []).map(profile => [profile.id, profile])
      );

      const contentItems: ContentItem[] = [
        ...(posts || []).map(post => ({
          id: post.id,
          type: 'post' as const,
          content: post.content,
          user_id: post.user_id,
          created_at: post.created_at,
          user: profilesMap.get(post.user_id)
        })),
        ...(articles || []).map(article => ({
          id: article.id,
          type: 'article' as const,
          content: article.content || '',
          title: article.title,
          user_id: article.user_id,
          created_at: article.created_at,
          user: profilesMap.get(article.user_id)
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setFlaggedContent(contentItems);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content for moderation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (contentId: string, type: string) => {
    toast({
      title: "Content Approved",
      description: `${type} has been approved and will remain published.`
    });
  };

  const handleRemove = async (contentId: string, type: string) => {
    try {
      if (type === 'post') {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', contentId);
        
        if (error) throw error;
      } else if (type === 'article') {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', contentId);
        
        if (error) throw error;
      }

      setFlaggedContent(prev => prev.filter(item => item.id !== contentId));
      toast({
        title: "Content Removed",
        description: `${type} has been removed from the platform.`
      });
    } catch (error) {
      console.error("Error removing content:", error);
      toast({
        title: "Error",
        description: "Failed to remove content.",
        variant: "destructive"
      });
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'article':
        return <FileText size={16} className="text-green-600" />;
      default:
        return <MessageSquare size={16} className="text-gray-600" />;
    }
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
          <Flag size={20} className="text-orange-600 dark:text-orange-400" />
          Content Moderation
        </CardTitle>
        <CardDescription>
          Review and moderate user-generated content
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedContent.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getContentTypeIcon(item.type)}
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {item.user?.full_name || item.user?.username || 'Unknown User'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                {item.title && (
                  <h4 className="font-medium mb-2">{item.title}</h4>
                )}
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {item.content?.substring(0, 200)}...
                </p>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContent(item)}
                      >
                        <Eye size={16} className="mr-2" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {getContentTypeIcon(item.type)}
                          Content Review
                        </DialogTitle>
                        <DialogDescription>
                          Review this {item.type} and take appropriate action
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {item.title && (
                          <div>
                            <h4 className="font-medium mb-2">Title</h4>
                            <p className="text-sm">{item.title}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium mb-2">Content</h4>
                          <div className="max-h-40 overflow-y-auto p-3 bg-muted rounded text-sm">
                            {item.content}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Moderation Notes</h4>
                          <Textarea
                            value={moderationNote}
                            onChange={(e) => setModerationNote(e.target.value)}
                            placeholder="Add notes about this moderation action..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => handleApprove(item.id, item.type)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve
                  </Button>

                  <Button
                    onClick={() => handleRemove(item.id, item.type)}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle size={16} className="mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {flaggedContent.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                <p>No content pending moderation</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
