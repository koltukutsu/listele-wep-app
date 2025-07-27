import { MetadataRoute } from 'next'
import { APP_URL } from '~/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/login',
          '/onboarding',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/payment-success',
          '/payment-fail',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/pricing',
          '/llm.txt',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/pricing',
          '/llm.txt',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
        ],
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/pricing',
          '/llm.txt',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: [
          '/',
          '/pricing',
          '/llm.txt',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  }
} 