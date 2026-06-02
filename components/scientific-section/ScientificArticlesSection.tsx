'use client'
import React, { useRef, useState, useEffect } from 'react'
import { stripHtml } from '@/lib/stripHtml'
import Image from 'next/image'
import Link from 'next/link'
import '../../styles/scientific-section.css'
import { getArticles, formatDate, type ArticlePreview } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

interface Props {
  titleKey?: 'title' | 'see_also'
  showButton?: boolean
  category?: string
  excludeSlug?: string
}

export default function ScientificArticlesSection({
  titleKey = 'title',
  showButton = true,
  category,
  excludeSlug,
}: Props) {
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLang()
  const t = makeT('scientific', lang)

  useEffect(() => {
    setLoading(true)
    const langParam = lang === 'ru' ? undefined : lang

    getArticles({ category, page: 1, lang: langParam })
      .then((data) => {
        const filtered = excludeSlug
          ? data.results.filter((a) => a.slug !== excludeSlug)
          : data.results
        setArticles(filtered.slice(0, 6))
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [category, lang, excludeSlug])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDraggingThumb, setIsDraggingThumb] = useState(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const updateThumb = () => {
    if (!scrollContainerRef.current || !thumbRef.current || !trackRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    const trackWidth = trackRef.current.clientWidth
    if (scrollWidth <= clientWidth) { thumbRef.current.style.display = 'none'; return }
    thumbRef.current.style.display = 'block'
    const thumbWidth = Math.max((clientWidth / scrollWidth) * trackWidth, 50)
    thumbRef.current.style.width = `${thumbWidth}px`
    const maxScroll = scrollWidth - clientWidth
    const maxThumbLeft = trackWidth - thumbWidth
    thumbRef.current.style.transform = `translateX(${(scrollLeft / maxScroll) * maxThumbLeft}px)`
  }

  useEffect(() => {
    updateThumb()
    window.addEventListener('resize', updateThumb)
    return () => window.removeEventListener('resize', updateThumb)
  }, [articles])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY * 2
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    let isDown = false, startMouseX = 0, startScrollLeft = 0
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return
      isDown = true; startMouseX = e.clientX; startScrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'; document.body.style.userSelect = 'none'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      el.scrollLeft = startScrollLeft - (e.clientX - startMouseX)
    }
    const onMouseUp = () => { isDown = false; el.style.cursor = 'grab'; document.body.style.userSelect = '' }
    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingThumb(true)
    startXRef.current = e.pageX
    if (scrollContainerRef.current) scrollLeftRef.current = scrollContainerRef.current.scrollLeft
    document.body.style.userSelect = 'none'
  }

  const handleThumbMouseMove = (e: MouseEvent) => {
    if (!isDraggingThumb || !scrollContainerRef.current || !trackRef.current || !thumbRef.current) return
    e.preventDefault()
    const walk = e.pageX - startXRef.current
    const { scrollWidth, clientWidth } = scrollContainerRef.current
    const trackWidth = trackRef.current.clientWidth
    const thumbWidth = thumbRef.current.clientWidth
    const maxScroll = scrollWidth - clientWidth
    const maxThumbLeft = trackWidth - thumbWidth
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current + (walk * maxScroll / maxThumbLeft)
  }

  const handleThumbMouseUp = () => { setIsDraggingThumb(false); document.body.style.userSelect = '' }

  useEffect(() => {
    if (isDraggingThumb) {
      window.addEventListener('mousemove', handleThumbMouseMove)
      window.addEventListener('mouseup', handleThumbMouseUp)
    } else {
      window.removeEventListener('mousemove', handleThumbMouseMove)
      window.removeEventListener('mouseup', handleThumbMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleThumbMouseMove)
      window.removeEventListener('mouseup', handleThumbMouseUp)
    }
  }, [isDraggingThumb])

  // Функция для получения правильной ссылки с параметром языка
  const getArticleLink = (slug: string) => {
    if (lang === 'ru') return `/articles/${slug}`
    return `/articles/${slug}?lang=${lang}`
  }

  // Функция для получения ссылки на страницу всех статей
  const getArticlesLink = () => {
    if (lang === 'ru') return '/articles'
    return `/articles?lang=${lang}`
  }

  return (
    <section className="scientific-articles-section">
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '140px', pointerEvents: 'none', zIndex: 0, backgroundImage: `url('/images/ornament.jpg')`, backgroundRepeat: 'repeat-y', backgroundPosition: 'right top', backgroundSize: '180px auto', WebkitMaskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)', maskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)' }} />
      <div className="container">
        <div className="scientific-header-row">
          <h2 className="experts-title" translate="no">{t(titleKey)}</h2>
          {showButton && (
            <Link href={getArticlesLink()} className="scientific-more-btn" translate="no">
              {t('more')} <span className="arrows" suppressHydrationWarning>{lang === 'ar' ? '‹‹‹' : '›››'}</span>
            </Link>
          )}
        </div>

        <div className="scientific-main-container">
          <div
            className="scientific-cards-row"
            ref={scrollContainerRef}
            onScroll={updateThumb}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="scientific-card scientific-card--skeleton">
                    <div className="scientific-card-img-wrapper scientific-card-img--skeleton" />
                    <div className="scientific-card-content">
                      <div className="skeleton-line skeleton-line--title" />
                      <div className="skeleton-line skeleton-line--desc" />
                    </div>
                  </div>
                ))
              : articles.map((article) => (
                  <Link
                    key={article.id}
                    href={getArticleLink(article.slug)}
                    className="scientific-card scientific-card--link"
                  >
                    <div className="scientific-card-img-wrapper">
                      {article.preview_image_url ? (
                        <Image
                          src={article.preview_image_url}
                          alt={article.title}
                          width={303}
                          height={160}
                          className="scientific-card-img"
                          draggable={false}
                        />
                      ) : (
                        <div className="scientific-card-img-placeholder" />
                      )}
                    </div>
                    <div className="scientific-card-content">
                      <h4 className="scientific-card-title" translate="no">{article.title}</h4>
                      <p className="scientific-card-desc" translate="no">
                        {stripHtml(article.short_description)}
                      </p>
                      <div className="scientific-card-divider" />
                      <div className="news-meta scientific-card-meta">
                        <div className="meta-item">
                          <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                            <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 13 5 13C5 13 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#7C7C7C"/>
                          </svg>
                          <span translate="no">{article.location}</span>
                        </div>
                        <div className="meta-item">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{formatDate(article.created, lang)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="scientific-scroller" ref={trackRef}>
            <div
              className="scientific-scroller-thumb"
              ref={thumbRef}
              onMouseDown={handleThumbMouseDown}
              style={{ cursor: isDraggingThumb ? 'grabbing' : 'grab' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}