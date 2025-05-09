'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Booking, Service, Status } from '@/models/types';

export default function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (isMounted && bookingId) {
      fetchBookingData();
    }
  }, [isMounted, bookingId]);

  const fetchBookingData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch booking data
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      if (!bookingData) throw new Error('Booking tidak ditemukan');

      const booking: Booking = {
        id: bookingData.id,
        orderNumber: bookingData.order_number,
        name: bookingData.name,
        phone: bookingData.phone,
        serviceId: bookingData.service_id,
        date: bookingData.date,
        address: bookingData.address,
        status: bookingData.status,
        createdAt: new Date(bookingData.created_at),
      };

      setBooking(booking);

      // Fetch service associated with the booking
      if (booking.serviceId) {
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', booking.serviceId)
          .single();

        if (serviceError) throw serviceError;

        if (serviceData) {
          setService({
            id: serviceData.id,
            name: serviceData.name,
            price: serviceData.price,
            description: serviceData.description,
            imageUrl: serviceData.image_url,
          });
        }
      }

      // Fetch statuses for the booking
      const { data: statusesData, error: statusesError } = await supabase
        .from('statuses')
        .select('*')
        .eq('booking_id', bookingId)
        .order('timestamp', { ascending: false });

      if (statusesError) throw statusesError;

      const formattedStatuses = statusesData.map(status => ({
        id: status.id,
        bookingId: status.booking_id,
        status: status.status,
        timestamp: new Date(status.timestamp),
      }));

      setStatuses(formattedStatuses);
    } catch (err: any) {
      console.error('Error fetching booking data:', err);
      setError(`Error saat mengambil data: ${err.message}`);
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
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Add new status record
      const { error: insertError } = await supabase
        .from('statuses')
        .insert([
          {
            booking_id: bookingId,
            status: newStatus,
            timestamp: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      // Refetch booking data after update
      fetchBookingData();
      setNewStatus('');
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(`Error saat memperbarui status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <div className="mt-4 flex space-x-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => fetchBookingData()}
          >
            Coba Lagi
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => router.push('/admin/bookings')}
          >
            Kembali ke Daftar Booking
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center my-12">
        <p>Booking tidak ditemukan</p>
        <button
          className="mt-4 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md"
          onClick={() => router.push('/admin/bookings')}
        >
          Kembali ke Daftar Booking
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          className="mr-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
          onClick={() => router.push('/admin/bookings')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold">Detail Booking #{booking.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Info */}
        <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Informasi Booking</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <p className="text-sm text-gray-600">Layanan</p>
                <p className="font-medium">{service?.name || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Harga</p>
                <p className="font-medium">Rp {service ? service.price.toLocaleString('id-ID') : 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status Terkini</p>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Selesai'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Order Diterima'
                        ? 'bg-blue-100 text-blue-800'
                        : booking.status === 'Dalam Proses Cuci'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'Siap Diantar'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
            <div className="space-y-3">
              {statuses.length > 0 ? (
                statuses.map((status) => (
                  <div key={status.id} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          status.status === 'Selesai'
                            ? 'bg-green-500'
                            : status.status === 'Order Diterima'
                            ? 'bg-blue-500'
                            : status.status === 'Dalam Proses Cuci'
                            ? 'bg-yellow-500'
                            : status.status === 'Siap Diantar'
                            ? 'bg-purple-500'
                            : 'bg-gray-500'
                        }`}
                      ></div>
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
    </div>
  );
}
