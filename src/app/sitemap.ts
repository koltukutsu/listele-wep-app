import { MetadataRoute } from 'next'
import { APP_URL } from '~/lib/config'
import { getPublicProjects, getAllBlogPosts } from '~/lib/firestore'

// Define categories for SEO category pages
const CATEGORIES = [
  'e-commerce',
  'saas', 
  'local-business',
  'consulting',
  'education',
  'health',
  'technology',
  'food',
  'fashion',
  'travel'
];

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
      url: `${APP_URL}/showcase`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
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
  ];

  // Add category pages for SEO
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${APP_URL}/kategori/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add dynamic project pages and blog posts
  try {
    const [publicProjects, blogPosts] = await Promise.all([
      getPublicProjects(),
      getAllBlogPosts(true)
    ]);
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
      
      // Determine priority based on project stats
      let priority = 0.7;
      if (project.stats?.totalSignups > 50) {
        priority = 0.9; // High performing projects get higher priority
      } else if (project.stats?.totalSignups > 10) {
        priority = 0.8;
      }
      
      return {
        url: `${APP_URL}/${project.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority,
      };
    });

    // Add blog post pages
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
      let lastModified = new Date();
      
      if (post.updatedAt) {
        if (typeof post.updatedAt === 'object' && 'seconds' in post.updatedAt) {
          lastModified = new Date(post.updatedAt.seconds * 1000);
        } else if (typeof post.updatedAt === 'number') {
          lastModified = new Date(post.updatedAt);
        }
      }
      
      return {
        url: `${APP_URL}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
    
    return [...staticPages, ...categoryPages, ...projectPages, ...blogPages];
  } catch (error) {
    console.error('Error fetching public projects for sitemap:', error);
    return [...staticPages, ...categoryPages];
  }
} 