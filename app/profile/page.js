'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import AdminDashboard from "@/components/web3/AdminDashboard";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
        setName(data?.name || "");
        setEmail(data?.email || "");
      }
      setLoading(false);
    };

    getProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, name });
      setEditing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic mb-2">Profil Saya</h1>
          <p className="text-zinc-500 text-sm">Kelola informasi akun kamu!</p>
        </div>

        {/* Wallet Detail Card */}
        {profile?.wallet_address && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">
              📦 Wallet Hardhat {profile.wallet_index === 0 ? "(ADMIN)" : `#${profile.wallet_index}`}
            </h2>
            <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Hardhat Network</div>
                <div className="bg-primary/20 text-primary text-xs font-black px-3 py-1 rounded-full">
                  {profile.wallet_index === 0 ? "ADMIN" : "USER"}
                </div>
              </div>

              <div className="space-y-6">
                {/* Wallet Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Alamat Wallet
                  </label>
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-sm break-all">{profile.wallet_address}</span>
                    <button 
                      onClick={() => copyToClipboard(profile.wallet_address)}
                      className="bg-zinc-700 hover:bg-zinc-600 transition-all p-2 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>

                {/* Private Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Private Key (Test Only!)
                  </label>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs break-all text-yellow-400">{profile.wallet_private_key}</span>
                    <button 
                      onClick={() => copyToClipboard(profile.wallet_private_key)}
                      className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition-all p-2 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-red-400">⚠️ JANGAN BAGIKAN PRIVATE KEY INI KE SIAPAPUN!</p>
                </div>

                {/* Balance Info */}
                <div className="bg-gradient-to-r from-fuchsia-600/10 to-purple-600/10 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Estimated Balance</span>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">1000 ETH</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Saldo default Hardhat test accounts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard (Only for wallet_index 0) */}
        {profile?.wallet_index === 0 && (
          <div className="mb-8">
            <AdminDashboard />
          </div>
        )}

        <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-fuchsia-500/30 mb-4">
              {profile?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                />
              ) : (
                <div className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white">
                  {profile?.name || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-zinc-400">
                {profile?.email || user?.email || "-"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Points
              </label>
              <div className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-primary font-bold">
                {profile?.points || 0} Points
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Tanggal Bergabung
              </label>
              <div className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-zinc-400">
                {new Date(user?.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-black text-sm py-3 rounded-xl hover:brightness-110 transition-all"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(profile?.name || "");
                    }}
                    className="px-6 bg-zinc-800 text-zinc-400 font-black text-sm py-3 rounded-xl hover:bg-zinc-700 transition-all"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-black text-sm py-3 rounded-xl hover:brightness-110 transition-all"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
