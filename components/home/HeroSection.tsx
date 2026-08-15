'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import '../../styles/hero.css'
import { getBroadcast, getQuotes, type Broadcast, type Quote } from '@/lib/api'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { useLang } from '@/lib/LanguageContext'

interface HeroSectionProps {
  onGroupClick?: () => void
}

export default function HeroSection({ onGroupClick }: HeroSectionProps) {
  const [activeSlideMain, setActiveSlideMain] = useState(0)
  const [activeSlideSpeaker, setActiveSlideSpeaker] = useState(0)
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [quotes, setQuotes] = useState<Quote[] | null>(null)
  const { lang } = useLang()

  const mainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speakerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speakerSlidesLengthRef = useRef(1)

  const mainSlidesData = {
    ru: [
      { image: '/images/222.jpg',   title: '2003 год – Рукопожатие с исламским миром' },
      { image: '/images/bihh2.jpg', title: '2006 год – Создание Группы стратегического видения «Россия – исламский мир»' },
      { image: '/images/bihh.jpg',  title: '2026 год – 20-летие Группы стратегического видения «Россия – Исламский мир»' },
    ],
    en: [
      { image: '/images/222.jpg',   title: '2003 – A step toward the Islamic world' },
      { image: '/images/bihh2.jpg', title: '2006 – Strategic Vision Group "Russia – Islamic world" establishment' },
      { image: '/images/bihh.jpg',  title: '2026 – 20th anniversary of the Strategic Vision Group "Russia – Islamic world"' },
    ],
    ar: [
      { image: '/images/222.jpg',   title: '2003 – خطوة نحو العالم الإسلامي' },
      { image: '/images/bihh2.jpg', title: '2006 – تأسيس مجموعة الرؤية الإستراتيجية "روسيا – العالم الإسلامي"' },
      { image: '/images/bihh.jpg',  title: '2026 – الذكرى العشرون لتأسيس مجموعة الرؤية الإستراتيجية "روسيا – العالم الإسلامي"' },
    ],
  }

  const currentLang = (lang === 'en' || lang === 'ar') ? lang : 'ru'
  const mainSlides = mainSlidesData[currentLang]

  const isLoading = quotes === null
  const isEmpty = quotes !== null && quotes.length === 0
  const finalSpeakerSlides = quotes?.map(q => ({ image: q.image, name: q.name, position: q.short_description, quote: q.text })) ?? []
  speakerSlidesLengthRef.current = finalSpeakerSlides.length


  const startMainTimer = () => {
    if (mainTimerRef.current) clearInterval(mainTimerRef.current)
    mainTimerRef.current = setInterval(() => {
      setActiveSlideMain(prev => (prev + 1) % mainSlides.length)
    }, 420000)
  }

  const startSpeakerTimer = () => {
    if (speakerTimerRef.current) clearInterval(speakerTimerRef.current)
    speakerTimerRef.current = setInterval(() => {
      setActiveSlideSpeaker(prev => (prev + 1) % (speakerSlidesLengthRef.current || 1))
    }, 420000)
  }

  useEffect(() => {
    startMainTimer()
    startSpeakerTimer()
    return () => {
      if (mainTimerRef.current) clearInterval(mainTimerRef.current)
      if (speakerTimerRef.current) clearInterval(speakerTimerRef.current)
    }
  }, [])

  const handleMainDot = (index: number) => {
    setActiveSlideMain(index)
    startMainTimer()
  }

  const handleSpeakerDot = (index: number) => {
    setActiveSlideSpeaker(index)
    startSpeakerTimer()
  }

  useEffect(() => {
    getBroadcast(currentLang).then(data => setBroadcast(data))
  }, [currentLang])

  useEffect(() => {
    setQuotes(null)
    getQuotes({ lang: currentLang })
      .then(data => setQuotes(data.results))
      .catch(() => setQuotes([]))
  }, [currentLang])

  useEffect(() => {
    if (activeSlideSpeaker >= finalSpeakerSlides.length) setActiveSlideSpeaker(0)
  }, [quotes])

  const getBroadcastState = (): 'upcoming' | 'live' | 'recorded' | null => {
    if (!broadcast) return null
    const now = new Date()
    const eventDate = new Date(broadcast.event_date)
    if (eventDate > now) return 'upcoming'
    const diffHours = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60)
    if (diffHours <= 3) return 'live'
    return 'recorded'
  }

  const broadcastState = getBroadcastState()

  const getBroadcastLabel = () => {
    if (!broadcast || !broadcastState) return ''
    if (broadcastState === 'upcoming') {
      const d = new Date(broadcast.event_date)
      const locale = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar-SA-u-nu-latn' : 'ru-RU'
      const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
      const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      if (lang === 'en') return `Live broadcast starts on ${date} at ${time}`
      if (lang === 'ar') return `يبدأ البث المباشر في ${date} الساعة ${time}`
      return `Прямая трансляция начнётся ${date} в ${time}`
    }
    if (broadcastState === 'live') {
      if (lang === 'en') return 'Watch live broadcast'
      if (lang === 'ar') return 'مشاهدة البث المباشر'
      return 'Смотреть трансляцию'
    }
    if (lang === 'en') return 'Watch broadcast recording'
    if (lang === 'ar') return 'مشاهدة تسجيل البث'
    return 'Смотреть запись трансляции'
  }

  const embed = broadcast ? getVideoEmbed(broadcast.video_url) : null

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left-wrapper">
              <div className="hero-left">
                <Image
                  src={mainSlides[activeSlideMain].image}
                  alt="Hero main"
                  width={913}
                  height={517}
                  className="hero-main-image"
                />

                {broadcast && broadcastState && (
                  <button
                    onClick={() => broadcastState !== 'upcoming' && setShowPopup(true)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#51AB64',
                      border: 'none',
                      padding: '8px 16px',
                      cursor: broadcastState !== 'upcoming' ? 'pointer' : 'default',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (broadcastState !== 'upcoming')
                        (e.currentTarget as HTMLButtonElement).style.background = '#3d9150'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#51AB64'
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#fff',
                      flexShrink: 0,
                      animation: broadcastState === 'live' ? 'broadcastPulse 1.2s infinite' : 'none',
                    }} />
                    <span style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                    }}>
                      {getBroadcastLabel()}
                    </span>
                  </button>
                )}

                <div className="hero-left-content">
                  <h2 className="hero-left-title" translate="no">
                    {mainSlides[activeSlideMain].title.split('\n').map((line, i) => (
                      <span key={i}>{line}{i < mainSlides[activeSlideMain].title.split('\n').length - 1 && <br />}</span>
                    ))}
                  </h2>
                  <button className="hero-more-btn" onClick={onGroupClick} translate="no" style={currentLang === 'ar' ? { direction: 'ltr' } : undefined}>
                    {currentLang === 'ar' ? (
                      <>
                        <span className="hero-btn-arrows">
                          <span className="arrow-3">{'<'}</span>
                          <span className="arrow-2">{'<'}</span>
                          <span className="arrow-1">{'<'}</span>
                        </span>
                        {'حول المجموعة'}
                      </>
                    ) : (
                      <>
                        {currentLang === 'en' ? 'About the Group' : 'О группе'}
                        <span className="hero-btn-arrows">
                          <span className="arrow-1">{'>'}</span>
                          <span className="arrow-2">{'>'}</span>
                          <span className="arrow-3">{'>'}</span>
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="hero-dots-container">
                {mainSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-dot ${activeSlideMain === index ? 'active' : ''}`}
                    onClick={() => handleMainDot(index)}
                  />
                ))}
              </div>
            </div>

            <div className="hero-right-wrapper">
              <div className="hero-right">
                {(isLoading || isEmpty) ? (
                  <div className="hero-right-overlay" style={{ position: 'static', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 260 }}>
                    {isEmpty && (
                      <p style={{ color: '#7C7C7C', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                        {currentLang === 'ar' ? 'لا توجد اقتباسات بعد' : currentLang === 'en' ? 'No quotes yet' : 'Цитат пока нет'}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="hero-right-image-container">
                      <Image
                        src={finalSpeakerSlides[activeSlideSpeaker].image}
                        alt={finalSpeakerSlides[activeSlideSpeaker].name}
                        width={313}
                        height={517}
                        className="hero-right-image"
                      />
                    </div>
                    <div className="hero-right-overlay">
                      <div className="hero-right-content" translate="no">
                        <div className="hero-right-name-container">
                          <h3 className="hero-right-name">{finalSpeakerSlides[activeSlideSpeaker].name}</h3>
                          <p className="hero-right-position">{finalSpeakerSlides[activeSlideSpeaker].position}</p>
                        </div>
                        <p className="hero-right-quote">
                          {finalSpeakerSlides[activeSlideSpeaker].quote}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isEmpty && (
                <div className="hero-dots-container">
                  {finalSpeakerSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`hero-dot ${activeSlideSpeaker === index ? 'active' : ''}`}
                      onClick={() => handleSpeakerDot(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showPopup && broadcast && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              borderRadius: 8,
              overflow: 'hidden',
              width: '100%',
              maxWidth: 900,
              position: 'relative',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              background: '#111',
              borderBottom: '1px solid #333',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#51AB64', flexShrink: 0,
                  animation: broadcastState === 'live' ? 'broadcastPulse 1.2s infinite' : 'none',
                }} />
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                  {broadcast.title}
                </span>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                  width: 32, height: 32, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 18, fontWeight: 700, transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              >×</button>
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              {embed?.type === 'iframe' ? (
                <iframe
                  src={embed.src}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none',
                  }}
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              ) : embed?.type === 'video' ? (
                <video
                  controls autoPlay
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
                >
                  <source src={embed.src} />
                </video>
              ) : embed?.type === 'redirect' ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 16, background: '#111',
                }}>
                  <p style={{ color: '#7C7C7C', fontSize: 14, margin: 0 }}>
                    {lang === 'en' ? 'This video is not available for inline viewing' : lang === 'ar' ? 'هذا الفيديو غير متاح للعرض المضمّن' : 'Видео недоступно для встроенного просмотра'}
                  </p>
                  <a
                    href={embed.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 24px', background: '#51AB64', color: '#fff',
                      textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 4,
                    }}
                  >
                    {lang === 'en' ? 'Open video' : lang === 'ar' ? 'فتح الفيديو' : 'Открыть видео'}
                  </a>
                </div>
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7C7C7C', fontSize: 14,
                }}>
                  {lang === 'en' ? 'Failed to load player' : lang === 'ar' ? 'تعذّر تحميل المشغّل' : 'Не удалось загрузить плеер'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes broadcastPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </>
  )
}