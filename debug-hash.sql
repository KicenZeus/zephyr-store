-- FILE DEBUG: Cek perhitungan hash di SQL!
-- Jalankan ini di Supabase SQL Editor, lalu lihat hasilnya!

-- 1. Coba hitung hash untuk transaksi tertentu (ganti dengan data transaksi kamu!)
-- Ganti dengan data transaksi genesis kamu!
SELECT 
  id,
  user_id,
  game,
  item,
  amount,
  created_at,
  prev_hash,
  nonce,
  block_hash,
  public.calculate_hash(
    id,
    user_id,
    game,
    item,
    amount,
    created_at,
    prev_hash,
    nonce
  ) AS calculated_hash,
  public.calculate_hash(
    id,
    user_id,
    game,
    item,
    amount,
    created_at,
    prev_hash,
    nonce
  ) = block_hash AS is_valid
FROM public.transactions
ORDER BY created_at ASC
LIMIT 5; -- Lihat 5 transaksi pertama

-- 2. Lihat format created_at seperti apa!
SELECT id, created_at, pg_typeof(created_at) FROM public.transactions LIMIT 1;
