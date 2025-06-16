
-- Add approval system columns to funding_events table
ALTER TABLE public.funding_events 
ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approval_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN rejection_reason TEXT;

-- Add check constraint to ensure valid approval statuses
ALTER TABLE public.funding_events 
ADD CONSTRAINT funding_events_approval_status_check 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Create index for faster queries on approval status
CREATE INDEX idx_funding_events_approval_status ON public.funding_events(approval_status);

-- Enable RLS on funding_events table
ALTER TABLE public.funding_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only approved events (public view)
CREATE POLICY "Users can view approved events" 
ON public.funding_events 
FOR SELECT 
USING (approval_status = 'approved');

-- Policy: Users can insert their own events (will be pending by default)
CREATE POLICY "Users can create their own events" 
ON public.funding_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND approval_status = 'pending');

-- Policy: Users can view their own events regardless of status
CREATE POLICY "Users can view their own events" 
ON public.funding_events 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Policy: Admins can view all events
CREATE POLICY "Admins can view all events" 
ON public.funding_events 
FOR SELECT 
USING (public.is_admin());

-- Policy: Admins can update event approval status
CREATE POLICY "Admins can update events" 
ON public.funding_events 
FOR UPDATE 
USING (public.is_admin());
