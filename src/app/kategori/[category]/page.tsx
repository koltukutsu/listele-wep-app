import { getPublicProjectsByCategory } from '~/lib/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Eye, Users, ExternalLink, ArrowLeft, TrendingUp, Target } from 'lucide-react';
import type { Metadata } from 'next';
import { APP_URL } from '~/lib/config';

const CATEGORY_INFO = {
  'e-commerce': {
    title: 'E-Commerce Projects',
    description: 'Discover successful e-commerce projects built with Launch List. Get inspired by online stores, product sales pages, and e-commerce starter projects.',
    keywords: 'e-commerce landing page, online store page, product sales page, ecommerce startup, online sales project',
    emoji: '🛒',
    longDescription: 'Looking to step into the e-commerce world? Here you can find dozens of successful e-commerce projects brought to life with Launch List. From online stores to product sales pages, from marketplace ideas to niche e-commerce projects, get inspired and gather ideas for your own project.'
  },
  'saas': {
    title: 'SaaS Projects',
    description: 'The best examples of Software as a Service (SaaS) projects. Landing page examples for B2B tools, SaaS products and software solutions.',
    keywords: 'saas landing page, software service page, b2b tool page, saas startup, software project page',
    emoji: '💻',
    longDescription: 'The SaaS world is constantly growing and evolving. Here you can find landing page examples of software services, B2B tools, business automation solutions and SaaS products built with Launch List. Get inspired for your own software idea and validate with real customers.'
  },
  'local-business': {
    title: 'Local Business Projects',
    description: 'Digital marketing projects built for local businesses. Example pages for restaurants, hairdressers, cafes and other local services.',
    keywords: 'local business page, restaurant website, hairdresser page, cafe landing page, local service page',
    emoji: '🏪',
    longDescription: 'Local businesses need a strong online presence to thrive. In this category, explore the digital storefronts that various local businesses created with Launch List: from restaurants to hairdressers, cafes to gyms.'
  },
  'consulting': {
    title: 'Consulting Projects',
    description: 'Professional pages built for expert consultants and coaches. Business consulting, life coaching and specialized advisory services.',
    keywords: 'consulting page, coach website, business consultant page, expert profile page, consulting services',
    emoji: '👔',
    longDescription: 'In consulting, trust and expertise are everything. Explore professional pages of experts from business consultants to life coaches, marketing strategists to financial advisors.'
  },
  'education': {
    title: 'Education Projects',
    description: 'Pages for online courses, education platforms and teaching services. Inspiring examples for educators and course creators.',
    keywords: 'online course page, education platform, teacher website, course landing page, education service page',
    emoji: '📚',
    longDescription: 'Education is rapidly evolving with digital transformation. From online courses to one-on-one tutoring, from education platforms to workshops, get inspired by diverse education projects.'
  },
  'health': {
    title: 'Health Projects',
    description: 'Digital pages for health services, wellness products and therapists. Professional examples that build trust in the health sector.',
    keywords: 'health service page, doctor website, wellness product page, therapy service, health consulting',
    emoji: '🏥',
    longDescription: 'In health, digital presence is critical for trust and professionalism. Explore professional pages across the health domain: doctors, therapists, wellness coaches and health product providers.'
  },
  'technology': {
    title: 'Technology Projects',
    description: 'Landing pages for tech startups, software projects and technology services. Innovative project examples in the technology sector.',
    keywords: 'technology startup page, software project page, tech service page, technology product page, startup landing page',
    emoji: '🚀',
    longDescription: 'The tech world is full of innovation. From AI projects to mobile apps, from blockchain to IoT products, discover the most creative and innovative projects in technology.'
  },
  'food': {
    title: 'Food & Beverage Projects',
    description: 'Creative projects in the food industry. Example pages for restaurants, food trucks, catering services and specialty food products.',
    keywords: 'restaurant website, meal service page, catering service page, food truck page, food product page',
    emoji: '🍕',
    longDescription: 'The food industry is a creative field with both traditional and modern approaches. Explore diverse startup ideas from ghost kitchens to gourmet products and more.'
  },
  'fashion': {
    title: 'Fashion Projects',
    description: 'Aesthetic pages built for fashion brands, designers and style consultants. Trend projects in fashion and lifestyle.',
    keywords: 'fashion brand page, designer website, style consultant page, fashion brand landing page, fashion product page',
    emoji: '👗',
    longDescription: 'Fashion is among the most visually driven sectors. From women’s fashion to men’s style, sustainable fashion to bespoke services—explore creative fashion projects.'
  },
  'travel': {
    title: 'Travel Projects',
    description: 'Services in tourism and travel. From tour operators to custom travel planning, from accommodation to guiding services.',
    keywords: 'tour operator page, travel guide website, hotel booking page, tourism service, travel consulting',
    emoji: '✈️',
    longDescription: 'Travel is a space where experiences are everything. From boutique hotels to private guiding, from travel blogs to adventure tours—discover diverse service models in tourism.'
  }
};

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];

  if (!categoryInfo) {
    return {
      title: 'Category Not Found - Launch List',
      description: 'The category you are looking for was not found. Return to the homepage to explore all project categories.',
    };
  }

  return {
    title: `${categoryInfo.title} | Launch List Project Gallery`,
    description: categoryInfo.description,
    keywords: categoryInfo.keywords,
    alternates: {
      canonical: `/kategori/${category}`,
    },
    openGraph: {
      title: `${categoryInfo.title} | Launch List`,
      description: categoryInfo.description,
      url: `${APP_URL}/kategori/${category}`,
      siteName: 'Launch List',
      images: [`${APP_URL}/opengraph-image.png`],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryInfo.title} | Launch List`,
      description: categoryInfo.description,
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
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];

  if (!categoryInfo) {
    notFound();
  }

  // Fetch projects for this category
  const projects = await getPublicProjectsByCategory(category, 50);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Generate category structured data
  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryInfo.title,
    "description": categoryInfo.description,
    "url": `${APP_URL}/kategori/${category}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Launch List",
      "url": APP_URL
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": APP_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Project Gallery",
          "item": `${APP_URL}/showcase`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryInfo.title,
          "item": `${APP_URL}/kategori/${category}`
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": projects.length,
      "itemListElement": projects.slice(0, 10).map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": project.config.title || project.name,
          "description": project.config.subtitle || project.config.description,
          "url": `${APP_URL}/${project.slug}`
        }
      }))
    }
  };

  return (
    <>
      {/* Inject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryStructuredData),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-lime-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400">Home</Link>
              <span>/</span>
              <Link href="/showcase" className="hover:text-lime-600 dark:hover:text-lime-400">Project Gallery</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100">{categoryInfo.title}</span>
            </nav>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">{categoryInfo.emoji}</span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text text-transparent">
                  {categoryInfo.title}
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                {categoryInfo.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-lime-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {projects.length} Projects
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatNumber(projects.reduce((sum, p) => sum + (p.stats?.totalSignups || 0), 0))} Total Signups
                  </span>
                </div>
              </div>

              {/* Long Description */}
              <div className="max-w-4xl mx-auto">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {categoryInfo.longDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/showcase">
              <Button variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Categories
              </Button>
            </Link>
            
            <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
              {projects.length} projects found
            </Badge>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
              <span className="text-6xl mb-4 block">{categoryInfo.emoji}</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No projects in this category yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create the first project and set an example for this category!
              </p>
              <Link href="/onboarding">
                <Button className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black">
                  Create the First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1 text-gray-900 dark:text-gray-100">
                      {project.config.title || project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {project.config.subtitle || project.config.description || "A great project"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Quick Stats */}
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Users className="w-3 h-3" />
                          {formatNumber(project.stats?.totalSignups || 0)}
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Eye className="w-3 h-3" />
                          {formatNumber(project.stats?.totalVisits || 0)}
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/${project.slug}`} target="_blank">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-xl p-8 text-black">
              <span className="text-4xl mb-4 block">{categoryInfo.emoji}</span>
              <h3 className="text-2xl font-bold mb-4">
                Be part of {categoryInfo.title} too!
              </h3>
              <p className="text-black/80 mb-6 max-w-2xl mx-auto">
                Create your own {category} project with Launch List, collect customers, and make a difference in your industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-lime-400 dark:hover:bg-slate-700">
                    Get Started - Free
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                    Other Categories
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 