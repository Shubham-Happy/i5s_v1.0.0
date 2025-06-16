
-- Create a table for startup comments
CREATE TABLE public.startup_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL,
  user_id UUID NOT NULL,
  parent_id UUID NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for startup comment likes
CREATE TABLE public.startup_comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Add Row Level Security (RLS) to startup_comments
ALTER TABLE public.startup_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for startup_comments
CREATE POLICY "Anyone can view startup comments" 
  ON public.startup_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create startup comments" 
  ON public.startup_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startup comments" 
  ON public.startup_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own startup comments" 
  ON public.startup_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) to startup_comment_likes
ALTER TABLE public.startup_comment_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for startup_comment_likes
CREATE POLICY "Anyone can view startup comment likes" 
  ON public.startup_comment_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create startup comment likes" 
  ON public.startup_comment_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own startup comment likes" 
  ON public.startup_comment_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.startup_comments 
ADD CONSTRAINT startup_comments_startup_id_fkey 
FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE;

ALTER TABLE public.startup_comments 
ADD CONSTRAINT startup_comments_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES public.startup_comments(id) ON DELETE CASCADE;

ALTER TABLE public.startup_comment_likes 
ADD CONSTRAINT startup_comment_likes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.startup_comments(id) ON DELETE CASCADE;

-- Add updated_at trigger for startup_comments
CREATE TRIGGER update_startup_comments_updated_at 
  BEFORE UPDATE ON public.startup_comments 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
