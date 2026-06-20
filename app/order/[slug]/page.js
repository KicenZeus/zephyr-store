"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/client";

import { getGameData, paymentMethods } from "./_libs/data-service";
import FormAccount from "./_components/FormAccount";
import PaymentAccordion from "./_components/PaymentAccordion";
import Web3Payment from "./_components/Web3Payment";

export default function OrderPage() {
  const { slug } = useParams();
  const router = useRouter();
  const gameData = useMemo(() => getGameData(slug), [slug]);

  const [activeCategory, setActiveCategory] = useState(Object.keys(gameData.denominations)[0]);
  const [selectedNominal, setSelectedNominal] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openSection, setOpenSection] = useState("ewallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState("web3"); // "web3" or "traditional"

  const handlePayment = async () => {
    if (!selectedNominal || !selectedPayment) return;

    // Cek login hanya saat mau bayar
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Simpan state order sementara biar gak hilang setelah login
      sessionStorage.setItem(
        "pending_order",
        JSON.stringify({ slug, selectedNominal, selectedPayment })
      );
      router.push("/login?redirect=" + encodeURIComponent(`/order/${slug}`));
      return;
    }

    setIsProcessing(true);

    try {
      // Insert transaction to database with status "pending"
      const transactionId = `TRX-${Date.now()}`;
      const { error } = await supabase.from("transactions").insert({
        id: transactionId,
        user_id: user.id,
        game: gameData.name,
        item: selectedItem.amount,
        amount: totalPrice,
        status: "pending", // status pending dulu
        payment_method: selectedMethod.name,
      });

      if (!error) {
        try {
          // Step 1: Pastikan profile user ada di database!
          let { data: currentProfile, error: profileGetError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          
          if (profileGetError || !currentProfile) {
            console.log('Profile not found, creating one...');
            const { error: createProfileError } = await supabase.from('profiles').insert({
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email,
              points: 0,
            });
            
            if (createProfileError) {
              console.error('❌ Error creating profile:', createProfileError);
              throw createProfileError;
            }
          }
          
          // Simpan data transaksi ke session storage untuk halaman payment
          sessionStorage.setItem(`payment_${transactionId}`, JSON.stringify({
            gameName: gameData.name,
            nominal: selectedItem.amount,
            totalPrice: totalPrice,
            selectedPayment: selectedPayment
          }));
          
          // Arahkan ke halaman menunggu pembayaran
          router.push(`/payment/${transactionId}`);
        } catch (err) {
          console.error("Error in payment flow:", err);
          let errorText = "Gagal memproses pembayaran";
          if (typeof err === 'object' && err !== null) {
            if (err.message) errorText = err.message;
            else if (err.code) errorText = `Error code: ${err.code}`;
            else errorText = JSON.stringify(err, null, 2);
          } else if (typeof err === 'string') {
            errorText = err;
          }
          alert("❌ Gagal memproses pembayaran: " + errorText);
        }
      } else {
        console.error("Supabase error:", error);
        let errorText = "Gagal memproses pembayaran";
        if (typeof error === 'object' && error !== null) {
          if (error.message) errorText = error.message;
          else if (error.code) errorText = `Error code: ${error.code}`;
          else errorText = JSON.stringify(error, null, 2);
        } else if (typeof error === 'string') {
          errorText = error;
        }
        alert("❌ Gagal memproses pembayaran: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan: " + (err.message || err));
    }

    setIsProcessing(false);
  };

  const selectedItem = gameData.denominations[activeCategory]?.find(
    (i) => i.id === selectedNominal
  );
  const selectedMethod = paymentMethods
    .flatMap((g) => g.options)
    .find((o) => o.id === selectedPayment);
  const totalPrice =
    selectedItem && selectedMethod
      ? selectedItem.price + selectedMethod.fee
      : null;

  const canCheckout = selectedNominal && selectedPayment;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
        <img
          src={`/card/${slug}-banner.jpg`}
          className="w-full h-full object-cover opacity-40"
          onError={(e) => (e.target.src = `/card/${slug}.jpg`)}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* KOLOM KIRI: INFO GAME */}
          <div className="lg:col-span-4">
            <div className="bg-[#18181b]/90 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 sticky top-24">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden -mt-24 mb-6 border-4 border-[#18181b] shadow-2xl">
                <img
                  src={`/card/${slug}.jpg`}
                  className="w-full h-full object-cover"
                  alt={gameData.name}
                />
              </div>
              <h1 className="text-2xl font-black uppercase italic">{gameData.name}</h1>
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-6">
                {gameData.developer}
              </p>
              <div className="space-y-2">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-primary text-[10px] font-black uppercase">
                  ⚡ Konfirmasi Instan
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-zinc-400 text-[10px] font-black uppercase">
                  🛡️ Aman & Legal
                </div>
              </div>

              {/* Ringkasan Order — muncul kalau semua sudah dipilih */}
              {canCheckout && totalPrice && (
                <div className="mt-4 p-4 bg-zinc-900 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-500">Ringkasan Order</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">{selectedItem.amount}</span>
                    <span>Rp {selectedItem.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Biaya {selectedMethod.name}</span>
                    <span>Rp {selectedMethod.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: FORM ORDER */}
          <div className="lg:col-span-8 space-y-6">

            {/* Step 1: Data Akun */}
            <FormAccount />

            {/* Step 2: Pilih Nominal */}
            <section className="bg-[#18181b] border border-white/5 rounded-[2.5rem] p-10">
              <div className="bg-[#27272a] px-8 py-5 flex items-center gap-4 -mx-10 -mt-10 mb-8 rounded-t-[2.5rem]">
                <span className="w-8 h-8 bg-primary text-black rounded-xl flex items-center justify-center font-black text-sm">
                  2
                </span>
                <h2 className="text-sm font-black uppercase tracking-widest">Pilih Nominal</h2>
              </div>

              {/* Tab Kategori */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {Object.keys(gameData.denominations).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedNominal(null);
                    }}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-primary text-black"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid Nominal */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gameData.denominations[activeCategory].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedNominal(item.id)}
                    className={`p-6 rounded-[2rem] border text-left transition-all ${
                      selectedNominal === item.id
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(224,142,254,0.1)]"
                        : "bg-zinc-900 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-black uppercase mb-1 ${
                        selectedNominal === item.id ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {item.amount}
                    </p>
                    <p className="text-primary text-[11px] font-black">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Payment Mode Toggle */}
            <section className="bg-[#18181b] border border-white/5 rounded-[2.5rem] p-6">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setPaymentMode("web3")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all border ${
                    paymentMode === "web3"
                      ? "bg-primary text-black border-primary"
                      : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                  }`}
                >
                  ⚡ Web3 (MetaMask)
                </button>
                <button
                  onClick={() => setPaymentMode("traditional")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all border ${
                    paymentMode === "traditional"
                      ? "bg-primary text-black border-primary"
                      : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                  }`}
                >
                  💳 Traditional
                </button>
              </div>

              {/* Step 3: Metode Pembayaran */}
              {paymentMode === "traditional" && (
                <PaymentAccordion
                  methods={paymentMethods}
                  openSection={openSection}
                  setOpenSection={setOpenSection}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                />
              )}

              {/* Web3 Payment */}
              {paymentMode === "web3" && selectedNominal && (
                <Web3Payment
                  gameSlug={slug}
                  gameName={gameData.name}
                  packageName={selectedItem?.amount}
                  priceInIDR={selectedItem?.price}
                  onSuccess={() => {
                    alert("✅ Pembayaran berhasil via Web3!");
                    router.push("/transactions");
                  }}
                />
              )}
            </section>

            {/* Traditional Payment Button */}
            {paymentMode === "traditional" && (
              <button
                onClick={handlePayment}
                disabled={!canCheckout || isProcessing}
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all text-sm ${
                  canCheckout && !isProcessing
                    ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-2xl shadow-fuchsia-500/40 hover:scale-[1.02] active:scale-95"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                }`}
              >
                {isProcessing
                  ? "⏳ Memproses Pembayaran..."
                  : canCheckout
                  ? `Bayar Rp ${totalPrice?.toLocaleString() ?? "..."}`
                  : "Lengkapi Data Diatas"}
              </button>
            )}

            {/* Hint kalau belum login */}
            {canCheckout && (
              <p className="text-center text-[10px] text-zinc-600">
                Kamu akan diminta login sebelum melanjutkan pembayaran
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}