// components/home/Services.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Service } from '@/models/types';
import { supabase } from '@/utils/supabase';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const fetchServices = async () => {
      try {
        // Ambil data dari Supabase
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Konversi format data
        const servicesData = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.image_url
        })) as Service[];
        
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchServices();
    }
  }, [isMounted]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Berbagai pilihan layanan untuk semua jenis sepatu</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(index => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="relative h-48 w-full">
                  <Image 
                    src={service.imageUrl} 
                    alt={service.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">Rp {service.price.toLocaleString('id-ID')}</span>
                    <button className="text-primary hover:text-secondary font-medium">Detail</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;