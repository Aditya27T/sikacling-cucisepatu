// components/ui/FontAwesomeIcon.tsx
'use client'

import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export default function FontAwesomeIcon({
  icon,
  className = ''
}: {
  icon: IconDefinition
  className?: string
}) {
  return <FAIcon icon={icon} className={className} />
}