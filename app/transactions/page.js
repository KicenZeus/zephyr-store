"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function StatusBadge({ status }) {
  const statusConfig = {
    success: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Berhasil" },
    pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Menunggu" },
    failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Gagal" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*, prev_hash, block_hash, nonce, block_height")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setTransactions(data);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

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
          <h1 className="text-3xl font-black italic mb-2">Riwayat Transaksi</h1>
          <p className="text-zinc-500 text-sm">Lihat semua transaksi kamu disini!</p>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-zinc-500">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        Block #{tx.block_height || 1}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{tx.id}</span>
                    </div>
                    <h3 className="font-black text-white mb-1">{tx.game}</h3>
                    <p className="text-sm text-zinc-400">{tx.item}</p>
                    <p className="text-xs text-zinc-500 mt-2">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={tx.status} />
                    <p className="text-lg font-black text-primary">Rp {tx.amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Blockchain Info */}
                {tx.block_hash && (
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase">⛓️ Blockchain Info</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase mb-1">Hash</p>
                        <p className="text-xs font-mono text-purple-400 break-all">{tx.block_hash}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase mb-1">Previous Hash</p>
                        <p className="text-xs font-mono text-pink-400 break-all">{tx.prev_hash}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase mb-1">Nonce</p>
                        <p className="text-xs font-mono text-green-400">{tx.nonce || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
