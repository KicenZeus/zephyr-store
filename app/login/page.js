'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getHardhatWallet, getNextWalletIndex } from "@/lib/hardhat-wallet";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        setError(signInError.message || "Email atau password salah.");
        setLoading(false);
        return;
      }

      console.log("Login success:", data.user?.email);

      // Check if user has a wallet
      if (data.user) {
        // First, get the user's profile
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // If no wallet, assign one
        if (!profile?.wallet_address) {
          // Get total profile count for wallet index
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

          // Determine the correct index
          let walletIndex;
          if (profile) {
            // Existing user without wallet, use their position or default to 0
            walletIndex = 0;
            // Let's just cycle through based on count
            walletIndex = (count || 0) % 10;
          } else {
            // No profile at all
            walletIndex = (count || 0) % 10;
          }

          const wallet = getHardhatWallet(walletIndex);

          if (profile) {
            // Update existing profile
            await supabase
              .from('profiles')
              .update({
                wallet_address: wallet.address,
                wallet_private_key: wallet.privateKey,
                wallet_index: wallet.index
              })
              .eq('id', data.user.id);
          } else {
            // Create new profile
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
                email: data.user.email,
                wallet_address: wallet.address,
                wallet_private_key: wallet.privateKey,
                wallet_index: wallet.index,
                points: 0
              });
          }
        }
      }

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";

      window.location.href = redirect;
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Gagal terhubung ke server. Periksa koneksi atau .env.local!");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 tracking-tighter">
            Zephyr.
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Top up game favoritmu dengan aman & cepat</p>
        </div>

        <div className="bg-[#18181b] border border-white/5 rounded-[2.5rem] p-10">
          <h2 className="text-sm font-black uppercase tracking-widest mb-8">Masuk ke Akun</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Email</label>
              <input
                type="email"
                required
                placeholder="contoh@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Password</label>
              <input
                type="password"
                required
                placeholder="Password kamu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-bold">❌ {error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all mt-2 ${
                loading
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-lg shadow-fuchsia-500/20"
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-xs">
              Sudah punya akun?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
