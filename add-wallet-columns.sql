-- Run this in Supabase SQL Editor to add wallet columns
-- This is safer and simpler!

-- 1. Add wallet columns to profiles table (if they don't exist)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS wallet_private_key TEXT,
ADD COLUMN IF NOT EXISTS wallet_index INTEGER DEFAULT 0;

