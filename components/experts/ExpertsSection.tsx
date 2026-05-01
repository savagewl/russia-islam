'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import '../../styles/experts-section.css'
import { getExperts, type Expert } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

export default function ExpertsSection() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [thumbStartLeft, setThumbStartLeft] = useState(0)
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLang()
  const t = makeT('experts', lang)
  useEffect(() => {
    setLoading(true)
    getExperts({ page: 1, lang })
      .then((data) => setExperts(data.results))
      .catch(() => setExperts([]))
      .finally(() => setLoading(false))
  }, [lang])

  const updateThumb = () => {
    if (!scrollWrapperRef.current || !thumbRef.current) return
    const wrapper = scrollWrapperRef.current
    const thumb = thumbRef.current
    const scrollWidth = wrapper.scrollWidth - wrapper.clientWidth
    const scrollerWidth = wrapper.clientWidth
    const thumbWidth = (scrollerWidth / wrapper.scrollWidth) * scrollerWidth
    const maxThumbLeft = scrollerWidth - thumbWidth
    const thumbPosition = scrollWidth > 0 ? (wrapper.scrollLeft / scrollWidth) * maxThumbLeft : 0
    thumb.style.width = `${thumbWidth}px`
    thumb.style.left = `${thumbPosition}px`
  }

  useEffect(() => {
    const wrapper = scrollWrapperRef.current
    if (!wrapper) return
    wrapper.addEventListener('scroll', updateThumb)
    setTimeout(updateThumb, 100)
    return () => wrapper.removeEventListener('scroll', updateThumb)
  }, [experts])



  useEffect(() => {
    const wrapper = scrollWrapperRef.current
    if (!wrapper) return
    let isDown = false, startMouseX = 0, startScrollLeft = 0
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return
      isDown = true; startMouseX = e.clientX; startScrollLeft = wrapper.scrollLeft
      wrapper.style.cursor = 'grabbing'; wrapper.style.userSelect = 'none'
    }
    const onMouseMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); wrapper.scrollLeft = startScrollLeft - (e.clientX - startMouseX) }
    const onMouseUp = () => { isDown = false; wrapper.style.cursor = 'grab'; wrapper.style.userSelect = '' }
    wrapper.style.cursor = 'grab'
    wrapper.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { wrapper.removeEventListener('mousedown', onMouseDown); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); setIsDragging(true); setStartX(e.clientX)
    if (thumbRef.current) setThumbStartLeft(thumbRef.current.offsetLeft)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollWrapperRef.current || !thumbRef.current) return
      const wrapper = scrollWrapperRef.current; const thumb = thumbRef.current
      const scrollerWidth = wrapper.clientWidth; const thumbWidth = thumb.offsetWidth
      const maxThumbLeft = scrollerWidth - thumbWidth
      const newLeft = Math.max(0, Math.min(thumbStartLeft + (e.clientX - startX), maxThumbLeft))
      thumb.style.left = `${newLeft}px`
      wrapper.scrollLeft = (newLeft / maxThumbLeft) * (wrapper.scrollWidth - wrapper.clientWidth)
    }
    const handleMouseUp = () => setIsDragging(false)
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp) }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
  }, [isDragging, startX, thumbStartLeft])

  return (
    <section className="experts-section">
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '140px', pointerEvents: 'none', zIndex: 0, backgroundImage: `url('/images/ornament.jpg')`, backgroundRepeat: 'repeat-y', backgroundPosition: 'right top', backgroundSize: '180px auto', WebkitMaskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)', maskImage: 'linear-gradient(to left, black 0%, black 70%, transparent 100%)' }} />
      <div className="experts-container">
        <div className="experts-header-row"><h2 className="experts-title" translate="no">{t('title')}</h2></div>
        <div className="experts-scroll-wrapper" ref={scrollWrapperRef}>
          <div className="experts-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="expert-card" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
                    <div className="expert-img-wrapper" style={{ background: '#e0e0e0' }} />
                    <div className="expert-info">
                      <div className="expert-text-block">
                        <div style={{ height: 16, background: '#eee', borderRadius: 3, marginBottom: 8 }} />
                        <div style={{ height: 12, background: '#eee', borderRadius: 3 }} />
                        <div style={{ height: 12, background: '#eee', borderRadius: 3, width: '70%', marginTop: 4 }} />
                      </div>
                      <div style={{ height: 33, background: '#eee', borderRadius: 2, width: 139 }} />
                    </div>
                  </div>
                ))
              : experts.map((expert) => (
                  <div key={expert.id} className="expert-card">
                    <div className="expert-img-wrapper">
                      {expert.preview_image_url ? (
                        <Image src={expert.preview_image_url} alt={expert.name} width={186} height={187} className="expert-img" draggable={false} />
                      ) : (<div style={{ width: '100%', height: '100%', background: '#e0e0e0' }} />)}
                    </div>
                    <div className="expert-info">
                      <div className="expert-text-block">
                        <h4 className="expert-name">{expert.name}</h4>
                        <p className="expert-desc">{expert.description}</p>
                      </div>
                      <Link href={`/experts/${expert.id}`} className="expert-btn" translate="no">
                        {t('more')}
                        <span className="expert-btn-arrows" dir="ltr">{lang === 'ar' ? '‹‹‹' : '›››'}</span>
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <div className="experts-scroller">
          <div ref={thumbRef} className="experts-scroller-thumb" onMouseDown={handleThumbMouseDown} style={{ cursor: isDragging ? 'grabbing' : 'grab' }} />
        </div>
      </div>
      <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </section>
  )
}