
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function usePostMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ content, imageFile }: { content: string, imageFile: File | null }) => {
      if (!user) throw new Error("You must be logged in to create a post");

      // Upload image if one is provided
      let image_url = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        image_url = urlData.publicUrl;
      }

      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { content, image_url, user_id: user.id }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been created.",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, content, imageFile }: { postId: string, content: string, imageFile: File | null }) => {
      if (!user) throw new Error("You must be logged in to update a post");

      // Get the existing post to check ownership
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('user_id, image_url')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      
      // Verify ownership
      if (existingPost.user_id !== user.id) {
        throw new Error("You can only edit your own posts");
      }

      // Prepare update data
      const updateData: { content: string, image_url?: string | null } = { content };

      // Handle image
      if (imageFile) {
        // Upload new image
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        updateData.image_url = urlData.publicUrl;
      }

      // Update post
      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("You must be logged in to delete a post");

      // Get the existing post to check ownership
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      
      // Verify ownership
      if (existingPost.user_id !== user.id) {
        throw new Error("You can only delete your own posts");
      }

      // Delete post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return postId;
    },
    onSuccess: (deletedPostId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been deleted.",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation
  };
}
