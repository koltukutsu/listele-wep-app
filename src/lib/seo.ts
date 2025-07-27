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
    'proje sayfası',
    'müşteri toplama',
    'startup',
    'girişimcilik',
    'listelee.io',
    'proje validation',
    'mvp',
    'iş fikri'
  ];

  const projectKeywords = [
    projectName.toLowerCase(),
    ...(category ? [category, `${category} projesi`, `${category} startup`] : []),
    ...(description ? extractKeywords(description) : []),
    ...(subtitle ? extractKeywords(subtitle) : [])
  ];

  // Category-specific keywords
  const categoryKeywords = getCategoryKeywords(category);

  return [...new Set([...baseKeywords, ...projectKeywords, ...categoryKeywords])];
}

// Extract keywords from text content
function extractKeywords(text: string): string[] {
  const commonWords = ['ve', 'ile', 'için', 'bir', 'bu', 'o', 'şu', 'ya', 'da', 'de', 'ki', 'mi', 'mu', 'mü'];
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
      'e-ticaret',
      'online mağaza',
      'ürün satış',
      'e-ticaret startup',
      'online satış',
      'dijital mağaza'
    ],
    'saas': [
      'saas',
      'yazılım hizmeti',
      'b2b araç',
      'yazılım startup',
      'cloud software',
      'software service'
    ],
    'local-business': [
      'yerel işletme',
      'lokal hizmet',
      'mahalle işi',
      'yerel hizmet',
      'işletme sayfası',
      'lokal startup'
    ],
    'consulting': [
      'danışmanlık',
      'konsültasyon',
      'uzman hizmet',
      'danışman',
      'profesyonel hizmet',
      'koçluk'
    ],
    'education': [
      'eğitim',
      'online kurs',
      'öğretim',
      'eğitim platformu',
      'kurs sayfası',
      'öğrenim'
    ],
    'health': [
      'sağlık',
      'wellness',
      'terapi',
      'sağlık hizmeti',
      'wellness koçluğu',
      'sağlık danışmanlığı'
    ],
    'technology': [
      'teknoloji',
      'tech startup',
      'yazılım',
      'teknoloji hizmeti',
      'dijital çözüm',
      'innovation'
    ],
    'food': [
      'yemek',
      'gıda',
      'restaurant',
      'catering',
      'food truck',
      'yemek servisi'
    ],
    'fashion': [
      'moda',
      'fashion',
      'stil',
      'tasarım',
      'giyim',
      'moda markası'
    ],
    'travel': [
      'seyahat',
      'turizm',
      'tur',
      'travel',
      'gezi',
      'tatil'
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
    "creator": {
      "@type": "Organization",
      "name": "Listelee.io",
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
        answer: "Listelee.io ile e-ticaret projeniz için profesyonel landing page dakikalar içinde oluşturabilirsiniz. Ürün tanıtımı, müşteri yorumları ve satış sayfası özelliklerini kolayca ekleyebilirsiniz."
      },
      {
        question: "E-ticaret startup'ı için hangi özellikler önemli?",
        answer: "E-ticaret projesi için müşteri güven sinyalleri, ürün görselleri, fiyat bilgileri ve kolay iletişim formu kritik önemde. Listelee.io bu özellikleri otomatik olarak sayfanıza ekler."
      }
    ],
    'saas': [
      {
        question: "SaaS ürünü için etkili landing page nasıl olmalı?",
        answer: "SaaS landing page'inde ürünün çözdüğü problem, özellikler, fiyatlandırma ve demo talebi formu bulunmalı. Listelee.io ile SaaS projeler için optimize edilmiş şablonlar kullanabilirsiniz."
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
      suggestions.push('Başlık 30-60 karakter arasında olmalı');
    }
  } else {
    suggestions.push('Proje başlığı eksik');
  }

  // Description optimization (25 points)
  if (project.config.subtitle || project.config.description) {
    const desc = project.config.subtitle || project.config.description;
    if (desc.length >= 120 && desc.length <= 160) {
      score += 25;
    } else {
      score += 15;
      suggestions.push('Açıklama 120-160 karakter arasında olmalı');
    }
  } else {
    suggestions.push('Proje açıklaması eksik');
  }

  // Category (15 points)
  if (project.config.category) {
    score += 15;
  } else {
    suggestions.push('Proje kategorisi seçilmeli');
  }

  // Content quality (20 points)
  const hasFeatures = project.config.features?.length > 0;
  const hasBenefits = project.config.benefits?.length > 0;
  
  if (hasFeatures && hasBenefits) {
    score += 20;
  } else if (hasFeatures || hasBenefits) {
    score += 10;
    suggestions.push('Özellikler ve faydalar bölümlerini ekleyin');
  } else {
    suggestions.push('Proje özellikleri ve faydaları eksik');
  }

  // Performance metrics (15 points)
  if (project.stats?.totalSignups > 10) {
    score += 15;
  } else if (project.stats?.totalSignups > 0) {
    score += 8;
    suggestions.push('Daha fazla müşteri kaydı almaya odaklanın');
  } else {
    suggestions.push('Henüz müşteri kaydı alınmamış');
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
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}&via=listeleio`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${title} ${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${title}`
  };
} 