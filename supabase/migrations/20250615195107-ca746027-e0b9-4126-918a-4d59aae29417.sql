
-- Remove the problematic Phone_check constraint and recreate the column properly
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_Phone_check";

-- Make sure the Phone column allows NULL values and has no restrictive constraints
ALTER TABLE public.profiles ALTER COLUMN "Phone" DROP NOT NULL;
