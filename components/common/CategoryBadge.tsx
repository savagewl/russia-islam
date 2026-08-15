'use client'

import { useLang } from '@/lib/LanguageContext'
import { getCategoryLabel } from '@/lib/api'

export default function CategoryBadge({ category, fallback, className, style }: {
  category: string
  fallback?: string
  className?: string
  style?: React.CSSProperties
}) {
  const { lang } = useLang()
  const label = getCategoryLabel(category, lang, fallback)
  if (!label) return null
  return <span className={className} style={style}>{label}</span>
}
