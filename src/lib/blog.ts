import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './firestore';

const blogDirectory = path.join(process.cwd(), 'content/blog');

// Blog post type for local markdown files
export interface LocalBlogPost extends Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'views'> {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  views: number;
}

export function getAllBlogSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    return fileNames
      .filter(name => name.endsWith('.md'))
      .map(name => name.replace(/\.md$/, ''));
  } catch (error) {
    console.warn('Blog directory not found, returning empty array');
    return [];
  }
}

export function getBlogPostBySlug(slug: string): LocalBlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure required fields exist
    if (!data.title || !data.slug) {
      console.warn(`Invalid blog post: ${slug} - missing required fields`);
      return null;
    }

    return {
      id: slug,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      content,
      author: data.author || {
        name: 'Launch List',
        email: 'info@launchlist.io'
      },
      category: data.category || 'General',
      tags: data.tags || [],
      status: 'published', // Local markdown files are always published
      seo: data.seo || {
        title: data.title,
        description: data.excerpt || '',
        keywords: data.tags || []
      },
      publishedAt: data.publishedAt || new Date().toISOString(),
      createdAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.publishedAt || new Date().toISOString(),
      readingTime: data.readingTime || calculateReadingTime(content),
      views: 0, // Local files don't track views
      featuredImage: data.featuredImage
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getAllBlogPosts(publishedOnly: boolean = true): LocalBlogPost[] {
  const slugs = getAllBlogSlugs();
  const posts = slugs
    .map(slug => getBlogPostBySlug(slug))
    .filter((post): post is LocalBlogPost => post !== null);

  // Sort by published date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getBlogPostsByCategory(category: string): LocalBlogPost[] {
  const allPosts = getAllBlogPosts(true);
  return allPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): LocalBlogPost[] {
  const allPosts = getAllBlogPosts(true);
  return allPosts.filter(post => post.tags.includes(tag));
}

export function getRecentBlogPosts(limitCount: number = 6): LocalBlogPost[] {
  const allPosts = getAllBlogPosts(true);
  return allPosts.slice(0, limitCount);
}

export function getBlogCategories(): string[] {
  const allPosts = getAllBlogPosts(true);
  const categories = new Set<string>();
  allPosts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
}

export function getBlogTags(): string[] {
  const allPosts = getAllBlogPosts(true);
  const tags = new Set<string>();
  allPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Compatibility function to convert LocalBlogPost to BlogPost format for components
export function convertToFirestoreBlogPost(localPost: LocalBlogPost): BlogPost {
  return {
    ...localPost,
    createdAt: { seconds: Date.parse(localPost.createdAt) / 1000 } as any,
    updatedAt: { seconds: Date.parse(localPost.updatedAt) / 1000 } as any,
    publishedAt: { seconds: Date.parse(localPost.publishedAt) / 1000 } as any,
  };
} 