import type { Metadata } from "next";
import "./globals.css";
import "../styles/topbar.css";
import "../styles/header.css";
import "../styles/hero.css";
import "../styles/newsTicker.css";
import "../styles/footer.css";
import "../styles/islamInRussia.css";
import "../styles/scientificArticle.css";
import "../styles/scientific-section.css";
import "../styles/newsSection.css";
import "../styles/projects.css";
import "../styles/experts-section.css";
import "../styles/photoVideo.css";
import "../styles/aboutGroup.css";
import "../styles/contactInfo.css";
import "../styles/group-members.css";
import ClientLayout from '@/components/layouts/ClientLayout'
import Footer from '@/components/common/Footer'


export const metadata: Metadata = {
  metadataBase: new URL('https://rusislworld.ru'),

  title: {
    default: 'Россия - Исламский мир | Группа стратегического видения',
    template: '%s | Россия - Исламский мир',
  },

  description:
    'Группа стратегического видения «Россия — Исламский мир». Новости, аналитика, экспертные мнения, научные статьи и ключевые проекты.',

  keywords: [
    'Россия',
    'Исламский мир',
    'ОИС',
    'группа стратегического видения',
    'ислам в России',
    'международное сотрудничество',
    'аналитика',
    'эксперты',
  ],

  authors: [{ name: 'Группа стратегического видения «Россия — Исламский мир»' }],

  icons: {
    icon: '/images/Screenshot_2.png',
    shortcut: '/images/Screenshot_2.png',
    apple: '/images/Screenshot_2.png',
  },

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Россия - Исламский мир',
    title: 'Россия - Исламский мир | Группа стратегического видения',
    description:
      'Группа стратегического видения «Россия — Исламский мир». Новости, аналитика, экспертные мнения и ключевые проекты.',
    url: 'https://rusislworld.ru',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Россия - Исламский мир',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Россия - Исламский мир',
    description:
      'Группа стратегического видения «Россия — Исламский мир»',
    images: ['/images/og-default.jpg'],
  },

  other: {
    'content-language': 'ru',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <div className="site-container">
          <ClientLayout>
            <>
              {children}
              <Footer />
            </>
          </ClientLayout>
        </div>
      </body>
    </html>
  );
}