"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function RankBadge({ rank }) {
  const colors = {
    1: "bg-gradient-to-br from-yellow-400 to-orange-500",
    2: "bg-gradient-to-br from-zinc-300 to-zinc-500",
    3: "bg-gradient-to-br from-amber-600 to-yellow-800",
  };

  const badgeColor = colors[rank] || "bg-zinc-700";

  return (
    <div className={`w-10 h-10 rounded-2xl ${badgeColor} flex items-center justify-center font-black text-lg shadow-lg`}>
      {rank}
    </div>
  );
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(10);

      if (!error && data) {
        const withRank = data.map((player, index) => ({
          ...player,
          rank: index + 1,
          avatar: player.name?.charAt(0).toUpperCase() || "?",
        }));
        setLeaderboardData(withRank);
      }
      setLoading(false);
    };
    fetchLeaderboard();
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
          <h1 className="text-3xl font-black italic mb-2">Leaderboard</h1>
          <p className="text-zinc-500 text-sm">Top Pembeli Teraktif!</p>
        </div>

        {/* Podium for Top 3 */}
        {leaderboardData.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">
            {[2, 1, 3].map((rank) => {
              const player = leaderboardData.find((p) => p.rank === rank);
              if (!player) return null;
              const heights = {
                1: "h-40",
                2: "h-32",
                3: "h-28",
              };

              return (
                <div key={rank} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white mb-3 shadow-2xl shadow-fuchsia-500/30">
                    {player.avatar}
                  </div>
                  <p className="text-sm font-black text-white">{player.name}</p>
                  <div className={`${heights[rank]} bg-gradient-to-t from-zinc-800 to-zinc-900 border border-white/10 rounded-t-3xl w-28 flex flex-col items-center justify-end pb-3`}>
                    <RankBadge rank={rank} />
                    <p className="text-[10px] text-yellow-400 font-black mt-2">{(player.points || 0).toLocaleString()} Pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of the leaderboard */}
        <div className="space-y-3">
          {leaderboardData.slice(3).map((player) => (
            <div
              key={player.id}
              className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all"
            >
              <RankBadge rank={player.rank} />
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-black text-white">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className="font-black text-white">{player.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-primary">{(player.points || 0).toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Poin</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
