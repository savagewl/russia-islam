'use client'

import { useState, useEffect } from 'react'
import { formatDate, getArticleBySlug } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 0C4.1 0 1.75 2.35 1.75 5.25C1.75 9.1875 7 14 7 14C7 14 12.25 9.1875 12.25 5.25C12.25 2.35 9.9 0 7 0ZM7 7.125C5.9625 7.125 5.125 6.2875 5.125 5.25C5.125 4.2125 5.9625 3.375 7 3.375C8.0375 3.375 8.875 4.2125 8.875 5.25C8.875 6.2875 8.0375 7.125 7 7.125Z" fill="currentColor"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface Props {
  created: string
  location?: string
  slug: string
}

export default function ArticleMeta({ created, location: initialLocation, slug }: Props) {
  const { lang } = useLang()
  const [location, setLocation] = useState(initialLocation)

  useEffect(() => {
    getArticleBySlug(slug, lang)
      .then((article) => setLocation(article.location))
      .catch(() => {})
  }, [slug, lang])

  return (
    <div className="article-meta">
      {location && (
        <div className="article-meta-item">
          <LocationIcon />
          <span className="article-meta-text">{location}</span>
        </div>
      )}
      <div className="article-meta-item">
        <CalendarIcon />
        <span className="article-meta-text">{formatDate(created, lang)}</span>
      </div>
    </div>
  )
}
