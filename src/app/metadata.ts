import { Metadata, Viewport } from 'next'
import { siteConfig } from '~/lib/metadata'
import { APP_URL } from '~/lib/config'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: siteConfig.openGraph.title,
    template: '%s | Launch List'
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: siteConfig.formatDetection,
  icons: siteConfig.icons,
  manifest: '/manifest.json',
  openGraph: {
    ...siteConfig.openGraph,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Launch List - AI-Powered Project Landing Page Generator',
      },
    ],
  },
  twitter: {
    ...siteConfig.twitter,
    images: ['/twitter-image.png'],
  },
  robots: siteConfig.robots,
  alternates: {
    canonical: '/',
  },
  category: 'business',
  classification: 'Business Application',
  applicationName: 'Launch List',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Launch List',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
    'apple-touch-icon': '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
} 