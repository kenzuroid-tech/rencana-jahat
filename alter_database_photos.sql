-- Jalankan kode ini di menu "SQL Editor" di dashboard Supabase kamu
-- untuk menambah kolom foto Nisho dan foto Haydar

ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS nisho_photo_url TEXT;
ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS haydar_photo_url TEXT;
