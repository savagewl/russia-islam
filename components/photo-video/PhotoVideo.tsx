'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import ScientificArticlesSection from '../scientific-section/ScientificArticlesSection'
import '../../styles/photoVideo.css'
import { getAlbums, getArticles, getBroadcasts, formatDate, type Album, type ArticlePreview, type Broadcast } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'
import PhotoVideoDatePicker from './PhotoVideoDatePicker'

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 13" fill="none">
    <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 13 5 13C5 13 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#7C7C7C"/>
  </svg>
)

const PAGE_SIZE = 8

export default function PhotoVideo() {
  const { lang } = useLang()
  const t = makeT('photo_video', lang)
  const [activeTab, setActiveTab] = useState<'albums' | 'videos' | 'broadcasts'>('albums')

  const [albums, setAlbums] = useState<Album[]>([])
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

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
    setPage(1)
  }, [activeTab, dateFrom, dateTo, lang])

  useEffect(() => {
    setLoadingList(true)

    if (activeTab === 'albums') {
      getAlbums({ page, page_size: PAGE_SIZE, lang })
        .then(data => { setAlbums(data.results); setTotalCount(data.count) })
        .catch(() => { setAlbums([]); setTotalCount(0) })
        .finally(() => setLoadingList(false))
      return
    }

    if (activeTab === 'broadcasts') {
      getBroadcasts({
        page, page_size: PAGE_SIZE,
        ...(dateFrom ? { event_date_from: `${dateFrom}T00:00:00` } : {}),
        ...(dateTo ? { event_date_to: `${dateTo}T23:59:59` } : {}),
        lang,
      })
        .then(data => { setBroadcasts(data.results); setTotalCount(data.count) })
        .catch(() => { setBroadcasts([]); setTotalCount(0) })
        .finally(() => setLoadingList(false))
      return
    }

    getArticles({
      page, lang,
      ...(dateFrom ? { created_from: dateFrom } : {}),
      ...(dateTo ? { created_to: dateTo } : {}),
      has_videos: true,
    })
      .then(data => { setArticles(data.results.slice(0, PAGE_SIZE)); setTotalCount(data.count) })
      .catch(() => { setArticles([]); setTotalCount(0) })
      .finally(() => setLoadingList(false))
  }, [activeTab, dateFrom, dateTo, lang, page])

  const handleApplyDate = () => { setDateFrom(pendingFrom); setDateTo(pendingTo); setShowDatePicker(false); setPage(1) }
  const handleClearDate = () => { setDateFrom(''); setDateTo(''); setPendingFrom(''); setPendingTo(''); setShowDatePicker(false); setPage(1) }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const Pagination = () => {
    if (totalPages <= 1) return null
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 40, flexWrap: 'wrap' }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: '8px 14px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ccc' : '#393939', fontSize: 14 }}
        >←</button>
        {pages.map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} style={{ padding: '8px 4px', color: '#7C7C7C', fontSize: 14 }}>…</span>
            : <button
                key={`page-${p}`}
                onClick={() => setPage(Number(p))}
                style={{ padding: '8px 14px', border: '1px solid', borderRadius: 4, fontSize: 14, cursor: 'pointer', borderColor: page === p ? '#393939' : '#E0E0E0', background: page === p ? '#393939' : '#fff', color: page === p ? '#fff' : '#393939', fontWeight: page === p ? 600 : 400 }}
              >{p}</button>
        )}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ padding: '8px 14px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ccc' : '#393939', fontSize: 14 }}
        >→</button>
      </div>
    )
  }

  const hasDateFilter = dateFrom || dateTo
  const dateLabel = hasDateFilter ? `${dateFrom || '...'} — ${dateTo || '...'}` : t('select_date')

  const skeletonCards = Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="photo-grid-card" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
      <div className="photo-grid-img" style={{ background: '#e0e0e0' }} />
      <div className="photo-grid-info">
        <div style={{ height: 13, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
        <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '60%' }} />
      </div>
    </div>
  ))

  return (
    <>
      <section className="photo-video-section">
        <div className="photo-video-container">
          <h1 className="photo-video-title" translate="no">{t('title')}</h1>

          <div className="photo-video-top-row">
            <div className="photo-video-tabs">
              <button className={`photo-video-tab ${activeTab === 'albums' ? 'active' : ''}`} onClick={() => setActiveTab('albums')} translate="no">
                {t('tab_albums')}
              </button>
              <button className={`photo-video-tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')} translate="no">
                {t('tab_videos')}
              </button>
              <button className={`photo-video-tab ${activeTab === 'broadcasts' ? 'active' : ''}`} onClick={() => setActiveTab('broadcasts')} translate="no">
                {t('tab_broadcasts')}
              </button>
            </div>

            <div ref={datePickerRef} style={{ position: 'relative' }}>
                <div
                  className="photo-video-date-picker"
                  onClick={() => { setPendingFrom(dateFrom); setPendingTo(dateTo); setShowDatePicker(v => !v) }}
                  style={{ cursor: 'pointer', userSelect: 'none', color: hasDateFilter ? '#393939' : undefined }}
                >
                  <CalendarIcon />
                  <span>{dateLabel}</span>
                  {hasDateFilter && (
                    <span onClick={(e) => { e.stopPropagation(); handleClearDate() }}
                      style={{ marginLeft: 6, color: '#999', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>×</span>
                  )}
                </div>
                {showDatePicker && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 6, padding: 16, zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 240 }}>
                    <p style={{ fontSize: 12, color: '#7C7C7C', margin: '0 0 12px' }} translate="no">{t('filter_by_pub')}</p>
                    <PhotoVideoDatePicker from={pendingFrom} to={pendingTo} lang={lang} labelFrom={t('date_from')} labelTo={t('date_to')} onFromChange={setPendingFrom} onToChange={setPendingTo} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleApplyDate} style={{ flex: 1, padding: '7px 0', background: '#393939', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('apply')}</button>
                      <button onClick={handleClearDate} style={{ flex: 1, padding: '7px 0', background: '#F3F3F3', color: '#393939', border: '1px solid #E0E0E0', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('reset')}</button>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* АЛЬБОМЫ */}
          {activeTab === 'albums' && (
            <>
              <div className="photo-grid-2x2">
                {loadingList ? skeletonCards
                  : albums.length === 0
                  ? <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>{t('no_albums')}</div>
                  : albums.map(album => (
                      <Link key={album.id} href={`/photo-video/albums/${album.id}`} className="photo-grid-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="photo-grid-img">
                          {album.photos.length > 0 ? (
                            <img src={album.photos[0].image} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            </div>
                          )}
                          {album.photos.length > 0 && (
                            <div className="photo-count-badge">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                              {t('photos_count')}: {album.photos.length}
                            </div>
                          )}
                        </div>
                        <div className="photo-grid-info">
                          <h4 className="photo-grid-title">{album.title}</h4>
                          <div className="photo-grid-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon /> {formatDate(album.created, lang)}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                }
              </div>
              <Pagination />
            </>
          )}

          {/* ВИДЕО */}
          {activeTab === 'videos' && (
            <>
              <div className="photo-grid-2x2">
                {loadingList ? skeletonCards
                  : articles.length === 0
                  ? <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>{t('not_found_period')}</div>
                  : articles.map(article => (
                      <Link key={article.id} href={`/articles/${article.slug}`} className="photo-grid-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="photo-grid-img">
                          {article.preview_image_url ? (
                            <Image src={article.preview_image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="300px" />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.7"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                          )}
                          <div className="photo-count-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            {t('tab_videos')}
                          </div>
                        </div>
                        <div className="photo-grid-info">
                          <h4 className="photo-grid-title">{article.title}</h4>
                          <div className="photo-grid-meta">
                            {article.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LocationIcon /> {article.location}</span>}
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon /> {formatDate(article.created, lang)}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                }
              </div>
              <Pagination />
            </>
          )}

          {/* ТРАНСЛЯЦИИ */}
          {activeTab === 'broadcasts' && (
            <>
              <div className="photo-grid-2x2">
                {loadingList ? skeletonCards
                  : broadcasts.length === 0
                  ? <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>{t('no_broadcasts')}</div>
                  : broadcasts.map(broadcast => (
                      <Link key={broadcast.id} href={`/photo-video/broadcasts/${broadcast.id}`} className="photo-grid-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="photo-grid-img" style={{ position: 'relative', overflow: 'hidden' }}>
                          <img src={broadcast.image ?? '/images/favicon-square.png'} alt={broadcast.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="photo-count-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49"/></svg>
                            {t('tab_broadcasts')}
                          </div>
                        </div>
                        <div className="photo-grid-info">
                          <h4 className="photo-grid-title">{broadcast.title}</h4>
                          <div className="photo-grid-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon /> {formatDate(broadcast.event_date, lang)}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                }
              </div>
              <Pagination />
            </>
          )}
        </div>
      </section>

      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </>
  )
}
