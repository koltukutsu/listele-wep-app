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
  { value: "all", label: "All Projects" },
  { value: "e-commerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
  { value: "local-business", label: "Local Business" },
  { value: "consulting", label: "Consulting" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "technology", label: "Technology" },
  { value: "food", label: "Food & Beverage" },
  { value: "fashion", label: "Fashion" },
  { value: "travel", label: "Travel" }
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
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-lg text-black dark:text-white">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-[#D8FF00]" />
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Project Gallery
              </h1>
              <Sparkles className="w-8 h-8 text-[#D8FF00]" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get inspired by successful projects built with Launch List. Each one is a real founder story and customer acquisition success!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#D8FF00]" />
              <h2 className="text-2xl font-bold text-black dark:text-white">Featured Projects</h2>
              <Badge variant="outline" className="border-[#D8FF00] text-black dark:text-white bg-[#D8FF00] dark:bg-[#D8FF00]">Editor’s Pick</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#D8FF00] bg-white dark:bg-slate-800">
                  <CardHeader className="relative">
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="border-[#D8FF00] text-black dark:text-white bg-[#D8FF00] dark:bg-[#D8FF00]">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#D8FF00] transition-colors text-black dark:text-white">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                      {project.config?.subtitle || project.config?.description || "A great project"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-black dark:text-white">
                            {formatNumber(project.stats?.totalSignups || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Signups</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-black dark:text-white">
                            {formatNumber(project.stats?.totalVisits || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Visits</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-black dark:text-white">
                            {(project.stats?.conversionRate || 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Conversion</div>
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
                        className="w-full bg-[#D8FF00] hover:bg-[#B8E000] text-black group-hover:shadow-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
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
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <Input
                    placeholder="Search project name, description or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-[#D8FF00] focus:border-[#D8FF00]"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm focus:border-[#D8FF00] focus:ring-2 focus:ring-[#D8FF00]/20 focus:ring-opacity-50 py-2.5 text-sm font-medium appearance-none bg-no-repeat pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="all" className="font-medium">All Categories</option>
                    {PROJECT_CATEGORIES.filter(cat => cat.value !== "all").map((category) => (
                      <option key={category.value} value={category.value} className="font-medium">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Category Pills with SEO Links */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === "all" 
                    ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                    : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }
                >
                  Tüm Projeler
                </Button>
                {PROJECT_CATEGORIES.filter(cat => cat.value !== "all").map((category) => (
                  <div key={category.value} className="flex items-center gap-1">
                    <Button
                      onClick={() => setSelectedCategory(category.value)}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      className={selectedCategory === category.value 
                        ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                        : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }
                    >
                      {category.label}
                    </Button>
                    <Link href={`/kategori/${category.value}`} className="opacity-70 hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* SEO Category Links Section */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-black dark:text-white mb-3">
                  🎯 Category-Specific Pages
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                  Explore specially prepared pages for each category and review more detailed project examples:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {PROJECT_CATEGORIES.filter(cat => cat.value !== "all").map((category) => (
                    <Link 
                      key={category.value}
                      href={`/kategori/${category.value}`}
                      className="text-xs px-2 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#D8FF00]" />
              <h2 className="text-2xl font-bold text-black dark:text-white">All Projects</h2>
              <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-800">{filteredProjects.length} projects</Badge>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "No projects match your search" 
                  : "No projects have been published yet"}
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }} className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-[#D8FF00] transition-colors line-clamp-1 text-black dark:text-white">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {project.config?.subtitle || project.config?.description || "A great project"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Quick Stats */}
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-black dark:text-white">
                          <Users className="w-3 h-3" />
                          {formatNumber(project.stats?.totalSignups || 0)}
                        </div>
                        <div className="flex items-center gap-1 text-black dark:text-white">
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
                        View
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
          <div className="bg-[#D8FF00] rounded-xl p-8 text-black">
            <h3 className="text-2xl font-bold mb-4">
              Your Project Can Be Here! 🚀
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Build your landing page with Launch List, collect customers, and let your success story inspire thousands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started - Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-black text-black hover:bg-black/10">
                  See Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 