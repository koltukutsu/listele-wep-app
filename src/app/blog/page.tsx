import { getAllBlogPosts, getBlogCategories, getBlogTags, convertToFirestoreBlogPost } from '~/lib/blog';
import BlogListingClient from './BlogListingClient';
import type { Metadata } from 'next';
import { APP_URL } from '~/lib/config';

export const metadata: Metadata = {
  title: 'Blog - Girişimcilik, Startup ve Teknoloji İçerikleri | Listelee.io',
  description: 'Girişimcilik, startup dünyası, teknoloji trendleri ve proje geliştirme hakkında uzman içerikleri. Listelee.io blog\'da sektörün en güncel bilgilerini keşfedin.',
  keywords: [
    'girişimcilik blog',
    'startup blog',
    'teknoloji blog',
    'proje geliştirme',
    'landing page rehberi',
    'startup tavsiyeleri',
    'girişimci hikayeler',
    'teknoloji haberleri',
    'iş fikri geliştirme',
    'mvp oluşturma'
  ].join(', '),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - Girişimcilik ve Startup İçerikleri | Listelee.io',
    description: 'Girişimcilik, startup dünyası ve teknoloji trendleri hakkında uzman içerikleri keşfedin.',
    url: `${APP_URL}/blog`,
    siteName: 'Listelee.io',
    images: [`${APP_URL}/opengraph-image.png`],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Girişimcilik ve Startup İçerikleri | Listelee.io',
    description: 'Girişimcilik, startup dünyası ve teknoloji trendleri hakkında uzman içerikleri keşfedin.',
    images: [`${APP_URL}/twitter-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function BlogPage() {
  // Fetch initial data for server-side rendering
  const [localPosts, categories, tags] = await Promise.all([
    getAllBlogPosts(true),
    getBlogCategories(),
    getBlogTags()
  ]);

  // Convert local posts to Firestore format for compatibility
  const posts = localPosts.map(convertToFirestoreBlogPost);

  // Generate structured data for the blog page
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Listelee.io Blog",
    "description": "Girişimcilik, startup dünyası ve teknoloji trendleri hakkında uzman içerikleri",
    "url": `${APP_URL}/blog`,
    "inLanguage": "tr",
    "publisher": {
      "@type": "Organization",
      "name": "Listelee.io",
      "url": APP_URL,
      "logo": `${APP_URL}/Logo.png`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${APP_URL}/blog`
    },
    "blogPost": localPosts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${APP_URL}/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Listelee.io",
        "url": APP_URL
      }
    }))
  };

  return (
    <>
      {/* Inject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      
      <BlogListingClient 
        initialPosts={posts} 
        categories={categories} 
        tags={tags} 
      />
    </>
  );
} 