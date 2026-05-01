'use client'

import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

export default function BackButton() {
  const router = useRouter()
  const { lang } = useLang()
  const t = makeT('common', lang)

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      const source = sessionStorage.getItem('article-nav-source')
      if (source) {
        sessionStorage.removeItem('article-nav-source')
        router.push(source)
        return
      }
    }
    router.back()
  }

  const label = t('back')

  return (
    <button className="article-back-btn" onClick={handleBack} translate="no" style={lang === 'ar' ? { flexDirection: 'row-reverse' } : {}}>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M5.5 1L1.5 6L5.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 1L6.5 6L10.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 1L11.5 6L15.5 11" stroke="#8D8D8D" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </button>
  )
}