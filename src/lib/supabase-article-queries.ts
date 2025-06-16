
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  readingTime?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  commentsList?: any[];
}

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    console.log("Fetching articles...");
    
    const { data: articlesData, error } = await supabase
      .from('articles')
      .select(`
        *,
        user_id
      `)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }

    console.log("Raw articles data:", articlesData);

    // Fetch author information and engagement data for each article
    const articles = await Promise.all(
      articlesData.map(async (article) => {
        console.log(`Processing article ${article.id}...`);

        // Get user profile info for the author
        const { data: authorProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', article.user_id)
          .single();

        // Get like count for this article
        const { count: likeCount } = await supabase
          .from('article_likes')
          .select('*', { count: 'exact', head: true })
          .eq('article_id', article.id);

        // Get comment count for this article
        const { count: commentCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('article_id', article.id);
        
        console.log(`Article ${article.id} - Likes: ${likeCount}, Comments: ${commentCount}`);
        
        // Transform the data to match our Article interface
        const transformedArticle = {
          id: article.id,
          title: article.title,
          summary: article.summary,
          content: article.content,
          coverImage: article.cover_image,
          author: {
            id: article.user_id,
            name: authorProfile?.full_name || authorProfile?.username || "Anonymous",
            avatar: authorProfile?.avatar_url,
            role: "Author",
            bio: authorProfile?.status || "Writer at Statusnow"
          },
          publishedAt: article.published_at,
          readingTime: article.reading_time || "5 min",
          tags: article.tags || [],
          likes: likeCount || 0,
          comments: commentCount || 0,
          commentsList: []
        };

        console.log(`Transformed article ${article.id}:`, transformedArticle);
        return transformedArticle;
      })
    );
    
    console.log("Final articles array:", articles);
    return articles;
  } catch (error) {
    console.error("Error processing articles:", error);
    return [];
  }
};

export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    console.log(`Fetching article by id: ${id}`);
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        user_id
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching article with id ${id}:`, error);
      return null;
    }

    console.log(`Raw article data for ${id}:`, article);

    // Get user profile info for the author
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', article.user_id)
      .single();

    // Get like count for this article
    const { count: likeCount } = await supabase
      .from('article_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', article.id);

    // Get comment count for this article
    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', article.id);

    console.log(`Article ${id} engagement - Likes: ${likeCount}, Comments: ${commentCount}`);
    
    const transformedArticle = {
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      coverImage: article.cover_image,
      author: {
        id: article.user_id,
        name: authorProfile?.full_name || authorProfile?.username || "Anonymous",
        avatar: authorProfile?.avatar_url,
        role: "Author",
        bio: authorProfile?.status || "Writer at Statusnow"
      },
      publishedAt: article.published_at,
      readingTime: article.reading_time || "5 min",
      tags: article.tags || [],
      likes: likeCount || 0,
      comments: commentCount || 0,
      commentsList: []
    };

    console.log(`Final transformed article ${id}:`, transformedArticle);
    return transformedArticle;
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    return null;
  }
};
