// src/components/Home/HeroSlider.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  { title: 'Summer Drop', subtitle: 'Fresh fits, bold styles', bg: 'from-orange-500 to-pink-600' },
  { title: 'Streetwear Sale', subtitle: 'Up to 40% off', bg: 'from-purple-600 to-indigo-600' },
  { title: 'New Hoodies', subtitle: 'Cozy. Bold. You.', bg: 'from-teal-600 to-cyan-600' },
];

const HeroSlider = () => (
  <div className="relative h-[60vh] overflow-hidden">
    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} loop className="h-full">
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <div className={`h-full bg-gradient-to-r ${s.bg} flex items-center justify-center text-white`}>
            <div className="text-center px-6 max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">{s.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{s.subtitle}</p>
              <Link to="/shop" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
                Shop Now
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default HeroSlider;