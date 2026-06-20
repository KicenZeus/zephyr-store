-- FULL ZEPHYR STORE SUPABASE SETUP
-- Jalankan file ini di Supabase SQL Editor untuk setup lengkap

-- ==========================================
-- 1. BUAT TABEL PROFILES (untuk user)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  points INTEGER DEFAULT 0,
  wallet_address TEXT,
  wallet_private_key TEXT,
  wallet_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. BUAT TABEL TRANSACTIONS (untuk riwayat transaksi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL,
  game TEXT NOT NULL,
  item TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  prev_hash TEXT,
  block_hash TEXT,
  nonce INTEGER DEFAULT 0,
  block_height INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. BUAT TABEL GAMES (untuk daftar game)
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
-- 4. INSERT DAFTAR GAME (sesuai proyek)
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
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. POLICIES UNTUK TABEL PROFILES
-- ==========================================
-- Allow ALL users to read ALL profiles (untuk leaderboard)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to insert/update their own profile (untuk upsert)
DROP POLICY IF EXISTS "Users can insert and update own profile" ON public.profiles;
CREATE POLICY "Users can insert and update own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 7. POLICIES UNTUK TABEL TRANSACTIONS
-- ==========================================
-- Allow users to view their own transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own transactions
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own transactions
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 8. POLICIES UNTUK TABEL GAMES
-- ==========================================
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
-- 9. TRIGGER UNTUK OTOMATIS BUAT PROFILE SAAT USER SIGNUP
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, wallet_address, wallet_private_key, wallet_index)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'wallet_address',
    NEW.raw_user_meta_data ->> 'wallet_private_key',
    (NEW.raw_user_meta_data ->> 'wallet_index')::INTEGER
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 10. FUNGSI BLOCKCHAIN & TRIGGER
-- ==========================================
-- Fungsi untuk menghitung hash sederhana
CREATE OR REPLACE FUNCTION public.calculate_hash(
  p_id TEXT,
  p_user_id UUID,
  p_game TEXT,
  p_item TEXT,
  p_amount INTEGER,
  p_created_at TIMESTAMPTZ,
  p_prev_hash TEXT,
  p_nonce INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(sha256(
    (
      p_id || '|' ||
      p_user_id::TEXT || '|' ||
      p_game || '|' ||
      p_item || '|' ||
      p_amount::TEXT || '|' ||
      p_created_at::TEXT || '|' ||
      COALESCE(p_prev_hash, 'genesis') || '|' ||
      p_nonce::TEXT
    )::bytea
  ), 'hex');
END;
$$;

-- Fungsi untuk menambahkan transaksi ke BLOCKCHAIN GLOBAL
CREATE OR REPLACE FUNCTION public.add_transaction_to_blockchain()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_last_block RECORD;
  v_new_hash TEXT;
  v_nonce INTEGER := 0;
  v_target_prefix TEXT := '00'; -- Kesulitan mining sederhana
BEGIN
  -- Dapatkan transaksi TERAKHIR di SELURUH DATABASE (blockchain global)
  SELECT * INTO v_last_block
  FROM public.transactions
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  -- Tentukan prev_hash dan block_height secara GLOBAL
  IF v_last_block IS NULL OR v_last_block.id = NEW.id THEN
    -- Ini adalah GENESIS BLOCK (transaksi pertama di database)!
    NEW.prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    NEW.block_height := 1;
  ELSE
    -- Hubungkan ke block terakhir di global chain
    NEW.prev_hash := v_last_block.block_hash;
    NEW.block_height := v_last_block.block_height + 1;
  END IF;

  -- Mining sederhana: cari nonce agar hash diawali dengan '00'
  LOOP
    v_new_hash := public.calculate_hash(
      NEW.id,
      NEW.user_id,
      NEW.game,
      NEW.item,
      NEW.amount,
      NEW.created_at,
      NEW.prev_hash,
      v_nonce
    );

    EXIT WHEN starts_with(v_new_hash, v_target_prefix);

    v_nonce := v_nonce + 1;
    -- Batasi nonce agar tidak infinite loop
    IF v_nonce > 10000 THEN
      EXIT;
    END IF;
  END LOOP;

  NEW.nonce := v_nonce;
  NEW.block_hash := v_new_hash;

  RETURN NEW;
END;
$$;

-- Trigger untuk otomatis menambahkan transaksi ke blockchain global
DROP TRIGGER IF EXISTS on_transaction_insert ON public.transactions;
CREATE TRIGGER on_transaction_insert
BEFORE INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.add_transaction_to_blockchain();

-- ==========================================
-- SELESAI!
-- ==========================================
