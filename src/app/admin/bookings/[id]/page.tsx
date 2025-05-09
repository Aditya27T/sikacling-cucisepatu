// src/app/admin/bookings/[id]/page.tsx
import BookingDetailClient from '@/components/admin/BookingDetailClient';
import  PageProps  from 'next';

// Implementasi props yang kompatibel dengan PageProps
export default function BookingDetailPage(props: {
  params: {
    id: string;
  } & Promise<any>; // Gabungkan properties seperti yang diharapkan
}) {
  // Ketika dirender, params akan menjadi objek konkret
  const { id } = props.params as unknown as { id: string };
  return <BookingDetailClient bookingId={id} />;
}