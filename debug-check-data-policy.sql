-- Cek dan FIX POLICY SELECT transaction_hashes
-- Jalankan ini di Supabase SQL Editor!

-- 1. Lihat semua policy yang ada
SELECT * FROM pg_policies WHERE tablename = 'transaction_hashes';

-- 2. Hapus policy yang mungkin salah
DROP POLICY IF EXISTS "Anyone can view transaction hashes" ON public.transaction_hashes;
DROP POLICY IF EXISTS "Authenticated users can insert transaction hashes" ON public.transaction_hashes;
DROP POLICY IF EXISTS "No one can update transaction hashes" ON public.transaction_hashes;
DROP POLICY IF EXISTS "No one can delete transaction hashes" ON public.transaction_hashes;

-- 3. Buat policy baru yang jelas!
CREATE POLICY "Enable read access for all users"
  ON public.transaction_hashes FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-KAMU_DISINI
MIDTRANS_SERVER_KEY=SB-Mid-server-KAMU_DISINI
  ON public.transaction_hashes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Disable update access for everyone"
  ON public.transaction_hashes FOR UPDATE
  USING (false);

CREATE POLICY "Disable delete access for everyone"
  ON public.transaction_hashes FOR DELETE
  USING (false);

-- 4. Coba lihat apakah data ada
SELECT 'Data di transaction_hashes: ' || COUNT(*) || ' baris' AS info FROM public.transaction_hashes;
SELECT 'Data di transactions: ' || COUNT(*) || ' baris' AS info FROM public.transactions;

-- 5. Coba gabungkan
SELECT 
  t.id,
  th.block_hash
FROM public.transactions t
LEFT JOIN public.transaction_hashes th ON t.id = th.id
LIMIT 10;
