import { Suspense } from 'react';
import AdminClientLayout from '@/components/admin/AdminClientLayout';

export const metadata = {
  title: 'SikaCling Admin',
  description: 'Panel admin untuk mengelola SikaCling',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLoadingSkeleton />}>
      <AdminClientLayout>
        {children}
      </AdminClientLayout>
    </Suspense>
  );
}

function AdminLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="shrink-0">
          <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div>
          <div className="h-4 w-36 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}