// // services/bookingService.ts
// 'use client'

// import { supabase } from '@/utils/supabase';
// import { Booking, Service } from '@/models/types';

// // Generate random order number
// const generateOrderNumber = () => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let result = '';
//   for (let i = 0; i < 8; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };

// export const useBookingService = () => {
  
//   // Get all services
//   const getServices = async (): Promise<Service[]> => {
//     try {
//       const { data, error } = await supabase
//         .from('services')
//         .select('*')
//         .order('name');
      
//       if (error) throw error;
      
//       return data.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         imageUrl: item.image_url
//       }));
//     } catch (error) {
//       console.error('Error saat mengambil layanan:', error);
//       throw error;
//     }
//   };

//   // Create a new booking
//   const createBooking = async (bookingData: Omit<Booking, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<{ orderNumber: string }> => {
//     try {
//       const orderNumber = generateOrderNumber();
      
//       // Insert booking
//       const { data: booking, error: bookingError } = await supabase
//         .from('bookings')
//         .insert([
//           {
//             order_number: orderNumber,
//             name: bookingData.name,
//             phone: bookingData.phone,
//             service_id: bookingData.serviceId,
//             date: bookingData.date,
//             address: bookingData.address,
//             status: 'Order Diterima'
//           }
//         ])
//         .select()
//         .single();
      
//       if (bookingError) throw bookingError;
      
//       // Insert initial status
//       const { error: statusError } = await supabase
//         .from('statuses')
//         .insert([
//           {
//             booking_id: booking.id,
//             status: 'Order Diterima',
//             timestamp: new Date().toISOString()
//           }
//         ]);
      
//       if (statusError) throw statusError;
      
//       return { orderNumber };
//     } catch (error) {
//       console.error('Error saat membuat booking:', error);
//       throw error;
//     }
//   };

//   // Get booking by order number
//   const getBookingByOrderNumber = async (orderNumber: string): Promise<Booking | null> => {
//     try {
//       const { data, error } = await supabase
//         .from('bookings')
//         .select('*')
//         .eq('order_number', orderNumber)
//         .single();
      
//       if (error) {
//         if (error.code === 'PGRST116') {
//           // No rows returned
//           return null;
//         }
//         throw error;
//       }
      
//       return {
//         id: data.id,
//         orderNumber: data.order_number,
//         name: data.name,
//         phone: data.phone,
//         serviceId: data.service_id,
//         date: data.date,
//         address: data.address,
//         status: data.status,
//         createdAt: new Date(data.created_at)
//       };
//     } catch (error) {
//       console.error('Error saat mengambil booking:', error);
//       throw error;
//     }
//   };

//   return { getServices, createBooking, getBookingByOrderNumber };
// };