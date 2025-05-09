// components/admin/ImportDataClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function ImportDataClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  // Seed functions
  const seedServices = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      // Sample services data
      const services = [
        {
          name: 'Cuci Dasar',
          price: 25000,
          description: 'Pembersihan dasar bagian luar sepatu dengan bahan khusus.',
          image_url: '/services/cuci-dasar.jpg'
        },
        {
          name: 'Cuci Premium',
          price: 50000,
          description: 'Pembersihan menyeluruh luar dalam termasuk deodorisasi.',
          image_url: '/services/cuci-premium.jpg'
        },
        {
          name: 'Repaint & Restoration',
          price: 150000,
          description: 'Perbaikan warna dan kondisi sepatu seperti baru.',
          image_url: '/services/repaint.jpg'
        }
      ];
      
      const { error: insertError } = await supabase
        .from('services')
        .insert(services);
      
      if (insertError) throw insertError;
      
      setResult('Data layanan berhasil diimpor!');
    } catch (err: any) {
      console.error('Error seeding services:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const seedTestimonials = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      // Sample testimonials data
      const testimonials = [
        {
          name: 'Andi Wijaya',
          image: '/testimonials/person1.jpg',
          rating: 5,
          text: 'Sepatu sneaker putih saya yang sudah kuning kembali bersih seperti baru. Proses trackingnya juga sangat membantu!'
        },
        {
          name: 'Budi Santoso',
          image: '/testimonials/person2.jpg',
          rating: 5,
          text: 'Pelayanan cepat dan hasilnya memuaskan. Sekarang semua sepatu koleksi saya rutin dicuci di sini.'
        },
        {
          name: 'Citra Dewi',
          image: '/testimonials/person3.jpg',
          rating: 4.5,
          text: 'Sangat praktis bisa booking via website dan dijemput di rumah. Hasil cuciannya bersih dan wangi.'
        }
      ];
      
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert(testimonials);
      
      if (insertError) throw insertError;
      
      setResult('Data testimoni berhasil diimpor!');
    } catch (err: any) {
      console.error('Error seeding testimonials:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const seedAll = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      await seedServices();
      await seedTestimonials();
      
      setResult('Semua data berhasil diimpor!');
    } catch (err: any) {
      console.error('Error seeding all data:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Import Data</h1>
        <p className="text-gray-600">Impor data awal untuk aplikasi SikaCling</p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Pilih Data untuk Diimpor</h2>
        </div>
        
        <div className="p-6">
          <p className="mb-6 text-gray-600">
            Perhatian: Proses import ini akan menambahkan data ke dalam database Anda. Pastikan untuk tidak mengimport data yang sama berulang kali untuk menghindari duplikasi.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Data Layanan</h3>
              <p className="text-sm text-gray-600 mb-4">
                Impor data layanan dasar seperti Cuci Dasar, Cuci Premium, dan Repaint & Restoration.
              </p>
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
                onClick={seedServices}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Import Layanan'}
              </button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Data Testimoni</h3>
              <p className="text-sm text-gray-600 mb-4">
                Impor data testimoni pelanggan untuk ditampilkan di halaman utama website.
              </p>
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
                onClick={seedTestimonials}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Import Testimoni'}
              </button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Semua Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Impor semua data sekaligus (layanan dan testimoni).
              </p>
              <button 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md disabled:opacity-50"
                onClick={seedAll}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Import Semua Data'}
              </button>
            </div>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-600">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}