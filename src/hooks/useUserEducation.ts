
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserEducation {
  id: string;
  user_id: string;
  school: string;
  degree: string;
  logo?: string;
  start_year: string;
  end_year: string;
  description?: string;
  activities?: string;
  created_at: string;
  updated_at: string;
}

export const useUserEducation = (userId?: string) => {
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("useUserEducation: Fetching education for user:", userId);

        const { data, error } = await supabase
          .from('user_education')
          .select('*')
          .eq('user_id', userId)
          .order('start_year', { ascending: false });

        if (error) {
          console.error("useUserEducation: Error fetching education:", error);
          setError(error.message);
          return;
        }

        console.log("useUserEducation: Education fetched:", data);
        setEducation(data || []);
      } catch (err) {
        console.error("useUserEducation: Error in fetchEducation:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  const addEducation = async (educationData: Omit<UserEducation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_education')
        .insert(educationData)
        .select()
        .single();

      if (error) throw error;

      setEducation(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Education added successfully",
      });
      return data;
    } catch (error) {
      console.error("Error adding education:", error);
      toast({
        title: "Error",
        description: "Failed to add education",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    education,
    isLoading,
    error,
    addEducation,
  };
};
