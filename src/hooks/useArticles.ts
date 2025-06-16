
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticles, fetchArticleById, Article } from '@/lib/supabase-article-queries';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useArticles = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });
  
  return {
    articles: data || [],
    isLoading,
    error,
  };
};

export const useArticleById = (id: string) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', id],
    queryFn: () => fetchArticleById(id),
  });
  
  return {
    article: data,
    isLoading,
    error,
  };
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: any) => {
      // Using raw SQL query format to bypass type issues with Supabase client
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `INSERT INTO public.articles (
          title, 
          summary, 
          content, 
          cover_image, 
          user_id, 
          published_at, 
          reading_time, 
          tags
        ) VALUES (
          '${articleData.title.replace(/'/g, "''")}', 
          '${articleData.summary.replace(/'/g, "''")}', 
          '${articleData.content?.replace(/'/g, "''") || ''}', 
          ${articleData.cover_image ? `'${articleData.cover_image}'` : 'NULL'}, 
          '${articleData.user_id}', 
          '${articleData.published_at || new Date().toISOString()}', 
          ${articleData.reading_time ? `'${articleData.reading_time}'` : 'NULL'}, 
          ${articleData.tags && articleData.tags.length > 0 ? 
            `ARRAY[${articleData.tags.map((t: string) => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 
            'NULL'
          }
        ) RETURNING *`
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success",
        description: "Your article has been published",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to publish article",
        description: error.message || "An error occurred while publishing your article",
        variant: "destructive",
      });
    },
  });

  return {
    createArticle: createArticleMutation.mutate,
    isCreating: createArticleMutation.isPending,
  };
};
