// components/home/Tracking.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Status } from '@/models/types';

const Tracking: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<{ statuses: Status[], progress: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }

  const handleTracking = async () => {
    if (!orderNumber) {
      setError('Silakan masukkan nomor order Anda');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cari booking berdasarkan order number
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
      
      if (bookingError) {
        if (bookingError.code === 'PGRST116') {
          // No rows returned
          setError('Nomor order tidak ditemukan');
          setTrackingData(null);
          setLoading(false);
          return;
        }
        throw bookingError;
      }
      
      // Ambil status tracking
      const { data: statusesData, error: statusesError } = await supabase
        .from('statuses')
        .select('*')
        .eq('booking_id', bookingData.id)
        .order('timestamp', { ascending: true });
      
      if (statusesError) throw statusesError;
      
      // Convert to correct format
      const statuses = statusesData.map(item => ({
        id: item.id,
        bookingId: item.booking_id,
        status: item.status,
        timestamp: new Date(item.timestamp)
      }));
      
      // Calculate progress based on number of statuses completed
      const totalStatusSteps = 4; // Order Diterima, Dalam Proses Cuci, Siap Diantar, Selesai
      const progress = Math.min(Math.round((statuses.length / totalStatusSteps) * 100), 100);
      
      setTrackingData({ statuses, progress });
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // All possible statuses in order
  const allStatuses = [
    'Order Diterima',
    'Dalam Proses Cuci',
    'Siap Diantar',
    'Selesai'
  ];

  return (
    <section id="tracking" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl font-bold mb-6">Lacak Order Anda</h2>
            <p className="text-gray-600 mb-8">Masukkan nomor order Anda untuk melihat status terkini dari proses pencucian sepatu.</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <label htmlFor="order-number" className="block text-gray-700 font-medium mb-2">Nomor Order</label>
                <input 
                  type="text" 
                  id="order-number" 
                  placeholder="Masukkan nomor order"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button 
                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-medium transition"
                onClick={handleTracking}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Lacak Sekarang'}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-6 text-center">Status Order</h3>
              <div className="space-y-8">
                {trackingData ? (
                  allStatuses.map((statusName, index) => {
                    // Find if this status exists in tracking data
                    const statusData = trackingData.statuses.find(s => s.status === statusName);
                    const isCompleted = !!statusData;
                    
                    return (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center`}>
                            <i className={`fas ${isCompleted ? 'fa-check' : 'fa-ellipsis-h'}`}></i>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className={`font-medium ${!isCompleted ? 'text-gray-400' : ''}`}>{statusName}</h4>
                          <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                            {statusData ? statusData.timestamp.toLocaleString('id-ID') : 'Menunggu proses'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Default view when no tracking data
                  allStatuses.map((statusName, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                          <i className="fas fa-ellipsis-h"></i>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-400">{statusName}</h4>
                        <p className="text-sm text-gray-400">Menunggu informasi</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{trackingData ? trackingData.progress : 0}%</span>
                </div>
                <div className="tracking-progress rounded-full">
                  <div style={{ width: `${trackingData ? trackingData.progress : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tracking;