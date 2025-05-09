import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faShoePrints }from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faShoePrints} className="text-2xl text-primary mr-2" />
              <span className="text-xl font-bold">Sika<span className="text-primary">Cling</span></span>
            </div>
            <p className="text-gray-400">Jasa cuci sepatu premium dengan layanan lengkap dan hasil maksimal.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"> <FontAwesomeIcon icon={faInstagram} className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-white"> <FontAwesomeIcon icon={faFacebook} className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-white"> <FontAwesomeIcon icon={faWhatsapp} className="text-xl" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Cuci Dasar</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Cuci Premium</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Repaint & Restoration</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Pickup & Delivery</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Tentang Kami</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Karir</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Kontak</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 mr-3" />
                <span>Jl. Contoh No. 123, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faPhoneAlt} className="mt-1 mr-3" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faEnvelope} className="mt-1 mr-3" />
                <span>hello@sikacling.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SikaCling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;