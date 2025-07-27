"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  BookOpen,
  Save,
  X
} from "lucide-react";
import { BlogPost, getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "~/lib/firestore";
import { auth } from "~/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BlogManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Girişimcilik',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user is admin (you can implement your own admin check)
        const isAdmin = currentUser.email === 'admin@listelee.io' || currentUser.email?.includes('@listelee.io');
        if (!isAdmin) {
          toast.error('Bu sayfaya erişim yetkiniz yok.');
          router.push('/dashboard');
          return;
        }
        await loadPosts();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadPosts = async () => {
    try {
      const allPosts = await getAllBlogPosts(false); // Get all posts including drafts
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Blog yazıları yüklenirken hata oluştu');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && { slug: generateSlug(value) })
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Girişimcilik',
      tags: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user || !formData.title || !formData.content) {
      toast.error('Başlık ve içerik alanları zorunludur');
      return;
    }

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const readingTime = calculateReadingTime(formData.content);

      const blogPostData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || formData.content.substring(0, 160) + '...',
        content: formData.content,
        author: {
          name: user.displayName || 'Admin',
          email: user.email || '',
          avatar: user.photoURL
        },
        category: formData.category,
        tags,
        status,
        seo: {
          title: formData.seoTitle || formData.title,
          description: formData.seoDescription || formData.excerpt,
          keywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k)
        },
        publishedAt: status === 'published' ? new Date() as any : undefined,
        readingTime
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, blogPostData);
        toast.success('Blog yazısı güncellendi');
      } else {
        await createBlogPost(blogPostData);
        toast.success('Blog yazısı oluşturuldu');
      }

      resetForm();
      await loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Blog yazısı kaydedilirken hata oluştu');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      seoTitle: post.seo.title,
      seoDescription: post.seo.description,
      seoKeywords: post.seo.keywords.join(', ')
    });
    setEditingPost(post);
    setIsCreating(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteBlogPost(postId);
      toast.success('Blog yazısı silindi');
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Blog yazısı silinirken hata oluştu');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Yayınlanmamış';
    const date = typeof timestamp.seconds === 'number' 
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazılarını oluşturun ve yönetin</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="mb-8 border-lime-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingPost ? 'Yazı Düzenle' : 'Yeni Yazı Oluştur'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Blog yazısı başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Özet</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Yazının kısa özeti..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">İçerik * (Markdown destekli)</label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Yazının içeriğini markdown formatında yazın..."
                rows={15}
                className="font-mono"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                >
                  <option value="Girişimcilik">Girişimcilik</option>
                  <option value="Startup">Startup</option>
                  <option value="Teknoloji">Teknoloji</option>
                  <option value="Pazarlama">Pazarlama</option>
                  <option value="Proje Yönetimi">Proje Yönetimi</option>
                  <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Etiketler (virgülle ayırın)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="startup, girişimcilik, teknoloji"
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h4 className="font-medium mb-4">SEO Ayarları</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Başlığı</label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="SEO için optimize edilmiş başlık"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Açıklaması</label>
                  <Textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="SEO için meta açıklama"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Anahtar Kelimeleri</label>
                  <Input
                    value={formData.seoKeywords}
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                    placeholder="anahtar, kelime, listesi"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleSave('draft')}
                variant="outline"
                className="border-gray-300 dark:border-slate-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Taslak Kaydet
              </Button>
              <Button
                onClick={() => handleSave('published')}
                className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Yayınla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Henüz blog yazısı yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                İlk blog yazınızı oluşturmak için yukarıdaki butona tıklayın
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className={post.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }
                      >
                        {post.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views || 0} görüntüleme
                      </span>
                      <span>{post.readingTime} dk okuma</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {post.status === 'published' && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 