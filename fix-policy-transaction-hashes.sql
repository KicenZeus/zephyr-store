-- FIX POLICY INSERT transaction_hashes!
-- Jalankan ini di Supabase SQL Editor!

-- Hapus policy lama
DROP POLICY IF EXISTS "Only service role can insert transaction hashes" ON public.transaction_hashes;
DROP POLICY IF EXISTS "Anyone can view transaction hashes" ON public.transaction_hashes;

-- Buat policy baru
CREATE POLICY "Anyone can view transaction hashes"
  ON public.transaction_hashes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert transaction hashes"
  ON public.transaction_hashes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "No one can update transaction hashes"
  ON public.transaction_hashes FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete transaction hashes"
  ON public.transaction_hashes FOR DELETE
  USING (false);

-- SELESAI!
