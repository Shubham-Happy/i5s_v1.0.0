
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Trash, Eye, FileEdit, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

interface Article {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  user_name?: string;
}

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch content with improved error handling
  const fetchContent = useCallback(async (contentType: string) => {
    setIsLoading(true);
    try {
      if (contentType === "posts") {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (postsError) throw postsError;
        
        // Get user details for each post
        if (postsData) {
          const postsWithUsers = await Promise.all(
            postsData.map(async (post) => {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', post.user_id)
                .maybeSingle();
              
              if (userError) {
                console.error("Error fetching user for post:", userError);
                return {
                  ...post,
                  user_name: 'Unknown User'
                };
              }
              
              return {
                ...post,
                user_name: userData?.full_name || userData?.username || 'Unknown User'
              };
            })
          );
          
          setPosts(postsWithUsers);
        }
      } else if (contentType === "articles") {
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (articlesError) throw articlesError;
        
        if (articlesData) {
          const articlesWithUsers = await Promise.all(
            articlesData.map(async (article) => {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', article.user_id)
                .maybeSingle();
              
              if (userError) {
                console.error("Error fetching user for article:", userError);
                return {
                  ...article,
                  user_name: 'Unknown User'
                };
              }
              
              return {
                ...article,
                user_name: userData?.full_name || userData?.username || 'Unknown User'
              };
            })
          );
          
          setArticles(articlesWithUsers);
        }
      } else if (contentType === "comments") {
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (commentsError) throw commentsError;
        
        if (commentsData) {
          const commentsWithUsers = await Promise.all(
            commentsData.map(async (comment) => {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', comment.user_id)
                .maybeSingle();
              
              if (userError) {
                console.error("Error fetching user for comment:", userError);
                return {
                  ...comment,
                  user_name: 'Unknown User'
                };
              }
              
              return {
                ...comment,
                user_name: userData?.full_name || userData?.username || 'Unknown User'
              };
            })
          );
          
          setComments(commentsWithUsers);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${contentType}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab, fetchContent]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      const { type, id } = itemToDelete;
      let error;
      
      if (type === 'post') {
        // First delete all comments associated with the post
        const { error: commentDeleteError } = await supabase
          .from('comments')
          .delete()
          .eq('post_id', id);
          
        if (commentDeleteError) {
          console.warn("Error deleting comments:", commentDeleteError);
          // Continue with post deletion even if comment deletion fails
        }
        
        // Then delete post reactions
        const { error: reactionsDeleteError } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', id);
          
        if (reactionsDeleteError) {
          console.warn("Error deleting reactions:", reactionsDeleteError);
          // Continue with post deletion even if reactions deletion fails
        }
        
        // Finally delete the post
        ({ error } = await supabase.from('posts').delete().eq('id', id));
        if (!error) setPosts(posts.filter(post => post.id !== id));
      } else if (type === 'article') {
        ({ error } = await supabase.from('articles').delete().eq('id', id));
        if (!error) setArticles(articles.filter(article => article.id !== id));
      } else if (type === 'comment') {
        ({ error } = await supabase.from('comments').delete().eq('id', id));
        if (!error) setComments(comments.filter(comment => comment.id !== id));
      }
      
      if (error) throw error;
      
      toast({
        title: "Deleted Successfully",
        description: `The ${type} has been removed.`
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting this item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setConfirmDeleteOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get filtered content based on the current active tab and search term
  const getFilteredContent = () => {
    if (activeTab === "posts") {
      return posts.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "articles") {
      return articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return comments.filter(comment => 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const renderContentTable = () => {
    const filteredContent = getFilteredContent();
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
        </div>
      );
    }
    
    if (filteredContent.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Content Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 
              `No results match your search criteria.` : 
              `No ${activeTab} have been created yet.`}
          </p>
        </div>
      );
    }
    
    if (activeTab === "posts") {
      return (
        <table className="w-full">
          <thead className="bg-cream-50 dark:bg-purple-900/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
            {(filteredContent as Post[]).map((post) => (
              <tr key={post.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-4 whitespace-nowrap">{post.user_name}</td>
                <td className="px-4 py-4">
                  <div className="max-w-md truncate">{post.content}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{formatDate(post.created_at)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => confirmDelete(post.id, 'post')}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (activeTab === "articles") {
      return (
        <table className="w-full">
          <thead className="bg-cream-50 dark:bg-purple-900/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
            {(filteredContent as Article[]).map((article) => (
              <tr key={article.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-4">
                  <div className="max-w-xs truncate font-medium">{article.title}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{article.user_name}</td>
                <td className="px-4 py-4 whitespace-nowrap">{formatDate(article.created_at)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20">
                      <FileEdit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => confirmDelete(article.id, 'article')}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="w-full">
          <thead className="bg-cream-50 dark:bg-purple-900/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
            {(filteredContent as Comment[]).map((comment) => (
              <tr key={comment.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-4">
                  <div className="max-w-md truncate">{comment.content}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{comment.user_name}</td>
                <td className="px-4 py-4 whitespace-nowrap">{formatDate(comment.created_at)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => confirmDelete(comment.id, 'comment')}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setSearchTerm("");
      }} className="w-full">
        <TabsList className="bg-cream-50 dark:bg-purple-900/20 w-full mb-4">
          <TabsTrigger value="posts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Posts</TabsTrigger>
          <TabsTrigger value="articles" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Articles</TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="focus:outline-none">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-cream-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
                    <FileText className="h-5 w-5 mr-2" />
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                  </CardTitle>
                  <CardDescription>Manage user {activeTab} and content</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder={`Search ${activeTab}...`} 
                    className="max-w-[200px] border-purple-200" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    className="border-purple-200" 
                    onClick={() => fetchContent(activeTab)}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {renderContentTable()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
