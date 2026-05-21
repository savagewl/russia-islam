import { Metadata } from 'next'
import GrantsSection from '@/components/grants/GrantsSection'

export const metadata: Metadata = {
  title: 'Гранты | Россия - Исламский мир',
  description: 'Гранты и программы финансирования Группы стратегического видения «Россия — Исламский мир».',
}

export default function GrantsPage() {
  return (
    <div style={{ paddingTop: 0 }}>
      <div style={{
        width: '100%',
        background: '#242424',
        padding: '28px 90px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant, serif',
          fontWeight: 600,
          fontSize: 38,
          color: '#ffffff',
          margin: 0,
        }}>
          Гранты
        </h1>
      </div>
      <GrantsSection />
    </div>
  )
}
