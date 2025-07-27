import { APP_URL } from './config'

export const siteConfig = {
  name: "Listelee.io",
  description: "Fikirlerini hızla hayata geçir. AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
  shortDescription: "AI destekli landing page oluşturucu ile fikirlerini hızla hayata geçir.",
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
    "Türkçe landing page builder",
    "proje pazarlama",
    "startup landing page",
    "müşteri doğrulama",
    "iş modeli testi",
    "yapay zeka proje asistanı",
    "startup validasyon"
  ],
  authors: [{ name: "Listelee.io Team", url: APP_URL }],
  creator: "Listelee.io",
  publisher: "Listelee.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: APP_URL,
    title: "Listelee.io - Fikirlerini Hızla Hayata Geçir",
    description: "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
    siteName: "Listelee.io",
    images: [
      {
        url: `${APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Listelee.io - AI-Powered Project Landing Page Generator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Listelee.io - Fikirlerini Hızla Hayata Geçir",
    description: "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü.",
    images: [`${APP_URL}/twitter-image.png`],
    creator: "@listeleio",
    site: "@listeleio",
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

// Main organization structured data
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Listelee.io",
  "description": siteConfig.description,
  "url": APP_URL,
  "logo": `${APP_URL}/Logo.png`,
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Listelee.io Kurucu Ekibi"
    }
  ],
  "sameAs": [
    "https://twitter.com/listeleio"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": APP_URL,
    "availableLanguage": "Turkish"
  }
}

// Software application structured data
export const softwareApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Listelee.io",
  "description": siteConfig.description,
  "url": APP_URL,
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Landing Page Builder",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript",
  "softwareVersion": "1.0",
  "datePublished": "2024-01-01",
  "inLanguage": "tr",
  "availableLanguage": "Turkish",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "TRY",
    "description": "Ücretsiz plan mevcut, ücretli planlar yakında",
    "availability": "https://schema.org/InStock"
  },
  "author": {
    "@type": "Organization",
    "name": "Listelee.io",
    "url": APP_URL
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Listelee.io",
    "url": APP_URL
  },
  "screenshot": `${APP_URL}/demo.png`,
  "featureList": [
    "AI destekli proje oluşturma",
    "Drag & drop editör",
    "Müşteri lead toplama",
    "Gerçek zamanlı analitik",
    "Mobil uyumlu tasarım",
    "SEO optimizasyonu"
  ]
}

// Website structured data
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Listelee.io",
  "description": siteConfig.description,
  "url": APP_URL,
  "inLanguage": "tr",
  "publisher": {
    "@type": "Organization",
    "name": "Listelee.io",
    "url": APP_URL
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${APP_URL}/showcase?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

// Combined structured data
export const structuredData = [
  organizationStructuredData,
  softwareApplicationStructuredData,
  websiteStructuredData
]

// Page-specific metadata generators
export const createPageMetadata = (
  title: string, 
  description: string, 
  path: string = '',
  image?: string
) => ({
  title: `${title} | ${siteConfig.name}`,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: `${APP_URL}${path}`,
    images: image ? [image] : siteConfig.openGraph.images,
  },
  twitter: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: image ? [image] : siteConfig.twitter.images,
  },
  alternates: {
    canonical: path || '/',
  },
})

// Specific page metadata
export const pageMetadata = {
  pricing: createPageMetadata(
    "Fiyatlandırma",
    "Listelee.io fiyat planları. Ücretsiz başla, ihtiyacına göre büyüt. Girişimciler için uygun fiyatlı landing page çözümleri.",
    "/pricing"
  ),
  showcase: createPageMetadata(
    "Proje Galerisi",
    "Listelee.io ile hayata geçirilmiş başarılı proje örnekleri. İlham al, kendi projenin için fikir edin.",
    "/showcase"
  ),
  login: createPageMetadata(
    "Giriş Yap",
    "Listelee.io hesabına giriş yap. Projelerini yönet, müşteri verilerini takip et.",
    "/login"
  ),
  onboarding: createPageMetadata(
    "Başlangıç",
    "Listelee.io'ya hoş geldin! İlk projeni oluştur ve fikrini hayata geçirmeye başla.",
    "/onboarding"
  ),
} 