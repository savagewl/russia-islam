'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import '../../styles/topbar.css'
import { getArticles, formatDate, getCategoryLabel, type ArticlePreview } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

interface TopBarProps {
  onMenuToggle: (isOpen: boolean) => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { lang, setLang } = useLang()
  const t = makeT('search', lang)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchLanguage = (newLang: string) => {
    setLang(newLang)
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticlePreview[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await getArticles({ search: query.trim(), page: 1, lang })
        setResults(data.results.slice(0, 6))
        setShowDropdown(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, lang])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setShowDropdown(false)
    setQuery('')
    setIsMobileSearchOpen(false)
  }, [pathname])

  const goToArticle = (slug: string) => {
    setShowDropdown(false)
    setQuery('')
    setIsMobileSearchOpen(false)
    router.push(`/articles/${slug}`)
  }

  const goToSearch = () => {
    if (!query.trim()) return
    setShowDropdown(false)
    setIsMobileSearchOpen(false)
    router.push(`/articles?search=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) goToSearch()
    if (e.key === 'Escape') { setShowDropdown(false); setIsMobileSearchOpen(false) }
  }

  const handleMenuClick = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)
    onMenuToggle(newState)
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('resetToHome'))
    }
  }

  const logoSrc = !mounted
    ? '/images/Russia.svg'
    : lang === 'en'
    ? '/images/English.svg'
    : lang === 'ar'
    ? '/images/Arab.svg'
    : '/images/Russia.svg'

  const SearchResults = () => (
    <>
      {searching ? (
        <div style={{ padding: '12px 16px', color: '#7C7C7C', fontSize: 13 }}>{t('searching')}</div>
      ) : results.length === 0 ? (
        <div style={{ padding: '12px 16px', color: '#7C7C7C', fontSize: 13 }}>{t('not_found')}</div>
      ) : (
        <>
          {results.map((article) => (
            <div
              key={article.id}
              onMouseDown={(e) => { e.preventDefault(); goToArticle(article.slug) }}
              style={{ display: 'flex', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
            >
              {article.preview_image_url && (
                <div style={{ width: 52, height: 40, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <Image src={article.preview_image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="52px" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#393939', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </div>
                <div style={{ fontSize: 11, color: '#7C7C7C', display: 'flex', gap: 8 }}>
                  {article.category && <span style={{ color: '#51AB64', fontWeight: 500 }}>{getCategoryLabel(article.category, lang, article.category_display)}</span>}
                  <span>{formatDate(article.created, lang)}</span>
                </div>
              </div>
            </div>
          ))}
          <div
            onMouseDown={(e) => { e.preventDefault(); goToSearch() }}
            style={{ padding: '10px 16px', textAlign: 'center', fontSize: 13, color: '#51AB64', fontWeight: 500, cursor: 'pointer', background: '#F8F8F8' }}
          >
            {t('show_all')}
          </div>
        </>
      )}
    </>
  )

  return (
    <div className="top-bar">
      <div className="content-wrapper">
        <div className="top-bar-left">
          <Link href="/" onClick={handleLogoClick}>
            <Image
  key={logoSrc}
  src={logoSrc}
  alt="Россия – Исламский мир"
  width={273}
  height={76}
  priority
  unoptimized
  className="logo-image"
/>
          </Link>
        </div>

        <button
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={handleMenuClick}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="top-bar-right">
          <div className="search-wrapper" ref={searchRef} style={{ position: 'relative' }}>
            <button
              className="search-button"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setIsMobileSearchOpen(true)
                  setTimeout(() => mobileInputRef.current?.focus(), 50)
                } else {
                  goToSearch()
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="1.5"/>
                <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <input
              type="text"
              placeholder={t('placeholder')}
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && !isMobileSearchOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                zIndex: 9999, maxHeight: 400, overflowY: 'auto',
                borderTop: '1px solid #E0E0E0', minWidth: 360,
              }}>
                <SearchResults />
              </div>
            )}
          </div>

          <div className="vertical-divider"></div>
          <div className="language-selector">
            {[
              { code: 'ru', label: 'Ru' },
              { code: 'en', label: 'En' },
              { code: 'ar', label: 'Ar' },
            ].map(({ code, label }) => (
              <button key={code} className={lang === code ? 'active' : ''} onClick={() => switchLanguage(code)} translate="no">
                <span translate="no">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => { setIsMobileSearchOpen(false); setShowDropdown(false); setQuery('') }}
        >
          <div style={{ background: '#fff', padding: '12px 16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 4, padding: '0 12px', height: 44 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="1.5"/>
                <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder={t('placeholder_mobile')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 15, color: '#333' }}
              />
              {query
                ? <button onMouseDown={(e) => { e.preventDefault(); setQuery(''); setShowDropdown(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 22, padding: 0, lineHeight: 1 }}>×</button>
                : <button onMouseDown={(e) => { e.preventDefault(); setIsMobileSearchOpen(false); setQuery('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 14, padding: 0 }}>{t('cancel')}</button>
              }
            </div>
            {showDropdown && (
              <div style={{ background: '#fff', marginTop: 4, maxHeight: '60vh', overflowY: 'auto' }}>
                <SearchResults />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}