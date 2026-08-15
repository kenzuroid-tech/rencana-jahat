-- Jalankan kode ini di menu "SQL Editor" di dashboard Supabase kamu.

-- 1. Buat tabel completed_dates
CREATE TABLE IF NOT EXISTS completed_dates (
    id TEXT PRIMARY KEY,
    is_completed BOOLEAN DEFAULT false,
    photo_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    posted_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Buat Storage Bucket untuk foto
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Izinkan akses publik (Bypass RLS) untuk tabel completed_dates
ALTER TABLE completed_dates DISABLE ROW LEVEL SECURITY;

-- 4. Izinkan akses publik untuk Storage (Supaya bisa upload dan lihat foto)
CREATE POLICY "Public Access" 
ON storage.objects FOR ALL 
USING (bucket_id = 'photos') 
WITH CHECK (bucket_id = 'photos');
