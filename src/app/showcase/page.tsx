"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Eye, Users, ExternalLink, Search, Filter, TrendingUp, Award, Sparkles } from "lucide-react";
import { getFeaturedProjects, getPublicProjectsByCategory, incrementProjectViews } from "~/lib/firestore";
import { Project } from "~/lib/firestore";
import { APP_URL } from "~/lib/config";
import { trackFeatureUsage } from "~/lib/analytics";
import Link from "next/link";

const PROJECT_CATEGORIES = [
  { value: "all", label: "Tüm Projeler" },
  { value: "e-commerce", label: "E-Ticaret" },
  { value: "saas", label: "SaaS" },
  { value: "local-business", label: "Yerel İşletme" },
  { value: "consulting", label: "Danışmanlık" },
  { value: "education", label: "Eğitim" },
  { value: "health", label: "Sağlık" },
  { value: "technology", label: "Teknoloji" },
  { value: "food", label: "Yemek & İçecek" },
  { value: "fashion", label: "Moda" },
  { value: "travel", label: "Seyahat" }
];

interface ProjectStats {
  totalSignups: number;
  totalVisits: number;
  conversionRate: number;
  galleryViews?: number;
}

interface ShowcaseProject extends Project {
  stats: ProjectStats;
  featured?: boolean;
  config: {
    category?: string;
    isPublic?: boolean;
    [key: string]: any;
  };
}

export default function ShowcasePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ShowcaseProject[]>([]);
  const [allProjects, setAllProjects] = useState<ShowcaseProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadProjects() {
      try {
        const [featured, all] = await Promise.all([
          getFeaturedProjects(6),
          getPublicProjectsByCategory(undefined, 50)
        ]);
        
        console.log('Featured projects loaded:', featured.length);
        console.log('All projects loaded:', all.length);
        console.log('Sample project data:', all[0]);
        
        setFeaturedProjects(featured as ShowcaseProject[]);
        setAllProjects(all as ShowcaseProject[]);
        setFilteredProjects(all as ShowcaseProject[]);
        
        await trackFeatureUsage('project_gallery', 'viewed');
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = allProjects;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.config?.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.config?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.config?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, allProjects]);

  const handleProjectView = async (project: ShowcaseProject) => {
    await incrementProjectViews(project.id);
    await trackFeatureUsage('project_gallery', 'used', { 
      projectId: project.id,
      category: project.config?.category 
    });
    window.open(`${APP_URL}/${project.slug}`, '_blank');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-800 dark:text-gray-200">Projeler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-lime-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-lime-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text text-transparent">
                Proje Galerisi
              </h1>
              <Sparkles className="w-8 h-8 text-lime-500" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Listele.io ile hayata geçirilmiş başarılı projelerden ilham alın. 
              Her biri gerçek girişimcilerin hikayesi ve müşteri toplama başarısı!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-lime-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Öne Çıkan Projeler</h2>
              <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">Editör Seçimi</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-lime-200 dark:border-lime-700 bg-white dark:bg-slate-800">
                  <CardHeader className="relative">
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
                        <Award className="w-3 h-3 mr-1" />
                        Öne Çıkan
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors text-gray-900 dark:text-gray-100">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                      {project.config?.subtitle || project.config?.description || "Harika bir proje"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatNumber(project.stats?.totalSignups || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Kayıt</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatNumber(project.stats?.totalVisits || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Ziyaret</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {(project.stats?.conversionRate || 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Dönüşüm</div>
                        </div>
                      </div>

                      {/* Category */}
                      {project.config?.category && (
                        <Badge variant="secondary" className="w-fit bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600">
                          {PROJECT_CATEGORIES.find(cat => cat.value === project.config.category)?.label || project.config.category}
                        </Badge>
                      )}

                      {/* CTA */}
                      <Button 
                        onClick={() => handleProjectView(project)}
                        className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black group-hover:shadow-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Projeyi İncele
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-lime-200 dark:border-slate-700 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <Input
                    placeholder="Proje adı, açıklama veya içerik ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-lime-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-lime-500 focus:ring-2 focus:ring-lime-200 dark:focus:ring-lime-800 focus:ring-opacity-50 py-2.5 text-sm font-medium appearance-none bg-no-repeat pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="all" className="font-medium">Tüm Kategoriler</option>
                    {PROJECT_CATEGORIES.filter(cat => cat.value !== "all").map((category) => (
                      <option key={category.value} value={category.value} className="font-medium">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Category Pills */}
            <div className="mt-4 pt-4 border-t border-lime-100 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === "all" 
                    ? "bg-gradient-to-r from-lime-400 to-green-500 text-black hover:from-lime-500 hover:to-green-600" 
                    : "border-lime-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-slate-700"
                  }
                >
                  Tüm Projeler
                </Button>
                {PROJECT_CATEGORIES.filter(cat => cat.value !== "all").map((category) => (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    className={selectedCategory === category.value 
                      ? "bg-gradient-to-r from-lime-400 to-green-500 text-black hover:from-lime-500 hover:to-green-600" 
                      : "border-lime-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-slate-700"
                    }
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-lime-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tüm Projeler</h2>
              <Badge variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/50">{filteredProjects.length} proje</Badge>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Aramanızla eşleşen proje bulunamadı" 
                  : "Henüz hiç proje yayınlanmamış"}
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }} className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1 text-gray-900 dark:text-gray-100">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {project.config?.subtitle || project.config?.description || "Harika bir proje"}
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

                      {/* Category */}
                      {project.config?.category && (
                        <Badge variant="outline" className="text-xs w-fit border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700">
                          {PROJECT_CATEGORIES.find(cat => cat.value === project.config.category)?.label || project.config.category}
                        </Badge>
                      )}

                      {/* CTA */}
                      <Button 
                        onClick={() => handleProjectView(project)}
                        size="sm"
                        variant="outline"
                        className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        İncele
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-xl p-8 text-black">
            <h3 className="text-2xl font-bold mb-4">
              Senin Projen de Burada Olabilir! 🚀
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Listele.io ile kendi landing page'ini oluştur, müşteri topla ve başarı hikayenin binlerce kişiye ilham versin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-lime-400 dark:hover:bg-slate-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Hemen Başla - Ücretsiz
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                  Fiyatları İncele
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 