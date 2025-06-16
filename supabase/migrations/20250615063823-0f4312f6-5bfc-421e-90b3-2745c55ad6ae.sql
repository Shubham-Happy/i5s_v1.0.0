
-- Create experience table
CREATE TABLE public.user_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.user_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  logo TEXT,
  start_year TEXT NOT NULL,
  end_year TEXT NOT NULL,
  description TEXT,
  activities TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_education ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for experience table
CREATE POLICY "Users can view all experience" 
  ON public.user_experience 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own experience" 
  ON public.user_experience 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experience" 
  ON public.user_experience 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experience" 
  ON public.user_experience 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for education table
CREATE POLICY "Users can view all education" 
  ON public.user_education 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own education" 
  ON public.user_education 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" 
  ON public.user_education 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" 
  ON public.user_education 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_user_experience_updated_at 
  BEFORE UPDATE ON public.user_experience 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_education_updated_at 
  BEFORE UPDATE ON public.user_education 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
