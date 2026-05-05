'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import ScientificArticlesSection from '../scientific-section/ScientificArticlesSection'
import '../../styles/photoVideo.css'
import { getArticles, getArticleBySlug, getBroadcasts, formatDate, type ArticlePreview, type ArticleDetail, type Broadcast } from '@/lib/api'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'
import PhotoVideoDatePicker from './PhotoVideoDatePicker'

const LocationIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 13" fill="none">
    <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 13 5 13C5 13 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#7C7C7C"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhotoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const VideoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
)

const BroadcastIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="12" cy="12" r="2"/>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.49 3.51a12 12 0 0 1 0 16.97M3.51 20.49a12 12 0 0 1 0-16.97"/>
  </svg>
)

export default function PhotoVideo() {
  const { lang } = useLang()
  const t = makeT('photo_video', lang)
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'broadcasts'>('photos')
  const [activeArticleTab, setActiveArticleTab] = useState<'article' | 'photos' | 'video'>('article')

  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [mediaCounts, setMediaCounts] = useState<Record<string, number>>({})

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetail | null>(null)
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null)
  const [loadingArticle, setLoadingArticle] = useState(false)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pendingFrom, setPendingFrom] = useState('')
  const [pendingTo, setPendingTo] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setLoadingList(true)
    setSelectedSlug(null)
    setSelectedArticle(null)
    setSelectedBroadcast(null)
    setMediaCounts({})

    if (activeTab === 'broadcasts') {
      getBroadcasts({
        page: 1,
        page_size: 8,
        ...(dateFrom ? { event_date_from: `${dateFrom}T00:00:00` } : {}),
        ...(dateTo ? { event_date_to: `${dateTo}T23:59:59` } : {}),
        lang,
      })
        .then(data => setBroadcasts(data.results))
        .catch(() => setBroadcasts([]))
        .finally(() => setLoadingList(false))
      return
    }

    getArticles({
      page: 1,
      lang,
      ...(dateFrom ? { created_from: dateFrom } : {}),
      ...(dateTo ? { created_to: dateTo } : {}),
      ...(activeTab === 'photos' ? { has_photos: true } : { has_videos: true }),
    })
      .then(async (data) => {
        const four = data.results.slice(0, 4)
        setArticles(four)
        const counts: Record<string, number> = {}
        await Promise.allSettled(
          four.map(async (article) => {
            try {
              const detail = await getArticleBySlug(article.slug, lang)
              counts[article.slug] = activeTab === 'photos'
                ? detail.photos.length
                : detail.videos.length
            } catch {}
          })
        )
        setMediaCounts(counts)
      })
      .catch(() => setArticles([]))
      .finally(() => setLoadingList(false))
  }, [activeTab, dateFrom, dateTo, lang])

  const handleCardClick = async (slug: string) => {
    if (selectedSlug === slug) return
    setSelectedSlug(slug)
    setActiveArticleTab('article')
    setLoadingArticle(true)
    setSelectedArticle(null)
    setSelectedBroadcast(null)

    try {
      const detail = await getArticleBySlug(slug, lang)
      setSelectedArticle(detail)
      const hasDescription = detail.description.trim().length > 0
      if (activeTab === 'photos' && detail.photos.length > 0) {
        setActiveArticleTab('photos')
      } else if (activeTab === 'videos' && detail.videos.length > 0) {
        setActiveArticleTab('video')
      } else if (!hasDescription && detail.photos.length > 0) {
        setActiveArticleTab('photos')
      } else if (!hasDescription && detail.videos.length > 0) {
        setActiveArticleTab('video')
      }
    } catch {
      setSelectedArticle(null)
    } finally {
      setLoadingArticle(false)
    }
  }

  const handleBroadcastClick = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast)
    setSelectedSlug(null)
    setSelectedArticle(null)
  }

  const handleApplyDate = () => {
    setDateFrom(pendingFrom)
    setDateTo(pendingTo)
    setShowDatePicker(false)
  }

  const handleClearDate = () => {
    setDateFrom('')
    setDateTo('')
    setPendingFrom('')
    setPendingTo('')
    setShowDatePicker(false)
  }

  const hasDateFilter = dateFrom || dateTo
  const dateLabel = hasDateFilter
    ? `${dateFrom || '...'} — ${dateTo || '...'}`
    : t('select_date')

  return (
    <>
      <section className="photo-video-section">
        <div className="photo-video-container">
          <h1 className="photo-video-title" translate="no">{t('title')}</h1>

          <div className="photo-video-layout">

            <div className="photo-video-left">
              <div className="photo-video-top-row">
                <div className="photo-video-tabs">
                  <button
                    className={`photo-video-tab ${activeTab === 'photos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('photos')}
                  >{t('tab_photos')}</button>
                  <button
                    className={`photo-video-tab ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                  >{t('tab_videos')}</button>
                  <button
                    className={`photo-video-tab ${activeTab === 'broadcasts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('broadcasts')}
                  >{t('tab_broadcasts')}</button>
                </div>

                <div ref={datePickerRef} style={{ position: 'relative' }}>
                    <div
                      className="photo-video-date-picker"
                      onClick={() => {
                        setPendingFrom(dateFrom)
                        setPendingTo(dateTo)
                        setShowDatePicker(v => !v)
                      }}
                      style={{ cursor: 'pointer', userSelect: 'none', color: hasDateFilter ? '#393939' : undefined }}
                    >
                      <CalendarIcon />
                      <span>{dateLabel}</span>
                      {hasDateFilter && (
                        <span
                          onClick={(e) => { e.stopPropagation(); handleClearDate() }}
                          style={{ marginLeft: 6, color: '#999', fontWeight: 700, fontSize: 16, lineHeight: 1 }}
                        >×</span>
                      )}
                    </div>

                    {showDatePicker && (
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: '#fff', border: '1px solid #E0E0E0',
                        borderRadius: 6, padding: 16, zIndex: 999,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 240,
                      }}>
                        <p style={{ fontSize: 12, color: '#7C7C7C', margin: '0 0 12px' }} translate="no">{t('filter_by_pub')}</p>
                        <PhotoVideoDatePicker
                          from={pendingFrom}
                          to={pendingTo}
                          lang={lang}
                          labelFrom={t('date_from')}
                          labelTo={t('date_to')}
                          onFromChange={setPendingFrom}
                          onToChange={setPendingTo}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={handleApplyDate}
                            style={{ flex: 1, padding: '7px 0', background: '#393939', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                          >{t('apply')}</button>
                          <button onClick={handleClearDate}
                            style={{ flex: 1, padding: '7px 0', background: '#F3F3F3', color: '#393939', border: '1px solid #E0E0E0', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                          >{t('reset')}</button>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {activeTab !== 'broadcasts' && (
                <div className="photo-grid-2x2">
                  {loadingList
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="photo-grid-card" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                          <div className="photo-grid-img" style={{ background: '#e0e0e0' }} />
                          <div className="photo-grid-info">
                            <div style={{ height: 13, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                            <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '60%' }} />
                          </div>
                        </div>
                      ))
                    : articles.length === 0
                    ? (
                      <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>
                        {t('not_found_period')}
                      </div>
                    )
                    : articles.map((article) => (
                        <div
                          key={article.id}
                          className={`photo-grid-card ${selectedSlug === article.slug ? 'selected' : ''}`}
                          onClick={() => handleCardClick(article.slug)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="photo-grid-img">
                            {article.preview_image_url ? (
                              <Image src={article.preview_image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="300px" />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.7">
                                  <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                              </div>
                            )}
                            <div className="photo-count-badge">
                              <span style={{ display: activeTab === 'photos' ? 'inline-flex' : 'none' }}><PhotoIcon /></span>
                              <span style={{ display: activeTab === 'photos' ? 'none' : 'inline-flex' }}><VideoIcon /></span>
                              {mediaCounts[article.slug] !== undefined
                                ? activeTab === 'photos'
                                  ? `${t('tab_photos')}: ${mediaCounts[article.slug]}`
                                  : `${t('tab_videos')}: ${mediaCounts[article.slug]}`
                                : activeTab === 'photos' ? `${t('tab_photos')}...` : `${t('tab_videos')}...`
                              }
                            </div>
                          </div>
                          <div className="photo-grid-info">
                            <h4 className="photo-grid-title">{article.title}</h4>
                            <div className="photo-grid-meta">
                              {article.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <LocationIcon /> {article.location}
                                </span>
                              )}
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CalendarIcon /> {formatDate(article.created, lang)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}

              {activeTab === 'broadcasts' && (
                <div className="photo-grid-2x2">
                  {loadingList
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="photo-grid-card" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                          <div className="photo-grid-img" style={{ background: '#1a1a1a' }} />
                          <div className="photo-grid-info">
                            <div style={{ height: 13, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                            <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '60%' }} />
                          </div>
                        </div>
                      ))
                    : broadcasts.length === 0
                    ? (
                      <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>
                        {t('no_broadcasts')}
                      </div>
                    )
                    : broadcasts.map((broadcast) => (
                        <div
                          key={broadcast.id}
                          className={`photo-grid-card ${selectedBroadcast?.id === broadcast.id ? 'selected' : ''}`}
                          onClick={() => handleBroadcastClick(broadcast)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="photo-grid-img" style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8">
                              <circle cx="12" cy="12" r="2"/>
                              <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.49 3.51a12 12 0 0 1 0 16.97M3.51 20.49a12 12 0 0 1 0-16.97"/>
                            </svg>
                            <div className="photo-count-badge">
                              <BroadcastIcon />
                              {t('broadcast_label')}
                            </div>
                          </div>
                          <div className="photo-grid-info">
                            <h4 className="photo-grid-title">{broadcast.title}</h4>
                            <div className="photo-grid-meta">
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CalendarIcon /> {formatDate(broadcast.event_date, lang)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}
            </div>

            <div className="photo-video-right">
              {selectedBroadcast && (() => {
                const embed = getVideoEmbed(selectedBroadcast.video_url)
                return (
                  <>
                    <div className="pv-article-meta">
                      <span className="pv-meta-item"><CalendarIcon /> {formatDate(selectedBroadcast.event_date, lang)}</span>
                    </div>
                    <h2 className="pv-article-title">{selectedBroadcast.title}</h2>
                    <div className="pv-article-content">
                      {embed ? (
                        embed.type === 'iframe' ? (
                          <iframe
                            src={embed.src}
                            style={{ width: '100%', height: '340px', border: 'none', borderRadius: 4 }}
                            allowFullScreen allow="autoplay; encrypted-media"
                          />
                        ) : embed.type === 'video' ? (
                          <video controls style={{ width: '100%', borderRadius: 4 }}>
                            <source src={embed.src} />
                          </video>
                        ) : (
                          <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8f8f8', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                              <circle cx="12" cy="12" r="2"/>
                              <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.49 3.51a12 12 0 0 1 0 16.97M3.51 20.49a12 12 0 0 1 0-16.97"/>
                            </svg>
                            <p style={{ color: '#7C7C7C', fontSize: 14, marginBottom: 16 }} translate="no">
                              {t('video_unsupported')}
                            </p>
                            <a
                              href={embed.src}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px', background: '#393939', color: '#fff',
                                borderRadius: 6, fontSize: 14, textDecoration: 'none',
                                fontFamily: 'inherit', cursor: 'pointer',
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                              {t('open_broadcast')}
                            </a>
                          </div>
                        )
                      ) : (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>
                          {t('player_error')}
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}

              {!selectedSlug && !selectedBroadcast && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#7C7C7C', fontSize: 14, textAlign: 'center', padding: 40 }}>
                  {activeTab === 'broadcasts' ? t('select_prompt_broadcast') : t('select_prompt_article')}
                </div>
              )}

              {selectedSlug && loadingArticle && (
                <div style={{ padding: 24 }}>
                  {[1, 0.4, 0.7, 1, 0.9, 0.8].map((w, i) => (
                    <div key={i} style={{ height: i < 2 ? 20 : 12, background: '#eee', borderRadius: 3, marginBottom: 10, width: `${w * 100}%`, animation: 'skeletonPulse 1.5s infinite' }} />
                  ))}
                </div>
              )}

              {selectedSlug && !loadingArticle && !selectedArticle && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#7C7C7C', fontSize: 14, textAlign: 'center', padding: 40 }}>
                  {t('article_load_error')}
                </div>
              )}

              {selectedArticle && (
                <>
                  <div className="pv-article-meta">
                    {selectedArticle.location && (
                      <span className="pv-meta-item"><LocationIcon /> {selectedArticle.location}</span>
                    )}
                    <span className="pv-meta-item"><CalendarIcon /> {formatDate(selectedArticle.created, lang)}</span>
                  </div>

                  <h2 className="pv-article-title">{selectedArticle.title}</h2>

                  <div className="pv-article-tabs">
                    {selectedArticle.description.trim().length > 0 && (
                      <button className={`pv-article-tab ${activeArticleTab === 'article' ? 'active' : ''}`} onClick={() => setActiveArticleTab('article')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                        {t('tab_article')}
                      </button>
                    )}
                    {selectedArticle.photos.length > 0 && (
                      <button className={`pv-article-tab ${activeArticleTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveArticleTab('photos')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        {t('tab_photos')} <bdi>({selectedArticle.photos.length})</bdi>
                      </button>
                    )}
                    {selectedArticle.videos.length > 0 && (
                      <button className={`pv-article-tab ${activeArticleTab === 'video' ? 'active' : ''}`} onClick={() => setActiveArticleTab('video')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                        {t('tab_videos')} <bdi>({selectedArticle.videos.length})</bdi>
                      </button>
                    )}
                  </div>

                  <div className="pv-article-content">
                    {activeArticleTab === 'article' && (
                      <div className="pv-article-scroll">
                        <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: selectedArticle.description }} />
                      </div>
                    )}
                    {activeArticleTab === 'photos' && (
                      <div className="pv-gallery">
                        {[selectedArticle.photos.slice(0, 4), selectedArticle.photos.slice(4, 8)]
                          .filter(row => row.length > 0)
                          .map((row, rowIdx) => (
                            <div key={rowIdx} className="pv-gallery-row">
                              {row.map(photo => (
                                <div key={photo.id} className="pv-gallery-item">
                                  <Image src={photo.image_url} alt={`${t('tab_photos')} ${photo.id}`} fill style={{ objectFit: 'cover' }} />
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                    {activeArticleTab === 'video' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {selectedArticle.videos.map(video => {
                          const embed = getVideoEmbed(video.video_url)
                          if (!embed) return null
                          if (embed.type === 'iframe') {
                            return (
                              <iframe key={video.id} src={embed.src}
                                style={{ width: '100%', height: '300px', border: 'none', borderRadius: 4 }}
                                allowFullScreen allow="autoplay; encrypted-media"
                              />
                            )
                          }
                          return (
                            <video key={video.id} controls style={{ width: '100%', borderRadius: 4 }}>
                              <source src={embed.src} />
                            </video>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      <ScientificArticlesSection titleKey="see_also" showButton={false} />

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}