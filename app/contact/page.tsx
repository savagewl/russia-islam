
import { Metadata } from 'next'
import ContactInfo from '@/components/contact/ContactInfo'

export const revalidate = 86400 

export const metadata: Metadata = {
  title: 'Контактная информация | Россия - Исламский мир',
  description: 'Контактная информация группы стратегического видения «Россия — Исламский мир». Адрес: г. Казань, ул. Ибрагимова 68, к.6. Телефон: +7 (917) 054-48-64.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Контактная информация | Россия - Исламский мир',
    description: 'Свяжитесь с группой стратегического видения «Россия — Исламский мир».',
    url: '/contact',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Группа стратегического видения «Россия — Исламский мир»',
  url: 'https://rusislworld.ru',
  logo: 'https://rusislworld.ru/images/logo_ru.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7 (843) 590-12-37',
    email: 'rusislworld@mail.ru',
    contactType: 'customer service',
    availableLanguage: ['Russian', 'English', 'Arabic'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '420015, Россия, Республика Татарстан, г.Казань, ул.Горького, д.3 (офис 14)',
    addressLocality: 'Казань',
    addressCountry: 'RU',
  },
  sameAs: [],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactInfo />
    </>
  )
}