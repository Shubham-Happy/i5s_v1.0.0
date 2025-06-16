
-- First, let's check if the foreign key constraint exists and drop it if it does
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'job_listings_user_id_fkey' 
        AND table_name = 'job_listings'
    ) THEN
        ALTER TABLE public.job_listings DROP CONSTRAINT job_listings_user_id_fkey;
    END IF;
END $$;

-- Now add the foreign key constraint properly
ALTER TABLE public.job_listings 
ADD CONSTRAINT job_listings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure RLS is enabled on job_listings
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can create their own job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can update their own job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can delete their own job listings" ON public.job_listings;

-- Create policies for job_listings
CREATE POLICY "Anyone can view job listings" ON public.job_listings
FOR SELECT USING (true);

CREATE POLICY "Users can create their own job listings" ON public.job_listings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job listings" ON public.job_listings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job listings" ON public.job_listings
FOR DELETE USING (auth.uid() = user_id);
