"use client";

import Navbar from "@/components/layout/Navbar";
import HeroCarousel from "@/components/layout/HeroCarousel";
import GameCard from "@/components/ui/GameCard";
import Footer from "@/components/layout/footer";

const gameList = [
  { id: 1, name: "Mobile Legends", category: "Mobile", image: "/card/mobile-legends.jpg", slug: "mobile-legends" },
  { id: 2, name: "Free Fire", category: "Mobile", image: "/card/free-fire.jpg", slug: "free-fire" },
  { id: 3, name: "Genshin Impact", category: "PC/Mobile", image: "/card/genshin-impact.jpg", slug: "genshin-impact" },
  { id: 4, name: "Valorant", category: "PC", image: "/card/valorant.jpg", slug: "valorant" },
  { id: 5, name: "PUBG Mobile", category: "Mobile", image: "/card/pubg.jpg", slug: "pubg" },
  { id: 6, name: "Clash Of Clans", category: "Mobile", image: "/card/clash-of-clans.jpg", slug: "clash-of-clans" },
  { id: 7, name: "Clash Royale", category: "Mobile", image: "/card/clash-royale.jpg", slug: "clash-royale" },
  { id: 8, name: "Delta Force", category: "PC/Mobile", image: "/card/delta-force.jpg", slug: "delta-force" },
  { id: 9, name: "League Of Legends", category: "Mobile", image: "/card/league-of-legends.jpg", slug: "league-of-legends" },
  { id: 10, name: "Honor Of Kings", category: "Mobile", image: "/card/honor-of-kings.jpg", slug: "honor-of-kings" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary-container">
      <Navbar />
      <HeroCarousel />

      <section className="max-w-7xl mx-auto px-6 py-10 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(224,142,254,0.5)]"></span>
            Populer Sekarang
          </h2>
          <button className="text-primary text-sm font-semibold hover:underline">Lihat Semua</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {gameList.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}