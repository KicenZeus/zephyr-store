"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const flashSaleItems = [
  {
    id: 1,
    game: "Mobile Legends",
    item: "86 Diamonds",
    originalPrice: 25000,
    salePrice: 17500,
    discount: 30,
    image: "/card/mobile-legends.jpg",
    endTime: Date.now() + 3600000,
    sold: 450,
    stock: 1000,
    slug: "mobile-legends",
  },
  {
    id: 2,
    game: "Free Fire",
    item: "100 Diamonds",
    originalPrice: 15000,
    salePrice: 9900,
    discount: 34,
    image: "/card/free-fire.jpg",
    endTime: Date.now() + 7200000,
    sold: 890,
    stock: 500,
    slug: "free-fire",
  },
  {
    id: 3,
    game: "Genshin Impact",
    item: "60 Crystals",
    originalPrice: 18000,
    salePrice: 12600,
    discount: 30,
    image: "/card/genshin-impact.jpg",
    endTime: Date.now() + 1800000,
    sold: 230,
    stock: 300,
    slug: "genshin-impact",
  },
  {
    id: 4,
    game: "Valorant",
    item: "475 VP",
    originalPrice: 55000,
    salePrice: 41250,
    discount: 25,
    image: "/card/valorant.jpg",
    endTime: Date.now() + 10800000,
    sold: 156,
    stock: 200,
    slug: "valorant",
  },
  {
    id: 5,
    game: "PUBG Mobile",
    item: "300 UC",
    originalPrice: 55000,
    salePrice: 38500,
    discount: 30,
    image: "/card/pubg.jpg",
    endTime: Date.now() + 5400000,
    sold: 320,
    stock: 400,
    slug: "pubg",
  },
  {
    id: 6,
    game: "Clash Of Clans",
    item: "500 Gems",
    originalPrice: 30000,
    salePrice: 21000,
    discount: 30,
    image: "/card/clash-of-clans.jpg",
    endTime: Date.now() + 3600000,
    sold: 180,
    stock: 250,
    slug: "clash-of-clans",
  },
  {
    id: 7,
    game: "Clash Royale",
    item: "80 Gems",
    originalPrice: 18000,
    salePrice: 12600,
    discount: 30,
    image: "/card/clash-royale.jpg",
    endTime: Date.now() + 7200000,
    sold: 250,
    stock: 350,
    slug: "clash-royale",
  },
  {
    id: 8,
    game: "Honor Of Kings",
    item: "300 Vouchers",
    originalPrice: 60000,
    salePrice: 42000,
    discount: 30,
    image: "/card/honor-of-kings.jpg",
    endTime: Date.now() + 10800000,
    sold: 400,
    stock: 500,
    slug: "honor-of-kings",
  },
];

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;
      if (difference > 0) {
        setTimeLeft(difference);
      } else {
        setTimeLeft(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex gap-2">
      {[hours, minutes, seconds].map((value, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-red-500/30">
            {String(value).padStart(2, "0")}
          </div>
          <span className="text-[10px] text-zinc-500 font-bold mt-1">
            {["JAM", "MENIT", "DETIK"][i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function FlashSaleCard({ item }) {
  return (
    <Link href={`/order/${item.slug}`} className="group">
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/30 transition-all hover:-translate-y-1">
        <div className="relative">
          <img src={item.image} alt={item.game} className="w-full h-44 object-cover" />
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            -{item.discount}%
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-yellow-400">⏱️ Cepat!</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">{item.game}</p>
          <h3 className="text-sm font-black text-white mt-1">{item.item}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-yellow-400">
              Rp {item.salePrice.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 line-through">
              Rp {item.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${(item.sold / item.stock) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-zinc-500 font-bold">Terjual {item.sold}</span>
              <span className="text-[9px] text-yellow-400 font-black">Sisa {item.stock - item.sold}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FlashSalePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-6 py-3 mb-4">
            <span className="text-2xl animate-pulse">⚡</span>
            <span className="text-sm font-black uppercase tracking-widest text-yellow-400">FLASH SALE</span>
          </div>
          <h1 className="text-4xl font-black italic mb-4">
            Diskon <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Hingga 50%</span>!
          </h1>
          <p className="text-zinc-500 text-sm mb-6">Jangan sampai kehabisan, stok terbatas!</p>
          <CountdownTimer endTime={Date.now() + 3600000 * 24} />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleItems.map((item) => (
            <FlashSaleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
