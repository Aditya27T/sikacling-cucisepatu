import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faSearchLocation, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kenapa Memilih Kami?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Kami memberikan pengalaman terbaik dalam perawatan sepatu Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card bg-gray-50 p-8 rounded-xl transition duration-300">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faTruck} className="text-2xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Pickup & Delivery</h3>
            <p className="text-gray-600">Kami jemput dan antar sepatu Anda sampai depan rumah. Gratis biaya transport untuk area tertentu.</p>
          </div>
          <div className="feature-card bg-gray-50 p-8 rounded-xl transition duration-300">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faSearchLocation} className="text-2xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
            <p className="text-gray-600">Lacak status cucian sepatu Anda secara real-time melalui website atau aplikasi kami.</p>
          </div>
          <div className="feature-card bg-gray-50 p-8 rounded-xl transition duration-300">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Garansi Kepuasan</h3>
            <p className="text-gray-600">Tidak puas dengan hasil cucian? Kami akan cuci ulang atau kembalikan uang Anda.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;