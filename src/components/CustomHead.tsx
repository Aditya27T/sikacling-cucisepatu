// components/CustomHead.tsx
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function CustomHead() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" 
        strategy="afterInteractive"
      />
    </>
  )
}