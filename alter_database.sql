-- Jalankan kode ini di menu "SQL Editor" di dashboard Supabase kamu
-- untuk memperbarui tabel agar mendukung review terpisah antara Nisho dan Haydar

ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS nisho_review TEXT;
ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS nisho_rating INTEGER CHECK (nisho_rating >= 1 AND nisho_rating <= 5);

ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS haydar_review TEXT;
ALTER TABLE completed_dates ADD COLUMN IF NOT EXISTS haydar_rating INTEGER CHECK (haydar_rating >= 1 AND haydar_rating <= 5);
