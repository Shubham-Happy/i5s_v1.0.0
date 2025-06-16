
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPeople, fetchFollowing, fetchFollowers, fetchSuggestions, followUser } from "@/lib/supabase-people-queries";

export const usePeople = (searchQuery: string = '') => {
  const { data: people = [], isLoading } = useQuery({
    queryKey: ['people', searchQuery],
    queryFn: () => fetchPeople(searchQuery),
  });

  return { people, isLoading };
};

export const useFollowing = (searchQuery: string = '') => {
  const { data: following = [], isLoading } = useQuery({
    queryKey: ['following', searchQuery],
    queryFn: () => fetchFollowing(searchQuery),
  });

  return { following, isLoading };
};

export const useFollowers = (searchQuery: string = '') => {
  const { data: followers = [], isLoading } = useQuery({
    queryKey: ['followers', searchQuery],
    queryFn: () => fetchFollowers(searchQuery),
  });

  return { followers, isLoading };
};

export const useSuggestions = (searchQuery: string = '') => {
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['suggestions', searchQuery],
    queryFn: () => fetchSuggestions(searchQuery),
  });

  return { suggestions, isLoading };
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Invalidate and refetch all people-related queries
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  return {
    followUser: mutation.mutate,
    isFollowing: mutation.isPending,
  };
};
