'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConnectWallet from "@/components/web3/ConnectWallet";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Ambil user session saat mount
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, email, wallet_index")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    getUser();

    // Listen perubahan auth (login/logout dari tab lain)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
        setDropdownOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav className="fixed top-0 w-full z-[100] bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0 text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 tracking-tighter cursor-pointer">
          <Link href="/">Zephyr.</Link>
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Game, Voucher, atau Skin..."
              className="w-full bg-white/5 border border-white/10 py-2.5 px-11 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-xs"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        {/* Auth & Web3 Area */}
        <div className="flex items-center gap-3">
          <ConnectWallet />
          {user ? (
            /* ── SUDAH LOGIN: Avatar + Dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 hover:border-primary/40 transition-all"
              >
                {/* Avatar Inisial */}
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-[11px] font-black text-white">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-black text-white leading-none truncate max-w-[120px]">
                    {profile?.name ?? "Loading..."}
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Member</p>
                </div>
                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs font-black text-white truncate">{profile?.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{profile?.email}</p>
                  </div>
                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 group-hover:text-primary transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">Profil Saya</span>
                    </Link>
                    <Link
                      href="/transactions"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 group-hover:text-primary transition-colors"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">Riwayat Transaksi</span>
                    </Link>

                    
                  </div>
                  {/* Logout */}
                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 group-hover:text-red-400 transition-colors"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-red-400 transition-colors">Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── BELUM LOGIN: Tombol Masuk & Daftar ── */
            <>
              <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors px-3 py-2">
                Masuk
              </Link>
              <Link href="/register" className="bg-primary px-5 py-2 rounded-xl text-on-primary-container font-black text-[11px] uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      {/* BARIS 2: Navigation Links */}
      <div className="bg-zinc-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <NavItem icon="shopping-bag" label="Topup" active={pathname === "/"} />
            </Link>
            <Link href="/flashsale">
              <NavItem icon="zap" label="Flash Sale" color="text-yellow-400" active={pathname === "/flashsale"} />
            </Link>
            <Link href="/transactions">
              <NavItem icon="search" label="Cek Transaksi" active={pathname === "/transactions"} />
            </Link>
            <Link href="/leaderboard">
              <NavItem icon="trello" label="Leaderboard" active={pathname === "/leaderboard"} />
            </Link>
            <Link href="/calculator">
              <NavItem icon="calculator" label="Kalkulator" active={pathname === "/calculator"} />
            </Link>
            
            {/* Admin Link - Only for wallet_index 0 */}
            {profile?.wallet_index === 0 && (
              <Link href="/admin">
                <NavItem icon="link" label="Admin" color="text-fuchsia-400" active={pathname === "/admin"} />
              </Link>
            )}

          </div>
          <div className="hidden md:flex items-center text-zinc-500 gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Server Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false, color = "" }) {
  const icons = {
    "shopping-bag": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    "zap": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z"/></svg>,
    "search": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="m16 19-1.5-1.5"/></svg>,
    "trello": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="3" height="9" x="7" y="7"/><rect width="3" height="5" x="14" y="7"/></svg>,
    "calculator": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
    "link": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v2"/><path d="M12 9v2"/><path d="M12 3v2"/><circle cx="12" cy="18" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="6" r="1"/></svg>,
  };
  return (
    <div className={`flex items-center gap-2 cursor-pointer py-1 border-b-2 transition-all group ${active ? "border-primary text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>
      <span className={`group-hover:scale-110 transition-transform ${color || (active ? "text-primary" : "")}`}>{icons[icon]}</span>
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}