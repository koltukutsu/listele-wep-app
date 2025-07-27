import { getBlogPostBySlug, getRecentBlogPosts, convertToFirestoreBlogPost } from '~/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import type { Metadata } from 'next';
import { APP_URL } from '~/lib/config';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı - Listelee.io Blog',
      description: 'Aradığınız blog yazısı bulunamadı. Diğer yazılarımızı keşfetmek için blog sayfamızı ziyaret edin.',
    };
  }

  const publishDate = new Date(post.publishedAt);
  const modifiedDate = new Date(post.updatedAt);

  return {
    title: post.seo.title || `${post.title} | Listelee.io Blog`,
    description: post.seo.description || post.excerpt,
    keywords: post.seo.keywords.join(', '),
    authors: [{ name: post.author.name, url: `${APP_URL}/blog` }],
    creator: post.author.name,
    publisher: 'Listelee.io',
    category: post.category,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      url: `${APP_URL}/blog/${post.slug}`,
      siteName: 'Listelee.io',
      images: post.featuredImage ? [post.featuredImage] : [`${APP_URL}/opengraph-image.png`],
      locale: 'tr_TR',
      type: 'article',
      publishedTime: publishDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [`${APP_URL}/twitter-image.png`],
      creator: '@listeleio',
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
    other: {
      'article:published_time': publishDate.toISOString(),
      'article:modified_time': modifiedDate.toISOString(),
      'article:author': post.author.name,
      'article:section': post.category,
      'article:tag': post.tags.join(','),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [localPost, localRecentPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRecentBlogPosts(5)
  ]);

  if (!localPost) {
    notFound();
  }

  // Convert to Firestore format for compatibility
  const post = convertToFirestoreBlogPost(localPost);
  const recentPosts = localRecentPosts.map(convertToFirestoreBlogPost);

  // Generate structured data for the blog post
  const publishDate = new Date(localPost.publishedAt);
  const modifiedDate = new Date(localPost.updatedAt);
  
  const blogPostStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage || `${APP_URL}/opengraph-image.png`,
    "url": `${APP_URL}/blog/${post.slug}`,
    "datePublished": publishDate.toISOString(),
    "dateModified": modifiedDate.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "email": post.author.email,
      "image": post.author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "Listelee.io",
      "url": APP_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${APP_URL}/Logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${APP_URL}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readingTime}M`,
    "inLanguage": "tr",
    "isPartOf": {
      "@type": "Blog",
      "name": "Listelee.io Blog",
      "@id": `${APP_URL}/blog`
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ReadAction",
      "userInteractionCount": post.views || 0
    }
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": APP_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${APP_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `${APP_URL}/blog?category=${encodeURIComponent(post.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `${APP_URL}/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      {/* Inject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <BlogPostClient post={post} recentPosts={recentPosts} />
    </>
  );
} 