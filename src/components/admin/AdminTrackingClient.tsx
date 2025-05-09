// components/admin/AdminTrackingClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Booking, Status } from '@/models/types';

export default function AdminTrackingClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  const handleSearch = async () => {
    if (!orderNumber) {
      setError('Silakan masukkan nomor order');
      return;
    }
    
    setLoading(true);
    setError('');
    setBooking(null);
    setStatuses([]);
    
    try {
      // Find booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
      
      if (bookingError) {
        if (bookingError.code === 'PGRST116') {
          // No rows found
          setError('Nomor order tidak ditemukan');
          setLoading(false);
          return;
        }
        throw bookingError;
      }
      
      const booking: Booking = {
        id: bookingData.id,
        orderNumber: bookingData.order_number,
        name: bookingData.name,
        phone: bookingData.phone,
        serviceId: bookingData.service_id,
        date: bookingData.date,
        address: bookingData.address,
        status: bookingData.status,
        createdAt: new Date(bookingData.created_at)
      };
      
      setBooking(booking);
      
      // Get statuses
      const { data: statusesData, error: statusesError } = await supabase
        .from('statuses')
        .select('*')
        .eq('booking_id', booking.id)
        .order('timestamp', { ascending: false });
      
      if (statusesError) throw statusesError;
      
      const formattedStatuses = statusesData.map(status => ({
        id: status.id,
        bookingId: status.booking_id,
        status: status.status,
        timestamp: new Date(status.timestamp)
      }));
      
      setStatuses(formattedStatuses);
    } catch (err: string | any) {
      console.error('Error searching booking:', err);
      setError(`Error saat mencari booking: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async () => {
    if (!newStatus || !booking || isUpdating) return;
    
    setIsUpdating(true);
    setError('');
    
    try {
      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);
      
      if (updateError) throw updateError;
      
      // Add new status record
      const { error: insertError } = await supabase
        .from('statuses')
        .insert([
          {
            booking_id: booking.id,
            status: newStatus,
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (insertError) throw insertError;
      
      // Update local state
      setBooking({
        ...booking,
        status: newStatus
      });
      
      // Add to statuses list
      const newStatusObj: Status = {
        id: Date.now().toString(), // temporary ID
        bookingId: booking.id,
        status: newStatus,
        timestamp: new Date()
      };
      
      setStatuses([newStatusObj, ...statuses]);
      setNewStatus('');
    } catch (err: string | any) {
      console.error('Error updating status:', err);
      setError(`Error saat memperbarui status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manajemen Tracking</h1>
        <p className="text-gray-600">Cari pesanan berdasarkan nomor order untuk memperbarui status</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="order-number" className="sr-only">Nomor Order</label>
            <input
              id="order-number"
              type="text"
              placeholder="Masukkan nomor order"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          
          <button 
            className="w-full md:w-auto bg-primary hover:bg-secondary text-white px-6 py-2 rounded-md"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Mencari...' : 'Cari Order'}
          </button>
        </div>
      </div>
      
      {/* Booking Information */}
      {booking && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow md:col-span-2">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold">Informasi Booking</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{booking.orderNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'Order Diterima' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'Dalam Proses Cuci' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Siap Diantar' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Nama Pelanggan</p>
                  <p className="font-medium">{booking.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Nomor WhatsApp</p>
                  <p className="font-medium">{booking.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tanggal Booking</p>
                  <p className="font-medium">{booking.createdAt.toLocaleDateString('id-ID')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pickup</p>
                  <p className="font-medium">{booking.date}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Alamat Pickup</p>
                  <p className="font-medium">{booking.address}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold">Update Status</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status Baru
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Pilih Status</option>
                  <option value="Order Diterima">Order Diterima</option>
                  <option value="Dalam Proses Cuci">Dalam Proses Cuci</option>
                  <option value="Siap Diantar">Siap Diantar</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              
              <button
                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md disabled:opacity-50"
                onClick={handleUpdateStatus}
                disabled={!newStatus || isUpdating}
              >
                {isUpdating ? 'Memperbarui...' : 'Update Status'}
              </button>
            </div>
            
            <div className="px-6 py-4 border-t">
              <h3 className="font-medium mb-3">Riwayat Status</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {statuses.length > 0 ? (
                  statuses.map((status, index) => (
                    <div key={status.id || index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-3 h-3 rounded-full ${
                          status.status === 'Selesai' ? 'bg-green-500' : 
                          status.status === 'Order Diterima' ? 'bg-blue-500' :
                          status.status === 'Dalam Proses Cuci' ? 'bg-yellow-500' :
                          status.status === 'Siap Diantar' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{status.status}</p>
                        <p className="text-xs text-gray-500">
                          {status.timestamp.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Belum ada riwayat status</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}