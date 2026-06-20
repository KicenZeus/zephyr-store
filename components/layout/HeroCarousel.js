"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroCarousel() {
  const banners = [
    { id: 1, image: "/banner-1.jpg" }, // Pastikan filenya ada di folder public
    { id: 2, image: "/banner-2.jpg" },
    { id: 3, image: "/banner-3.jpg" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-37 mb-10">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{
          delay: 5000, // Gw bikin agak lama (5 detik) biar user sempet baca tulisan di gambarnya
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl shadow-primary/5"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full aspect-[21/9] md:aspect-[5/2] bg-zinc-900 cursor-pointer">
              {/* Gambar Full Tanpa Overlay Teks */}
              <img 
                src={banner.image} 
                alt="Promotion Banner" 
                className="w-full h-full object-cover" 
              />
              
              {/* Efek kilau halus pas di-hover biar kerasa interaktif */}
              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Styling Titik Pagination biar masuk ke tema ElectricVoid */}
      <style jsx global>{`
        .swiper-pagination-bullet { 
          background: rgba(255, 255, 255, 0.2) !important; 
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active { 
          background: #e08efe !important; /* Warna primary lu */
          width: 24px !important; 
          border-radius: 10px !important; 
        }
        .swiper-button-next, .swiper-button-prev { 
          color: #e08efe !important; 
          transform: scale(0.6);
        }
      `}</style>
    </div>
  );
}