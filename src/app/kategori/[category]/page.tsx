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
    title: 'E-Ticaret Projeleri',
    description: 'Listelee.io ile oluşturulmuş başarılı e-ticaret projelerini keşfet. Online mağaza, ürün satış sayfaları ve e-ticaret başlangıç projelerinden ilham al.',
    keywords: 'e-ticaret landing page, online mağaza sayfası, ürün satış sayfası, e-ticaret startup, online satış projesi',
    emoji: '🛒',
    longDescription: 'E-ticaret dünyasına adım atmak mı istiyorsun? Burada Listelee.io ile hayata geçirilmiş onlarca başarılı e-ticaret projesini bulabilirsin. Online mağazalardan ürün satış sayfalarına, marketplace fikirlerinden niş e-ticaret projelerine kadar geniş bir yelpazede ilham alabilir, kendi projen için fikirler edinebilirsin.'
  },
  'saas': {
    title: 'SaaS Projeleri',
    description: 'Yazılım hizmeti (SaaS) projelerinin en başarılı örnekleri. B2B araçlar, SaaS ürünler ve yazılım çözümleri için landing page örnekleri.',
    keywords: 'saas landing page, yazılım hizmeti sayfası, b2b araç sayfası, saas startup, yazılım proje sayfası',
    emoji: '💻',
    longDescription: 'SaaS (Software as a Service) dünyası sürekli büyüyen ve gelişen bir alan. Burada Listelee.io ile oluşturulmuş yazılım hizmetleri, B2B araçları, iş otomasyonu çözümleri ve SaaS ürünlerinin landing page örneklerini bulabilirsin. Kendi yazılım fikrin için müşteri validation yapma sürecinden ilham al.'
  },
  'local-business': {
    title: 'Yerel İşletme Projeleri',
    description: 'Yerel işletmeler için oluşturulmuş dijital pazarlama projeleri. Restoran, kuaför, cafe ve diğer yerel hizmetler için örnek sayfalar.',
    keywords: 'yerel işletme sayfası, restoran web sitesi, kuaför sayfası, cafe landing page, yerel hizmet sayfası',
    emoji: '🏪',
    longDescription: 'Yerel işletmeler dijital dünyada var olmak için güçlü bir online varlığa ihtiyaç duyuyor. Bu kategoride restoranlardan kuaförlere, cafelerden spor salonlarına kadar çeşitli yerel işletmelerin Listelee.io ile oluşturdukları dijital vitrinleri keşfedebilirsin.'
  },
  'consulting': {
    title: 'Danışmanlık Projeleri',
    description: 'Uzman danışmanlar ve koçlar için oluşturulmuş profesyonel sayfalar. İş danışmanlığı, yaşam koçluğu ve özel danışmanlık hizmetleri.',
    keywords: 'danışmanlık sayfası, koç web sitesi, iş danışmanı sayfası, uzman profil sayfası, danışmanlık hizmeti',
    emoji: '👔',
    longDescription: 'Danışmanlık sektöründe güven ve uzmanlık göstermek çok önemli. Bu kategoride iş danışmanlarından yaşam koçlarına, pazarlama uzmanlarından finans danışmanlarına kadar farklı alanlardaki uzmanların profesyonel sayfalarını inceleyebilirsin.'
  },
  'education': {
    title: 'Eğitim Projeleri',
    description: 'Online kurslar, eğitim platformları ve öğretim hizmetleri için oluşturulmuş sayfalar. Eğitimciler ve kurs yaratıcıları için ilham verici örnekler.',
    keywords: 'online kurs sayfası, eğitim platformu, öğretmen web sitesi, kurs landing page, eğitim hizmeti sayfası',
    emoji: '📚',
    longDescription: 'Eğitim sektörü dijital dönüşümle birlikte hızla gelişiyor. Online kurslardan birebir öğretim hizmetlerine, eğitim platformlarından workshop organizasyonlarına kadar eğitim alanındaki çeşitli projelerden ilham al.'
  },
  'health': {
    title: 'Sağlık Projeleri',
    description: 'Sağlık hizmetleri, wellness ürünleri ve terapistler için oluşturulmuş dijital sayfalar. Sağlık sektöründe güven oluşturan profesyonel örnekler.',
    keywords: 'sağlık hizmeti sayfası, doktor web sitesi, wellness ürün sayfası, terapi hizmeti, sağlık danışmanlığı',
    emoji: '🏥',
    longDescription: 'Sağlık sektöründe dijital varlık, güven ve profesyonellik açısından kritik öneme sahip. Doktorlardan terapistlere, wellness koçlarından sağlık ürünü satıcılarına kadar sağlık alanındaki profesyonel sayfaları keşfet.'
  },
  'technology': {
    title: 'Teknoloji Projeleri',
    description: 'Tech startupları, yazılım projeleri ve teknoloji hizmetleri için oluşturulmuş landing pagelar. Teknoloji sektöründeki inovatif proje örnekleri.',
    keywords: 'teknoloji startup sayfası, yazılım proje sayfası, tech hizmet sayfası, teknoloji ürün sayfası, startup landing page',
    emoji: '🚀',
    longDescription: 'Teknoloji dünyası sürekli yenilikle dolu. Yapay zeka projelerinden mobil uygulamalara, blockchain çözümlerinden IoT ürünlerine kadar teknoloji sektöründeki en yaratıcı ve inovatif projeleri keşfet.'
  },
  'food': {
    title: 'Yemek & İçecek Projeleri',
    description: 'Gıda sektöründeki yaratıcı projeler. Restoranlar, food trucklar, catering hizmetleri ve özel gıda ürünleri için örnek sayfalar.',
    keywords: 'restoran web sitesi, yemek servisi sayfası, catering hizmet sayfası, food truck sayfası, gıda ürün sayfası',
    emoji: '🍕',
    longDescription: 'Yemek sektörü hem geleneksel hem de modern yaklaşımlarla dolu yaratıcı bir alan. Ghost kitchenlardan gourmet ürünlere, veganözel diyetürlere kadar gıda sektöründeki çeşitli girişim fikirlerini keşfet.'
  },
  'fashion': {
    title: 'Moda Projeleri',
    description: 'Moda markaları, tasarımcılar ve stil danışmanları için oluşturulmuş estetik sayfalar. Fashion ve lifestyle sektöründeki trend projeler.',
    keywords: 'moda markası sayfası, tasarımcı web sitesi, stil danışmanı sayfası, fashion brand landing page, moda ürün sayfası',
    emoji: '👗',
    longDescription: 'Moda dünyası görsellik ve estetik açısından en ön planda olan sektörlerden biri. Kadın modasından erkek stiline, sürdürülebilir modadan özel tasarım hizmetlerine kadar moda sektöründeki yaratıcı projeleri incele.'
  },
  'travel': {
    title: 'Seyahat Projeleri',
    description: 'Turizm ve seyahat sektöründeki hizmetler. Tur operatörlerinden özel seyahat planlamasına, konaklama hizmetlerinden rehberlik servislerine.',
    keywords: 'tur operatörü sayfası, seyahat rehberi web sitesi, otel rezervasyon sayfası, turizm hizmeti, seyahat danışmanlığı',
    emoji: '✈️',
    longDescription: 'Seyahat sektörü deneyim satışının en yoğun olduğu alanlardan biri. Boutique otellerden özel tur rehberliğine, seyahat blogundan macera turlarına kadar turizm sektöründeki çeşitli hizmet modellerini keşfet.'
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
      title: 'Kategori Bulunamadı - Listelee.io',
      description: 'Aradığınız kategori bulunamadı. Tüm proje kategorilerini keşfetmek için ana sayfaya dönün.',
    };
  }

  return {
    title: `${categoryInfo.title} | Listelee.io Proje Galerisi`,
    description: categoryInfo.description,
    keywords: categoryInfo.keywords,
    alternates: {
      canonical: `/kategori/${category}`,
    },
    openGraph: {
      title: `${categoryInfo.title} | Listelee.io`,
      description: categoryInfo.description,
      url: `${APP_URL}/kategori/${category}`,
      siteName: 'Listelee.io',
      images: [`${APP_URL}/opengraph-image.png`],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryInfo.title} | Listelee.io`,
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
      "name": "Listelee.io",
      "url": APP_URL
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
          "name": "Proje Galerisi",
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
              <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/showcase" className="hover:text-lime-600 dark:hover:text-lime-400">Proje Galerisi</Link>
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
                    {projects.length} Proje
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatNumber(projects.reduce((sum, p) => sum + (p.stats?.totalSignups || 0), 0))} Toplam Kayıt
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
                Tüm Kategoriler
              </Button>
            </Link>
            
            <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
              {projects.length} proje bulundu
            </Badge>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
              <span className="text-6xl mb-4 block">{categoryInfo.emoji}</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Bu kategoride henüz proje yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                İlk projeyi sen oluştur ve bu kategoriye örnek ol!
              </p>
              <Link href="/onboarding">
                <Button className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black">
                  İlk Projeyi Oluştur
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
                      {project.config.subtitle || project.config.description || "Harika bir proje"}
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
                          İncele
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
                {categoryInfo.title} kategorisinde sen de var ol!
              </h3>
              <p className="text-black/80 mb-6 max-w-2xl mx-auto">
                Listelee.io ile kendi {category} projenizi oluşturun, müşteri toplayın ve sektörünüzde fark yaratın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-lime-400 dark:hover:bg-slate-700">
                    Hemen Başla - Ücretsiz
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                    Diğer Kategoriler
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