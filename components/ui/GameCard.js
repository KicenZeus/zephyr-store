"use client";
import Link from "next/link";

export default function GameCard({ game }) {
  return (
    <Link href={`/order/${game.slug}`}> {/* Pindah ke halaman order sesuai slug game */}
      <div className="group relative bg-surface-container-low/50 backdrop-blur-sm border border-white/5 p-3 rounded-[2rem] hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 shadow-lg">
        
        {/* Image Container */}
        <div className="aspect-[4/5] bg-zinc-800 rounded-[1.5rem] mb-4 overflow-hidden relative z-0">
          <img 
            src={game.image} 
            alt={game.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { e.target.src = "https://placehold.co/400x500/1a1a1a/e08efe?text=" + game.name }}
          />
          
          {/* Hover Overlay Gelap */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Top Up</span>
          </div>
        </div>

        {/* Text Info */}
        <div className="px-2 pb-2">
          <h3 className="font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors truncate">
            {game.name}
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
            {game.category}
          </p>
        </div>

        {/* Badge Icon Kilat (Melayang) */}
        <div className="absolute top-5 right-5 p-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z"/></svg>
        </div>
      </div>
    </Link>
  );
}