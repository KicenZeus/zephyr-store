-- ISI HASH UNTUK SEMUA TRANSAKSI LAMA!
-- Jalankan ini di Supabase SQL Editor!

-- 1. Nonaktifkan trigger terlebih dahulu agar tidak terjadi konflik
DROP TRIGGER IF EXISTS on_transaction_insert ON public.transactions;

-- 2. Pindahkan hash lama dari transactions ke transaction_hashes (jika ada)
INSERT INTO public.transaction_hashes (id, block_hash, prev_hash, nonce, block_height)
SELECT 
  id, 
  block_hash, 
  prev_hash, 
  nonce, 
  block_height
FROM public.transactions
WHERE block_hash IS NOT NULL
  AND id NOT IN (SELECT id FROM public.transaction_hashes)
ON CONFLICT (id) DO NOTHING;

-- 3. Hitung hash untuk transaksi yang belum punya!
DO $$
DECLARE
  tx RECORD;
  v_last_block RECORD;
  v_new_hash TEXT;
  v_nonce INTEGER;
  v_target_prefix TEXT := '00';
  v_prev_hash TEXT;
  v_block_height INTEGER;
BEGIN
  -- Loop semua transaksi yang belum punya hash, urutkan berdasarkan created_at!
  FOR tx IN SELECT * FROM public.transactions WHERE id NOT IN (SELECT id FROM public.transaction_hashes) ORDER BY created_at ASC, id ASC LOOP
    -- Dapatkan block terakhir dari transaction_hashes
    SELECT th.* INTO v_last_block
    FROM public.transaction_hashes th
    JOIN public.transactions t ON th.id = t.id
    ORDER BY t.created_at DESC, t.id DESC
    LIMIT 1;

    -- Tentukan prev_hash dan block_height
    IF v_last_block IS NULL THEN
      v_prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
      v_block_height := 1;
    ELSE
      v_prev_hash := v_last_block.block_hash;
      v_block_height := v_last_block.block_height + 1;
    END IF;

    -- Mining sederhana
    v_nonce := 0;
    LOOP
      v_new_hash := public.calculate_hash(
        tx.id,
        tx.user_id,
        tx.game,
        tx.item,
        tx.amount,
        tx.created_at,
        v_prev_hash,
        v_nonce
      );
      EXIT WHEN starts_with(v_new_hash, v_target_prefix) OR v_nonce > 10000;
      v_nonce := v_nonce + 1;
    END LOOP;

    -- Masukkan ke transaction_hashes
    INSERT INTO public.transaction_hashes (id, block_hash, prev_hash, nonce, block_height)
    VALUES (tx.id, v_new_hash, v_prev_hash, v_nonce, v_block_height);

    -- Update juga transaksi asli (backward compatibility)
    UPDATE public.transactions
    SET 
      prev_hash = v_prev_hash,
      block_hash = v_new_hash,
      nonce = v_nonce,
      block_height = v_block_height
    WHERE id = tx.id;
  END LOOP;
END $$;

-- 4. Aktifkan kembali trigger!
CREATE OR REPLACE FUNCTION public.save_transaction_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_last_block RECORD;
  v_new_hash TEXT;
  v_nonce INTEGER := 0;
  v_target_prefix TEXT := '00';
  v_prev_hash TEXT;
  v_block_height INTEGER;
BEGIN
  -- Dapatkan transaksi terakhir (untuk chain)
  SELECT th.* INTO v_last_block
  FROM public.transaction_hashes th
  JOIN public.transactions t ON th.id = t.id
  ORDER BY t.created_at DESC, t.id DESC
  LIMIT 1;

  -- Tentukan prev_hash dan block_height
  IF v_last_block IS NULL THEN
    v_prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    v_block_height := 1;
  ELSE
    v_prev_hash := v_last_block.block_hash;
    v_block_height := v_last_block.block_height + 1;
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
      v_prev_hash,
      v_nonce
    );
    EXIT WHEN starts_with(v_new_hash, v_target_prefix) OR v_nonce > 10000;
    v_nonce := v_nonce + 1;
  END LOOP;

  -- Simpan ke tabel transaction_hashes!
  INSERT INTO public.transaction_hashes (id, block_hash, prev_hash, nonce, block_height)
  VALUES (NEW.id, v_new_hash, v_prev_hash, v_nonce, v_block_height);

  -- Update transaksi (untuk backward compatibility)
  UPDATE public.transactions
  SET 
    prev_hash = v_prev_hash,
    block_hash = v_new_hash,
    nonce = v_nonce,
    block_height = v_block_height
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_transaction_insert
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.save_transaction_hash();

-- SELESAI!
