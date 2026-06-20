-- FINAL FIXED UPDATE: Isi kolom developer dengan nilai default
-- Sesuai dengan struktur tabel kamu yang sudah ada

-- ==========================================
-- 1. INSERT DAFTAR GAME (dengan semua kolom wajib)
-- ==========================================
INSERT INTO public.games (slug, name, developer, category) VALUES
('mobile-legends', 'Mobile Legends', 'Moonton', 'MOBA'),
('free-fire', 'Free Fire', 'Garena', 'Battle Royale'),
('genshin-impact', 'Genshin Impact', 'Hoyoverse', 'RPG'),
('valorant', 'Valorant', 'Riot Games', 'FPS'),
('pubg', 'PUBG Mobile', 'Level Infinite', 'Battle Royale'),
('clash-of-clans', 'Clash Of Clans', 'Supercell', 'Strategy'),
('clash-royale', 'Clash Royale', 'Supercell', 'Strategy'),
('delta-force', 'Delta Force', 'Tencent', 'FPS'),
('league-of-legends', 'League Of Legends', 'Riot Games', 'MOBA'),
('honor-of-kings', 'Honor Of Kings', 'Tencent', 'MOBA'),
('call-of-duty-mobile', 'Call of Duty Mobile', 'Activision', 'FPS'),
('arena-of-valor', 'Arena of Valor', 'Tencent', 'MOBA'),
('hogwarts-mystery', 'Hogwarts Mystery', 'Jam City', 'RPG'),
('brawl-stars', 'Brawl Stars', 'Supercell', 'Battle Royale'),
('black-desert-mobile', 'Black Desert Mobile', 'Pearl Abyss', 'RPG'),
('roblox', 'Roblox', 'Roblox Corporation', 'Sandbox'),
('minecraft', 'Minecraft', 'Mojang Studios', 'Sandbox'),
('fifa-mobile', 'FIFA Mobile', 'EA Sports', 'Sports'),
('mobile-legends-adventure', 'Mobile Legends Adventure', 'Moonton', 'RPG'),
('rise-of-kingdoms', 'Rise of Kingdoms', 'Lilith Games', 'Strategy')
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
