-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-event-media', 'client-event-media', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup RLS for the bucket
-- Clients can upload their own media
CREATE POLICY "Clients can upload to client-event-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Clients can view their own media
CREATE POLICY "Clients can view their own media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Clients can delete their own media
CREATE POLICY "Clients can delete their own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);
