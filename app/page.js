"use client";

import Navbar from "@/components/layout/Navbar";
import HeroCarousel from "@/components/layout/HeroCarousel";
import GameCard from "@/components/ui/GameCard";
import Footer from "@/components/layout/footer";
import { useState } from "react";

const gameList = [
  { id: 1, name: "Mobile Legends", category: "MOBA", image: "/card/mobile-legends.jpg", slug: "mobile-legends" },
  { id: 2, name: "Free Fire", category: "Battle Royale", image: "/card/free-fire.jpg", slug: "free-fire" },
  { id: 3, name: "Genshin Impact", category: "RPG", image: "/card/genshin-impact.jpg", slug: "genshin-impact" },
  { id: 4, name: "Valorant", category: "FPS", image: "/card/valorant.jpg", slug: "valorant" },
  { id: 5, name: "PUBG Mobile", category: "Battle Royale", image: "/card/pubg.jpg", slug: "pubg" },
  { id: 6, name: "Clash Of Clans", category: "Strategy", image: "/card/clash-of-clans.jpg", slug: "clash-of-clans" },
  { id: 7, name: "Clash Royale", category: "Strategy", image: "/card/clash-royale.jpg", slug: "clash-royale" },
  { id: 8, name: "Delta Force", category: "FPS", image: "/card/delta-force.jpg", slug: "delta-force" },
  { id: 9, name: "League Of Legends", category: "MOBA", image: "/card/league-of-legends.jpg", slug: "league-of-legends" },
  { id: 10, name: "Honor Of Kings", category: "MOBA", image: "/card/honor-of-kings.jpg", slug: "honor-of-kings" },
  { id: 11, name: "Call of Duty Mobile", category: "FPS", image: "/card/call-of-duty-mobile.jpg", slug: "call-of-duty-mobile" },
  { id: 12, name: "Arena of Valor", category: "MOBA", image: "/card/arena-of-valor.jpg", slug: "arena-of-valor" },
  { id: 13, name: "Hogwarts Mystery", category: "RPG", image: "/card/hogwarts-mystery.jpg", slug: "hogwarts-mystery" },
  { id: 14, name: "Brawl Stars", category: "Battle Royale", image: "/card/brawl-stars.jpg", slug: "brawl-stars" },
  { id: 15, name: "Black Desert Mobile", category: "RPG", image: "/card/black-desert-mobile.jpg", slug: "black-desert-mobile" },
  { id: 16, name: "Roblox", category: "Sandbox", image: "/card/roblox.jpg", slug: "roblox" },
  { id: 17, name: "Minecraft", category: "Sandbox", image: "/card/minecraft.jpg", slug: "minecraft" },
  { id: 18, name: "FIFA Mobile", category: "Sports", image: "/card/fifa-mobile.jpg", slug: "fifa-mobile" },
  { id: 19, name: "Mobile Legends Adventure", category: "RPG", image: "/card/mobile-legends-adventure.jpg", slug: "mobile-legends-adventure" },
  { id: 20, name: "Rise of Kingdoms", category: "Strategy", image: "/card/rise-of-kingdoms.jpg", slug: "rise-of-kingdoms" },
];

const categories = ["Semua", "MOBA", "Battle Royale", "FPS", "RPG", "Strategy", "Sandbox", "Sports"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredGames = selectedCategory === "Semua"
    ? gameList
    : gameList.filter(game => game.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary-container">
      <Navbar />
      <HeroCarousel />

      <section className="max-w-7xl mx-auto px-6 py-10 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(224,142,254,0.5)]"></span>
            Semua Game
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(224,142,254,0.4)]"
                  : "bg-zinc-900/50 border border-white/10 text-zinc-400 hover:border-primary/50 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">Tidak ada game di kategori ini</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}