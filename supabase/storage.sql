
-- Create articles storage bucket (this will be executed separately)
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'Articles Storage', true);

-- Create RLS policy to allow any authenticated user to upload to the bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'articles');

-- Create RLS policy to allow public to read from the bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'articles');
