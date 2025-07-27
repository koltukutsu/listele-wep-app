"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  ArrowLeft, 
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Check,
  BookOpen,
  Tag
} from "lucide-react";
import { BlogPost } from "~/lib/firestore";
import { toast } from "sonner";

interface BlogPostClientProps {
  post: BlogPost;
  recentPosts: BlogPost[];
}

export default function BlogPostClient({ post, recentPosts }: BlogPostClientProps) {
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success("Bağlantı panoya kopyalandı!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error("Bağlantı kopyalanamadı");
    }
  };

  const generateShareUrls = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const description = encodeURIComponent(post.excerpt);

    return {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=listeleio`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
  };

  const shareUrls = generateShareUrls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      
      {/* Header with breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-lime-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-lime-600 dark:hover:text-lime-400">Blog</Link>
            <span>/</span>
            <Link 
              href={`/blog?category=${encodeURIComponent(post.category)}`} 
              className="hover:text-lime-600 dark:hover:text-lime-400"
            >
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">{post.title}</span>
          </nav>

          {/* Back to Blog */}
          <Link href="/blog">
            <Button variant="outline" size="sm" className="mb-6 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blog'a Dön
            </Button>
          </Link>

          {/* Post Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
                {post.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {post.readingTime} dakika okuma
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-lime-400 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <User className="w-3 h-3" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  {formatNumber(post.views || 0)} görüntüleme
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <a 
                    href={shareUrls.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </a>
                  <a 
                    href={shareUrls.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </a>
                  <a 
                    href={shareUrls.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardContent className="p-8">
                
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="mb-8">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:bg-lime-100 dark:hover:bg-lime-900/20 hover:text-lime-700 dark:hover:text-lime-300 cursor-pointer transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>

                {/* Article Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          className="text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 underline"
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {children}
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-lime-400 dark:border-lime-600 pl-4 py-2 bg-lime-50 dark:bg-lime-900/20 my-4 italic text-gray-700 dark:text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto my-4">
                          {children}
                        </pre>
                      )
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </article>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Bu yazıyı paylaş
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Kopyalandı!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Linki Kopyala
                          </>
                        )}
                      </Button>
                      <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                      </a>
                      <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Recent Posts */}
              <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BookOpen className="w-5 h-5 text-lime-500" />
                    Son Yazılar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.filter(p => p.id !== post.id).slice(0, 4).map((recentPost) => (
                      <Link key={recentPost.id} href={`/blog/${recentPost.slug}`}>
                        <div className="group p-3 rounded-lg hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors cursor-pointer border border-transparent hover:border-lime-200 dark:hover:border-lime-800">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-lime-700 dark:group-hover:text-lime-300 line-clamp-2 mb-2">
                            {recentPost.title}
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(recentPost.publishedAt)}</span>
                            <span>•</span>
                            <span>{recentPost.readingTime} dk</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Link href="/blog">
                      <Button variant="outline" className="w-full border-lime-300 dark:border-lime-700 text-lime-700 dark:text-lime-300 hover:bg-lime-50 dark:hover:bg-lime-900/20">
                        Tüm Yazıları Gör
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="border-lime-200 dark:border-lime-700 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20">
                <CardContent className="p-6 text-center">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    🚀 Kendi Projenizi Oluşturun!
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Blog'da edindiğiniz bilgileri pratiğe dökün ve kendi landing page'inizi oluşturun.
                  </p>
                  <Link href="/onboarding">
                    <Button className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black">
                      Hemen Başla
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 