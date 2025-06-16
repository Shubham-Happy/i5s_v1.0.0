
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Anyone can create feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;

-- Create new policies for feedback table
CREATE POLICY "Users can view their own feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Anyone can create feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update and view all feedback" 
  ON public.feedback 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Add policy for admins to select all feedback
CREATE POLICY "Admins can select all feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));
