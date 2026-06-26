"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Fungsi untuk menghitung hash di frontend (mirip dengan fungsi calculate_hash di SQL)
// Format waktu harus SAMA PERSIS dengan di SQL!
function formatDateForHash(dateString) {
  const date = new Date(dateString);
  return date.toISOString().replace("T", " ").replace("Z", "+00");
}

// Fungsi untuk mengubah format created_at agar SAMA PERSIS dengan PostgreSQL!
function formatCreatedAtForHash(createdAtStr) {
  return createdAtStr.replace("T", " ").replace(/:00$/, "");
}

async function calculateTransactionHash(tx) {
  const prevHashToUse = tx.prev_hash;
  const userIdStr = String(tx.user_id).toLowerCase();
  const amountStr = String(tx.amount);
  const nonceStr = String(tx.nonce);
  const createdAtForHash = formatCreatedAtForHash(tx.created_at);

  const data = 
    tx.id + "|" + 
    userIdStr + "|" + 
    tx.game + "|" + 
    tx.item + "|" + 
    amountStr + "|" + 
    createdAtForHash + "|" + 
    prevHashToUse + "|" + 
    nonceStr;
  
  // Kita gunakan SHA-256 dari Crypto API browser
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return null;
  }
}

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
  const [verificationStatus, setVerificationStatus] = useState({});
  const [checkingStatus, setCheckingStatus] = useState({}); // Untuk loading cek status
  const supabase = createClient();
  
  // Fungsi untuk cek status Midtrans secara manual
  const checkMidtransStatus = async (orderId) => {
    setCheckingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch('/api/midtrans/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const result = await response.json();
      if (result.success) {
        alert(`Status transaksi ${orderId}: ${result.status}`);
        await refreshAllData();
      } else {
        alert('Gagal cek status: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Cek status error:', error);
      alert('Gagal cek status: ' + error.message);
    }
    setCheckingStatus(prev => ({ ...prev, [orderId]: false }));
  };

  // Fungsi untuk memverifikasi semua transaksi
  const verifyAllTransactions = async (txs) => {
    const newStatus = {};
    for (const tx of txs) {
      if (tx.block_hash) {
        const calculatedHash = await calculateTransactionHash(tx);
        newStatus[tx.id] = calculatedHash === tx.block_hash;
      } else {
        newStatus[tx.id] = null; // Tidak ada hash untuk diverifikasi
      }
    }
    setVerificationStatus(newStatus);
  };

  // Fungsi untuk REFRESH SEMUA DATA dari Supabase + cek status Midtrans
  const refreshAllData = async (currentUser) => {
    const userToUse = currentUser || user;
    if (!userToUse) return;
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        transaction_hashes (
          block_hash,
          prev_hash,
          nonce,
          block_height
        )
      `)
      .eq("user_id", userToUse.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Refresh error:', error);
      return;
    }
    
    const dataWithHash = data.map(tx => ({
      ...tx,
      block_hash: tx.transaction_hashes?.block_hash,
      prev_hash: tx.transaction_hashes?.prev_hash,
      nonce: tx.transaction_hashes?.nonce,
      block_height: tx.transaction_hashes?.block_height
    }));
    
    for (const tx of dataWithHash) {
      if (tx.status === 'pending') {
        try {
          const response = await fetch('/api/midtrans/check-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: tx.id })
          });
          const result = await response.json();
          
          if (result.success) {
            const index = dataWithHash.findIndex(t => t.id === tx.id);
            if (index !== -1 && dataWithHash[index].status !== result.status) {
              dataWithHash[index] = { ...dataWithHash[index], status: result.status };
            }
          }
        } catch (error) {
          console.error(`Check status ${tx.id} error:`, error);
        }
      }
    }
    
    setTransactions(dataWithHash);
    verifyAllTransactions(dataWithHash);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await refreshAllData(user);
      }
      setLoading(false);
    };
    fetchData();
    
    const interval = setInterval(() => {
      refreshAllData();
    }, 5000);
    
    return () => clearInterval(interval);
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
                    {tx.status === 'pending' && (
                      <button
                        onClick={() => checkMidtransStatus(tx.id)}
                        disabled={checkingStatus[tx.id]}
                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkingStatus[tx.id] ? '⏳ Cek...' : '🔄 Cek Status Midtrans'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {verificationStatus[tx.id] === true && (
                      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl">
                        <span className="text-green-400">✅</span>
                        <span className="text-[10px] font-black text-green-400 uppercase">Transaksi Terverifikasi - Data Tidak Dimanipulasi</span>
                      </div>
                    )}
                    {verificationStatus[tx.id] === false && (
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl">
                        <span className="text-red-400">❌</span>
                        <span className="text-[10px] font-black text-red-400 uppercase">PERINGATAN: Data Transaksi Telah Dimanipulasi!</span>
                      </div>
                    )}
                    {verificationStatus[tx.id] === null && (
                      <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl">
                        <span className="text-yellow-400">⚠️</span>
                        <span className="text-[10px] font-black text-yellow-400 uppercase">Tidak Ada Hash Blockchain</span>
                      </div>
                    )}
                  </div>

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
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
