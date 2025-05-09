// components/home/Booking.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { Service } from '@/models/types';
import { supabase } from '@/utils/supabase';

// Generate random order number
const generateOrderNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Tambahkan data durasi proses untuk setiap layanan
const serviceDurations: { [key: string]: string } = {
  'Cuci Dasar': '3 hari',
  'Cuci Premium': '1 hari',
  'Repaint & Restoration': '1 bulan'
};

const Booking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceId: '',
    date: '',
    address: ''
  });

  useEffect(() => {
    setIsMounted(true);
    
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update durasi layanan saat service dipilih
    if (name === 'serviceId' && value) {
      const selectedService = services.find(service => service.id === value);
      if (selectedService) {
        setSelectedServiceDuration(serviceDurations[selectedService.name] || '');
      } else {
        setSelectedServiceDuration('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.serviceId || !formData.date || !formData.address) {
      setError('Harap isi semua field yang diperlukan');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const orderNumber = generateOrderNumber();
      
      // Insert booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            order_number: orderNumber,
            name: formData.name,
            phone: formData.phone,
            service_id: formData.serviceId,
            date: formData.date,
            address: formData.address,
            status: 'Order Diterima'
          }
        ])
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      
      // Insert initial status
      const { error: statusError } = await supabase
        .from('statuses')
        .insert([
          {
            booking_id: booking.id,
            status: 'Order Diterima',
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (statusError) throw statusError;
      
      // Dapatkan nama layanan untuk pesan sukses
      const selectedService = services.find(service => service.id === formData.serviceId);
      const serviceName = selectedService ? selectedService.name : 'Layanan tidak ditemukan';
      const serviceDuration = selectedServiceDuration || 'Tidak diketahui';
      
      setSuccess(`Terima kasih ${formData.name}! Booking layanan ${serviceName} berhasil dengan nomor order ${orderNumber}. Estimasi waktu proses: ${serviceDuration}. Kami akan menghubungi via WhatsApp.`);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        serviceId: '',
        date: '',
        address: ''
      });
      setSelectedServiceDuration('');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-primary p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Booking Layanan</h2>
              <p className="mb-6">Isi form berikut untuk memesan layanan cuci sepatu kami. Tim kami akan segera menghubungi Anda untuk konfirmasi.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <i className="fas fa-phone-alt mr-3"></i>
                  <span>+62 812 3456 7890</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-3"></i>
                  <span>hello@sikacling.id</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-3"></i>
                  <span>Jl. Contoh No. 123, Jakarta</span>
                </div>
              </div>
              
              {/* Informasi Durasi Layanan */}
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Estimasi Waktu Proses:</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Cuci Dasar:</span>
                    <span className="font-medium">3 hari</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cuci Premium:</span>
                    <span className="font-medium">1 hari</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Repaint & Restoration:</span>
                    <span className="font-medium">1 bulan</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="serviceId" className="block text-gray-700 font-medium mb-2">Jenis Layanan</label>
                  <select 
                    id="serviceId" 
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Pilih Layanan</option>
                    {loading ? (
                      <option disabled>Loading...</option>
                    ) : (
                      services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} (Rp {service.price.toLocaleString('id-ID')})
                        </option>
                      ))
                    )}
                  </select>
                  
                  {selectedServiceDuration && (
                    <p className="mt-2 text-sm text-primary font-medium">
                      Estimasi waktu proses: {selectedServiceDuration}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Tanggal Pickup</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Alamat Pickup</label>
                  <textarea 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3} 
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition"
                  disabled={submitting}
                >
                  {submitting ? 'Memproses...' : 'Pesan Sekarang'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;