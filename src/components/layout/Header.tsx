// components/layout/Header.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    // Return placeholder dengan struktur yang sama
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <nav className="hidden md:flex space-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-20 h-4 bg-gray-200 rounded"></div>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="w-36 h-10 bg-gray-200 rounded-lg"></div>
            <div className="md:hidden w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-shoe-prints text-2xl text-primary mr-2"></i>
          <span className="text-xl font-bold text-dark">Sika<span className="text-primary">Cling</span></span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link href="#home" className="font-medium hover:text-primary transition">Beranda</Link>
          <Link href="#services" className="font-medium hover:text-primary transition">Layanan</Link>
          <Link href="#tracking" className="font-medium hover:text-primary transition">Tracking</Link>
          <Link href="#services" className="font-medium hover:text-primary transition">Harga</Link>
          <Link href="#testimonials" className="font-medium hover:text-primary transition">Testimoni</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="#booking" className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition">
            Booking Sekarang
          </Link>
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="#home" className="font-medium hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
              <Link href="#services" className="font-medium hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Layanan</Link>
              <Link href="#tracking" className="font-medium hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Tracking</Link>
              <Link href="#services" className="font-medium hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Harga</Link>
              <Link href="#testimonials" className="font-medium hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Testimoni</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;