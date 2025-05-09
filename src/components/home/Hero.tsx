import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero-gradient text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sepatu Bersih, <span className="text-accent">Hati Senang</span></h1>
          <p className="text-xl mb-8">Layanan cuci sepatu profesional dengan proses higienis dan hasil maksimal. Pesan online, lacak progress, dan dapatkan sepatu bersih seperti baru!</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="#booking" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-center transition">
              Booking Sekarang
            </Link>
            <Link href="#services" className="border-2 border-white hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-bold text-center transition">
              Lihat Layanan
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
            <Image 
              src="/assets/heroimage.png"
              alt="Sepatu bersih hasil cuci profesional" 
              fill
              className="rounded-xl shadow-2xl object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;