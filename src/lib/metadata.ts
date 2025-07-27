import { APP_URL } from './config'

export const siteConfig = {
  name: "Listele.io",
  description: "Fikirlerini hızla hayata geçir. AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
  keywords: [
    "landing page oluşturucu",
    "proje sayfası",
    "girişimci araçları",
    "lead toplama",
    "MVP oluşturma",
    "Türkiye startup",
    "proje validasyonu",
    "müşteri toplama",
    "AI proje oluşturucu",
    "startup araçları",
    "girişimcilik",
    "iş fikri validation",
    "no-code landing page",
    "Türkçe landing page builder"
  ],
  authors: [{ name: "Listele.io Team" }],
  creator: "Listele.io",
  publisher: "Listele.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: APP_URL,
    title: "Listele.io - Fikirlerini Hızla Hayata Geçir",
    description: "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
    siteName: "Listele.io",
    images: [
      {
        url: `${APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Listele.io - AI-Powered Project Landing Page Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Listele.io - Fikirlerini Hızla Hayata Geçir",
    description: "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü.",
    images: [`${APP_URL}/twitter-image.png`],
    creator: "@listeleio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Listele.io",
  "description": "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
  "url": APP_URL,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "TRL",
    "description": "Ücretsiz plan mevcut, ücretli planlar 10 TL'den başlar"
  },
  "author": {
    "@type": "Organization",
    "name": "Listele.io"
  },
  "inLanguage": "tr",
  "availableLanguage": "Turkish"
} 