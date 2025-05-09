import React from 'react';
import Link from 'next/link';

const CTA: React.FC = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Siap Membersihkan Sepatu Anda?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Pesan sekarang dan dapatkan sepatu bersih seperti baru dengan proses profesional kami.</p>
        <Link href="#booking" className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition">
          Booking Sekarang
        </Link>
      </div>
    </section>
  );
};

export default CTA;