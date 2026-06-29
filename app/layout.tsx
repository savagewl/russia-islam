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
    icon: '/images/favicon-square.png',
    shortcut: '/images/favicon-square.png',
    apple: '/images/favicon-square.png',
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
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=110251281','ym');
          ym(110251281,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
        `}} />
        <noscript dangerouslySetInnerHTML={{ __html: `<div><img src="https://mc.yandex.ru/watch/110251281" style="position:absolute;left:-9999px;" alt="" /></div>` }} />
      </head>
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