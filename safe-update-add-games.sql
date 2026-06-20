-- SAFE UPDATE: Tambahkan tabel games dengan pengecekan kolom
-- Jalankan ini jika kamu sudah punya tabel games sebelumnya

-- ==========================================
-- 1. BUAT TABEL GAMES (jika belum ada)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.games (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. TAMBAHKAN KOLOM YANG HILANG (jika tabel sudah ada tapi kurang kolom)
-- ==========================================
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ==========================================
-- 3. TAMBAHKAN UNIQUE CONSTRAINT (jika belum ada)
-- ==========================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'games_slug_key' AND table_name = 'games'
  ) THEN
    ALTER TABLE public.games ADD CONSTRAINT games_slug_key UNIQUE (slug);
  END IF;
END $$;

-- ==========================================
-- 4. INSERT DAFTAR GAME (dengan ON CONFLICT agar aman)
-- ==========================================
INSERT INTO public.games (name, category, image, slug) VALUES
('Mobile Legends', 'MOBA', '/card/mobile-legends.jpg', 'mobile-legends'),
('Free Fire', 'Battle Royale', '/card/free-fire.jpg', 'free-fire'),
('Genshin Impact', 'RPG', '/card/genshin-impact.jpg', 'genshin-impact'),
('Valorant', 'FPS', '/card/valorant.jpg', 'valorant'),
('PUBG Mobile', 'Battle Royale', '/card/pubg.jpg', 'pubg'),
('Clash Of Clans', 'Strategy', '/card/clash-of-clans.jpg', 'clash-of-clans'),
('Clash Royale', 'Strategy', '/card/clash-royale.jpg', 'clash-royale'),
('Delta Force', 'FPS', '/card/delta-force.jpg', 'delta-force'),
('League Of Legends', 'MOBA', '/card/league-of-legends.jpg', 'league-of-legends'),
('Honor Of Kings', 'MOBA', '/card/honor-of-kings.jpg', 'honor-of-kings'),
('Call of Duty Mobile', 'FPS', '/card/call-of-duty-mobile.jpg', 'call-of-duty-mobile'),
('Arena of Valor', 'MOBA', '/card/arena-of-valor.jpg', 'arena-of-valor'),
('Hogwarts Mystery', 'RPG', '/card/hogwarts-mystery.jpg', 'hogwarts-mystery'),
('Brawl Stars', 'Battle Royale', '/card/brawl-stars.jpg', 'brawl-stars'),
('Black Desert Mobile', 'RPG', '/card/black-desert-mobile.jpg', 'black-desert-mobile'),
('Roblox', 'Sandbox', '/card/roblox.jpg', 'roblox'),
('Minecraft', 'Sandbox', '/card/minecraft.jpg', 'minecraft'),
('FIFA Mobile', 'Sports', '/card/fifa-mobile.jpg', 'fifa-mobile'),
('Mobile Legends Adventure', 'RPG', '/card/mobile-legends-adventure.jpg', 'mobile-legends-adventure'),
('Rise of Kingdoms', 'Strategy', '/card/rise-of-kingdoms.jpg', 'rise-of-kingdoms')
ON CONFLICT (slug) DO NOTHING; -- Jangan insert jika game sudah ada

-- ==========================================
-- 5. ENABLE RLS & POLICIES UNTUK TABEL GAMES
-- ==========================================
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow ALL users to read ALL games
DROP POLICY IF EXISTS "Everyone can view all games" ON public.games;
CREATE POLICY "Everyone can view all games"
  ON public.games FOR SELECT
  USING (true);

-- Only allow service role/admin to insert/update/delete games (untuk keamanan)
DROP POLICY IF EXISTS "Only service role can modify games" ON public.games;
CREATE POLICY "Only service role can modify games"
  ON public.games FOR ALL
  USING (false);

-- ==========================================
-- SELESAI!
-- ==========================================
