'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import '../../styles/projects.css'
import ScientificArticlesSection from '../scientific-section/ScientificArticlesSection'
import { getArticles, formatDate, type ArticlePreview } from '@/lib/api'
import { stripHtml } from '@/lib/stripHtml'
import { useLang } from '@/lib/LanguageContext'

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function GrantsSection() {
  const [grants, setGrants] = useState<ArticlePreview[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLang()

  useEffect(() => {
    setLoading(true)
    getArticles({ category: 'grant', page: 1, lang })
      .then((data) => setGrants(data.results.slice(0, 4)))
      .catch(() => setGrants([]))
      .finally(() => setLoading(false))
  }, [lang])

  const verticalGrants = grants.slice(0, 2)
  const horizontalGrants = grants.slice(2, 4)

  if (loading) {
    return (
      <>
        <section className="projects-section">
          <div className="projects-frame-14636">
            <div className="projects-cards-row">
              {[0, 1].map((i) => (
                <div key={i} className="project-card-vertical" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                  <div className="card-img-vertical" style={{ background: '#e0e0e0' }} />
                  <div className="card-content-vertical">
                    <div style={{ height: 16, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                    <div style={{ height: 12, background: '#eee', borderRadius: 3, width: '80%' }} />
                  </div>
                </div>
              ))}
              <div className="project-cards-stacked">
                {[0, 1].map((i) => (
                  <div key={i} className="project-card-horizontal" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                    <div className="card-img-horizontal" style={{ background: '#e0e0e0' }} />
                    <div className="card-content-horizontal">
                      <div style={{ height: 14, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                      <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '70%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </>
    )
  }

  if (grants.length === 0) {
    return (
      <>
        <section className="projects-section">
          <div className="projects-frame-14636" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <p style={{ color: '#7C7C7C', fontSize: 16 }}>Гранты появятся позже</p>
          </div>
        </section>
        <ScientificArticlesSection titleKey="see_also" showButton={false} />
      </>
    )
  }

  return (
    <>
      <section className="projects-section">
        <div className="projects-frame-14636">
          <div className="projects-cards-row">
            {verticalGrants.map((grant) => (
              <Link key={grant.id} href={`/articles/${grant.slug}`} className="project-card-vertical" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-img-vertical">
                  {grant.preview_image_url
                    ? <Image src={grant.preview_image_url} alt={grant.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 400px" />
                    : <div style={{ width: '100%', height: '100%', background: '#e8f0eb' }} />
                  }
                </div>
                <div className="card-content-vertical">
                  <h4 className="card-title">{grant.title}</h4>
                  {grant.short_description && (
                    <p className="card-desc">{stripHtml(grant.short_description)}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    <CalendarIcon />
                    <span style={{ fontSize: 11, color: '#7C7C7C' }}>{formatDate(grant.created, lang)}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="project-cards-stacked">
              {horizontalGrants.map((grant) => (
                <Link key={grant.id} href={`/articles/${grant.slug}`} className="project-card-horizontal" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card-img-horizontal">
                    {grant.preview_image_url
                      ? <Image src={grant.preview_image_url} alt={grant.title} fill style={{ objectFit: 'cover' }} sizes="215px" />
                      : <div style={{ width: '100%', height: '100%', background: '#e8f0eb' }} />
                    }
                  </div>
                  <div className="card-content-horizontal">
                    <h4 className="card-title">{grant.title}</h4>
                    {grant.short_description && (
                      <p className="card-desc">{stripHtml(grant.short_description)}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      <CalendarIcon />
                      <span style={{ fontSize: 11, color: '#7C7C7C' }}>{formatDate(grant.created, lang)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}
