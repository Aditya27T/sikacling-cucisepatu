// components/admin/FontAwesomeScript.tsx
'use client'

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function FontAwesomeScript() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  if (!loaded) return null;
  
  return (
    <Script 
      src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" 
      strategy="afterInteractive"
    />
  );
}