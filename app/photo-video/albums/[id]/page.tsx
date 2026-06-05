'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAlbumById, getArticleBySlug, formatDate, type Album, type ArticleDetail } from '@/lib/api'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'
import { createPortal } from 'react-dom'
import ScientificArticlesSection from '@/components/scientific-section/ScientificArticlesSection'

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 20 }}>
      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        <img src={src} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4, display: 'block' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: -16, right: -16, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#333', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>×</button>
      </div>
    </div>,
    document.body
  )
}

export default function AlbumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { lang } = useLang()
  const t = makeT('photo_video', lang)

  const albumId = Number(params.id)
  const [album, setAlbum] = useState<Album | null>(null)
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'article' | 'video'>('photos')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!albumId) return
    setLoading(true)
    getAlbumById(albumId)
      .then(async (data) => {
        setAlbum(data)
        if (data.article_slug) {
          try {
            const detail = await getArticleBySlug(data.article_slug, lang)
            setArticle(detail)
            const albumInArticle = detail.albums.find(a => a.id === albumId)
            if (albumInArticle) setAlbum({ ...data, photos: albumInArticle.photos })
          } catch {}
        }
      })
      .catch(() => router.push('/photo-video'))
      .finally(() => setLoading(false))
  }, [albumId, lang])

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', maxWidth: 1260, margin: '0 auto' }}>
        <div style={{ height: 32, background: '#eee', borderRadius: 4, width: 200, marginBottom: 24, animation: 'skeletonPulse 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/3', background: '#e0e0e0', borderRadius: 4, animation: 'skeletonPulse 1.5s infinite' }} />
          ))}
        </div>
        <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    )
  }

  if (!album) return null

  const hasArticle = !!article
  const hasVideos = (article?.videos ?? []).length > 0

  return (
    <>
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Назад */}
        <Link href="/photo-video" className="article-back-btn" style={{ marginBottom: 24, display: 'inline-flex' }} translate="no">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('back_to_albums')}
        </Link>

        {/* Заголовок — меняется на title статьи когда активен таб "Статья" */}
        <h1 style={{ fontWeight: 700, fontSize: 28, color: '#2b2b2b', margin: '0 0 8px' }}>
          {activeTab === 'article' && article ? article.title : album.title}
        </h1>
        <p style={{ fontSize: 13, color: '#7C7C7C', marginBottom: 32 }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ marginRight: 4, verticalAlign: 'middle' }}>
            <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {formatDate(album.created, lang)}
        </p>

        {/* Табы */}
        <div className="article-tabs-wrapper" style={{ marginBottom: 32 }}>
          <div className="article-tabs">
            <button className={`article-tab ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              {t('tab_photos')} ({album.photos.length})
            </button>
            {hasArticle && (
              <button className={`article-tab ${activeTab === 'article' ? 'active' : ''}`} onClick={() => setActiveTab('article')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                {t('tab_article')}
              </button>
            )}
            {hasVideos && (
              <button className={`article-tab ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                {t('tab_videos')} ({(article?.videos ?? []).length})
              </button>
            )}
          </div>
        </div>

        {/* Фотографии */}
        {activeTab === 'photos' && (
          album.photos.length === 0
            ? <p style={{ color: '#7C7C7C', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Фотографий нет</p>
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {album.photos.map(photo => (
                  <div key={photo.id} onClick={() => setLightboxSrc(photo.image)} style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: 4, background: '#f0f0f0' }}>
                    <img src={photo.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                ))}
              </div>
            )
        )}

        {/* Статья */}
        {activeTab === 'article' && article && (
          <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: article.description }} />
        )}

        {/* Видео */}
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {(article?.videos ?? []).map(video => {
              const embed = getVideoEmbed(video.video_url)
              if (!embed) return null
              if (embed.type === 'iframe') return <iframe key={video.id} src={embed.src} style={{ width: '100%', height: 480, border: 'none', borderRadius: 8 }} allowFullScreen allow="autoplay; encrypted-media" />
              return <video key={video.id} controls style={{ width: '100%', borderRadius: 8 }}><source src={embed.src} /></video>
            })}
          </div>
        )}
      </div>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}
