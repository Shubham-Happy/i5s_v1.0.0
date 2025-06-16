
-- First, let's ensure the notifications table has proper RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create comprehensive RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create a function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_content TEXT,
  p_actor_user_id UUID DEFAULT NULL,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, content, actor_user_id, link)
  VALUES (p_user_id, p_type, p_content, p_actor_user_id, p_link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger for post reactions (likes)
CREATE OR REPLACE FUNCTION public.handle_post_reaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create notification for likes (not unlikes)
  IF TG_OP = 'INSERT' AND NEW.reaction_type = 'like' THEN
    -- Get the post owner
    INSERT INTO public.notifications (user_id, type, content, actor_user_id, link)
    SELECT 
      p.user_id,
      'like',
      'liked your post',
      NEW.user_id,
      '/posts'
    FROM posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id; -- Don't notify self
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for comments
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create notification for post owner (if commenting on a post)
  IF NEW.post_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, content, actor_user_id, link)
    SELECT 
      p.user_id,
      'comment',
      'commented on your post',
      NEW.user_id,
      '/posts'
    FROM posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id; -- Don't notify self
  END IF;
  
  -- Create notification for article owner (if commenting on an article)
  IF NEW.article_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, content, actor_user_id, link)
    SELECT 
      a.user_id,
      'comment',
      'commented on your article',
      NEW.user_id,
      '/articles/' || a.id
    FROM articles a
    WHERE a.id = NEW.article_id AND a.user_id != NEW.user_id; -- Don't notify self
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_post_reaction_change ON public.post_reactions;
DROP TRIGGER IF EXISTS on_comment_insert ON public.comments;

-- Create triggers
CREATE TRIGGER on_post_reaction_change
  AFTER INSERT OR DELETE ON public.post_reactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_reaction();

CREATE TRIGGER on_comment_insert
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
