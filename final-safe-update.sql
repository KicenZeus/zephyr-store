-- FINAL SAFE UPDATE: Sesuai dengan tabel games kamu yang sudah ada
-- Tidak menyimpan path gambar di database (sesuai permintaan)

-- ==========================================
-- 1. INSERT DAFTAR GAME (hanya kolom yang dibutuhkan, tanpa gambar)
-- ==========================================
-- Kita gunakan ON CONFLICT untuk menghindari error
INSERT INTO public.games (slug, name, category) VALUES
('mobile-legends', 'Mobile Legends', 'MOBA'),
('free-fire', 'Free Fire', 'Battle Royale'),
('genshin-impact', 'Genshin Impact', 'RPG'),
('valorant', 'Valorant', 'FPS'),
('pubg', 'PUBG Mobile', 'Battle Royale'),
('clash-of-clans', 'Clash Of Clans', 'Strategy'),
('clash-royale', 'Clash Royale', 'Strategy'),
('delta-force', 'Delta Force', 'FPS'),
('league-of-legends', 'League Of Legends', 'MOBA'),
('honor-of-kings', 'Honor Of Kings', 'MOBA'),
('call-of-duty-mobile', 'Call of Duty Mobile', 'FPS'),
('arena-of-valor', 'Arena of Valor', 'MOBA'),
('hogwarts-mystery', 'Hogwarts Mystery', 'RPG'),
('brawl-stars', 'Brawl Stars', 'Battle Royale'),
('black-desert-mobile', 'Black Desert Mobile', 'RPG'),
('roblox', 'Roblox', 'Sandbox'),
('minecraft', 'Minecraft', 'Sandbox'),
('fifa-mobile', 'FIFA Mobile', 'Sports'),
('mobile-legends-adventure', 'Mobile Legends Adventure', 'RPG'),
('rise-of-kingdoms', 'Rise of Kingdoms', 'Strategy')
ON CONFLICT (slug) DO NOTHING; -- Jangan insert jika game sudah ada

-- ==========================================
-- 2. PASTIKAN RLS & POLICIES AKTIF
-- ==========================================
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow ALL users to read ALL games
DROP POLICY IF EXISTS "Everyone can view all games" ON public.games;
CREATE POLICY "Everyone can view all games"
  ON public.games FOR SELECT
  USING (true);

-- ==========================================
-- SELESAI!
-- ==========================================
