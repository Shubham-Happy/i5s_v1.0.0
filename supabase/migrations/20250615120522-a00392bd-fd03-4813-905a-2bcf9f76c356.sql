
-- Create feedback table for storing user feedback submissions
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback table
CREATE POLICY "Users can view their own feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

CREATE POLICY "Anyone can create feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update feedback" 
  ON public.feedback 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

-- Add trigger for updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to delete user and all related data
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from auth.users (this will cascade to profiles due to foreign key)
  DELETE FROM auth.users WHERE id = user_uuid;
  
  -- Return true if user was deleted
  RETURN FOUND;
END;
$$;
