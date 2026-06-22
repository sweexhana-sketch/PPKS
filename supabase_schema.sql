-- ════════════════════════════════════════════════════════════
-- SQL SCHEMA UNTUK SUPABASE (BACKEND SIPPKS)
-- ════════════════════════════════════════════════════════════
-- Copy dan paste kode di bawah ini ke SQL Editor di Supabase Anda,
-- lalu klik "Run" untuk membuat tabel dan kebijakan keamanannya.

-- 1. Membuat Tabel ppks_data
CREATE TABLE IF NOT EXISTS public.ppks_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    no_registrasi VARCHAR(50) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    jk VARCHAR(20) NOT NULL,
    ttl DATE,
    tgl_daftar DATE NOT NULL,
    jenis_ppks VARCHAR(100) NOT NULL,
    jenis_ppks_kode VARCHAR(10) NOT NULL,
    jenis_ppks_icon VARCHAR(10),
    wilayah VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft'::character varying NOT NULL,
    kondisi_kes VARCHAR(100),
    pendidikan VARCHAR(100),
    kebutuhan VARCHAR(200),
    prioritas VARCHAR(50),
    bansos VARCHAR(100),
    petugas VARCHAR(100),
    catatan TEXT
);

-- 2. Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.ppks_data ENABLE ROW LEVEL SECURITY;

-- 3. Membuat Kebijakan Akses (Policies)
-- Mengizinkan akses baca (SELECT) anonim agar data bisa ditampilkan di Frontend
CREATE POLICY "Allow public read access" 
ON public.ppks_data 
FOR SELECT 
USING (true);

-- Mengizinkan akses tambah (INSERT) anonim agar form "Tambah Data" bisa berfungsi
CREATE POLICY "Allow public insert access" 
ON public.ppks_data 
FOR INSERT 
WITH CHECK (true);

-- Mengizinkan akses ubah (UPDATE) anonim agar "Verifikasi" & "Edit" bisa berfungsi
CREATE POLICY "Allow public update access" 
ON public.ppks_data 
FOR UPDATE 
USING (true);

-- Mengizinkan akses hapus (DELETE) anonim agar tombol "Hapus" bisa berfungsi
CREATE POLICY "Allow public delete access" 
ON public.ppks_data 
FOR DELETE 
USING (true);
