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
    return date.toLocaleDateString('en-US', {
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
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      
      {/* Header with breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 overflow-x-auto">
            <Link href="/" className="hover:text-[#D8FF00] whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#D8FF00] whitespace-nowrap">Blog</Link>
            <span>/</span>
            <Link 
              href={`/blog?category=${encodeURIComponent(post.category)}`} 
              className="hover:text-[#D8FF00] whitespace-nowrap"
            >
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-black dark:text-white font-medium truncate">{post.title}</span>
          </nav>

          {/* Back to Blog */}
          <Link href="/blog">
            <Button variant="outline" size="sm" className="mb-4 sm:mb-6 text-xs sm:text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Post Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs border-[#D8FF00] text-black dark:text-white bg-[#D8FF00] dark:bg-[#D8FF00] w-fit">
                {post.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {post.readingTime} minutes read
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3 sm:mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D8FF00] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs sm:text-sm">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-black dark:text-white">
                      <User className="w-3 h-3" />
                      <span className="truncate">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatNumber(post.views || 0)} views
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                  className="text-xs border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  {copiedLink ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
                <a 
                  href={shareUrls.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </a>
                <a 
                  href={shareUrls.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </a>
                <a 
                  href={shareUrls.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="mb-6 sm:mb-8">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-xs sm:text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:bg-[#D8FF00]/20 hover:text-[#D8FF00] hover:border-[#D8FF00] cursor-pointer transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>

                {/* Article Content */}
                <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2 sm:mb-3 mt-4 sm:mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-2 mt-3 sm:mt-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          className="text-[#D8FF00] hover:text-[#B8E000] underline break-words"
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {children}
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#D8FF00] pl-3 sm:pl-4 py-2 bg-gray-50 dark:bg-slate-800 my-3 sm:my-4 italic text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 dark:bg-slate-800 p-3 sm:p-4 rounded-lg overflow-x-auto my-3 sm:my-4 text-xs sm:text-sm">
                          {children}
                        </pre>
                      )
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </article>

                {/* Share Section */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white">
                      Share this article
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                          <Twitter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Twitter
                        </Button>
                      </a>
                      <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                          <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="space-y-4 sm:space-y-6">
              
              {/* Recent Posts */}
              <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-black dark:text-white">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8FF00]" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {recentPosts.filter(p => p.id !== post.id).slice(0, 4).map((recentPost) => (
                      <Link key={recentPost.id} href={`/blog/${recentPost.slug}`}>
                        <div className="group p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-[#D8FF00]">
                          <h5 className="font-medium text-sm sm:text-base text-black dark:text-white group-hover:text-[#D8FF00] line-clamp-2 mb-1 sm:mb-2">
                            {recentPost.title}
                          </h5>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(recentPost.publishedAt)}</span>
                            <span>•</span>
                            <span>{recentPost.readingTime} dk</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Link href="/blog">
                      <Button variant="outline" className="w-full text-xs sm:text-sm border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-[#D8FF00] hover:text-[#D8FF00]">
                        View All Posts
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h4 className="font-bold text-sm sm:text-base text-black dark:text-white mb-2">
                    🚀 Create Your Own Project!
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                    Put the knowledge you gained from the blog into practice and create your own landing page.
                  </p>
                  <Link href="/onboarding">
                    <Button className="w-full text-xs sm:text-sm bg-[#D8FF00] hover:bg-[#B8E000] text-black">
                      Get Started
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