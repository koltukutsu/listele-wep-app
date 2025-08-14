import { APP_URL } from './config'

export const siteConfig = {
  name: "Launch List",
  description: "A waitlist platform for entrepreneurs. Validate your idea before launch, collect customers, and build your product with confidence.",
  shortDescription: "Validate your idea with a waitlist before launch.",
  keywords: [
    "waitlist",
    "launch waitlist",
    "landing page creator",
    "project page",
    "entrepreneur tools",
    "lead generation",
    "MVP creation",
    "startup tools",
    "project validation",
    "customer collection",
    "AI project creator",
    "startup tools",
    "entrepreneurship",
    "business idea validation",
    "no-code landing page",
    "landing page builder",
    "project marketing",
    "startup landing page",
    "customer validation",
    "business model testing",
    "artificial intelligence project assistant",
    "startup validation"
  ],
  authors: [{ name: "Launch List Team", url: APP_URL }],
  creator: "Launch List",
  publisher: "Launch List",
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
    locale: "en_US",
    url: APP_URL,
    title: "Launch List - Create Your Waitlist Quickly",
    description: "A waitlist platform for entrepreneurs. Validate your idea before launch, collect customers, and build your product with confidence.",
    siteName: "Launch List",
    images: [
      {
        url: `${APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Launch List - AI-Powered Project Landing Page Generator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch List - Create Your Waitlist Quickly",
    description: "A waitlist platform for entrepreneurs. Validate your idea before launch, collect customers, and build your product with confidence.",
    images: [`${APP_URL}/twitter-image.png`],
    creator: "@launchlist",
    site: "@launchlist",
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
  "name": "Launch List",
  "description": siteConfig.description,
  "url": APP_URL,
  "logo": `${APP_URL}/Logo.png`,
  "foundingDate": "2025",
  "founders": [
    {
      "@type": "Person",
      "name": "Launch List Founding Team"
    }
  ],
  "sameAs": [
    "https://twitter.com/launchlist"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": APP_URL,
    "availableLanguage": "English"
  }
}

// Software application structured data
export const softwareApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Launch List",
  "description": siteConfig.description,
  "url": APP_URL,
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Landing Page Builder",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript",
  "softwareVersion": "1.0",
  "datePublished": "2025-07-27",
  "inLanguage": "en",
  "availableLanguage": "English",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan available, paid plans coming soon",
    "availability": "https://schema.org/InStock"
  },
  "author": {
    "@type": "Organization",
    "name": "Launch List",
    "url": APP_URL
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Launch List",
    "url": APP_URL
  },
  "screenshot": `${APP_URL}/demo.png`,
  "featureList": [
    "AI-powered project creation",
    "Drag & drop editor",
    "Customer lead collection",
    "Real-time analytics",
    "Mobile-responsive design",
    "SEO optimization"
  ]
}

// Website structured data
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Launch List",
  "description": siteConfig.description,
  "url": APP_URL,
  "inLanguage": "en",
  "publisher": {
    "@type": "Organization",
    "name": "Launch List",
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
    "Pricing",
    "Launch List pricing plans. Start free, scale as you need. Affordable landing page solutions for entrepreneurs.",
    "/pricing"
  ),
  showcase: createPageMetadata(
    "Project Gallery",
    "Successful project examples brought to life with Launch List. Get inspired, get ideas for your own project.",
    "/showcase"
  ),
  login: createPageMetadata(
    "Sign In",
    "Sign in to your Launch List account. Manage your projects, track customer data.",
    "/login"
  ),
  onboarding: createPageMetadata(
    "Get Started",
    "Welcome to Launch List! Create your first project and start bringing your idea to life.",
    "/onboarding"
  ),
} 