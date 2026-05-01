'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import '../../styles/aboutGroup.css'
import { getArticles, type ArticlePreview, type PaginatedResponse } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'

const statsNumbers = ['57', '150+', '24', '12']

const texts = {
  ru: {
    stat1: 'Стран-участниц ОИС',
    stat2: 'Экспертов и партнёров',
    stat3: 'Реализованных проекта',
    stat4: 'Регионов присутствия',
    aboutHeading: 'О ГРУППЕ',
    aboutP1: 'Группа стратегического видения «Россия – Исламский мир»  –  это международная платформа для диалога и сотрудничества между Россией и мусульманскими странами.',
    aboutP2: 'Она объединяет государственных деятелей, дипломатов, экспертов, религиозных лидеров, а также представителей общественности, способствуя развитию народной дипломатии  –  прямого общения между людьми, культурами и сообществами.',
    aboutP3: 'Цель группы  –  укрепление взаимопонимания, развитие партнёрства и формирование устойчивых связей между Россией и исламским миром как на официальном, так и на общественном уровне.',
    missionHeading: 'МИССИЯ',
    missionText: 'Содействие развитию отношений Российской Федерации с мусульманскими странами посредством инструментов межкультурного и межцивилизационного сотрудничества.',
    directionsHeading: 'НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ',
    dir1: 'Инвестиционно-экономическое',
    dir2: 'Социально-культурное',
    dir3: 'Гуманитарное',
    dir4: 'Молодежное',
    foundersTitle: 'Основатели и руководители',
    moreBtn: 'Подробнее',
    noInfo: 'Информация появится позже',
  },
  en: {
    stat1: 'OIC Member States',
    stat2: 'Experts and Partners',
    stat3: 'Projects Completed',
    stat4: 'Regions of Presence',
    aboutHeading: 'About the Group',
    aboutP1: 'The Strategic Vision Group "Russia – Islamic world" is an international platform for dialogue and cooperation between Russia and Muslim countries.',
    aboutP2: 'It brings together government officials, diplomats, experts, religious leaders, and representatives of civil society, fostering the development of people-to-people diplomacy – direct engagement between individuals, cultures, and communities.',
    aboutP3: 'The Group\'s objective is to strengthen mutual understanding, advance partnerships, and build sustainable ties between Russia and the Islamic world at both official and public levels.',
    missionHeading: 'MISSION',
    missionText: 'To enhance relations between the Russian Federation and Muslim countries by promoting intercultural dialogue and civilizational cooperation.',
    directionsHeading: 'KEY AREAS',
    dir1: 'investment and economic cooperation',
    dir2: 'social and cultural development',
    dir3: 'humanitarian engagement',
    dir4: 'youth cooperation',
    foundersTitle: 'Founders and Leadership',
    moreBtn: 'More',
    noInfo: 'More information coming soon',
  },
  ar: {
    stat1: 'الدول الأعضاء في منظمة التعاون الإسلامي',
    stat2: 'الخبراء والشركاء',
    stat3: 'المشاريع',
    stat4: 'مناطق التواجد',
    aboutHeading: 'معلومات عن المجموعة',
    aboutP1: 'تُعد مجموعة الرؤية الاستراتيجية "روسيا – العالم الإسلامي" منصة دولية للحوار والتعاون بين روسيا والدول الإسلامية.',
    aboutP2: 'وتجمع المجموعة بين المسؤولين الحكوميين والدبلوماسيين والخبراء والقادة الدينيين، إلى جانب ممثلي المجتمع، بما يسهم في تعزيز الدبلوماسية الشعبية – أي التواصل المباشر بين الأفراد والثقافات والمجتمعات.',
    aboutP3: 'وتهدف المجموعة إلى تعزيز التفاهم المتبادل، وتطوير الشراكات، وبناء علاقات مستدامة بين روسيا والعالم الإسلامي على المستويين الرسمي والمجتمعي.',
    missionHeading: 'الرسالة',
    missionText: 'تعزيز تطوير العلاقات بين روسيا الاتحادية والدول الإسلامية من خلال أدوات التعاون بين الثقافات والحضارات.',
    directionsHeading: 'مجالات النشاط',
    dir1: 'التعاون الاقتصادي والاستثماري',
    dir2: 'التبادل الثقافي والاجتماعي',
    dir3: 'العمل الإنساني',
    dir4: 'تعزيز التعاون الشبابي',
    foundersTitle: 'المؤسسون والرؤساء',
    moreBtn: 'المزيد',
    noInfo: 'سيتم نشر المعلومات لاحقًا',
  },
}

export default function AboutSection({ initialFounders }: { initialFounders?: PaginatedResponse<ArticlePreview> | null } = {}) {
  const [founders, setFounders] = useState<ArticlePreview[]>(
    initialFounders?.results ?? []
  )
  const [loading, setLoading] = useState(!initialFounders)

  const { lang } = useLang()
  const t = texts[lang as keyof typeof texts] ?? texts.ru

  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    if (initialFounders && lang === 'ru') return

    setLoading(true)
    getArticles({ category: 'founders_and_executives', page: 1, lang })
      .then(data => setFounders(data.results))
      .catch(() => setFounders([]))
      .finally(() => setLoading(false))
  }, [lang])

  const updateThumb = () => {
    if (!scrollRef.current || !trackRef.current || !thumbRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const trackWidth = trackRef.current.clientWidth
    if (scrollWidth <= clientWidth) { thumbRef.current.style.display = 'none'; return }
    thumbRef.current.style.display = 'block'
    const thumbWidth = Math.max((clientWidth / scrollWidth) * trackWidth, 40)
    thumbRef.current.style.width = `${thumbWidth}px`
    const maxScroll = scrollWidth - clientWidth
    const maxThumbLeft = trackWidth - thumbWidth
    thumbRef.current.style.transform = `translateX(${(scrollLeft / maxScroll) * maxThumbLeft}px)`
  }

  useEffect(() => { setTimeout(updateThumb, 100); window.addEventListener('resize', updateThumb); return () => window.removeEventListener('resize', updateThumb) }, [founders])

  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    const handleWheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; e.preventDefault(); el.scrollLeft += e.deltaY * 2 }
    el.addEventListener('wheel', handleWheel, { passive: false }); return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    let isDown = false, startMouseX = 0, startScrollLeft = 0
    const onMouseDown = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a, button')) return; isDown = true; startMouseX = e.clientX; startScrollLeft = el.scrollLeft; el.style.cursor = 'grabbing'; document.body.style.userSelect = 'none' }
    const onMouseMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = startScrollLeft - (e.clientX - startMouseX) }
    const onMouseUp = () => { isDown = false; el.style.cursor = 'grab'; document.body.style.userSelect = '' }
    el.style.cursor = 'grab'; el.addEventListener('mousedown', onMouseDown); window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp)
    return () => { el.removeEventListener('mousedown', onMouseDown); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  const handleThumbMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setIsDragging(true); startXRef.current = e.pageX; if (scrollRef.current) scrollLeftRef.current = scrollRef.current.scrollLeft; document.body.style.userSelect = 'none' }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current || !trackRef.current || !thumbRef.current) return
      const walk = e.pageX - startXRef.current; const { scrollWidth, clientWidth } = scrollRef.current
      const trackWidth = trackRef.current.clientWidth; const thumbWidth = thumbRef.current.clientWidth
      const maxScroll = scrollWidth - clientWidth; const maxThumbLeft = trackWidth - thumbWidth
      scrollRef.current.scrollLeft = scrollLeftRef.current + (walk * maxScroll / maxThumbLeft)
    }
    const handleMouseUp = () => { setIsDragging(false); document.body.style.userSelect = '' }
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp) }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
  }, [isDragging])

  return (
    <section className="about-wrapper">
      <div className="about-top-block">
        <div className="about-text-container">
          <div className="about-who-we-are" translate="no">
            <h2 className="about-heading">{t.aboutHeading}</h2>
            <div className="about-paragraphs">
              <p>{t.aboutP1}</p>
              <p>{t.aboutP2}</p>
              <p>{t.aboutP3}</p>
            </div>
          </div>
          <div className="about-mission-directions" translate="no">
            <div className="about-mission">
              <h2 className="about-heading">{t.missionHeading}</h2>
              <p>{t.missionText}</p>
            </div>
            <div className="about-directions">
              <h2 className="about-heading">{t.directionsHeading}</h2>
              <p>{t.dir1}</p>
              <p>{t.dir2}</p>
              <p>{t.dir3}</p>
              <p>{t.dir4}</p>
            </div>
          </div>
        </div>
        <div className="about-stats-row">
          {statsNumbers.map((num, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{num}</div>
              <div className="stat-divider"></div>
              <div className="stat-text" translate="no">{t[`stat${i + 1}` as 'stat1']}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="founders-block">
        <div className="founders-content">
          <h2 className="founders-main-title" translate="no">{t.foundersTitle}</h2>
          <div className="founders-cards-row" ref={scrollRef} onScroll={updateThumb}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="founder-card" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                    <div className="founder-img-wrapper" style={{ background: '#e0e0e0' }} />
                    <div className="founder-info">
                      <div style={{ height: 14, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                      <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '80%', marginBottom: 4 }} />
                      <div style={{ height: 10, background: '#eee', borderRadius: 3, width: '60%' }} />
                    </div>
                  </div>
                ))
              : founders.length === 0
              ? (<div style={{ padding: '40px 0', color: '#7C7C7C', fontSize: 15 }}>{t.noInfo}</div>)
              : founders.map((founder) => (
                  <div key={founder.id} className="founder-card">
                    <div className="founder-img-wrapper">
                      {founder.preview_image_url ? (
                        <Image src={founder.preview_image_url} alt={founder.title} fill className="founder-img" draggable={false} style={{ objectFit: 'cover' }} sizes="155px" />
                      ) : (<div style={{ width: '100%', height: '100%', background: '#e0e0e0' }} />)}
                    </div>
                    <div className="founder-info">
                      <h4 className="founder-name">{founder.title}</h4>
                      <p className="founder-desc">{founder.short_description}</p>
                      <Link href={`/articles/${founder.slug}`} className="founder-more-btn">{lang === 'ar' ? <><span className="arrows">‹‹‹</span> {t.moreBtn}</> : <>{t.moreBtn} <span className="arrows">›››</span></>}</Link>
                    </div>
                  </div>
                ))}
          </div>
          <div className="founders-scroller" ref={trackRef}>
            <div className="founders-scroller-thumb" ref={thumbRef} onMouseDown={handleThumbMouseDown} style={{ cursor: isDragging ? 'grabbing' : 'grab' }} />
          </div>
        </div>
      </div>
      <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </section>
  )
}