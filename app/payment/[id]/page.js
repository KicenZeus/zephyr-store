"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getGameData, paymentMethods } from "@/app/order/[slug]/_libs/data-service";

export default function PaymentWaitingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getTransaction = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Ambil transaksi dari Supabase atau session storage (untuk demo)
      const pendingData = sessionStorage.getItem(`payment_${id}`);
      if (pendingData) {
        setTransaction(JSON.parse(pendingData));
        
        // Cari metode pembayaran yang dipilih
        const method = paymentMethods
          .flatMap(g => g.options)
          .find(o => o.id === JSON.parse(pendingData).selectedPayment);
        setSelectedMethod(method);
      }
    };
    getTransaction();
  }, [id, router, supabase]);

  const handleConfirmPayment = async () => {
    if (!transaction) return;
    
    setIsConfirming(true);
    
    try {
      // Simulasi: Update status transaksi menjadi "success"
      const { error } = await supabase.from("transactions").update({
        status: "success",
        updated_at: new Date().toISOString()
      }).eq("id", id);
      
      if (!error) {
        alert("✅ Pembayaran kamu terkonfirmasi! Pesanan sedang diproses!");
        router.push("/transactions");
        sessionStorage.removeItem(`payment_${id}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengkonfirmasi pembayaran");
    }
    setIsConfirming(false);
  };

  if (!transaction || !selectedMethod) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 text-xs font-black uppercase rounded-full mb-4">
            ⏳ Menunggu Pembayaran
          </span>
          <h1 className="text-3xl font-black mb-2">Selesaikan Pembayaranmu!</h1>
          <p className="text-zinc-500">Segera transfer sebelum batas waktu habis</p>
        </div>

        {/* Detail Pembayaran */}
        <div className="bg-[#18181b] border border-white/5 rounded-[2.5rem] p-8 mb-6">
          {/* Metode Pembayaran */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <img src={selectedMethod.img} alt={selectedMethod.name} className="w-12 h-12 object-contain bg-white/10 rounded-xl p-2" />
            <div>
              <p className="text-xs text-zinc-500 font-black uppercase">Metode Pembayaran</p>
              <p className="text-lg font-black">{selectedMethod.name}</p>
            </div>
          </div>

          {/* Jumlah Transfer */}
          <div className="text-center mb-8">
            <p className="text-xs text-zinc-500 font-black uppercase mb-2">Total Pembayaran</p>
            <p className="text-4xl font-black text-primary">Rp {transaction.totalPrice.toLocaleString()}</p>
          </div>

          {/* Instruksi Pembayaran */}
          <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-black uppercase mb-4">Instruksi Pembayaran</h3>
            
            {/* QRIS: Tampilkan gambar QR */}
            {selectedMethod.id === "qris" && selectedMethod.qrImage && (
              <div className="text-center mb-6">
                <img src={selectedMethod.qrImage} alt="QRIS" className="w-48 h-48 object-cover mx-auto rounded-xl" />
                <p className="text-xs text-zinc-500 mt-4">Scan QRIS di atas</p>
              </div>
            )}

            {/* VA/Ewallet: Tampilkan nomor rekening */}
            {selectedMethod.accountNumber && (
              <div className="bg-[#27272a] rounded-xl p-4 mb-6">
                <p className="text-xs text-zinc-500 font-black uppercase mb-2">{selectedMethod.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black">{selectedMethod.accountNumber}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(selectedMethod.accountNumber)}
                    className="text-xs text-primary font-black"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mt-2">a.n. {selectedMethod.accountName}</p>
              </div>
            )}

            <p className="text-xs text-zinc-400 leading-relaxed">{selectedMethod.instructions}</p>
          </div>

          {/* Detail Pesanan */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Game</span>
              <span className="font-bold">{transaction.gameName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Nominal</span>
              <span className="font-bold">{transaction.nominal}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">ID Transaksi</span>
              <span className="font-bold font-mono">{id}</span>
            </div>
          </div>
        </div>

        {/* Tombol Konfirmasi */}
        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all text-sm ${
            isConfirming
              ? "bg-zinc-800 text-zinc-500"
              : "bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-2xl shadow-fuchsia-500/40 hover:scale-[1.02]"
          }`}
        >
          {isConfirming ? "⏳ Mengkonfirmasi..." : "✅ Sudah Bayar, Konfirmasi!"}
        </button>

        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="w-full mt-4 py-3 text-zinc-500 text-xs font-bold uppercase"
        >
          Kembali
        </button>
      </div>
      <Footer />
    </main>
  );
}
