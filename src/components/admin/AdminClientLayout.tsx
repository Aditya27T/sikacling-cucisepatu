// components/admin/AdminClientLayout.tsx
'use client'

import { useAdminAuth } from '@/utils/admin-auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logoutAdmin } from '@/utils/admin-auth';
import FontAwesomeScript from './FontAwesomeScript';

export default function AdminClientLayout({ children } : { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Redirect to login if not authenticated
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);
  
  // If not mounted yet, return nothing to avoid hydration errors
  if (!isMounted) {
    return null;
  }
  
  // If login page, just render children
  if (pathname === '/admin/login') {
    return (
      <>
        <FontAwesomeScript />
        {children}
      </>
    );
  }
  
  // If loading or not authenticated, show loading spinner
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Handle logout
  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <FontAwesomeScript />
      {/* Sidebar */}
      <div className="w-64 bg-dark text-white">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <i className="fas fa-shoe-prints text-xl text-primary mr-2"></i>
            <span className="text-lg font-bold">Sika<span className="text-primary">Cling</span> Admin</span>
          </div>
        </div>
        
        <nav className="mt-4">
          <Link 
            href="/admin" 
            className={`flex items-center px-4 py-2 ${pathname === '/admin' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <i className="fas fa-tachometer-alt mr-3"></i>
            <span>Dashboard</span>
          </Link>
          
          {/* <Link 
            href="/admin/services" 
            className={`flex items-center px-4 py-2 ${pathname.startsWith('/admin/services') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <i className="fas fa-list-alt mr-3"></i>
            <span>Layanan</span>
          </Link> */}
          
          <Link 
            href="/admin/bookings" 
            className={`flex items-center px-4 py-2 ${pathname.startsWith('/admin/bookings') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <i className="fas fa-clipboard-list mr-3"></i>
            <span>Booking</span>
          </Link>
          
          <Link 
            href="/admin/tracking" 
            className={`flex items-center px-4 py-2 ${pathname.startsWith('/admin/tracking') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <i className="fas fa-search-location mr-3"></i>
            <span>Tracking</span>
          </Link>
          
          <Link 
            href="/admin/import" 
            className={`flex items-center px-4 py-2 ${pathname.startsWith('/admin/import') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <i className="fas fa-database mr-3"></i>
            <span>Import Data</span>
          </Link>
          
          <div 
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 cursor-pointer mt-8"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            <span>Logout</span>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-xl font-semibold">
              {pathname === '/admin' && 'Dashboard'}
              {pathname === '/admin/services' && 'Manajemen Layanan'}
              {pathname === '/admin/bookings' && 'Manajemen Booking'}
              {pathname === '/admin/tracking' && 'Manajemen Tracking'}
              {pathname === '/admin/import' && 'Import Data'}
              {pathname.startsWith('/admin/bookings/') && 'Detail Booking'}
            </h1>
            <div className="flex items-center">
              <span className="mr-2">{user.email}</span>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}