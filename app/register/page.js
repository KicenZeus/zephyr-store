'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getHardhatWallet, getNextWalletIndex } from "@/lib/hardhat-wallet";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) return setError("Password tidak cocok.");
    if (form.password.length < 6) return setError("Password minimal 6 karakter.");

    setLoading(true);
    const supabase = createClient();

    try {
      // Step 1: Get all used wallet indexes FIRST (before signup)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('wallet_index');

      // Extract used indexes
      const usedIndexes = profiles 
        ? profiles.map(p => p.wallet_index).filter(i => i !== null && i !== undefined) 
        : [];

      // Get next available index
      const walletIndex = getNextWalletIndex(usedIndexes);
      const wallet = getHardhatWallet(walletIndex);

      // Step 2: Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: { name: form.name.trim() },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        console.error("SignUp Error:", signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data?.user && data.user.identities?.length === 0) {
        setError("Email ini sudah terdaftar. Silakan login.");
        setLoading(false);
        return;
      }

      // Step 3: Handle profile with wallet
      if (data?.user) {
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if profile exists
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          // Profile exists, update with wallet
          await supabase
            .from('profiles')
            .update({
              wallet_address: wallet.address,
              wallet_private_key: wallet.privateKey,
              wallet_index: wallet.index
            })
            .eq('id', data.user.id);
        } else {
          // No profile, create it manually
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: form.name.trim(),
              email: form.email.trim(),
              wallet_address: wallet.address,
              wallet_private_key: wallet.privateKey,
              wallet_index: wallet.index,
              points: 0
            });
        }
      }

      setLoading(false);

      if (data?.user && !data?.session) {
        setSuccess(true);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Gagal terhubung ke server. Periksa koneksi atau .env.local!");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="text-2xl font-black uppercase mb-3">Cek Email Kamu!</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            Kami kirim link konfirmasi ke <span className="text-primary font-bold">{form.email}</span>.
            Klik link tersebut untuk mengaktifkan akun.
          </p>
          <Link href="/login" className="inline-block bg-gradient-to-r from-fuchsia-600 to-purple-600 px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-widest">
            Ke Halaman Login
          </Link>
        </div>
      </main>
    );
  }

  const fields = [
    { key: "name", label: "Nama Lengkap", type: "text", placeholder: "John Doe" },
    { key: "email", label: "Email", type: "email", placeholder: "contoh@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Minimal 6 karakter" },
    { key: "confirm", label: "Konfirmasi Password", type: "password", placeholder: "Ulangi password" },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 tracking-tighter">
            Zephyr.
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Buat akun baru untuk mulai top up</p>
        </div>

        <div className="bg-[#18181b] border border-white/5 rounded-[2.5rem] p-10">
          <h2 className="text-sm font-black uppercase tracking-widest mb-8">Buat Akun</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
                />
              </div>
            ))}

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
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-xs">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
