-- ULTIMATE SAFE DENOMINATIONS SETUP
-- Opsi 1: Jalankan apa adanya (aman)
-- Opsi 2: Jika masih error, jalankan baris DROP di bawah dulu (backup data jika penting!)

-- ==========================================
-- (OPTIONAL) HAPUS TABEL LAMA JIKA PERLU
-- Uncomment 2 baris di bawah jika kamu ingin menghapus tabel lama
-- ==========================================
-- DROP TABLE IF EXISTS public.denominations CASCADE;
-- DROP TABLE IF EXISTS public.denomination_categories CASCADE;

-- ==========================================
-- 1. BUAT TABEL KATEGORI (DENGAN AMAN)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denomination_categories (
  id SERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. BUAT TABEL DENOMINATIONS (DENGAN AMAN)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denominations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  amount TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. TAMBAHKAN KOLOM JIKA HILANG
-- ==========================================
ALTER TABLE public.denomination_categories 
ADD COLUMN IF NOT EXISTS game_slug TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.denominations 
ADD COLUMN IF NOT EXISTS category_id INTEGER,
ADD COLUMN IF NOT EXISTS amount TEXT,
ADD COLUMN IF NOT EXISTS price INTEGER,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ==========================================
-- 4. INSERT SEMUA DATA KATEGORI
-- ==========================================
INSERT INTO public.denomination_categories (game_slug, name) VALUES
('mobile-legends', 'Diamonds'),
('mobile-legends', 'Pass'),
('free-fire', 'Diamonds'),
('genshin-impact', 'Crystals'),
('valorant', 'VP'),
('pubg', 'UC'),
('clash-of-clans', 'Gems'),
('clash-royale', 'Gems'),
('delta-force', 'Coins'),
('league-of-legends', 'RP'),
('honor-of-kings', 'Vouchers'),
('call-of-duty-mobile', 'CP'),
('arena-of-valor', 'Vouchers'),
('hogwarts-mystery', 'Gems'),
('brawl-stars', 'Gems'),
('black-desert-mobile', 'Pearls'),
('roblox', 'Robux'),
('minecraft', 'Minecoins'),
('fifa-mobile', 'FIFA Points'),
('mobile-legends-adventure', 'Diamonds'),
('rise-of-kingdoms', 'Gems')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 5. INSERT SEMUA DENOMINATIONS
-- ==========================================

-- Helper Function: Ambil ID kategori berdasarkan game_slug dan nama
WITH cat AS (SELECT id, game_slug, name FROM public.denomination_categories)

-- MOBILE LEGENDS
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '56 Diamonds', 12000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '86 Diamonds', 20000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '172 Diamonds', 40000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '257 Diamonds', 60000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '344 Diamonds', 80000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '429 Diamonds', 100000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '514 Diamonds', 120000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '688 Diamonds', 160000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '860 Diamonds', 200000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Diamonds'), '1075 Diamonds', 250000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Pass'), 'Weekly Diamond Pass', 28500),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Pass'), 'Monthly Diamond Pass', 99000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Pass'), 'Twilight Pass', 145000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends' AND name = 'Pass'), 'Starlight Pass', 199000),

-- FREE FIRE
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '50 Diamonds', 8000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '100 Diamonds', 15000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '140 Diamonds', 20000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '210 Diamonds', 30000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '270 Diamonds', 35000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '355 Diamonds', 50000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '560 Diamonds', 80000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '720 Diamonds', 100000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '1080 Diamonds', 150000),
((SELECT id FROM cat WHERE game_slug = 'free-fire' AND name = 'Diamonds'), '1450 Diamonds', 200000),

-- GENSHIN IMPACT
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '60 Crystals', 15000),
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '300 Crystals', 75000),
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '980 Crystals', 225000),
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '1980 Crystals', 450000),
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '3280 Crystals', 750000),
((SELECT id FROM cat WHERE game_slug = 'genshin-impact' AND name = 'Crystals'), '6480 Crystals', 1450000),

-- VALORANT
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '475 VP', 50000),
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '1000 VP', 100000),
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '2050 VP', 200000),
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '3650 VP', 350000),
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '5350 VP', 500000),
((SELECT id FROM cat WHERE game_slug = 'valorant' AND name = 'VP'), '11000 VP', 1000000),

-- PUBG
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '60 UC', 10000),
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '300 UC', 50000),
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '600 UC', 100000),
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '1500 UC', 250000),
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '3000 UC', 500000),
((SELECT id FROM cat WHERE game_slug = 'pubg' AND name = 'UC'), '6000 UC', 1000000),

-- CLASH OF CLANS
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '50 Gems', 5000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '250 Gems', 25000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '500 Gems', 50000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '1000 Gems', 100000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '2000 Gems', 200000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '5000 Gems', 500000),
((SELECT id FROM cat WHERE game_slug = 'clash-of-clans' AND name = 'Gems'), '10000 Gems', 1000000),

-- CLASH ROYALE
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '80 Gems', 15000),
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '150 Gems', 25000),
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '500 Gems', 80000),
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '1200 Gems', 180000),
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '2500 Gems', 375000),
((SELECT id FROM cat WHERE game_slug = 'clash-royale' AND name = 'Gems'), '5000 Gems', 750000),

-- DELTA FORCE
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '100 Coins', 10000),
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '300 Coins', 30000),
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '500 Coins', 50000),
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '1000 Coins', 100000),
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '2500 Coins', 250000),
((SELECT id FROM cat WHERE game_slug = 'delta-force' AND name = 'Coins'), '5000 Coins', 500000),

-- LEAGUE OF LEGENDS
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '250 RP', 25000),
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '500 RP', 50000),
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '1000 RP', 100000),
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '2000 RP', 200000),
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '3500 RP', 350000),
((SELECT id FROM cat WHERE game_slug = 'league-of-legends' AND name = 'RP'), '5000 RP', 500000),

-- HONOR OF KINGS
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '60 Vouchers', 10000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '150 Vouchers', 25000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '300 Vouchers', 50000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '500 Vouchers', 80000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '680 Vouchers', 100000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '1280 Vouchers', 190000),
((SELECT id FROM cat WHERE game_slug = 'honor-of-kings' AND name = 'Vouchers'), '1980 Vouchers', 290000),

-- CALL OF DUTY MOBILE
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '80 CP', 12000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '200 CP', 30000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '400 CP', 55000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '800 CP', 100000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '1400 CP', 175000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '2000 CP', 250000),
((SELECT id FROM cat WHERE game_slug = 'call-of-duty-mobile' AND name = 'CP'), '2800 CP', 350000),

-- ARENA OF VALOR
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '60 Vouchers', 10000),
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '150 Vouchers', 22500),
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '300 Vouchers', 45000),
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '600 Vouchers', 85000),
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '1000 Vouchers', 140000),
((SELECT id FROM cat WHERE game_slug = 'arena-of-valor' AND name = 'Vouchers'), '1500 Vouchers', 210000),

-- HOGWARTS MYSTERY
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '100 Gems', 15000),
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '250 Gems', 35000),
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '500 Gems', 65000),
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '1000 Gems', 120000),
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '2000 Gems', 230000),
((SELECT id FROM cat WHERE game_slug = 'hogwarts-mystery' AND name = 'Gems'), '5000 Gems', 550000),

-- BRAWL STARS
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '80 Gems', 12000),
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '170 Gems', 25000),
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '360 Gems', 50000),
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '750 Gems', 100000),
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '1400 Gems', 180000),
((SELECT id FROM cat WHERE game_slug = 'brawl-stars' AND name = 'Gems'), '2800 Gems', 350000),

-- BLACK DESERT MOBILE
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '100 Pearls', 20000),
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '250 Pearls', 45000),
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '500 Pearls', 90000),
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '1000 Pearls', 170000),
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '2000 Pearls', 330000),
((SELECT id FROM cat WHERE game_slug = 'black-desert-mobile' AND name = 'Pearls'), '5000 Pearls', 800000),

-- ROBLOX
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '400 Robux', 50000),
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '800 Robux', 95000),
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '1700 Robux', 180000),
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '2800 Robux', 300000),
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '4500 Robux', 475000),
((SELECT id FROM cat WHERE game_slug = 'roblox' AND name = 'Robux'), '10000 Robux', 1000000),

-- MINECRAFT
((SELECT id FROM cat WHERE game_slug = 'minecraft' AND name = 'Minecoins'), '320 Minecoins', 40000),
((SELECT id FROM cat WHERE game_slug = 'minecraft' AND name = 'Minecoins'), '720 Minecoins', 80000),
((SELECT id FROM cat WHERE game_slug = 'minecraft' AND name = 'Minecoins'), '1720 Minecoins', 170000),
((SELECT id FROM cat WHERE game_slug = 'minecraft' AND name = 'Minecoins'), '3500 Minecoins', 350000),
((SELECT id FROM cat WHERE game_slug = 'minecraft' AND name = 'Minecoins'), '5000 Minecoins', 500000),

-- FIFA MOBILE
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '100 FIFA Points', 15000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '250 FIFA Points', 35000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '500 FIFA Points', 65000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '750 FIFA Points', 95000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '1050 FIFA Points', 120000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '1500 FIFA Points', 170000),
((SELECT id FROM cat WHERE game_slug = 'fifa-mobile' AND name = 'FIFA Points'), '2200 FIFA Points', 250000),

-- MOBILE LEGENDS ADVENTURE
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '60 Diamonds', 12000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '150 Diamonds', 30000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '300 Diamonds', 55000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '500 Diamonds', 90000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '680 Diamonds', 110000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '1000 Diamonds', 160000),
((SELECT id FROM cat WHERE game_slug = 'mobile-legends-adventure' AND name = 'Diamonds'), '2000 Diamonds', 320000),

-- RISE OF KINGDOMS
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '100 Gems', 15000),
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '300 Gems', 45000),
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '500 Gems', 70000),
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '1000 Gems', 130000),
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '2000 Gems', 260000),
((SELECT id FROM cat WHERE game_slug = 'rise-of-kingdoms' AND name = 'Gems'), '5000 Gems', 650000)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. RLS & POLICIES
-- ==========================================
ALTER TABLE public.denomination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denominations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view all categories" ON public.denomination_categories;
CREATE POLICY "Everyone can view all categories"
  ON public.denomination_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Everyone can view all denominations" ON public.denominations;
CREATE POLICY "Everyone can view all denominations"
  ON public.denominations FOR SELECT
  USING (true);

-- ==========================================
-- SELESAI! 🎉 SEMUA DATA BERHASIL DIMASUKKAN!
-- ==========================================
