"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Calendar, 
  User, 
  BookOpen,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { BlogPost } from "~/lib/firestore";

interface BlogListingClientProps {
  initialPosts: BlogPost[];
  categories: string[];
  tags: string[];
}

const POSTS_PER_PAGE = 9;

export default function BlogListingClient({ 
  initialPosts, 
  categories, 
  tags 
}: BlogListingClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search term, category, and tag
  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, selectedTag, posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = typeof timestamp.seconds === 'number' 
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#D8FF00]" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white">
                Launch List Blog
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#D8FF00]" />
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 px-4">
              Girişimcilik dünyasından en güncel haberler, startup hikayeleri, teknoloji trendleri 
              ve proje geliştirme rehberleri. Başarılı girişimcilerden ilham al!
            </p>
            
            {/* Blog Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8FF00]" />
                <span className="text-base sm:text-lg font-semibold text-black dark:text-white">
                  {posts.length} Makale
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8FF00]" />
                <span className="text-base sm:text-lg font-semibold text-black dark:text-white">
                  {categories.length} Kategori
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8FF00]" />
                <span className="text-base sm:text-lg font-semibold text-black dark:text-white">
                  {formatNumber(posts.reduce((sum, post) => sum + (post.views || 0), 0))} Görüntüleme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Makale ara... (başlık, içerik veya etiket)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-[#D8FF00] focus:border-[#D8FF00]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                📂 Kategoriler
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${selectedCategory === "all" 
                    ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                    : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Tümü ({posts.length})
                </Button>
                {categories.map((category) => {
                  const categoryCount = posts.filter(p => p.category === category).length;
                  return (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${selectedCategory === category 
                        ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                        : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {category} ({categoryCount})
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                🏷️ Etiketler
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Button
                  onClick={() => setSelectedTag("all")}
                  variant={selectedTag === "all" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${selectedTag === "all" 
                    ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                    : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Tümü
                </Button>
                {tags.slice(0, 10).map((tag) => { // Show only first 10 tags
                  const tagCount = posts.filter(p => p.tags.includes(tag)).length;
                  return (
                    <Button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${selectedTag === tag 
                        ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                        : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {tag} ({tagCount})
                    </Button>
                  );
                })}
                {tags.length > 10 && (
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400">
                    +{tags.length - 10} daha
                  </Badge>
                )}
              </div>
            </div>

            {/* Filter Results Info */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span>
                  {filteredPosts.length} sonuç gösteriliyor
                  {(searchTerm || selectedCategory !== "all" || selectedTag !== "all") && 
                    ` (${posts.length} toplam makale)`
                  }
                </span>
                {(searchTerm || selectedCategory !== "all" || selectedTag !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedTag("all");
                    }}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs sm:text-sm w-fit"
                  >
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mx-2 sm:mx-0">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-2 px-4">
              {searchTerm || selectedCategory !== "all" || selectedTag !== "all" 
                ? "Aramanızla eşleşen makale bulunamadı" 
                : "Henüz hiç blog yazısı yayınlanmamış"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 px-4">
              {searchTerm || selectedCategory !== "all" || selectedTag !== "all"
                ? "Farklı anahtar kelimeler veya filtreler deneyebilirsiniz."
                : "İlk blog yazımız yakında yayınlanacak!"}
            </p>
            {(searchTerm || selectedCategory !== "all" || selectedTag !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedTag("all");
                }}
                className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
              >
                Tüm Makaleleri Göster
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                  <CardHeader className="p-0">
                    {post.featuredImage && (
                      <div className="aspect-video bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-[#D8FF00]" />
                      </div>
                    )}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs border-[#D8FF00] text-black dark:text-white bg-[#D8FF00] dark:bg-[#D8FF00]">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} dk okuma
                        </div>
                      </div>
                      <CardTitle className="text-base sm:text-lg group-hover:text-[#D8FF00] transition-colors line-clamp-2 text-black dark:text-white mb-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(post.views || 0)}
                        </div>
                      </div>

                      {/* Read More Button */}
                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-[#D8FF00] hover:text-[#D8FF00]"
                        >
                          Devamını Oku →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  ← Önceki
                </Button>
                
                <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`text-sm min-w-[40px] ${currentPage === page 
                          ? "bg-[#D8FF00] text-black hover:bg-[#B8E000]" 
                          : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400 px-1">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="text-sm min-w-[40px] border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Sonraki →
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="mt-12 sm:mt-16 text-center">
          <div className="bg-[#D8FF00] rounded-xl p-6 sm:p-8 text-black mx-2 sm:mx-0">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              Kendin de Bir Proje Oluştur! 🚀
            </h3>
            <p className="text-sm sm:text-base text-black/80 mb-6 max-w-2xl mx-auto px-4">
              Blog'da okuduğun hikayelere ilham al ve kendi startup yolculuğuna başla. 
              Build your professional landing page in minutes with Launch List.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base bg-white text-black hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Hemen Başla - Ücretsiz
                </Button>
              </Link>
              <Link href="/showcase">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base border-black text-black hover:bg-black/10">
                  Örnek Projeleri İncele
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 