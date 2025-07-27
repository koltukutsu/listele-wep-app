import { MetadataRoute } from 'next'
import { APP_URL } from '~/lib/config'
import { getPublicProjects } from '~/lib/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages that should always be in sitemap
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${APP_URL}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Add dynamic project pages
  try {
    const publicProjects = await getPublicProjects();
    const projectPages: MetadataRoute.Sitemap = publicProjects.map((project) => {
      let lastModified = new Date();
      
      if (project.updatedAt) {
        if (typeof project.updatedAt === 'object' && 'seconds' in project.updatedAt) {
          lastModified = new Date(project.updatedAt.seconds * 1000);
        } else if (typeof project.updatedAt === 'number') {
          lastModified = new Date(project.updatedAt);
        }
      } else if (project.createdAt) {
        if (typeof project.createdAt === 'object' && 'seconds' in project.createdAt) {
          lastModified = new Date(project.createdAt.seconds * 1000);
        } else if (typeof project.createdAt === 'number') {
          lastModified = new Date(project.createdAt);
        }
      }
      
      return {
        url: `${APP_URL}/${project.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
    
    return [...staticPages, ...projectPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
} 