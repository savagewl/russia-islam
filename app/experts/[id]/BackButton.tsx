'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

export default function BackButton() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const t = makeT('common', lang)

  const label = t('back')

  return (
    <Link
      href="/"
      className="article-back-btn"
      style={isAr ? { direction: 'ltr' } : undefined}
    >
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M5.5 1L1.5 6L5.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 1L6.5 6L10.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 1L11.5 6L15.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </Link>
  )
}
