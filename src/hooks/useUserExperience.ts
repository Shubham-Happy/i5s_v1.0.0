
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserExperience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  logo?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  achievements?: string[];
  created_at: string;
  updated_at: string;
}

export const useUserExperience = (userId?: string) => {
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("useUserExperience: Fetching experiences for user:", userId);

        const { data, error } = await supabase
          .from('user_experience')
          .select('*')
          .eq('user_id', userId)
          .order('start_date', { ascending: false });

        if (error) {
          console.error("useUserExperience: Error fetching experiences:", error);
          setError(error.message);
          return;
        }

        console.log("useUserExperience: Experiences fetched:", data);
        setExperiences(data || []);
      } catch (err) {
        console.error("useUserExperience: Error in fetchExperiences:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [userId]);

  const addExperience = async (experience: Omit<UserExperience, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_experience')
        .insert(experience)
        .select()
        .single();

      if (error) throw error;

      setExperiences(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Experience added successfully",
      });
      return data;
    } catch (error) {
      console.error("Error adding experience:", error);
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    experiences,
    isLoading,
    error,
    addExperience,
  };
};
