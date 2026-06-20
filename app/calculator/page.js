"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import { getGameData } from "../order/[slug]/_libs/data-service";

const games = [
  { id: "mobile-legends", name: "Mobile Legends", currency: "Diamonds" },
  { id: "free-fire", name: "Free Fire", currency: "Diamonds" },
  { id: "genshin-impact", name: "Genshin Impact", currency: "Primogems" },
  { id: "valorant", name: "Valorant", currency: "VP" },
  { id: "pubg", name: "PUBG Mobile", currency: "UC" },
  { id: "clash-of-clans", name: "Clash of Clans", currency: "Gems" },
  { id: "clash-royale", name: "Clash Royale", currency: "Gems" },
  { id: "delta-force", name: "Delta Force", currency: "Coins" },
  { id: "league-of-legends", name: "League of Legends", currency: "RP" },
  { id: "honor-of-kings", name: "Honor of Kings", currency: "Vouchers" },
];

export default function CalculatorPage() {
  const [selectedGame, setSelectedGame] = useState("mobile-legends");
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [totalRupiah, setTotalRupiah] = useState(0);

  const gameData = getGameData(selectedGame);

  // Get all available denominations for selected game
  const allDenoms = Object.values(gameData.denominations).flat();

  const calculateTotal = (amount) => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTotalRupiah(0);
      return;
    }

    // Calculate cheapest way by using largest denominations first
    let remaining = numAmount;
    let total = 0;

    // Sort denominations descending by amount
    const sorted = [...allDenoms].sort((a, b) => {
      const aNum = parseInt(a.amount.split(" ")[0]);
      const bNum = parseInt(b.amount.split(" ")[0]);
      return bNum - aNum;
    });

    for (const denom of sorted) {
      const denomAmount = parseInt(denom.amount.split(" ")[0]);
      while (remaining >= denomAmount) {
        total += denom.price;
        remaining -= denomAmount;
      }
    }

    setTotalRupiah(total);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic mb-2">Kalkulator Top Up</h1>
          <p className="text-zinc-500 text-sm">Hitung berapa rupiah untuk jumlah mata uang game yang kamu inginkan!</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Game Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 block">Pilih Game</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    setSelectedGame(game.id);
                    setCurrencyAmount("");
                    setTotalRupiah(0);
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedGame === game.id
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-zinc-800 border-white/10 hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold">{game.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 block">
              Jumlah {games.find(g => g.id === selectedGame)?.currency}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Contoh: 100"
              value={currencyAmount}
              onChange={(e) => {
                setCurrencyAmount(e.target.value);
                calculateTotal(e.target.value);
              }}
              className="w-full bg-zinc-950 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Result */}
          <div className="bg-zinc-950 rounded-2xl p-6 text-center">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Perkiraan Total Harga</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">
              {totalRupiah > 0 ? `Rp ${totalRupiah.toLocaleString()}` : "-"}
            </p>
          </div>

          {/* Available Denominations */}
          <div>
            <p className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3">Denominasi Tersedia</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allDenoms.map((denom, i) => (
                <div key={i} className="bg-zinc-800 border border-white/10 rounded-2xl p-3">
                  <p className="text-xs font-bold">{denom.amount}</p>
                  <p className="text-primary text-xs font-black mt-1">Rp {denom.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
