-- Create a new storage bucket for library photos
insert into storage.buckets (id, name, public)
values ('library-photos', 'library-photos', true);

-- Policy: Allow public read access to all files in the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'library-photos' );

-- Policy: Allow authenticated users to upload files
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'library-photos' 
    and auth.role() = 'authenticated'
  );

-- Policy: Allow users to update their own files (optional, but good for edits)
-- Note: This assumes we might store userId in metadata or path, but for now simple insert is enough.
-- We can add more strict policies later if needed.
