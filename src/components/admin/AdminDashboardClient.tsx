// components/admin/AdminDashboardClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

interface Booking {
    id: number;
    orderNumber: string;
    name: string;
    createdAt: Date;
    status: string;
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalServices: 0,
  } as { 
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    totalServices: number;
  });
  const [recentBookings, setRecentBookings] = useState([] as Booking[]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
    
    const fetchData = async () => {
      try {
        // Fetch services count
        const { count: servicesCount, error: servicesError } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true });
          
        if (servicesError) throw servicesError;
        
        // Fetch all bookings count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });
          
        if (bookingsError) throw bookingsError;
        
        // Fetch active bookings count
        const { count: activeBookingsCount, error: activeBookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'Selesai');
          
        if (activeBookingsError) throw activeBookingsError;
        
        // Calculate completed bookings
        const completedBookings = bookingsCount - activeBookingsCount;
        
        // Fetch recent bookings
        const { data: recentBookingsData, error: recentBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentBookingsError) throw recentBookingsError;
        
        // Format bookings data
        const formattedBookings = recentBookingsData.map(booking => ({
          id: booking.id,
          orderNumber: booking.order_number,
          name: booking.name,
          createdAt: new Date(booking.created_at),
          status: booking.status
        }));
        
        setStats({
          totalBookings: bookingsCount || 0,
          activeBookings: activeBookingsCount || 0,
          completedBookings: completedBookings || 0,
          totalServices: servicesCount || 0,
        });
        
        setRecentBookings(formattedBookings);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Gagal mengambil data dashboard: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (isMounted) {
      fetchData();
    }
  }, [isMounted]);
  
  if (!isMounted) {
    return null;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Halaman
        </button>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render dashboard content seperti biasa
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <i className="fas fa-clipboard-list text-blue-500"></i>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Booking</h2>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <i className="fas fa-check-circle text-green-500"></i>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Booking Selesai</h2>
              <p className="text-2xl font-bold">{stats.completedBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <i className="fas fa-spinner text-yellow-500"></i>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Booking Aktif</h2>
              <p className="text-2xl font-bold">{stats.activeBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <i className="fas fa-list-alt text-purple-500"></i>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Layanan</h2>
              <p className="text-2xl font-bold">{stats.totalServices}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Booking Terbaru</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.createdAt.toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'Order Diterima' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Dalam Proses Cuci' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        className="text-primary hover:text-secondary"
                        onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data booking terbaru
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {recentBookings.length > 0 && (
          <div className="px-6 py-3 flex justify-end">
            <button 
              className="text-primary hover:text-secondary text-sm"
              onClick={() => router.push('/admin/bookings')}
            >
              Lihat Semua Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}