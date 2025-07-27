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
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-lime-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-lime-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text text-transparent">
                Listelee.io Blog
              </h1>
              <Sparkles className="w-8 h-8 text-lime-500" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Girişimcilik dünyasından en güncel haberler, startup hikayeleri, teknoloji trendleri 
              ve proje geliştirme rehberleri. Başarılı girişimcilerden ilham al!
            </p>
            
            {/* Blog Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lime-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {posts.length} Makale
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {categories.length} Kategori
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(posts.reduce((sum, post) => sum + (post.views || 0), 0))} Görüntüleme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-lime-200 dark:border-slate-700 p-6">
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Makale ara... (başlık, içerik veya etiket)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-lime-500 focus:border-lime-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                📂 Kategoriler
              </h4>
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
                      className={selectedCategory === category 
                        ? "bg-gradient-to-r from-lime-400 to-green-500 text-black hover:from-lime-500 hover:to-green-600" 
                        : "border-lime-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-slate-700"
                      }
                    >
                      {category} ({categoryCount})
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                🏷️ Etiketler
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedTag("all")}
                  variant={selectedTag === "all" ? "default" : "outline"}
                  size="sm"
                  className={selectedTag === "all" 
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600" 
                    : "border-blue-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                  }
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
                      className={selectedTag === tag 
                        ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600" 
                        : "border-blue-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                      }
                    >
                      {tag} ({tagCount})
                    </Button>
                  );
                })}
                {tags.length > 10 && (
                  <Badge variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400">
                    +{tags.length - 10} daha
                  </Badge>
                )}
              </div>
            </div>

            {/* Filter Results Info */}
            <div className="mt-6 pt-4 border-t border-lime-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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
                    className="text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20"
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
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm || selectedCategory !== "all" || selectedTag !== "all" 
                ? "Aramanızla eşleşen makale bulunamadı" 
                : "Henüz hiç blog yazısı yayınlanmamış"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
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
                className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Tüm Makaleleri Göster
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                  <CardHeader className="p-0">
                    {post.featuredImage && (
                      <div className="aspect-video bg-gradient-to-br from-lime-100 to-green-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-lime-500 dark:text-lime-400" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} dk okuma
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-2 text-gray-900 dark:text-gray-100 mb-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-4">
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
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author.name}
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
                          className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-lime-900/20 hover:border-lime-300 dark:hover:border-lime-700 hover:text-lime-700 dark:hover:text-lime-300"
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
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  ← Önceki
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page 
                        ? "bg-gradient-to-r from-lime-400 to-green-500 text-black hover:from-lime-500 hover:to-green-600" 
                        : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Sonraki →
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-xl p-8 text-black">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Kendin de Bir Proje Oluştur! 🚀
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Blog'da okuduğun hikayelere ilham al ve kendi startup yolculuğuna başla. 
              Listelee.io ile dakikalar içinde profesyonel landing page'ini oluştur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-lime-400 dark:hover:bg-slate-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Hemen Başla - Ücretsiz
                </Button>
              </Link>
              <Link href="/showcase">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
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