-- FIX: Tambahkan policy untuk INSERT ke tabel transactions (untuk user yang login)
-- Jalankan ini di Supabase SQL Editor!

-- 1. Pastikan RLS aktif
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. Policy: User bisa INSERT transaksi untuk dirinya sendiri
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Policy: User bisa SELECT transaksi mereka sendiri
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: Admin (wallet_index = 0) bisa melihat SEMUA transaksi
-- Tapi karena kita mengambil lewat Supabase Client di frontend (dengan user session),
-- kita buat policy khusus: User dengan wallet_index = 0 bisa melihat semua transaksi
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.wallet_index = 0
    )
  );

-- 5. Policy: User bisa UPDATE transaksi mereka sendiri (opsional)
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- SELESAI!
