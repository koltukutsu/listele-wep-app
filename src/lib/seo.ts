import { APP_URL } from './config';

// Enhanced slug generation with SEO optimization
export function generateSEOSlug(name: string, category?: string): string {
  // Remove Turkish characters and convert to ASCII equivalents
  const turkishMap: { [key: string]: string } = {
    'ş': 's', 'Ş': 'S', 'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U', 'ö': 'o', 'Ö': 'O',
    'ı': 'i', 'İ': 'I', 'ç': 'c', 'Ç': 'C'
  };
  
  let slug = name;
  Object.keys(turkishMap).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), turkishMap[char]);
  });
  
  // Generate base slug
  let baseSlug = slug
    .toLowerCase()
    .trim()
    // Remove unwanted characters but keep useful ones for SEO
    .replace(/[^a-z0-9\s\-\_]/g, '')
    // Replace multiple whitespace/underscores with hyphens
    .replace(/[\s\_]+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
  
  // Add category prefix for better SEO if category exists
  if (category && category !== 'other') {
    const categorySlug = category.replace(/[^a-z0-9]/g, '');
    baseSlug = `${categorySlug}-${baseSlug}`;
  }
  
  // Ensure slug is not too long for SEO (max 60 chars)
  return baseSlug.substring(0, 60).replace(/-+$/, '');
}

// Generate SEO-friendly keywords based on project content
export function generateProjectKeywords(
  projectName: string,
  category?: string,
  description?: string,
  subtitle?: string
): string[] {
  const baseKeywords = [
    'landing page',
    'project page',
    'lead generation',
    'startup',
    'entrepreneurship',
    'launch list',
    'project validation',
    'mvp',
    'business idea'
  ];

  const projectKeywords = [
    projectName.toLowerCase(),
    ...(category ? [category, `${category} project`, `${category} startup`] : []),
    ...(description ? extractKeywords(description) : []),
    ...(subtitle ? extractKeywords(subtitle) : [])
  ];

  // Category-specific keywords
  const categoryKeywords = getCategoryKeywords(category);

  return [...new Set([...baseKeywords, ...projectKeywords, ...categoryKeywords])];
}

// Extract keywords from text content
function extractKeywords(text: string): string[] {
  const commonWords = ['and', 'with', 'for', 'the', 'this', 'that', 'you', 'your'];
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5); // Take first 5 meaningful words
}

// Get category-specific keywords
function getCategoryKeywords(category?: string): string[] {
  const categoryMap: { [key: string]: string[] } = {
    'e-commerce': [
      'e-commerce',
      'online store',
      'product sales',
      'ecommerce startup',
      'online sales',
      'digital store'
    ],
    'saas': [
      'saas',
      'software as a service',
      'b2b tool',
      'software startup',
      'cloud software',
      'software service'
    ],
    'local-business': [
      'local business',
      'local service',
      'neighborhood business',
      'business page',
      'local startup'
    ],
    'consulting': [
      'consulting',
      'consultation',
      'expert service',
      'consultant',
      'professional service',
      'coaching'
    ],
    'education': [
      'education',
      'online course',
      'teaching',
      'education platform',
      'course page',
      'learning'
    ],
    'health': [
      'health',
      'wellness',
      'therapy',
      'health service',
      'wellness coaching',
      'health consulting'
    ],
    'technology': [
      'technology',
      'tech startup',
      'software',
      'technology service',
      'digital solution',
      'innovation'
    ],
    'food': [
      'food',
      'restaurant',
      'catering',
      'food truck',
      'meal service'
    ],
    'fashion': [
      'fashion',
      'style',
      'design',
      'apparel',
      'fashion brand'
    ],
    'travel': [
      'travel',
      'tourism',
      'tour',
      'trip',
      'vacation'
    ]
  };

  return category ? categoryMap[category] || [] : [];
}

// Generate rich snippet structured data for projects
export function generateProductSchema(project: any) {
  const baseUrl = `${APP_URL}/${project.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": project.config.title || project.name,
    "description": project.config.subtitle || project.config.description || `${project.name} - Launch List generated project`,
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
      "priceCurrency": "USD",
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
    "creator": {
      "@type": "Organization",
      "name": "Launch List",
      "url": APP_URL
    }
  };
}

// Generate FAQ schema for categories
export function generateCategoryFAQSchema(category: string) {
  const categoryFAQs: { [key: string]: Array<{ question: string; answer: string }> } = {
    'e-commerce': [
      {
        question: "E-ticaret projesi için landing page nasıl oluşturulur?",
        answer: "With Launch List, you can create a professional landing page for your e-commerce project in minutes. Easily add product showcases, customer testimonials, and sales page features."
      },
      {
        question: "E-ticaret startup'ı için hangi özellikler önemli?",
        answer: "For e-commerce projects, trust signals, product images, pricing information, and an easy contact form are critical. Launch List automatically adds these features to your page."
      }
    ],
    'saas': [
      {
        question: "SaaS ürünü için etkili landing page nasıl olmalı?",
        answer: "A SaaS landing page should include the problem your product solves, features, pricing, and a demo request form. With Launch List, you can use templates optimized for SaaS projects."
      }
    ]
  };

  const faqs = categoryFAQs[category] || [];
  
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// SEO score calculator for projects
export function calculateSEOScore(project: any): {
  score: number;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];

  // Title optimization (25 points)
  if (project.config.title) {
    if (project.config.title.length >= 30 && project.config.title.length <= 60) {
      score += 25;
    } else {
      score += 15;
      suggestions.push('Title should be between 30-60 characters');
    }
  } else {
    suggestions.push('Project title is missing');
  }

  // Description optimization (25 points)
  if (project.config.subtitle || project.config.description) {
    const desc = project.config.subtitle || project.config.description;
    if (desc.length >= 120 && desc.length <= 160) {
      score += 25;
    } else {
      score += 15;
      suggestions.push('Description should be between 120-160 characters');
    }
  } else {
    suggestions.push('Project description is missing');
  }

  // Category (15 points)
  if (project.config.category) {
    score += 15;
  } else {
    suggestions.push('Project category should be selected');
  }

  // Content quality (20 points)
  const hasFeatures = project.config.features?.length > 0;
  const hasBenefits = project.config.benefits?.length > 0;
  
  if (hasFeatures && hasBenefits) {
    score += 20;
  } else if (hasFeatures || hasBenefits) {
    score += 10;
    suggestions.push('Add both features and benefits sections');
  } else {
    suggestions.push('Project features and benefits are missing');
  }

  // Performance metrics (15 points)
  if (project.stats?.totalSignups > 10) {
    score += 15;
  } else if (project.stats?.totalSignups > 0) {
    score += 8;
    suggestions.push('Focus on getting more signups');
  } else {
    suggestions.push('No signups yet');
  }

  return { score, suggestions };
}

// Generate canonical URL
export function generateCanonicalURL(slug: string): string {
  return `${APP_URL}/${slug}`;
}

// Generate social sharing URLs
export function generateSocialShareURLs(project: any) {
  const url = generateCanonicalURL(project.slug);
  const title = encodeURIComponent(project.config.title || project.name);
  const description = encodeURIComponent(project.config.subtitle || project.config.description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}&via=launchlist`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${title} ${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${title}`
  };
} 