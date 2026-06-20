-- Script untuk MENGUPDATE transaksi lama yang BELUM punya hash!
-- Jalankan ini di Supabase SQL Editor!

-- 1. Nonaktifkan trigger UPDATE terlebih dahulu (karena kita mau mengedit transaksi lama)
DROP TRIGGER IF EXISTS on_transaction_update ON public.transactions;

-- 2. Update transaksi yang belum punya block_hash
-- Kita akan loop semua transaksi dan hitung hashnya satu per satu!
DO $$
DECLARE
  tx RECORD;
  v_last_block RECORD;
  v_new_hash TEXT;
  v_nonce INTEGER;
  v_target_prefix TEXT := '00';
BEGIN
  -- Urutkan transaksi berdasarkan created_at untuk membuat chain yang benar!
  FOR tx IN SELECT * FROM public.transactions ORDER BY created_at ASC, id ASC LOOP
    -- Cari transaksi sebelumnya
    SELECT * INTO v_last_block
    FROM public.transactions
    WHERE created_at < tx.created_at OR (created_at = tx.created_at AND id < tx.id)
    ORDER BY created_at DESC, id DESC
    LIMIT 1;

    -- Tentukan prev_hash dan block_height
    IF v_last_block IS NULL THEN
      tx.prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
      tx.block_height := 1;
    ELSE
      tx.prev_hash := v_last_block.block_hash;
      tx.block_height := v_last_block.block_height + 1;
    END IF;

    -- Mining sederhana: cari nonce agar hash diawali dengan '00'
    v_nonce := 0;
    LOOP
      v_new_hash := public.calculate_hash(
        tx.id,
        tx.user_id,
        tx.game,
        tx.item,
        tx.amount,
        tx.created_at,
        tx.prev_hash,
        v_nonce
      );

      EXIT WHEN starts_with(v_new_hash, v_target_prefix);

      v_nonce := v_nonce + 1;
      IF v_nonce > 10000 THEN EXIT; END IF;
    END LOOP;

    -- Update transaksi
    UPDATE public.transactions
    SET
      prev_hash = tx.prev_hash,
      block_hash = v_new_hash,
      nonce = v_nonce,
      block_height = tx.block_height
    WHERE id = tx.id;

  END LOOP;
END $$;

-- 3. Aktifkan kembali trigger UPDATE!
CREATE OR REPLACE FUNCTION public.prevent_transaction_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'TIDAK DIPERBOLEHKAN mengedit transaksi! Data transaksi bersifat IMMUTABLE!';
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_transaction_update
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_transaction_update();

-- SELESAI!
