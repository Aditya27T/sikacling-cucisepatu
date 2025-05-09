// hooks/useClientOnly.ts
'use client'

import { useState, useEffect } from 'react'

export function useClientOnly() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return mounted
}