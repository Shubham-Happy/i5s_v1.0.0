
-- Add columns for detailed organizer information
ALTER TABLE public.funding_events 
ADD COLUMN organizer_email TEXT,
ADD COLUMN organizer_phone TEXT,
ADD COLUMN organizer_website TEXT,
ADD COLUMN organizer_description TEXT;
