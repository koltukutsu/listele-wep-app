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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proje Bulunamadı',
    };
  }
  
  const previousImages = (await parent).openGraph?.images || [];
  const defaultImageUrl = `${APP_URL}/opengraph-image.png`;

  return {
    title: project.config.title,
    description: project.config.subtitle,
    openGraph: {
      title: project.config.title,
      description: project.config.subtitle,
      images: [defaultImageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.config.title,
      description: project.config.subtitle,
      images: [defaultImageUrl, ...previousImages],
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
  
  return <PublicProjectPage project={serializableProject} />;
}
