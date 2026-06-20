-- SETUP SISTEM HASH BARU!
-- Jalankan ini di Supabase SQL Editor!

-- 1. Buat tabel baru transaction_hashes (hash disimpan secara permanen)
CREATE TABLE IF NOT EXISTS public.transaction_hashes (
  id TEXT PRIMARY KEY REFERENCES public.transactions(id) ON DELETE CASCADE,
  block_hash TEXT NOT NULL,
  prev_hash TEXT,
  nonce INTEGER NOT NULL,
  block_height INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan RLS
ALTER TABLE public.transaction_hashes ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Semua orang bisa melihat hash
CREATE POLICY "Anyone can view transaction hashes"
  ON public.transaction_hashes FOR SELECT
  USING (true);

-- 4. Policy: Semua user yang login bisa insert hash (karena trigger yang insert)
CREATE POLICY "Authenticated users can insert transaction hashes"
  ON public.transaction_hashes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Policy: Tidak bisa update atau delete hash!
CREATE POLICY "No one can update transaction hashes"
  ON public.transaction_hashes FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete transaction hashes"
  ON public.transaction_hashes FOR DELETE
  USING (false);

-- 5. Nonaktifkan trigger UPDATE/DELETE lama (kita ingin bisa edit transaksi tapi verifikasi hash terpisah)
DROP TRIGGER IF EXISTS on_transaction_update ON public.transactions;
DROP TRIGGER IF EXISTS on_transaction_delete ON public.transactions;

-- 6. Buat trigger baru: Ketika insert transaksi, otomatis simpan hash ke transaction_hashes!
CREATE OR REPLACE FUNCTION public.save_transaction_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_last_block RECORD;
  v_new_hash TEXT;
  v_nonce INTEGER := 0;
  v_target_prefix TEXT := '00';
BEGIN
  -- Dapatkan transaksi terakhir (untuk chain)
  SELECT th.* INTO v_last_block
  FROM public.transaction_hashes th
  JOIN public.transactions t ON th.id = t.id
  ORDER BY t.created_at DESC, t.id DESC
  LIMIT 1;

  -- Tentukan prev_hash dan block_height
  IF v_last_block IS NULL THEN
    NEW.prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    NEW.block_height := 1;
  ELSE
    NEW.prev_hash := v_last_block.block_hash;
    NEW.block_height := v_last_block.block_height + 1;
  END IF;

  -- Mining sederhana
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
    EXIT WHEN starts_with(v_new_hash, v_target_prefix) OR v_nonce > 10000;
    v_nonce := v_nonce + 1;
  END LOOP;

  -- Simpan ke tabel transaction_hashes!
  INSERT INTO public.transaction_hashes (id, block_hash, prev_hash, nonce, block_height)
  VALUES (NEW.id, v_new_hash, NEW.prev_hash, v_nonce, NEW.block_height);

  -- Update transaksi (untuk backward compatibility)
  NEW.prev_hash := NEW.prev_hash;
  NEW.block_hash := v_new_hash;
  NEW.nonce := v_nonce;
  NEW.block_height := NEW.block_height;

  RETURN NEW;
END;
$$;

-- 7. Aktifkan trigger baru
DROP TRIGGER IF EXISTS on_transaction_insert ON public.transactions;
CREATE TRIGGER on_transaction_insert
BEFORE INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.save_transaction_hash();

-- 8. Pindahkan hash lama dari transactions ke transaction_hashes!
INSERT INTO public.transaction_hashes (id, block_hash, prev_hash, nonce, block_height)
SELECT id, block_hash, prev_hash, nonce, block_height
FROM public.transactions
WHERE block_hash IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- SELESAI!
