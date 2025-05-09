// components/admin/AdminBookingsClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Booking } from '@/models/types';

export default function AdminBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
    
    if (isMounted) {
      fetchBookings();
    }
  }, [isMounted]);
  
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if needed
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedBookings = data.map(booking => ({
        id: booking.id,
        orderNumber: booking.order_number,
        name: booking.name,
        phone: booking.phone,
        serviceId: booking.service_id,
        date: booking.date,
        address: booking.address,
        status: booking.status,
        createdAt: new Date(booking.created_at)
      })) as Booking[];
      
      setBookings(formattedBookings);
    } catch (err: string | any) {
      console.error('Error fetching bookings:', err);
      setError(`Error saat mengambil data booking: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredBookings = bookings.filter(booking => {
    // Filter by search term
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);
    
    return matchesSearch;
  });
  
  const handleViewDetails = (id: string) => {
    router.push(`/admin/bookings/${id}`);
  };
  
  if (!isMounted) {
    return null;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manajemen Booking</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Cari</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Cari berdasarkan nama, no. order, atau telepon"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="Order Diterima">Order Diterima</option>
              <option value="Dalam Proses Cuci">Dalam Proses Cuci</option>
              <option value="Siap Diantar">Siap Diantar</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          
          <button 
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md"
            onClick={fetchBookings}
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.createdAt.toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'Order Diterima' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Dalam Proses Cuci' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'Siap Diantar' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-primary hover:text-secondary"
                        onClick={() => handleViewDetails(booking.id)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Tidak ada hasil yang cocok dengan filter' 
                      : 'Belum ada data booking'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}