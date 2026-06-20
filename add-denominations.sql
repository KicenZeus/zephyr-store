-- ADD DENOMINATIONS: Tambah tabel kategori dan nominal topup
-- Sama seperti struktur di data-service.js

-- ==========================================
-- 1. TABEL KATEGORI DENOMINATION
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denomination_categories (
  id SERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL REFERENCES public.games(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. TABEL DENOMINATIONS (NOMINAL TOPUP)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denominations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES public.denomination_categories(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. INSERT DATA: KATEGORI + DENOMINATION SEMUA GAME
-- ==========================================

-- MOBILE LEGENDS
WITH ml_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('mobile-legends', 'Diamonds'),
  ('mobile-legends', 'Pass')
  RETURNING id, name
),
diamond_cat AS (SELECT id FROM ml_categories WHERE name = 'Diamonds'),
pass_cat AS (SELECT id FROM ml_categories WHERE name = 'Pass')
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM diamond_cat), '56 Diamonds', 12000),
((SELECT id FROM diamond_cat), '86 Diamonds', 20000),
((SELECT id FROM diamond_cat), '172 Diamonds', 40000),
((SELECT id FROM diamond_cat), '257 Diamonds', 60000),
((SELECT id FROM diamond_cat), '344 Diamonds', 80000),
((SELECT id FROM diamond_cat), '429 Diamonds', 100000),
((SELECT id FROM diamond_cat), '514 Diamonds', 120000),
((SELECT id FROM diamond_cat), '688 Diamonds', 160000),
((SELECT id FROM diamond_cat), '860 Diamonds', 200000),
((SELECT id FROM diamond_cat), '1075 Diamonds', 250000),
((SELECT id FROM pass_cat), 'Weekly Diamond Pass', 28500),
((SELECT id FROM pass_cat), 'Monthly Diamond Pass', 99000),
((SELECT id FROM pass_cat), 'Twilight Pass', 145000),
((SELECT id FROM pass_cat), 'Starlight Pass', 199000);

-- FREE FIRE
WITH ff_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('free-fire', 'Diamonds')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM ff_categories), '50 Diamonds', 8000),
((SELECT id FROM ff_categories), '100 Diamonds', 15000),
((SELECT id FROM ff_categories), '140 Diamonds', 20000),
((SELECT id FROM ff_categories), '210 Diamonds', 30000),
((SELECT id FROM ff_categories), '270 Diamonds', 35000),
((SELECT id FROM ff_categories), '355 Diamonds', 50000),
((SELECT id FROM ff_categories), '560 Diamonds', 80000),
((SELECT id FROM ff_categories), '720 Diamonds', 100000),
((SELECT id FROM ff_categories), '1080 Diamonds', 150000),
((SELECT id FROM ff_categories), '1450 Diamonds', 200000);

-- GENSHIN IMPACT
WITH gi_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('genshin-impact', 'Crystals')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM gi_categories), '60 Crystals', 15000),
((SELECT id FROM gi_categories), '300 Crystals', 75000),
((SELECT id FROM gi_categories), '980 Crystals', 225000),
((SELECT id FROM gi_categories), '1980 Crystals', 450000),
((SELECT id FROM gi_categories), '3280 Crystals', 750000),
((SELECT id FROM gi_categories), '6480 Crystals', 1450000);

-- VALORANT
WITH val_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('valorant', 'VP')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM val_categories), '475 VP', 50000),
((SELECT id FROM val_categories), '1000 VP', 100000),
((SELECT id FROM val_categories), '2050 VP', 200000),
((SELECT id FROM val_categories), '3650 VP', 350000),
((SELECT id FROM val_categories), '5350 VP', 500000),
((SELECT id FROM val_categories), '11000 VP', 1000000);

-- PUBG MOBILE
WITH pubg_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('pubg', 'UC')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM pubg_categories), '60 UC', 10000),
((SELECT id FROM pubg_categories), '300 UC', 50000),
((SELECT id FROM pubg_categories), '600 UC', 100000),
((SELECT id FROM pubg_categories), '1500 UC', 250000),
((SELECT id FROM pubg_categories), '3000 UC', 500000),
((SELECT id FROM pubg_categories), '6000 UC', 1000000);

-- CLASH OF CLANS
WITH coc_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('clash-of-clans', 'Gems')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM coc_categories), '50 Gems', 5000),
((SELECT id FROM coc_categories), '250 Gems', 25000),
((SELECT id FROM coc_categories), '500 Gems', 50000),
((SELECT id FROM coc_categories), '1000 Gems', 100000),
((SELECT id FROM coc_categories), '2000 Gems', 200000),
((SELECT id FROM coc_categories), '5000 Gems', 500000),
((SELECT id FROM coc_categories), '10000 Gems', 1000000);

-- CLASH ROYALE
WITH cr_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('clash-royale', 'Gems')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM cr_categories), '80 Gems', 15000),
((SELECT id FROM cr_categories), '150 Gems', 25000),
((SELECT id FROM cr_categories), '500 Gems', 80000),
((SELECT id FROM cr_categories), '1200 Gems', 180000),
((SELECT id FROM cr_categories), '2500 Gems', 375000),
((SELECT id FROM cr_categories), '5000 Gems', 750000);

-- DELTA FORCE
WITH df_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('delta-force', 'Coins')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM df_categories), '100 Coins', 10000),
((SELECT id FROM df_categories), '300 Coins', 30000),
((SELECT id FROM df_categories), '500 Coins', 50000),
((SELECT id FROM df_categories), '1000 Coins', 100000),
((SELECT id FROM df_categories), '2500 Coins', 250000),
((SELECT id FROM df_categories), '5000 Coins', 500000);

-- LEAGUE OF LEGENDS
WITH lol_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('league-of-legends', 'RP')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM lol_categories), '250 RP', 25000),
((SELECT id FROM lol_categories), '500 RP', 50000),
((SELECT id FROM lol_categories), '1000 RP', 100000),
((SELECT id FROM lol_categories), '2000 RP', 200000),
((SELECT id FROM lol_categories), '3500 RP', 350000),
((SELECT id FROM lol_categories), '5000 RP', 500000);

-- HONOR OF KINGS
WITH hok_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('honor-of-kings', 'Vouchers')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM hok_categories), '60 Vouchers', 10000),
((SELECT id FROM hok_categories), '150 Vouchers', 25000),
((SELECT id FROM hok_categories), '300 Vouchers', 50000),
((SELECT id FROM hok_categories), '500 Vouchers', 80000),
((SELECT id FROM hok_categories), '680 Vouchers', 100000),
((SELECT id FROM hok_categories), '1280 Vouchers', 190000),
((SELECT id FROM hok_categories), '1980 Vouchers', 290000);

-- CALL OF DUTY MOBILE
WITH cod_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('call-of-duty-mobile', 'CP')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM cod_categories), '80 CP', 12000),
((SELECT id FROM cod_categories), '200 CP', 30000),
((SELECT id FROM cod_categories), '400 CP', 55000),
((SELECT id FROM cod_categories), '800 CP', 100000),
((SELECT id FROM cod_categories), '1400 CP', 175000),
((SELECT id FROM cod_categories), '2000 CP', 250000),
((SELECT id FROM cod_categories), '2800 CP', 350000);

-- ARENA OF VALOR
WITH aov_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('arena-of-valor', 'Vouchers')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM aov_categories), '60 Vouchers', 10000),
((SELECT id FROM aov_categories), '150 Vouchers', 22500),
((SELECT id FROM aov_categories), '300 Vouchers', 45000),
((SELECT id FROM aov_categories), '600 Vouchers', 85000),
((SELECT id FROM aov_categories), '1000 Vouchers', 140000),
((SELECT id FROM aov_categories), '1500 Vouchers', 210000);

-- HOGWARTS MYSTERY
WITH hm_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('hogwarts-mystery', 'Gems')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM hm_categories), '100 Gems', 15000),
((SELECT id FROM hm_categories), '250 Gems', 35000),
((SELECT id FROM hm_categories), '500 Gems', 65000),
((SELECT id FROM hm_categories), '1000 Gems', 120000),
((SELECT id FROM hm_categories), '2000 Gems', 230000),
((SELECT id FROM hm_categories), '5000 Gems', 550000);

-- BRAWL STARS
WITH bs_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('brawl-stars', 'Gems')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM bs_categories), '80 Gems', 12000),
((SELECT id FROM bs_categories), '170 Gems', 25000),
((SELECT id FROM bs_categories), '360 Gems', 50000),
((SELECT id FROM bs_categories), '750 Gems', 100000),
((SELECT id FROM bs_categories), '1400 Gems', 180000),
((SELECT id FROM bs_categories), '2800 Gems', 350000);

-- BLACK DESERT MOBILE
WITH bdm_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('black-desert-mobile', 'Pearls')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM bdm_categories), '100 Pearls', 20000),
((SELECT id FROM bdm_categories), '250 Pearls', 45000),
((SELECT id FROM bdm_categories), '500 Pearls', 90000),
((SELECT id FROM bdm_categories), '1000 Pearls', 170000),
((SELECT id FROM bdm_categories), '2000 Pearls', 330000),
((SELECT id FROM bdm_categories), '5000 Pearls', 800000);

-- ROBLOX
WITH rb_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('roblox', 'Robux')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM rb_categories), '400 Robux', 50000),
((SELECT id FROM rb_categories), '800 Robux', 95000),
((SELECT id FROM rb_categories), '1700 Robux', 180000),
((SELECT id FROM rb_categories), '2800 Robux', 300000),
((SELECT id FROM rb_categories), '4500 Robux', 475000),
((SELECT id FROM rb_categories), '10000 Robux', 1000000);

-- MINECRAFT
WITH mc_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('minecraft', 'Minecoins')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM mc_categories), '320 Minecoins', 40000),
((SELECT id FROM mc_categories), '720 Minecoins', 80000),
((SELECT id FROM mc_categories), '1720 Minecoins', 170000),
((SELECT id FROM mc_categories), '3500 Minecoins', 350000),
((SELECT id FROM mc_categories), '5000 Minecoins', 500000);

-- FIFA MOBILE
WITH fifa_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('fifa-mobile', 'FIFA Points')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM fifa_categories), '100 FIFA Points', 15000),
((SELECT id FROM fifa_categories), '250 FIFA Points', 35000),
((SELECT id FROM fifa_categories), '500 FIFA Points', 65000),
((SELECT id FROM fifa_categories), '750 FIFA Points', 95000),
((SELECT id FROM fifa_categories), '1050 FIFA Points', 120000),
((SELECT id FROM fifa_categories), '1500 FIFA Points', 170000),
((SELECT id FROM fifa_categories), '2200 FIFA Points', 250000);

-- MOBILE LEGENDS ADVENTURE
WITH mla_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('mobile-legends-adventure', 'Diamonds')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM mla_categories), '60 Diamonds', 12000),
((SELECT id FROM mla_categories), '150 Diamonds', 30000),
((SELECT id FROM mla_categories), '300 Diamonds', 55000),
((SELECT id FROM mla_categories), '500 Diamonds', 90000),
((SELECT id FROM mla_categories), '680 Diamonds', 110000),
((SELECT id FROM mla_categories), '1000 Diamonds', 160000),
((SELECT id FROM mla_categories), '2000 Diamonds', 320000);

-- RISE OF KINGDOMS
WITH rok_categories AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('rise-of-kingdoms', 'Gems')
  RETURNING id, name
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM rok_categories), '100 Gems', 15000),
((SELECT id FROM rok_categories), '300 Gems', 45000),
((SELECT id FROM rok_categories), '500 Gems', 70000),
((SELECT id FROM rok_categories), '1000 Gems', 130000),
((SELECT id FROM rok_categories), '2000 Gems', 260000),
((SELECT id FROM rok_categories), '5000 Gems', 650000);

-- ==========================================
-- 4. RLS & POLICIES
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
-- SELESAI! 🎉
-- ==========================================
