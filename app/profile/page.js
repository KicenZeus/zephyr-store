
'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import AdminDashboard from "@/components/web3/AdminDashboard";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const fetchProfile = async () => {
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [supabase, router]);

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

  if (!user) {
    router.push("/login?redirect=/profile");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic mb-2">Profile</h1>
        </div>

        {profile?.wallet_index === 0 && (
          <div className="mb-8">
            <AdminDashboard />
          </div>
        )}

        <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-fuchsia-500/30 mb-4">
              {profile?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            {editing ? (
              <div className="flex items-center gap-3 w-full max-w-md">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-fuchsia-500/30"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-lg font-black text-white hover:text-primary transition-colors"
              >
                {profile?.name || "Edit Name"}
              </button>
            )}
          </div>

          <div className="space-y-4">
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
                Wallet Address
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white break-all">
                  {profile?.wallet_address || "-"}
                </div>
                {profile?.wallet_address && (
                  <button
                    onClick={() => copyToClipboard(profile.wallet_address)}
                    className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                )}
              </div>
            </div>

            {profile?.wallet_private_key && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
