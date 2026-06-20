"use client";

import { useState } from "react";

export default function FormAccount() {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");

  return (
    <section className="bg-[#18181b] border border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="bg-[#27272a] px-8 py-5 flex items-center gap-4">
        <span className="w-8 h-8 bg-primary text-black rounded-xl flex items-center justify-center font-black text-sm">1</span>
        <h2 className="text-sm font-black uppercase tracking-widest">Data Akun</h2>
      </div>
      <div className="p-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="bg-zinc-900 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="bg-zinc-900 border border-white/10 p-4 rounded-2xl text-sm focus:border-primary outline-none transition-colors"
            placeholder="Zone ID"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
          />
        </div>
        <p className="text-xs text-zinc-500">* Masukkan data akun kamu untuk pengiriman item</p>
      </div>
    </section>
  );
}
