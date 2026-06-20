-- FIX TRIGGER: Ganti ke AFTER INSERT!
-- Jalankan ini di Supabase SQL Editor!

-- 1. Nonaktifkan trigger lama
DROP TRIGGER IF EXISTS on_transaction_insert ON public.transactions;

-- 2. Update fungsi untuk AFTER INSERT
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

-- 3. Buat trigger baru (AFTER INSERT)
CREATE TRIGGER on_transaction_insert
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.save_transaction_hash();

-- SELESAI!
