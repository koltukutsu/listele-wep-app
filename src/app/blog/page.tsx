import { getAllBlogPosts, getBlogCategories, getBlogTags, convertToFirestoreBlogPost } from '~/lib/blog';
import BlogListingClient from './BlogListingClient';
import type { Metadata } from 'next';
import { APP_URL } from '~/lib/config';

export const metadata: Metadata = {
  title: 'Blog - Entrepreneurship, Startups and Technology | Launch List',
  description: "Expert content on entrepreneurship, startups, technology trends and project building. Discover the most up-to-date insights on the Launch List blog.",
  keywords: [
    'entrepreneurship blog',
    'startup blog',
    'technology blog',
    'project development',
    'landing page guide',
    'startup tips',
    'founder stories',
    'tech news',
    'business idea development',
    'building an mvp'
  ].join(', '),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - Entrepreneurship & Startup Content | Launch List',
    description: 'Discover expert content on entrepreneurship, the startup world and technology trends.',
    url: `${APP_URL}/blog`,
    siteName: 'Launch List',
    images: [`${APP_URL}/opengraph-image.png`],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Entrepreneurship & Startup Content | Launch List',
    description: 'Discover expert content on entrepreneurship, the startup world and technology trends.',
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
    "name": "Launch List Blog",
    "description": "Expert content about entrepreneurship, the startup world and technology trends",
    "url": `${APP_URL}/blog`,
    "inLanguage": "en",
    "publisher": {
      "@type": "Organization",
      "name": "Launch List",
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
        "name": "Launch List",
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