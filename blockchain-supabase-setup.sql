-- Script untuk menambahkan fitur BLOCKCHAIN GLOBAL ke Supabase
-- Jalankan ini di Supabase SQL Editor

-- 1. Tambahkan kolom blockchain ke tabel transactions (jika belum ada)
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS prev_hash TEXT,
ADD COLUMN IF NOT EXISTS block_hash TEXT,
ADD COLUMN IF NOT EXISTS nonce INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS block_height INTEGER DEFAULT 0;

-- 2. Buat fungsi untuk menghitung hash sederhana (sama seperti sebelumnya)
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

-- 3. Buat fungsi untuk menambahkan transaksi ke BLOCKCHAIN GLOBAL
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

-- 4. Buat trigger untuk otomatis menambahkan transaksi ke blockchain global
DROP TRIGGER IF EXISTS on_transaction_insert ON public.transactions;

CREATE TRIGGER on_transaction_insert
BEFORE INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.add_transaction_to_blockchain();
