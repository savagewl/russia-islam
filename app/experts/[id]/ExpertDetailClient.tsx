'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getExpertById, getCategoryLabel, formatDate, type ExpertDetail } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import BackButton from './BackButton'
import ScientificArticlesSection from '@/components/scientific-section/ScientificArticlesSection'

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 0C4.1 0 1.75 2.35 1.75 5.25C1.75 9.1875 7 14 7 14C7 14 12.25 9.1875 12.25 5.25C12.25 2.35 9.9 0 7 0ZM7 7.125C5.9625 7.125 5.125 6.2875 5.125 5.25C5.125 4.2125 5.9625 3.375 7 3.375C8.0375 3.375 8.875 4.2125 8.875 5.25C8.875 6.2875 8.0375 7.125 7 7.125Z" fill="currentColor"/>
  </svg>
)


export default function ExpertDetailClient({ id, initialExpert }: { id: number; initialExpert: ExpertDetail }) {
  const { lang } = useLang()
  const [expert, setExpert] = useState<ExpertDetail>(initialExpert)

  useEffect(() => {
    if (lang === 'ru') { setExpert(initialExpert); return }
    getExpertById(id, lang)
      .then(data => setExpert(data))
      .catch(() => setExpert(initialExpert))
  }, [lang, id])

  const topRow = expert.articles.slice(0, 3)
  const bottomRow = expert.articles.slice(3, 6)

  const noArticlesText = lang === 'ar' ? 'لا توجد مقالات لهذا الخبير بعد' : lang === 'en' ? 'This expert has no articles yet' : 'У этого эксперта пока нет статей'

  const renderCard = (article: ExpertDetail['articles'][0], isFirst: boolean) => {
    if (isFirst) {
      return (
        <Link key={article.id} href={`/articles/${article.slug}`} className="islam-card-large" style={{ textDecoration: 'none' }}>
          {article.preview_image_url && (
            <Image src={article.preview_image_url} alt={article.title} fill className="card-image-large" sizes="(max-width: 768px) 100vw, 619px" />
          )}
          <div className="card-overlay">
            <div className="card-meta-large">
              {article.category && (
                <span className="meta-tag">{getCategoryLabel(article.category, lang, article.category_display)}</span>
              )}
              <span className="meta-tag"><CalendarIcon /> {formatDate(article.created, lang)}</span>
            </div>
            <h3 className="card-title-large" translate="no">{article.title}</h3>
          </div>
        </Link>
      )
    }
    return (
      <Link key={article.id} href={`/articles/${article.slug}`} className="islam-card-small" style={{ textDecoration: 'none' }}>
        <div className="card-image-wrapper">
          {article.preview_image_url && (
            <Image src={article.preview_image_url} alt={article.title} fill className="card-image" sizes="303px" />
          )}
        </div>
        <div className="card-content-small">
          {article.category && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#51AB64', textTransform: 'uppercase', marginBottom: 4, display: 'block', letterSpacing: '0.05em' }}>
              {getCategoryLabel(article.category, lang, article.category_display)}
            </span>
          )}
          <h3 className="card-title-small" translate="no">{article.title}</h3>
          <div className="card-meta">
            {article.location && <span className="card-location" translate="no"><LocationIcon /> {article.location}</span>}
            <span className="card-date"><CalendarIcon /> {formatDate(article.created, lang)}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <div className="hero-section container" style={{ paddingBottom: 0 }}>
        <div className="article-back-row">
          <BackButton />
        </div>
        <div className="article-title-wrapper">
          <h1 className="article-title" translate="no">{expert.name}</h1>
        </div>
      </div>

      {expert.articles.length > 0 ? (
        <section className="islam-section">
          <div className="islam-main-frame">
            <div className="islam-content-frame">
              {topRow.length > 0 && <div className="islam-row">{topRow.map((a, i) => renderCard(a, i === 0))}</div>}
              {bottomRow.length > 0 && <div className="islam-row">{bottomRow.map((a, i) => renderCard(a, i === 0))}</div>}
            </div>
          </div>
        </section>
      ) : (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#7C7C7C', fontSize: 16 }}>{noArticlesText}</div>
      )}

      <div className="white-divider" />
      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <div className="white-divider" />
    </>
  )
}
