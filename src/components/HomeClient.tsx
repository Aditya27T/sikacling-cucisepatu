// components/HomeClient.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Services from '@/components/home/Services';
import Tracking from '@/components/home/Tracking';
import Booking from '@/components/home/Booking';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import Footer from '@/components/layout/Footer';
import FontAwesomeScript from '@/components/FontAwesomeScript';

export default function HomeClient() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Smooth scroll for navigation
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FontAwesomeScript />
      <Header />
      <main>
        <Hero />
        <Features />
        <Services />
        <Tracking />
        <Booking />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}