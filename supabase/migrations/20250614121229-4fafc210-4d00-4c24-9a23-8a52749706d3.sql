
-- Add the missing application_link column if it doesn't exist
ALTER TABLE public.funding_events 
ADD COLUMN IF NOT EXISTS application_link TEXT;
