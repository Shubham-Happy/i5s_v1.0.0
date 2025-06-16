
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DashboardCounts {
  users: number;
  posts: number;
  articles: number;
  jobs: number;
  startups: number;
  events: number;
}

export function useAdminDashboardData() {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    posts: 0,
    articles: 0,
    jobs: 0,
    startups: 0,
    events: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Use Promise.allSettled to continue even if some queries fail
      const results = await Promise.allSettled([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('job_listings').select('*', { count: 'exact', head: true }),
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('funding_events').select('*', { count: 'exact', head: true })
      ]);
      
      // Process results safely
      const countsData: DashboardCounts = {
        users: 0,
        posts: 0,
        articles: 0,
        jobs: 0,
        startups: 0,
        events: 0
      };
      
      if (results[0].status === 'fulfilled') {
        countsData.users = results[0].value.count || 0;
      }
      
      if (results[1].status === 'fulfilled') {
        countsData.posts = results[1].value.count || 0;
      }
      
      if (results[2].status === 'fulfilled') {
        countsData.articles = results[2].value.count || 0;
      }
      
      if (results[3].status === 'fulfilled') {
        countsData.jobs = results[3].value.count || 0;
      }
      
      if (results[4].status === 'fulfilled') {
        countsData.startups = results[4].value.count || 0;
      }
      
      if (results[5].status === 'fulfilled') {
        countsData.events = results[5].value.count || 0;
      }
      
      setCounts(countsData);
    } catch (error) {
      console.error("Error fetching counts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { counts, isLoading, fetchCounts };
}
