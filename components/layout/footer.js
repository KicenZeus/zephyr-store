import React from 'react';

const paymentMethods = [
    { name: 'BCA', src: '/payments/bca.png' },
    { name: 'BRI', src: '/payments/bri.png' },
    { name: 'QRIS', src: '/payments/qris.png' },
    { name: 'DANA', src: '/payments/dana.png' },
    { name: 'OVO', src: '/payments/ovo.png' },
    { name: 'ShopeePay', src: '/payments/shopeepay.png' },
];

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Glow Effect di Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 tracking-tighter mb-4">
              Zephyr.
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6">
              Platform top-up game tercepat dan terpercaya di Indonesia. Otomatis, aman, dan tersedia 24/7 untuk mendukung gaya hidup digitalmu.
            </p>
            <div className="flex gap-4">
              {/* Social Media Icons (Placeholders) */}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors cursor-pointer border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors cursor-pointer border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
            </div>
          </div>

          {/* Kolom 2: Layanan */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Top Up Mobile Legends</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Voucher Valorant</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Genshin Impact Genesis</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Flash Sale</a></li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Cek Transaksi</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Hubungi Kami (WhatsApp)</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-zinc-500 text-xs hover:text-primary transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          {/* Kolom 4: Metode Pembayaran */}
            <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Payment</h4>
            <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((pay) => (
                <div 
                    key={pay.name} 
                    className="bg-white/5 h-10 rounded-lg border border-white/5 flex items-center justify-center p-2 hover:bg-white/10 hover:border-primary/30 transition-all group"
                >
                    <img 
                    src={pay.src} 
                    alt={pay.name} 
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" 
                    onError={(e) => { e.target.src = "https://placehold.co/100x40?text=" + pay.name }}
                    />
                </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-zinc-600 italic">Mendukung E-Wallet, QRIS, & Transfer Bank</p>
    </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Zephyrus Concierge. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
             <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Powered by <span className="text-primary">Zephyrus</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}