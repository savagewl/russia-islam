'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBroadcasts, formatDate, type Broadcast } from '@/lib/api'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'
import ScientificArticlesSection from '@/components/scientific-section/ScientificArticlesSection'

export default function BroadcastDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { lang } = useLang()
  const t = makeT('photo_video', lang)

  const broadcastId = Number(params.id)
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!broadcastId) return
    setLoading(true)
    getBroadcasts({ page: 1, page_size: 100, lang })
      .then(data => {
        const found = data.results.find(b => b.id === broadcastId)
        if (!found) router.push('/photo-video')
        else setBroadcast(found)
      })
      .catch(() => router.push('/photo-video'))
      .finally(() => setLoading(false))
  }, [broadcastId, lang])

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', maxWidth: 1260, margin: '0 auto' }}>
        <div style={{ height: 32, background: '#eee', borderRadius: 4, width: 200, marginBottom: 24, animation: 'skeletonPulse 1.5s infinite' }} />
        <div style={{ height: 480, background: '#e0e0e0', borderRadius: 8, animation: 'skeletonPulse 1.5s infinite' }} />
        <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    )
  }

  if (!broadcast) return null

  const embed = getVideoEmbed(broadcast.video_url)

  return (
    <>
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '40px 20px 60px' }}>
        <Link href="/photo-video" className="article-back-btn" style={{ marginBottom: 24, display: 'inline-flex' }} translate="no">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('tab_broadcasts')}
        </Link>

        <p style={{ fontSize: 13, color: '#7C7C7C', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M10.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V11C1.5 11.5523 1.94772 12 2.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V3C11.5 2.44772 11.0523 2 10.5 2Z" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 1V3M4 1V3M1.5 5H11.5" stroke="#7C7C7C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {formatDate(broadcast.event_date, lang)}
        </p>

        <h1 style={{ fontWeight: 700, fontSize: 28, color: '#2b2b2b', margin: '0 0 32px', lineHeight: 1.3 }}>{broadcast.title}</h1>

        {embed ? (
          embed.type === 'iframe' ? (
            <iframe
              src={embed.src}
              style={{ width: '100%', height: 560, border: 'none', borderRadius: 8, display: 'block' }}
              allowFullScreen allow="autoplay; encrypted-media"
            />
          ) : embed.type === 'video' ? (
            <video controls style={{ width: '100%', borderRadius: 8, display: 'block', background: '#000' }}>
              <source src={embed.src} />
            </video>
          ) : (
            <div style={{ padding: '60px 24px', textAlign: 'center', background: '#f8f8f8', borderRadius: 8, border: '1px solid #e8e8e8' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" style={{ marginBottom: 20 }}>
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <p style={{ color: '#7C7C7C', fontSize: 15, marginBottom: 20 }} translate="no">{t('video_unsupported')}</p>
              <a href={embed.src} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#393939', color: '#fff', borderRadius: 6, fontSize: 15, textDecoration: 'none', fontFamily: 'inherit' }}>
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
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>{t('player_error')}</div>
        )}
      </div>

      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}
