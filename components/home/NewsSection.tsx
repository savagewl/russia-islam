'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import '../../styles/newsSection.css'
import { getArticles, formatDate, type ArticlePreview } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

const CalendarIcon = () => (
  <svg className="calendar-icon" width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
    <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 13 5 13C5 13 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#7C7C7C"/>
  </svg>
)

const RIGHT_CATEGORIES = [
  { category: 'key_projects', badgeKey: 'key_projects_badge' as const, color: '#9ECBC2', link: '/articles?category=key_projects' },
  { category: 'opportunities', badgeKey: 'opportunities_badge' as const, color: '#E0BBA5', link: '/articles?category=opportunities' },
  { category: 'events', badgeKey: 'events_badge' as const, color: '#E1D193', link: '/articles?category=events' },
]

export default function NewsSection() {
  const [oicNews, setOicNews] = useState<ArticlePreview[]>([])
  const [centerNews, setCenterNews] = useState<ArticlePreview | null>(null)
  const [rightNews, setRightNews] = useState<(ArticlePreview | null)[]>([null, null, null])
  const [loading, setLoading] = useState(true)

  const { lang } = useLang()
  const t = makeT('news', lang)
  useEffect(() => {
    setLoading(true)
    const fetchAll = async () => {
      try {
        const [oicData, groupData, projectsData, opportunitiesData, eventsData] = await Promise.allSettled([
          getArticles({ category: 'oic_news', page: 1, lang }),
          getArticles({ category: 'group_news', page: 1, lang }),
          getArticles({ category: 'key_projects', page: 1, lang }),
          getArticles({ category: 'opportunities', page: 1, lang }),
          getArticles({ category: 'events', page: 1, lang }),
        ])

        if (oicData.status === 'fulfilled') setOicNews(oicData.value.results.slice(0, 5))
        if (groupData.status === 'fulfilled' && groupData.value.results.length > 0) setCenterNews(groupData.value.results[0])
        setRightNews([
          projectsData.status === 'fulfilled' ? projectsData.value.results[0] ?? null : null,
          opportunitiesData.status === 'fulfilled' ? opportunitiesData.value.results[0] ?? null : null,
          eventsData.status === 'fulfilled' ? eventsData.value.results[0] ?? null : null,
        ])
      } catch (e) {
        console.error('NewsSection fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [lang])

  return (
    <div className="page-wrapper">
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '140px',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `url('/images/ornament.jpg')`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'right top',
          backgroundSize: '180px auto',
          WebkitMaskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)',
        }}
      />

      <section className="news-section">
        <div className="container">
          <div className="news-content">

            <div className="news-left">
              <div className="news-left-header" translate="no">{t('title')}</div>
              <div className="news-list">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="news-list-item">
                        <div style={{ height: 13, background: '#eee', borderRadius: 3, marginBottom: 8, animation: 'skeletonPulse 1.5s infinite' }} />
                        <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '40%', marginLeft: 'auto', animation: 'skeletonPulse 1.5s infinite' }} />
                        {i < 4 && <div className="news-list-divider" />}
                      </div>
                    ))
                  : oicNews.map((news, index) => (
                      <div key={news.id} className="news-list-item">
                        <Link href={`/articles/${news.slug}`} style={{ textDecoration: 'none' }}>
                          <h3 className="news-list-title" translate="no">{news.title}</h3>
                        </Link>
                        <div className="news-list-date-wrapper">
                          <CalendarIcon />
                          <span className="news-list-date">{formatDate(news.created, lang)}</span>
                        </div>
                        {index < oicNews.length - 1 && <div className="news-list-divider" />}
                      </div>
                    ))
                }
              </div>
              <Link href="/articles?category=oic_news" className="news-left-btn" translate="no">
                {t('more')} <span className="arrows">›››</span>
              </Link>
            </div>

            <div className="news-center">
              <div className="news-center-image-wrapper">
                {loading || !centerNews
                  ? <div style={{ width: '100%', height: '100%', background: '#e8e8e8', animation: 'skeletonPulse 1.5s infinite' }} />
                  : <>
                      {centerNews.preview_image_url && (
                        <Image
                          src={centerNews.preview_image_url}
                          alt={centerNews.title}
                          fill
                          className="news-center-img"
                          sizes="469px"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                      <Link href="/articles?category=group_news" className="news-image-overlay-btn center-overlay" translate="no">
                        {t('more')} <span className="arrows">›››</span>
                      </Link>
                    </>
                }
              </div>

              <div className="news-center-divider" />

              <div className="news-center-content">
                {loading || !centerNews
                  ? <>
                      <div style={{ height: 20, background: '#eee', borderRadius: 3, marginBottom: 16, width: '30%', animation: 'skeletonPulse 1.5s infinite' }} />
                      <div style={{ height: 18, background: '#eee', borderRadius: 3, marginBottom: 8, animation: 'skeletonPulse 1.5s infinite' }} />
                      <div style={{ height: 18, background: '#eee', borderRadius: 3, marginBottom: 8, width: '80%', animation: 'skeletonPulse 1.5s infinite' }} />
                      <div style={{ height: 13, background: '#eee', borderRadius: 3, width: '90%', animation: 'skeletonPulse 1.5s infinite' }} />
                    </>
                  : <>
                      <div className="news-group-badge" translate="no">{t('group_badge')}</div>
                      <Link href={`/articles/${centerNews.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 className="news-center-title" translate="no">{centerNews.title}</h3>
                      </Link>
                      <p className="news-center-description" translate="no">{centerNews.short_description}</p>
                      <div className="news-center-meta">
                        {lang === 'ru' ? (
                          <>
                            <div className="meta-item">
                              <CalendarIcon />
                              <span>{formatDate(centerNews.created, lang)}</span>
                            </div>
                            {centerNews.location && (
                              <div className="meta-item">
                                <LocationIcon />
                                <span>{centerNews.location}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {centerNews.location && (
                              <div className="meta-item">
                                <LocationIcon />
                                <span>{centerNews.location}</span>
                              </div>
                            )}
                            <div className="meta-item">
                              <CalendarIcon />
                              <span>{formatDate(centerNews.created, lang)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                }
              </div>
            </div>

            <div className="news-right">
              {RIGHT_CATEGORIES.map((cat, index) => {
                const article = rightNews[index]
                return (
                  <div key={cat.category} className="news-right-item-wrapper">
                    <div className="news-right-card">
                      <div className="news-right-img-wrapper">
                        {loading
                          ? <div style={{ width: '100%', height: '100%', background: '#e0e0e0', animation: 'skeletonPulse 1.5s infinite' }} />
                          : !article
                          ? <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                          : <>
                              {article.preview_image_url && (
                                <Image
                                  src={article.preview_image_url}
                                  alt={article.title}
                                  fill
                                  className="news-right-img"
                                  sizes="233px"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <Link href={cat.link} className="news-image-overlay-btn small-btn" translate="no">
                                {t('more')} <span className="arrows">›››</span>
                              </Link>
                            </>
                        }
                      </div>
                      <div className="news-right-content">
                        <div className="news-right-badge" style={{ backgroundColor: cat.color }} translate="no">
                          {t(cat.badgeKey)}
                        </div>
                        {loading
                          ? <>
                              <div style={{ height: 13, background: '#eee', borderRadius: 3, marginBottom: 6, animation: 'skeletonPulse 1.5s infinite' }} />
                              <div style={{ height: 13, background: '#eee', borderRadius: 3, width: '70%', animation: 'skeletonPulse 1.5s infinite' }} />
                            </>
                          : !article
                          ? <p style={{ fontSize: 12, color: '#aaa', margin: 0 }} translate="no">{t('no_content')}</p>
                          : <>
                              <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                                <h4 className="news-right-title" translate="no">{article.title}</h4>
                              </Link>
                              <div className="news-meta">
                                {lang === 'ru' ? (
                                  <>
                                    <div className="meta-item">
                                      <CalendarIcon />
                                      <span>{formatDate(article.created, lang)}</span>
                                    </div>
                                    {article.location && (
                                      <div className="meta-item">
                                        <LocationIcon />
                                        <span>{article.location}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {article.location && (
                                      <div className="meta-item">
                                        <LocationIcon />
                                        <span>{article.location}</span>
                                      </div>
                                    )}
                                    <div className="meta-item">
                                      <CalendarIcon />
                                      <span>{formatDate(article.created, lang)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                        }
                      </div>
                    </div>
                    <div className="news-right-color-divider" style={{ backgroundColor: cat.color }} />
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}