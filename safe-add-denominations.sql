-- SUPER SAFE ADD DENOMINATIONS: Cek semua kolom dan tabel dulu!

-- ==========================================
-- 1. CEK & BUAT TABEL KATEGORI JIKA BELUM ADA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denomination_categories (
  id SERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. CEK & BUAT TABEL DENOMINATIONS JIKA BELUM ADA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.denominations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  amount TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. TAMBAHKAN KOLOM YANG HILANG (UNTUK TABEL YANG SUDAH ADA)
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
-- 4. INSERT DATA (SAFE, SKIP JIKA SUDAH ADA)
-- ==========================================

-- MOBILE LEGENDS
WITH existing_ml_cats AS (
  SELECT id, name FROM public.denomination_categories WHERE game_slug = 'mobile-legends'
),
new_ml_cats AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('mobile-legends', 'Diamonds'),
  ('mobile-legends', 'Pass')
  ON CONFLICT DO NOTHING
  RETURNING id, name
),
all_ml_cats AS (
  SELECT id, name FROM existing_ml_cats
  UNION ALL
  SELECT id, name FROM new_ml_cats
),
diamond_cat AS (SELECT id FROM all_ml_cats WHERE name = 'Diamonds'),
pass_cat AS (SELECT id FROM all_ml_cats WHERE name = 'Pass')
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
((SELECT id FROM pass_cat), 'Starlight Pass', 199000)
ON CONFLICT DO NOTHING;

-- FREE FIRE
WITH existing_ff_cats AS (
  SELECT id, name FROM public.denomination_categories WHERE game_slug = 'free-fire'
),
new_ff_cats AS (
  INSERT INTO public.denomination_categories (game_slug, name) VALUES
  ('free-fire', 'Diamonds')
  ON CONFLICT DO NOTHING
  RETURNING id, name
),
all_ff_cats AS (
  SELECT id, name FROM existing_ff_cats
  UNION ALL
  SELECT id, name FROM new_ff_cats
)
INSERT INTO public.denominations (category_id, amount, price) VALUES
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '50 Diamonds', 8000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '100 Diamonds', 15000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '140 Diamonds', 20000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '210 Diamonds', 30000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '270 Diamonds', 35000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '355 Diamonds', 50000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '560 Diamonds', 80000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '720 Diamonds', 100000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '1080 Diamonds', 150000),
((SELECT id FROM all_ff_cats WHERE name = 'Diamonds'), '1450 Diamonds', 200000)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 5. RLS & POLICIES
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
