
-- Create analytics tables for tracking user activity
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

CREATE TABLE public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'post')),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_id, content_type)
);

-- Enable RLS on analytics tables
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_views
CREATE POLICY "Users can view their own profile analytics" 
  ON public.profile_views 
  FOR SELECT 
  USING (profile_user_id = auth.uid());

CREATE POLICY "Anyone can create profile views" 
  ON public.profile_views 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for content_analytics
CREATE POLICY "Users can view their own content analytics" 
  ON public.content_analytics 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own content analytics" 
  ON public.content_analytics 
  FOR ALL 
  USING (user_id = auth.uid());

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_content_analytics_updated_at 
  BEFORE UPDATE ON public.content_analytics 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment content views
CREATE OR REPLACE FUNCTION public.increment_content_view(
  p_content_id UUID,
  p_content_type TEXT,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.content_analytics (content_id, content_type, user_id, views)
  VALUES (p_content_id, p_content_type, p_user_id, 1)
  ON CONFLICT (content_id, content_type)
  DO UPDATE SET 
    views = content_analytics.views + 1,
    updated_at = now();
END;
$$;

-- Create function to track profile view
CREATE OR REPLACE FUNCTION public.track_profile_view(
  p_profile_user_id UUID,
  p_viewer_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profile_views (profile_user_id, viewer_user_id, ip_address, user_agent)
  VALUES (p_profile_user_id, p_viewer_user_id, p_ip_address, p_user_agent);
END;
$$;
