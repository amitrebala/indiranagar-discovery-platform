'use client'

import dynamic from 'next/dynamic'

const UnifiedAmitFAB = dynamic(() => import('./UnifiedAmitFAB'), {
  ssr: false,
  loading: () => null
})

export function FABProvider() {
  return <UnifiedAmitFAB />
}