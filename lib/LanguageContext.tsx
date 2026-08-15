'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface LanguageContextType {
  lang: string
  setLang: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  setLang: () => {},
})

export function useLang() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState('ru')

  useEffect(() => {
    const saved = localStorage.getItem('site-lang')
    if (saved && ['ru', 'en', 'ar'].includes(saved)) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: string) => {
    setLangState(newLang)
    localStorage.setItem('site-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
