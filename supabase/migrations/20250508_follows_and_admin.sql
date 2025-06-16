
-- Create follows table to track user relationships
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (follower_id, following_id)
);

-- Add is_admin field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Enable row level security on follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view follows (who follows whom)
CREATE POLICY "Allow users to view follows"
  ON public.follows
  FOR SELECT
  USING (true);

-- Policy to allow users to follow others
CREATE POLICY "Allow users to create follows"
  ON public.follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Policy to allow users to unfollow others
CREATE POLICY "Allow users to delete their own follows"
  ON public.follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- Create a function to manage follow notifications
CREATE OR REPLACE FUNCTION public.handle_new_follow()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for the user being followed
  INSERT INTO public.notifications (user_id, type, content, actor_user_id)
  VALUES (
    NEW.following_id,
    'follow',
    'started following you',
    NEW.follower_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for the handle_new_follow function
DROP TRIGGER IF EXISTS on_new_follow ON public.follows;
CREATE TRIGGER on_new_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_follow();

-- Update the update_updated_at_column trigger for the profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
