-- UPDATE & VERIFY: Tambahkan fitur verifikasi dan proteksi edit transaksi
-- Jalankan ini di Supabase SQL Editor!

-- 1. Buat fungsi untuk VERIFIKASI transaksi (apakah hash sesuai dengan data)
CREATE OR REPLACE FUNCTION public.verify_transaction(
  p_id TEXT,
  p_user_id UUID,
  p_game TEXT,
  p_item TEXT,
  p_amount INTEGER,
  p_created_at TIMESTAMPTZ,
  p_prev_hash TEXT,
  p_nonce INTEGER,
  p_block_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_calculated_hash TEXT;
BEGIN
  -- Hitung hash dari data transaksi yang diberikan
  v_calculated_hash := public.calculate_hash(
    p_id,
    p_user_id,
    p_game,
    p_item,
    p_amount,
    p_created_at,
    p_prev_hash,
    p_nonce
  );

  -- Bandingkan dengan block_hash yang ada
  RETURN v_calculated_hash = p_block_hash;
END;
$$;

-- 2. Trigger untuk PROTEKSI UPDATE transaksi: TIDAK BOLEH mengedit data transaksi!
-- Atau, jika diizinkan edit, harus menghitung ulang hash (dan semua block sesudahnya juga harus diupdate - tapi itu terlalu kompleks, jadi kita TOLAK UPDATE!)
CREATE OR REPLACE FUNCTION public.prevent_transaction_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- HANYA IZINKAN UPDATE status transaksi (jika memang perlu), tapi TIDAK BOLEH edit data lain!
  -- Atau, KITA TOLAK SEMUA UPDATE!
  RAISE EXCEPTION 'TIDAK DIPERBOLEHKAN mengedit transaksi! Data transaksi bersifat IMMUTABLE (tidak bisa diubah)!';
  RETURN NULL;
END;
$$;

-- 3. Buat trigger untuk UPDATE
DROP TRIGGER IF EXISTS on_transaction_update ON public.transactions;
CREATE TRIGGER on_transaction_update
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_transaction_update();

-- 4. (Opsional) Trigger untuk DELETE: Juga tidak boleh menghapus transaksi!
CREATE OR REPLACE FUNCTION public.prevent_transaction_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'TIDAK DIPERBOLEHKAN menghapus transaksi! Data transaksi bersifat IMMUTABLE!';
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_transaction_delete ON public.transactions;
CREATE TRIGGER on_transaction_delete
BEFORE DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_transaction_delete();

-- SELESAI!
