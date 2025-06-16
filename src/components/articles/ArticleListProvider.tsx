
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string; // Changed from excerpt to summary to match database
  cover_image?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  reading_time?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

interface ArticleListContextType {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ArticleListContext = createContext<ArticleListContextType | undefined>(undefined);

export function useArticleList() {
  const context = useContext(ArticleListContext);
  if (context === undefined) {
    throw new Error('useArticleList must be used within an ArticleListProvider');
  }
  return context;
}

interface ArticleListProviderProps {
  children: ReactNode;
}

export function ArticleListProvider({ children }: ArticleListProviderProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: articlesData, error: fetchError } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });
      
      if (fetchError) {
        console.error("Error fetching articles:", fetchError);
        throw fetchError;
      }

      // Transform articles data to include author information
      const transformedArticles = articlesData?.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content || "",
        summary: article.summary, // Use summary instead of excerpt
        cover_image: article.cover_image,
        user_id: article.user_id,
        created_at: article.created_at,
        updated_at: article.updated_at,
        published_at: article.published_at,
        reading_time: article.reading_time || "5 min",
        author: {
          id: article.user_id,
          name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
          avatar: article.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${article.profiles?.full_name || 'User'}`,
          role: "Author"
        }
      })) || [];

      setArticles(transformedArticles);
    } catch (error: any) {
      console.error("Error fetching articles:", error);
      setError(error.message || "Failed to load articles");
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const value = {
    articles,
    isLoading,
    error,
    refetch: fetchArticles
  };

  return (
    <ArticleListContext.Provider value={value}>
      {children}
    </ArticleListContext.Provider>
  );
}
