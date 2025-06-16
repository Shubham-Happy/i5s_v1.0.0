
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  funding_stage: string;
  location: string;
  logo?: string;
  votes: number;
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  founder?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const useStartup = (id: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: async (): Promise<Startup | null> => {
      const { data: startup, error } = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching startup:', error);
        return null;
      }

      // Fetch founder profile
      const { data: founder } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', startup.user_id)
        .single();

      return {
        ...startup,
        founder: founder ? {
          id: founder.id,
          name: founder.full_name || 'Unknown Founder',
          avatar: founder.avatar_url
        } : undefined
      };
    },
    enabled: !!id
  });
};

export const useStartups = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: async (): Promise<Startup[]> => {
      const { data: startups, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching startups:', error);
        return [];
      }

      // Fetch founder profiles for all startups
      const startupsWithFounders = await Promise.all(
        startups.map(async (startup) => {
          const { data: founder } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', startup.user_id)
            .single();

          return {
            ...startup,
            founder: founder ? {
              id: founder.id,
              name: founder.full_name || 'Unknown Founder',
              avatar: founder.avatar_url
            } : undefined
          };
        })
      );

      return startupsWithFounders;
    }
  });
};
