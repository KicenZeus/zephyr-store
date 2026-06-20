"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Fungsi untuk menghitung hash di frontend (mirip dengan fungsi calculate_hash di SQL)
// Format waktu harus SAMA PERSIS dengan di SQL!
function formatDateForHash(dateString) {
  const date = new Date(dateString);
  // Format sesuai dengan SQL (contoh: 2024-06-21 12:34:56.789012+00)
  // Atau kita gunakan format ISO yang sama dengan yang disimpan di Supabase!
  return date.toISOString().replace("T", " ").replace("Z", "+00");
}

// Fungsi untuk mengubah format created_at agar SAMA PERSIS dengan PostgreSQL!
function formatCreatedAtForHash(createdAtStr) {
  // Ganti 'T' dengan spasi dan hapus ':' di zona waktu (jika ada)
  // Contoh: 2026-06-20T18:20:28.695584+00:00 → 2026-06-20 18:20:28.695584+00
  return createdAtStr.replace("T", " ").replace(/:00$/, "");
}

function calculateTransactionHash(tx) {
  // Pastikan kita handle prev_hash dengan benar!
  // Di SQL, untuk genesis block, prev_hashnya adalah 0000..., bukan 'genesis'!
  const prevHashToUse = tx.prev_hash;

  // Pastikan user_id adalah string lowercase (karena UUID di SQL biasanya lowercase)
  const userIdStr = String(tx.user_id).toLowerCase();
  // Pastikan amount adalah string tanpa koma
  const amountStr = String(tx.amount);
  // Pastikan nonce adalah string
  const nonceStr = String(tx.nonce);
  // Format created_at agar sama dengan di SQL!
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
  
  console.log(`🔍 [DEBUG] Calculating hash for tx: ${tx.id}`);
  console.log(`📄 Data to hash: "${data}"`);
  console.log(`🔍 [DEBUG] userId: ${userIdStr} (lowercase)`);
  console.log(`🔍 [DEBUG] amount: ${amountStr}`);
  console.log(`🔍 [DEBUG] nonce: ${nonceStr}`);
  console.log(`🔍 [DEBUG] createdAt (original): ${tx.created_at}`);
  console.log(`🔍 [DEBUG] createdAt (formatted): ${createdAtForHash}`);
  
  // Kita gunakan SHA-256 dari Crypto API browser
  return new Promise(async (resolve) => {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      console.log(`✅ [DEBUG] Calculated hash: ${hashHex}`);
      console.log(`🔍 [DEBUG] Block hash from DB: ${tx.block_hash}`);
      console.log(`✅ [DEBUG] Match: ${hashHex === tx.block_hash}`);
      
      resolve(hashHex);
    } catch (e) {
      console.error("Error calculating hash:", e);
      resolve(null);
    }
  });
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
  const supabase = createClient();

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

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        console.log('🔍 [DEBUG] User:', user.id);
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
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        console.log('🔍 [DEBUG] Query result:', JSON.stringify({ data, error }, null, 2));

        if (!error && data) {
          // Gabungkan data hash ke transaksi (transaction_hashes adalah OBJECT, bukan array!)
          const dataWithHash = data.map(tx => {
            const mapped = ({
              ...tx,
              block_hash: tx.transaction_hashes?.block_hash,
              prev_hash: tx.transaction_hashes?.prev_hash,
              nonce: tx.transaction_hashes?.nonce,
              block_height: tx.transaction_hashes?.block_height
            });
            console.log(`🔍 [DEBUG] Mapped tx ${tx.id}:`, JSON.stringify(mapped, null, 2));
            return mapped;
          });
          console.log('🔍 [DEBUG] Data with hash:', JSON.stringify(dataWithHash, null, 2));
          setTransactions(dataWithHash);
          // Verifikasi semua transaksi setelah mengambil data
          verifyAllTransactions(dataWithHash);
        } else if (error) {
          console.error('❌ [DEBUG] Query error:', error);
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

                {/* Verification & Blockchain Info */}
                <div className="space-y-3">
                  {/* Verification Status */}
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
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
