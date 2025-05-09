// app/page.tsx
import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeClient />
    </Suspense>
  );
}