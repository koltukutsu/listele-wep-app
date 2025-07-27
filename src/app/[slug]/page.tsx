import { getProjectBySlug, trackVisit } from '~/lib/firestore';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import PublicProjectPage from './PublicProjectPage';
import type { Project } from '~/lib/firestore';
import type { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '~/lib/config';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate project-specific structured data
function generateProjectStructuredData(project: Project) {
  const baseUrl = `${APP_URL}/${project.slug}`;
  
  return [
    // Main Product/Service schema
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": project.config.title || project.name,
      "description": project.config.subtitle || project.config.description || `${project.name} - Listelee.io ile oluşturulmuş proje`,
      "url": baseUrl,
      "image": `${APP_URL}/opengraph-image.png`,
      "brand": {
        "@type": "Brand",
        "name": project.name
      },
      "category": project.config.category || "Startup Project",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "@id": `${baseUrl}#offer`,
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
        "url": baseUrl
      },
      "aggregateRating": project.stats?.totalSignups > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": Math.min(5, Math.max(1, 3 + (project.stats.conversionRate || 0) / 20)),
        "reviewCount": Math.max(1, Math.floor((project.stats.totalSignups || 0) / 10)),
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "isRelatedTo": {
        "@type": "WebApplication",
        "name": "Listelee.io",
        "url": APP_URL,
        "applicationCategory": "Landing Page Builder"
      }
    },
    // WebPage schema
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": project.config.title || project.name,
      "description": project.config.subtitle || project.config.description,
      "url": baseUrl,
      "inLanguage": "tr",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Listelee.io",
        "url": APP_URL
      },
      "about": {
        "@type": "Thing",
        "name": project.config.title || project.name,
        "description": project.config.subtitle || project.config.description
      },
      "mainEntity": {
        "@type": "Product",
        "@id": `${baseUrl}#product`
      },
      "breadcrumb": {
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
            "name": "Projeler",
            "item": `${APP_URL}/showcase`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": project.config.title || project.name,
            "item": baseUrl
          }
        ]
      }
    }
  ].filter(Boolean); // Remove undefined items
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proje Bulunamadı - Listelee.io',
      description: 'Aradığınız proje bulunamadı. Listelee.io\'da binlerce proje keşfedin.',
    };
  }
  
  const previousImages = (await parent).openGraph?.images || [];
  const defaultImageUrl = `${APP_URL}/opengraph-image.png`;
  const projectUrl = `${APP_URL}/${project.slug}`;
  
  // Enhanced title and description for SEO
  const seoTitle = project.config.title || project.name;
  const seoDescription = project.config.subtitle || project.config.description || 
    `${project.name} - Listelee.io ile oluşturulmuş ${project.config.category || 'startup'} projesi. Müşteri toplama ve proje validation platformu.`;
  
  // Generate keywords based on project content
  const keywords = [
    project.name.toLowerCase(),
    project.config.category || 'startup',
    'landing page',
    'proje sayfası',
    'müşteri toplama',
    'startup',
    'girişimcilik',
    'listelee.io'
  ].join(', ');

  return {
    title: `${seoTitle} | Listelee.io`,
    description: seoDescription,
    keywords,
    authors: [{ name: 'Listelee.io', url: APP_URL }],
    creator: project.name,
    publisher: 'Listelee.io',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `/${project.slug}`,
    },
    openGraph: {
      title: `${seoTitle} | Listelee.io`,
      description: seoDescription,
      url: projectUrl,
      siteName: 'Listelee.io',
      images: [
        {
          url: defaultImageUrl,
          width: 1200,
          height: 630,
          alt: `${seoTitle} - Listelee.io Project`,
        },
        ...previousImages
      ],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seoTitle} | Listelee.io`,
      description: seoDescription,
      images: [defaultImageUrl],
      creator: '@listeleio',
      site: '@listeleio',
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
          // Additional SEO metadata
    other: {
      'og:see_also': `${APP_URL}/showcase`,
      ...(project.updatedAt && {
        'og:updated_time': new Date(typeof project.updatedAt === 'number' ? project.updatedAt : project.updatedAt.toMillis()).toISOString()
      }),
      ...(project.createdAt && {
        'article:published_time': new Date(typeof project.createdAt === 'number' ? project.createdAt : project.createdAt.toMillis()).toISOString()
      }),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project | null = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Track visit for analytics
  try {
    const headersList = await headers();
    const visitData: {
      ipAddress: string;
      userAgent: string;
      referrer?: string;
    } = {
      userAgent: headersList.get('user-agent') || '',
      ipAddress: headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || '127.0.0.1',
    };
    
    const referrer = headersList.get('referer');
    if (referrer) {
      visitData.referrer = referrer;
    }
    
    trackVisit(project.id, visitData);
  } catch (error) {
    console.error('Failed to track visit:', error);
  }

  // Helper function to convert Timestamp to number
  const convertTimestamp = (timestamp: any): number | undefined => {
    if (!timestamp) return undefined;
    if (typeof timestamp === 'number') return timestamp;
    if (timestamp.toMillis) return timestamp.toMillis();
    return undefined;
  };

  // Manually serialize all Timestamp objects to numbers
  const serializableProject = {
    ...project,
    createdAt: convertTimestamp(project.createdAt) || Date.now(),
    updatedAt: convertTimestamp(project.updatedAt) || Date.now(),
    stats: {
      totalVisits: project.stats.totalVisits || 0,
      totalSignups: project.stats.totalSignups || 0,
      conversionRate: project.stats.conversionRate || 0,
      galleryViews: (project.stats as any).galleryViews || 0,
      lastVisitAt: convertTimestamp(project.stats.lastVisitAt),
      lastSignupAt: convertTimestamp(project.stats.lastSignupAt),
      lastGalleryView: convertTimestamp((project.stats as any).lastGalleryView),
    },
  };

  // Generate structured data for this project
  const projectStructuredData = generateProjectStructuredData(project);
  
  return (
    <>
      {/* Inject structured data */}
      {projectStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
      
      <PublicProjectPage project={serializableProject} />
    </>
  );
}
