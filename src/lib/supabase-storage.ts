
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export const uploadProfileImage = async (
  file: File,
  userId: string,
  type: 'avatar' | 'cover'
): Promise<UploadResult> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Please select an image file.' };
    }

    const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for avatar, 10MB for cover
    if (file.size > maxSize) {
      return { 
        url: null, 
        error: `File too large. ${type === 'avatar' ? 'Avatar' : 'Cover image'} must be less than ${maxSize / (1024 * 1024)}MB.` 
      };
    }

    // Create unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { url: null, error: 'Failed to upload image. Please try again.' };
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { url: null, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const deleteProfileImage = async (url: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected delete error:', error);
    return false;
  }
};
