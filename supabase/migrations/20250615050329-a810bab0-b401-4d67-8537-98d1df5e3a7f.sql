
-- Add apply_link column to job_listings table (required field)
ALTER TABLE public.job_listings 
ADD COLUMN apply_link text NOT NULL DEFAULT '';

-- Update existing jobs to have a placeholder apply link to avoid constraint violations
UPDATE public.job_listings 
SET apply_link = 'https://example.com/apply' 
WHERE apply_link = '' OR apply_link IS NULL;

-- Add a constraint to ensure apply_link is not empty
ALTER TABLE public.job_listings 
ADD CONSTRAINT job_listings_apply_link_not_empty 
CHECK (length(trim(apply_link)) > 0);
