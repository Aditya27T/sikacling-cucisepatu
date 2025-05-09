// app/admin/bookings/[id]/page.tsx
import BookingDetailClient from '@/components/admin/BookingDetailClient';

// Halaman server-side, hanya bertugas untuk merender komponen client
export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return <BookingDetailClient bookingId={params.id} />;
}