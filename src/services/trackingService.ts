// // services/trackingService.ts
// 'use client'

// import { supabase } from '@/utils/supabase';
// import { Booking, Status } from '@/models/types';
// import { useBookingService } from './bookingService';

// export const useTrackingService = () => {
//   const { getBookingByOrderNumber } = useBookingService();

//   // Get tracking information by order number
//   const getTrackingInfo = async (orderNumber: string): Promise<{ booking: Booking; statuses: Status[]; progress: number } | null> => {
//     try {
//       // Get booking
//       const booking = await getBookingByOrderNumber(orderNumber);
      
//       if (!booking) {
//         return null;
//       }
      
//       // Get statuses
//       const { data: statusesData, error } = await supabase
//         .from('statuses')
//         .select('*')
//         .eq('booking_id', booking.id)
//         .order('timestamp', { ascending: true });
      
//       if (error) throw error;
      
//       // Convert to correct format
//       const statuses = statusesData.map(item => ({
//         id: item.id,
//         bookingId: item.booking_id,
//         status: item.status,
//         timestamp: new Date(item.timestamp)
//       }));
      
//       // Calculate progress based on number of statuses completed
//       const totalStatusSteps = 4; // Order Diterima, Dalam Proses Cuci, Siap Diantar, Selesai
//       const progress = Math.min(Math.round((statuses.length / totalStatusSteps) * 100), 100);
      
//       return {
//         booking,
//         statuses,
//         progress
//       };
//     } catch (error) {
//       console.error('Error saat mengambil info tracking:', error);
//       throw error;
//     }
//   };

//   return { getTrackingInfo };
// };