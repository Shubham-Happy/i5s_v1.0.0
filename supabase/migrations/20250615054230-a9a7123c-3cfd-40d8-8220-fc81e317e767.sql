
-- Add foreign key constraint for articles.user_id to reference profiles.id
ALTER TABLE public.articles 
ADD CONSTRAINT articles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure RLS is enabled on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Users can create their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON public.articles;

-- Create policies for articles
CREATE POLICY "Anyone can view published articles" ON public.articles
FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Users can create their own articles" ON public.articles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" ON public.articles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON public.articles
FOR DELETE USING (auth.uid() = user_id);
