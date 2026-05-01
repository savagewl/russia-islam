'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/common/TopBar'
import Header from '@/components/common/Header'
import { LanguageProvider, useLang } from '@/lib/LanguageContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { lang } = useLang()

  useEffect(() => {
    const html = document.documentElement
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl')
      html.setAttribute('lang', 'ar')
    } else {
      html.setAttribute('dir', 'ltr')
      html.setAttribute('lang', lang === 'en' ? 'en' : 'ru')
    }
  }, [lang])

  return (
    <>
      <TopBar onMenuToggle={setIsMenuOpen} />
      <Header isMenuOpen={isMenuOpen} onCloseMenu={() => setIsMenuOpen(false)} />
      {children}
    </>
  )
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <LanguageProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageProvider>
  )
}