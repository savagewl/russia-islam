'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import type { ArticleDetail } from '@/lib/api'
import { getArticleBySlug, getCategoryLabel } from '@/lib/api'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'
import '../../../styles/scientificArticle.css'

function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        padding: 20,
      }}
    >
      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        <img
          src={src}
          alt="Фото"
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: 4,
            display: 'block',
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -16,
            right: -16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#333',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  )
}

function processFootnotes(html: string): string {
  const MARKER = '__FN__'

  // Шаг 1: помечаем определения сносок (абзацы начинающиеся с [n])
  let result = html.replace(
    /(<(?:p|div|li)[^>]*>\s*)\[(\d+)\]/g,
    (_, tag, num) => `${tag}${MARKER}${num}${MARKER}`
  )

  // Шаг 2: оставшиеся [n] в тексте делаем кликабельными ссылками
  result = result.replace(
    /\[(\d+)\]/g,
    (_, num) => `<a href="#fn-${num}" class="article-footnote-ref">[${num}]</a>`
  )

  // Шаг 3: восстанавливаем определения с id якорями
  result = result.replace(
    /__FN__(\d+)__FN__/g,
    (_, num) => `<span id="fn-${num}" style="scroll-margin-top:80px;font-weight:600">[${num}]</span>`
  )

  return result
}

function renderWithLinks(text: string) {
  const urlRegex = /https?:\/\/[^\s<>"]+/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const url = match[0]
    parts.push(
      <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="article-link">
        {url}
      </a>
    )
    lastIndex = match.index + url.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 1 ? parts : text
}

export default function ArticleTabs({ article, slug }: { article: ArticleDetail; slug: string }) {
  const [activeTab, setActiveTab] = useState('article')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const { lang } = useLang()
  const t = makeT('articles', lang)
  const [translatedArticle, setTranslatedArticle] = useState<ArticleDetail>(article)

  useEffect(() => {
    if (lang === 'ru') {
      setTranslatedArticle(article)
      return
    }
    getArticleBySlug(slug, lang)
      .then((data) => setTranslatedArticle(data))
      .catch(() => setTranslatedArticle(article))
  }, [lang, slug])

  const albumPhotos = (article.albums ?? []).flatMap(a => a.photos ?? [])

  const hasPhotos = albumPhotos.length > 0
  const hasVideos = (article.videos ?? []).length > 0


  // Для арабского RTL скобки переворачиваются браузером.
  // Используем LRM (U+200E) чтобы принудительно сохранить порядок (число).
  const formatCount = (n: number) => {
    if (lang === 'ar') {
      return `\u200E(${n})\u200E`
    }
    return `(${n})`
  }

  return (
    <>
      <div className="article-title-wrapper" translate="no">
        <h1 className="article-title">{translatedArticle.title}</h1>
      </div>

      {translatedArticle.category_display && (
        <div style={{ marginBottom: '20px' }} translate="no">
          <span className="news-group-badge" style={{ background: '#4CAF50' }}>
            {getCategoryLabel(translatedArticle.category, lang, translatedArticle.category_display)}
          </span>
        </div>
      )}

      <div className="article-tabs-wrapper">
        <div className="article-tabs" translate="no">
          <button
            className={`article-tab ${activeTab === 'article' ? 'active' : ''}`}
            onClick={() => setActiveTab('article')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            {t('tab_article')}
          </button>

          {hasPhotos && (
            <button
              className={`article-tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              {t('tab_photos')} {formatCount(albumPhotos.length)}
            </button>
          )}

          {hasVideos && (
            <button
              className={`article-tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              {t('tab_video')} {formatCount(article.videos.length)}
            </button>
          )}
        </div>
      </div>

      <div className="article-content-area">

        {activeTab === 'article' && (
          <div className="article-scroll-container" translate="no">
            <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: processFootnotes(translatedArticle.description) }} />

            {translatedArticle.source && (
              <p style={{ textAlign: 'right', fontSize: 13, color: '#7C7C7C', marginTop: 16 }}>
                {t('source')}: {renderWithLinks(translatedArticle.source)}
              </p>
            )}

            {translatedArticle.expert_detail && (
              <div className="article-expert-block">
                {translatedArticle.expert_detail.preview_image_url && (
                  <div className="article-expert-avatar">
                    <Image
                      src={translatedArticle.expert_detail.preview_image_url}
                      alt={translatedArticle.expert_detail.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="article-expert-info">
                  <Link href={`/experts/${translatedArticle.expert_detail.id}`} className="article-expert-name">
                    {translatedArticle.expert_detail.name}
                  </Link>
                  <p className="article-expert-desc">{translatedArticle.expert_detail.description}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="photos-no-scroll-container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              width: '100%',
            }}>
              {albumPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.image)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#f0f0f0',
                    borderRadius: 4,
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={`Фото ${photo.id}`}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" style={{ opacity: 0, transition: 'opacity 0.2s' }}>
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="article-scroll-container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {article.videos.map((video, idx) => {
                const embed = getVideoEmbed(video.video_url)
                if (!embed) return null
                return (
                  <div key={video.id} style={{
                    background: '#F8F9FA',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #E0E0E0',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#393939" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#393939' }}>
                        {t('tab_video')} {idx + 1}
                      </span>
                    </div>
                    {embed.type === 'iframe' ? (
                      <iframe
                        src={embed.src}
                        style={{ width: '100%', height: 480, border: 'none', display: 'block' }}
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                      />
                    ) : embed.type === 'video' ? (
                      <video controls style={{ width: '100%', display: 'block', background: '#000' }}>
                        <source src={embed.src} />
                      </video>
                    ) : (
                      /* redirect — показываем кнопку для перехода на внешний ресурс */
                      <div style={{
                        padding: '32px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 16,
                        background: '#F8F9FA',
                      }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7C7C7C" strokeWidth="1.5">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                        <p style={{ fontSize: 14, color: '#7C7C7C', margin: 0, textAlign: 'center' }}>
                          {t('video_unsupported')}
                        </p>
                        <a
                          href={embed.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 24px',
                            background: '#393939',
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: 500,
                            borderRadius: 4,
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#393939')}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          {t('open_video')}
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
      {selectedPhoto && (
        <PhotoLightbox src={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  )
}