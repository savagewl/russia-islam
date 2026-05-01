'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import '../../styles/islamInRussia.css'
import ScientificArticlesSection from '../scientific-section/ScientificArticlesSection'
import { getArticles, formatDate, type ArticlePreview, type PaginatedResponse } from '@/lib/api'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 0C4.1 0 1.75 2.35 1.75 5.25C1.75 9.1875 7 14 7 14C7 14 12.25 9.1875 12.25 5.25C12.25 2.35 9.9 0 7 0ZM7 7.125C5.9625 7.125 5.125 6.2875 5.125 5.25C5.125 4.2125 5.9625 3.375 7 3.375C8.0375 3.375 8.875 4.2125 8.875 5.25C8.875 6.2875 8.0375 7.125 7 7.125Z" fill="currentColor"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.0833 1.75H10.5V0.583333H9.33333V1.75H4.66667V0.583333H3.5V1.75H2.91667C2.26917 1.75 1.75583 2.275 1.75583 2.91667L1.75 12.25C1.75 12.8917 2.26917 13.4167 2.91667 13.4167H11.0833C11.725 13.4167 12.25 12.8917 12.25 12.25V2.91667C12.25 2.275 11.725 1.75 11.0833 1.75ZM11.0833 12.25H2.91667V4.66667H11.0833V12.25Z" fill="currentColor"/>
  </svg>
)

function SkeletonSmall() {
  return (
    <div className="islam-card-small" style={{ animation: 'skeletonPulse 1.5s infinite' }}>
      <div className="card-image-wrapper" style={{ background: '#e0e0e0' }} />
      <div className="card-content-small">
        <div style={{ height: 14, background: '#eee', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 14, background: '#eee', borderRadius: 4, width: '75%', marginBottom: 8 }} />
        <div style={{ height: 10, background: '#eee', borderRadius: 4, width: '50%', marginTop: 'auto' }} />
      </div>
    </div>
  )
}

function SkeletonLarge() {
  return (
    <div className="islam-card-large" style={{ background: '#e0e0e0', animation: 'skeletonPulse 1.5s infinite' }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%',
        padding: '24px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))'
      }}>
        <div style={{ height: 12, background: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: 10, width: '40%' }} />
        <div style={{ height: 20, background: 'rgba(255,255,255,0.3)', borderRadius: 4, width: '80%' }} />
      </div>
    </div>
  )
}

export default function IslamInRussia({ initialData }: { initialData?: PaginatedResponse<ArticlePreview> | null } = {}) {
  const [articles, setArticles] = useState<ArticlePreview[]>(
    initialData?.results ?? []
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialData?.count ?? 0)
  const [loading, setLoading] = useState(!initialData)

  const { lang } = useLang()
  const tA = makeT('articles', lang)
  const tC = makeT('calendar', lang)
  const isRtl = lang === 'ar'

  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const MONTHS: Record<string, string[]> = {
    ru: ['ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ','ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ'],
    en: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
    ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  }
  const MONTHS_SHORT: Record<string, string[]> = {
    ru: ['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'],
    en: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
    ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  }
  const MONTHS_CURRENT = MONTHS[lang] ?? MONTHS.ru
  const MONTHS_SHORT_CURRENT = MONTHS_SHORT[lang] ?? MONTHS_SHORT.ru
  const DAYS: Record<string, string[]> = {
    ru: ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'],
    en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    ar: ['اث','ثل','أر','خم','جم','سبت','أحد'],
  }
  const DAYS_CURRENT = DAYS[lang] ?? DAYS.ru
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const PAGE_SIZE = 6
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  useEffect(() => { setCurrentPage(1) }, [selectedDate])

  useEffect(() => {
    if (initialData && currentPage === 1 && lang === 'ru') return

    setLoading(true)
    if (!selectedDate && currentPage > 1) window.scrollTo({ top: 0, behavior: 'smooth' })
    const dateParam = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      : undefined
    getArticles({ category: 'islam_in_russia', page: currentPage, lang, created_from: dateParam, created_to: dateParam })
      .then((data) => {
        setArticles(data.results)
        setTotalCount(data.count)
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [currentPage, lang, selectedDate])

  const topRow = articles.slice(0, 3)
  const bottomRow = articles.slice(3, 6)

  const renderCard = (article: ArticlePreview, isFirst: boolean) => {
    if (isFirst) {
      return (
        <Link key={article.id} href={`/articles/${article.slug}`} className="islam-card-large" style={{ textDecoration: 'none' }}>
          {article.preview_image_url && (
            <Image src={article.preview_image_url} alt={article.title} fill className="card-image-large" sizes="(max-width: 768px) 100vw, 619px" />
          )}
          <div className="card-overlay">
            <div className="card-meta-large">
              {article.location && (<span className="meta-tag" translate="no"><LocationIcon /> {article.location}</span>)}
              <span className="meta-tag"><CalendarIcon /> {formatDate(article.created, lang)}</span>
            </div>
            <h3 className="card-title-large" translate="no">{article.title}</h3>
            {article.expert_name && (<p className="card-author" translate="no">{tA('author')} {article.expert_name}</p>)}
          </div>
        </Link>
      )
    }
    return (
      <Link key={article.id} href={`/articles/${article.slug}`} className="islam-card-small" style={{ textDecoration: 'none' }}>
        <div className="card-image-wrapper">
          {article.preview_image_url && (<Image src={article.preview_image_url} alt={article.title} fill className="card-image" sizes="303px" />)}
        </div>
        <div className="card-content-small">
          <h3 className="card-title-small" translate="no">{article.title}</h3>
          <p className="card-desc-small" translate="no">{article.short_description}</p>
          <div className="card-meta">
            {article.location && (<span className="card-location" translate="no"><LocationIcon /> {article.location}</span>)}
            <span className="card-date"><CalendarIcon /> {formatDate(article.created, lang)}</span>
          </div>
        </div>
      </Link>
    )
  }

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const CalendarWidget = () => {
    const daysInMonth = getDaysInMonth(calendarDate)
    const firstDay = getFirstDayOfMonth(calendarDate)
    const today = new Date()
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)]
    while (cells.length % 7 !== 0) cells.push(null)

    const [pickerMode, setPickerMode] = useState<'days' | 'months' | 'years'>('days')

    const prevNav = () => {
      if (pickerMode === 'days') setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
      else if (pickerMode === 'months') setCalendarDate(d => new Date(d.getFullYear() - 1, d.getMonth(), 1))
      else setCalendarDate(d => new Date(d.getFullYear() - 12, d.getMonth(), 1))
    }
    const nextNav = () => {
      if (pickerMode === 'days') setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
      else if (pickerMode === 'months') setCalendarDate(d => new Date(d.getFullYear() + 1, d.getMonth(), 1))
      else setCalendarDate(d => new Date(d.getFullYear() + 12, d.getMonth(), 1))
    }

    const handleDayClick = (day: number) => {
      const clicked = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
      if (selectedDate && clicked.toDateString() === selectedDate.toDateString()) {
        setSelectedDate(null)
      } else {
        setSelectedDate(clicked)
      }
    }

    const isSelected = (day: number) => selectedDate?.getFullYear() === calendarDate.getFullYear() &&
      selectedDate?.getMonth() === calendarDate.getMonth() && selectedDate?.getDate() === day
    const isToday = (day: number) => today.getFullYear() === calendarDate.getFullYear() &&
      today.getMonth() === calendarDate.getMonth() && today.getDate() === day
    const getDayClass = (day: number | null) => {
      if (!day) return 'articles-calendar-day empty'
      if (isSelected(day)) return 'articles-calendar-day selected'
      if (isToday(day)) return 'articles-calendar-day today'
      return 'articles-calendar-day'
    }

    const years = Array.from({ length: 12 }, (_, i) => calendarDate.getFullYear() - 5 + i)

    return (
      <>
        <p className="articles-calendar-title" translate="no">{tC('filter_by_date')}</p>
        <div className="articles-calendar-box">
          <div className="articles-calendar-header" dir="ltr">
            <button className="articles-calendar-nav" onClick={prevNav}>‹</button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className={`articles-calendar-month${pickerMode === 'months' ? ' active' : ''}`} onClick={() => setPickerMode(p => p === 'months' ? 'days' : 'months')}>
                <span translate="no">{MONTHS_CURRENT[calendarDate.getMonth()]}</span>
              </button>
              <button className={`articles-calendar-month${pickerMode === 'years' ? ' active' : ''}`} onClick={() => setPickerMode(p => p === 'years' ? 'days' : 'years')}>
                {calendarDate.getFullYear()}
              </button>
            </div>
            <button className="articles-calendar-nav" onClick={nextNav}>›</button>
          </div>

          {pickerMode === 'months' && (
            <div className="articles-calendar-picker-grid">
              {MONTHS_SHORT_CURRENT.map((m: string, i: number) => (
                <button key={i} className={`articles-calendar-picker-item${i === calendarDate.getMonth() ? ' active' : ''}`}
                  onClick={() => { setCalendarDate(new Date(calendarDate.getFullYear(), i, 1)); setPickerMode('days') }}
                  translate="no">
                  {m}
                </button>
              ))}
            </div>
          )}

          {pickerMode === 'years' && (
            <div className="articles-calendar-picker-grid">
              {years.map(y => (
                <button key={y} className={`articles-calendar-picker-item${y === calendarDate.getFullYear() ? ' active' : ''}`}
                  onClick={() => { setCalendarDate(new Date(y, calendarDate.getMonth(), 1)); setPickerMode('months') }}>
                  {y}
                </button>
              ))}
            </div>
          )}

          {pickerMode === 'days' && (
            <>
              <div className="articles-calendar-grid" style={{ marginBottom: 2 }}>
                {DAYS_CURRENT.map((d: string) => <div key={d} className="articles-calendar-dayname" translate="no">{d}</div>)}
              </div>
              <div className="articles-calendar-days-scroll">
                <div className="articles-calendar-grid">
                  {cells.map((day, i) => (
                    <div key={i} className={getDayClass(day)} onClick={() => day && handleDayClick(day)}>{day || ''}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          <button className="articles-calendar-reset" onClick={() => { setSelectedDate(null); setCalendarDate(new Date()); setPickerMode('days') }} translate="no">{tC('reset')}</button>
        </div>
        {selectedDate && (
          <p className="articles-calendar-selected-label" translate="no">
            {tC('showing_articles')} {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </>
    )
  }

  return (
    <>
      <section className="islam-section">
        <div className="islam-main-frame">
          <div className="articles-page-layout">
            <div className="articles-page-content">
              <div className={`islam-book-ref${isRtl ? ' rtl' : ''}`} translate="no">
                {lang === 'en' ? (
                  <>
                    <p><span className="islam-book-ref-label">Source:</span> History of Islam in Russia</p>
                    <p><span className="islam-book-ref-label">Scientific Editor:</span> Rafik Mukhametshin – Rector of the Russian Islamic Institute</p>
                    <p><span className="islam-book-ref-label">Reviewers:</span> Rail Fakhrutdinov, Rafilya Gimazova</p>
                  </>
                ) : lang === 'ar' ? (
                  <>
                    <p><span className="islam-book-ref-label">المصدر:</span> كتاب "تاريخ الإسلام في روسيا"</p>
                    <p><span className="islam-book-ref-label">المحرر العلمي:</span> رفيق محمدشين - رئيس المعهد الإسلامي الروسي</p>
                    <p><span className="islam-book-ref-label">المراجعون:</span> رئيل فخروتدينوف، رفيلة جيمازوفا</p>
                  </>
                ) : (
                  <>
                    <p><span className="islam-book-ref-label">Источник:</span> Книга «История Ислама в России»</p>
                    <p><span className="islam-book-ref-label">Научный редактор:</span> Мухаметшин Р.М. – ректор Российского исламского института.</p>
                    <p><span className="islam-book-ref-label">Рецензенты:</span> Фахрутдинов Р.Р., Гимазова Р.А.</p>
                  </>
                )}
              </div>
              <div className="islam-content-frame">
            {loading ? (
              <>
                <div className="islam-row"><SkeletonLarge /><SkeletonSmall /><SkeletonSmall /></div>
                <div className="islam-row"><SkeletonLarge /><SkeletonSmall /><SkeletonSmall /></div>
              </>
            ) : articles.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#7C7C7C', fontSize: 16 }} translate="no">{tA('not_found')}</div>
            ) : (
              <>
                {topRow.length > 0 && (<div className="islam-row">{topRow.map((article, i) => renderCard(article, i === 2))}</div>)}
                {bottomRow.length > 0 && (<div className="islam-row">{bottomRow.map((article, i) => renderCard(article, i === 0))}</div>)}
              </>
            )}
            {!loading && totalPages > 1 && (
              <div className="islam-pagination" dir="ltr">
                <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                {getPageNumbers().map((page, i) =>
                  page === '...' ? (<span key={`dots-${i}`} className="page-dots">...</span>) : (
                    <button key={page} className={`page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page as number)}>{page}</button>
                  )
                )}
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
                <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
              </div>
            )}
              </div>
            </div>
            <div className="articles-calendar-sidebar">
              <CalendarWidget />
            </div>
          </div>
        </div>
      </section>
      <div className="white-divider" />
      <ScientificArticlesSection titleKey="see_also" showButton={false} />
      <div className="white-divider" />
      <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </>
  )
}