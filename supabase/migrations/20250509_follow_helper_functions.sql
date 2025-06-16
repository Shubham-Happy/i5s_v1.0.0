
-- Create function to count followers
CREATE OR REPLACE FUNCTION public.count_followers(user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.follows 
  WHERE following_id = user_id;
$$;

-- Create function to count following
CREATE OR REPLACE FUNCTION public.count_following(user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.follows 
  WHERE follower_id = user_id;
$$;

-- Create function to check if a user is following another
CREATE OR REPLACE FUNCTION public.check_is_following(follower_id UUID, following_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.follows
    WHERE follower_id = check_is_following.follower_id
    AND following_id = check_is_following.following_id
  );
$$;

-- Create function to follow a user
CREATE OR REPLACE FUNCTION public.follow_user(follower_id UUID, following_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (follower_id, following_id);
EXCEPTION
  WHEN unique_violation THEN
    -- Already following, do nothing
    NULL;
END;
$$;

-- Create function to unfollow a user
CREATE OR REPLACE FUNCTION public.unfollow_user(follower_id UUID, following_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.follows
  WHERE follower_id = unfollow_user.follower_id
  AND following_id = unfollow_user.following_id;
END;
$$;
