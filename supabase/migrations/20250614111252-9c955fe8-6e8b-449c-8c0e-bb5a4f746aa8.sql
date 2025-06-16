
-- Create storage policies for existing event_images bucket
CREATE POLICY "Anyone can view event images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'event_images');

CREATE POLICY "Authenticated users can upload event images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'event_images' AND auth.role() = 'authenticated');

-- Create storage policies for post_images bucket
CREATE POLICY "Anyone can view post images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'post_images');

CREATE POLICY "Authenticated users can upload post images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'post_images' AND auth.role() = 'authenticated');
