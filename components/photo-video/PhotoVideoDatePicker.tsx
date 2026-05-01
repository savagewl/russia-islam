'use client'

import { useState } from 'react'

const MONTHS: Record<string, string[]> = {
  ru: ['ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ','ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ'],
  en: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
}
const DAYS: Record<string, string[]> = {
  ru: ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'],
  en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  ar: ['اث','ثل','أر','خم','جم','سبت','أحد'],
}

function toDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}
function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function formatDisplay(s: string, lang: string): string {
  if (!s) return ''
  const d = new Date(s)
  const months = MONTHS[lang] ?? MONTHS.ru
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}
function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}
function getFirstDayOfMonth(date: Date) {
  const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return day === 0 ? 6 : day - 1
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

interface Props {
  from: string
  to: string
  lang: string
  labelFrom: string
  labelTo: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}

export default function PhotoVideoDatePicker({ from, to, lang, labelFrom, labelTo, onFromChange, onToChange }: Props) {
  const [calDate, setCalDate] = useState(new Date())
  const months = MONTHS[lang] ?? MONTHS.ru
  const days = DAYS[lang] ?? DAYS.ru

  const fromDate = toDate(from)
  const toDate2 = toDate(to)

  const daysInMonth = getDaysInMonth(calDate)
  const firstDay = getFirstDayOfMonth(calDate)
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const handleDayClick = (day: number) => {
    const clicked = new Date(calDate.getFullYear(), calDate.getMonth(), day)
    if (!fromDate || (fromDate && toDate2)) {
      onFromChange(toStr(clicked))
      onToChange('')
    } else {
      if (clicked < fromDate) {
        onToChange(from)
        onFromChange(toStr(clicked))
      } else {
        onToChange(toStr(clicked))
      }
    }
  }

  const isFrom = (day: number) => {
    if (!fromDate) return false
    return sameDay(fromDate, new Date(calDate.getFullYear(), calDate.getMonth(), day))
  }
  const isTo = (day: number) => {
    if (!toDate2) return false
    return sameDay(toDate2, new Date(calDate.getFullYear(), calDate.getMonth(), day))
  }
  const isInRange = (day: number) => {
    if (!fromDate || !toDate2) return false
    const d = new Date(calDate.getFullYear(), calDate.getMonth(), day)
    return d > fromDate && d < toDate2
  }

  const prevMonth = () => setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const cellStyle = (day: number | null): React.CSSProperties => {
    if (!day) return { visibility: 'hidden' }
    const base: React.CSSProperties = {
      width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, borderRadius: '50%', cursor: 'pointer', border: 'none', background: 'none',
      fontFamily: 'inherit', transition: 'background 0.15s',
    }
    if (isFrom(day) || isTo(day)) return { ...base, background: '#393939', color: '#fff', borderRadius: '50%' }
    if (isInRange(day)) return { ...base, background: '#e8e8e8', borderRadius: 0 }
    return { ...base, color: '#393939' }
  }

  return (
    <div dir="ltr" style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#393939', fontWeight: 500, marginBottom: 4 }}>{labelFrom}</div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: 4, padding: '6px 8px', fontSize: 13, color: from ? '#393939' : '#aaa', background: '#fafafa', minHeight: 30 }}>
            {from ? formatDisplay(from, lang) : 'DD.MM.YYYY'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#393939', fontWeight: 500, marginBottom: 4 }}>{labelTo}</div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: 4, padding: '6px 8px', fontSize: 13, color: to ? '#393939' : '#aaa', background: '#fafafa', minHeight: 30 }}>
            {to ? formatDisplay(to, lang) : 'DD.MM.YYYY'}
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid #E0E0E0', borderRadius: 6, padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button onClick={prevMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#393939', padding: '0 4px' }}>‹</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#393939' }} translate="no">
            {months[calDate.getMonth()]} {calDate.getFullYear()}
          </span>
          <button onClick={nextMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#393939', padding: '0 4px' }}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {days.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#7C7C7C', fontWeight: 600, padding: '2px 0' }} translate="no">{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((day, i) => (
            <button
              key={i}
              onClick={() => day && handleDayClick(day)}
              style={cellStyle(day)}
              onMouseEnter={e => { if (day && !isFrom(day) && !isTo(day) && !isInRange(day)) (e.currentTarget as HTMLElement).style.background = '#f0f0f0' }}
              onMouseLeave={e => { if (day && !isFrom(day) && !isTo(day) && !isInRange(day)) (e.currentTarget as HTMLElement).style.background = 'none' }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
