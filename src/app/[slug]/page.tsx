import { getProjectBySlug, trackVisit } from '~/lib/firestore';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import PublicProjectPage from './PublicProjectPage';
import type { Project } from '~/lib/firestore';
import type { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '~/lib/config';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

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


export default async function ProjectPage({ params }: { params: { slug: string }}) {
  const project: Project | null = await getProjectBySlug(params.slug);

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

  // Manually serialize Timestamp objects to numbers
  const serializableProject = {
    ...project,
    createdAt: typeof project.createdAt === 'number' ? project.createdAt : project.createdAt.toMillis(),
    updatedAt: typeof project.updatedAt === 'number' ? project.updatedAt : project.updatedAt.toMillis(),
    stats: {
      ...project.stats,
      lastVisitAt: project.stats.lastVisitAt ? (typeof project.stats.lastVisitAt === 'number' ? project.stats.lastVisitAt : project.stats.lastVisitAt.toMillis()) : undefined,
      lastSignupAt: project.stats.lastSignupAt ? (typeof project.stats.lastSignupAt === 'number' ? project.stats.lastSignupAt : project.stats.lastSignupAt.toMillis()) : undefined,
    },
  };
  
  return <PublicProjectPage project={serializableProject} />;
}
