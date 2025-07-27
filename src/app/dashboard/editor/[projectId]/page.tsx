"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, type ChangeEvent } from "react";
import { toast } from "sonner";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { createProject, getProjectById, updateProject, deleteProject } from "~/lib/firestore";
import type { Project } from "~/lib/firestore";
import ProjectPreview from "~/components/project-preview";
import Confetti from 'react-confetti';
import AIFounderModal from '~/components/ai-founder-modal';
import { PartyPopper, Copy, Check, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '~/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { APP_URL, isPaymentEnabled } from "~/lib/config";
import { getPlanBySlug } from "~/lib/plans";
import { getUserProfile } from "~/lib/firestore";
import { Globe, Users, ToggleLeft, ToggleRight,ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';


const PROJECT_CATEGORIES = [
    { value: "other", label: "Diğer" },
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

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const defaultConfig = {
    name: "Yeni Projem",
    title: "Geleceği İnşa Etmeye Hazır mısın?",
    subtitle: "Büyük fikrin için ilk adımı at, dünyayı değiştirmeye başla.",
    description: "Bu yolculukta sana katılacak ilk kişilerden olmak için mailini bırak.",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#3b82f6",
    formFields: { name: true, email: true, phone: false },
    buttonText: "Geleceğin Parçası Ol",
    thankYouMessage: "Harika! Aramıza hoş geldin. Çok yakında büyük haberlerle döneceğiz. ",
    isPublic: true, // Default to public for free users
    category: 'other', // Default category
    targetAudience: {
        title: "Kimin Problemini Çözüyorsun?",
        description: "Girişiminin kalbinde yatan değeri anlat. Hangi büyük soruna çözüm getirdiğini, kimin hayatını kolaylaştırdığını net ve etkileyici bir şekilde ifade et."
    },
    benefits: [
        { title: "Değer Vaadin 1", description: "Kullanıcıların hayatını nasıl değiştireceksin?", icon: "" },
        { title: "Değer Vaadin 2", description: "Onlara ne gibi bir süper güç vereceksin?", icon: "" },
        { title: "Değer Vaadin 3", description: "Neden sensiz yapamayacaklar?", icon: "" }
    ],
    features: [
        { title: "Ana Özellik 1", description: "Fikrini hayata geçiren temel teknoloji nedir?", icon: "" },
        { title: "Ana Özellik 2", description: "Kullanıcıları en çok ne etkileyecek?", icon: "" },
        { title: "Ana Özellik 3", description: "Seni rakiplerinden ayıran o sihirli dokunuş.", icon: "" }
    ],
    faqSections: {
        whoIsItFor: {
            title: "Kimler İçin?",
            items: ["Girişimciler", "Yaratıcılar", "Meraklılar"]
        },
        whatCanItDo: {
            title: "Neler Yapabilir?",
            items: ["Fikrini doğrula", "Topluluk oluştur", "Harekete geç"]
        }
    },
    footerText: " 2025 Fikrinin Adı - Geleceği birlikte inşa ediyoruz."
};

export default function ProjectEditorPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const router = useRouter();

    const [config, setConfig] = useState<any>(defaultConfig); // Using any for now to match the dynamic nature of config
    const [loading, setLoading] = useState(false);
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
    const [createdProjectSlug, setCreatedProjectSlug] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [copyButtonText, setCopyButtonText] = useState('Kopyala');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userPlan, setUserPlan] = useState<any>(null);

    const isEditing = projectId !== 'new';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                
                // Fetch user profile and plan
                try {
                    const profile = await getUserProfile(currentUser.uid);
                    setUserProfile(profile);
                    if (profile) {
                        const plan = getPlanBySlug(profile.plan || 'free');
                        setUserPlan(plan);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }

                if (isEditing) {
                    try {
                        const projectData = await getProjectById(projectId);
                        if (projectData && projectData.userId === currentUser.uid) {
                            setConfig(projectData.config);
                        } else {
                            toast.error('Proje bulunamadı veya bu projeyi düzenleme yetkiniz yok.');
                            router.push('/dashboard');
                        }
                    } catch (error) {
                        toast.error('Proje yüklenirken bir hata oluştu.');
                        console.error('Error fetching project:', error);
                    }
                }
            } else {
                router.push("/login");
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [router, projectId, isEditing]);

    const updateConfig = (path: string, value: any) => {
        setConfig((prev: any) => {
            const newConfig = { ...prev };
            let current: any = newConfig;
            const keys = path.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newConfig;
        });
    };

    const generateSlug = (name: string): string => {
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
        
        return slug
            .toLowerCase()
            .trim()
            // Remove unwanted characters but keep useful ones for SEO
            .replace(/[^a-z0-9\s\-\_]/g, '')
            // Replace multiple whitespace/underscores with hyphens
            .replace(/[\s\_]+/g, '-')
            // Remove multiple consecutive hyphens
            .replace(/-+/g, '-')
            // Remove leading/trailing hyphens
            .replace(/^-+|-+$/g, '')
            // Ensure slug is not too long for SEO (max 60 chars)
            .substring(0, 60)
            .replace(/-+$/, ''); // Remove trailing hyphens again
    };

    const handlePrivacyToggle = () => {
        const currentIsPublic = config.isPublic;
        const wantsPrivate = currentIsPublic; // If currently public, user wants to make it private
        
        // Check if user is trying to make project private but is on free plan
        if (wantsPrivate && userPlan?.slug === 'free') {
            setShowUpgradeDialog(true);
            return;
        }
        
        // Allow the toggle
        updateConfig('isPublic', !currentIsPublic);
    };

    const canMakePrivate = userPlan?.slug !== 'free';

    const handleDeleteProject = async () => {
        if (!isEditing || !projectId || !user) return;
        
        setIsDeleting(true);
        try {
            await deleteProject(projectId);
            toast.success('Proje başarıyla silindi.');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Proje silinirken bir hata oluştu.');
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleSaveProject = async () => {
        if (!config.name) {
            toast.error("Lütfen proje adını girin.");
            return;
        }
        if (!user) {
            toast.error("Oturum açmanız gerekiyor.");
            return;
        }

        setLoading(true);
        const slug = generateSlug(config.name);

        try {
            if (isEditing) {
                await updateProject(projectId, { 
                    config,
                    status: 'published' // Ensure existing projects are also published
                });
                toast.success('Proje başarıyla güncellendi!');
                router.push('/dashboard');
            } else {
                const newProjectData: Partial<Project> = {
                    name: config.name,
                    slug,
                    config,
                    status: 'published', // Set status to published
                };
                const newProjectId = await createProject(user.uid, newProjectData);
                setCreatedProjectId(newProjectId);
                setCreatedProjectSlug(slug);
                toast.success('Proje başarıyla oluşturuldu! ');
                setShowConfetti(true);
            }
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error("Proje kaydedilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const updateListItem = (section: 'benefits' | 'features', index: number, field: string, value: string) => {
        const newList = [...config[section]];
        const updatedItem = { ...newList[index], [field]: value };
        newList[index] = updatedItem;
        updateConfig(section, newList);
    };

    const addListItem = (section: 'benefits' | 'features') => {
        const newItem = section === 'benefits' ? { title: "Yeni Değer Vaadi", description: "Açıklama", icon: "" } : { title: "Yeni Özellik", description: "Açıklama", icon: "" };
        updateConfig(section, [...config[section], newItem]);
    };

    const removeListItem = (section: 'benefits' | 'features', index: number) => {
        const newList = config[section].filter((_: any, i: number) => i !== index);
        updateConfig(section, newList);
    };

    const addFaqItem = (section: 'whoIsItFor' | 'whatCanItDo') => {
        const newItems = [...config.faqSections[section].items, "Yeni Soru"];
        updateConfig(`faqSections.${section}.items`, newItems);
    };

    const removeFaqItem = (section: 'whoIsItFor' | 'whatCanItDo', index: number) => {
        const newItems = config.faqSections[section].items.filter((_: any, i: number) => i !== index);
        updateConfig(`faqSections.${section}.items`, newItems);
    };

    const handleCopyLink = () => {
        if (!createdProjectSlug) return;
        const url = `${APP_URL}/${createdProjectSlug}`;
        navigator.clipboard.writeText(url);
        setCopyButtonText('Kopyalandı!');
        setTimeout(() => setCopyButtonText('Kopyala'), 2000);
    };

    const handleCustomDomainSave = async () => {
        if (!user) return;
        const userProfile = await getUserProfile(user.uid);
        if (userProfile?.plan === 'free') {
            setShowUpgradeDialog(true);
        } else {
            // Handle custom domain saving for paid users
            toast.info("Custom domain functionality is coming soon for pro users!");
        }
    }

    if (authLoading) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p>Yükleniyor...</p></main>;
  }

  return (
    <main className="h-screen bg-gray-50 overflow-hidden">
      {authLoading ? (
        <div className="flex items-center justify-center h-full">Yükleniyor...</div>
      ) : (
        <>
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} onConfettiComplete={() => setShowConfetti(false)} recycle={false} numberOfPieces={400} />}
          {isPaymentEnabled() && (
            <AIFounderModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onApplyConfig={(aiConfig) => setConfig(aiConfig)} />
          )}

          {createdProjectId ? (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-4">
              <PartyPopper size={64} className="text-green-500 mb-4 animate-bounce" />
              <h1 className="text-4xl font-bold mb-2 text-gray-800">İlk Adımı Attın!</h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">Harika bir başlangıç. Şimdi fikrini dünyayla paylaşarak geleceği inşa etmeye başla.</p>
              <div className="flex items-center space-x-2 bg-white border rounded-lg p-2 shadow-sm w-full max-w-lg">
                <input type="text" value={`${APP_URL}/${createdProjectSlug}`} readOnly className="flex-grow bg-transparent outline-none text-gray-700 px-2" />
                <Button onClick={handleCopyLink} className="shrink-0">
                  {copyButtonText === 'Kopyala' ? <Copy size={16} className="mr-2" /> : <Check size={16} className="mr-2" />}
                  {copyButtonText}
                </Button>
              </div>
              <Button onClick={() => router.push('/dashboard')} variant="link" className="mt-8 text-gray-600 hover:text-gray-900">
                Dashboard'a Dön
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 min-h-0">
                {/* ===== Left Panel: Editor ===== */}
                <div className="lg:col-span-2 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2"
                       style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 transparent' }}>

                  {/* Project Name and Category */}
                  <Card>
                    <CardHeader>
                      <CardTitle>🚀 Proje Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Proje Adı</Label>
                        <Input id="name" value={config.name} onChange={(e) => updateConfig('name', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="category">Proje Kategorisi</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              <span>{PROJECT_CATEGORIES.find(cat => cat.value === config.category)?.label || 'Kategori Seçin'}</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            {PROJECT_CATEGORIES.map(cat => (
                              <DropdownMenuItem key={cat.value} onSelect={() => updateConfig('category', cat.value)}>
                                {cat.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <p className="text-sm text-gray-500 mt-2">
                          Projenizi doğru kitleye ulaştırmak için bir kategori seçin.
                        </p>
                      </div>
                      {isPaymentEnabled() && (
                         <Button onClick={() => setIsAiModalOpen(true)} variant="outline" className="w-full">
                           ✨ AI Founder Mode ile Otomatik Doldur
                         </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>🖼️ Ana Ekran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Başlık</Label>
                        <Input id="title" value={config.title} onChange={(e) => updateConfig('title', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Alt Başlık</Label>
                        <Input id="subtitle" value={config.subtitle} onChange={(e) => updateConfig('subtitle', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="description">Açıklama</Label>
                        <Input id="description" value={config.description} onChange={(e) => updateConfig('description', e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Call to Action Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>📢 Harekete Geçirici Mesaj</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="buttonText">Buton Metni</Label>
                        <Input id="buttonText" value={config.buttonText} onChange={(e) => updateConfig('buttonText', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="thankYouMessage">Teşekkür Mesajı</Label>
                        <Input id="thankYouMessage" value={config.thankYouMessage} onChange={(e) => updateConfig('thankYouMessage', e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form Fields Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>📋 Form Alanları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="formName" checked={config.formFields.name} onCheckedChange={(checked) => updateConfig('formFields.name', checked)} />
                        <Label htmlFor="formName">İsim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="formEmail" checked={config.formFields.email} onCheckedChange={(checked) => updateConfig('formFields.email', checked)} />
                        <Label htmlFor="formEmail">E-posta</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="formPhone" checked={config.formFields.phone} onCheckedChange={(checked) => updateConfig('formFields.phone', checked)} />
                        <Label htmlFor="formPhone">Telefon</Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Target Audience Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>🎯 Hedef Kitle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="targetAudienceTitle">Başlık</Label>
                        <Input id="targetAudienceTitle" value={config.targetAudience.title} onChange={(e) => updateConfig('targetAudience.title', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="targetAudienceDescription">Açıklama</Label>
                        <Input id="targetAudienceDescription" value={config.targetAudience.description} onChange={(e) => updateConfig('targetAudience.description', e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Benefits Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>🌟 Değer Vaatleri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {config.benefits.map((benefit: Benefit, index: number) => (
                        <div key={index} className="p-4 border rounded-md space-y-2">
                          <Input value={benefit.title} onChange={(e) => updateListItem('benefits', index, 'title', e.target.value)} placeholder="Başlık" />
                          <Input value={benefit.description} onChange={(e) => updateListItem('benefits', index, 'description', e.target.value)} placeholder="Açıklama" />
                          <Button variant="ghost" size="icon" onClick={() => removeListItem('benefits', index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => addListItem('benefits')}>Değer Vaadi Ekle</Button>
                    </CardContent>
                  </Card>

                  {/* Features Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>✨ Özellikler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {config.features.map((feature: Feature, index: number) => (
                        <div key={index} className="p-4 border rounded-md space-y-2">
                          <Input value={feature.title} onChange={(e) => updateListItem('features', index, 'title', e.target.value)} placeholder="Başlık" />
                          <Input value={feature.description} onChange={(e) => updateListItem('features', index, 'description', e.target.value)} placeholder="Açıklama" />
                          <Button variant="ghost" size="icon" onClick={() => removeListItem('features', index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => addListItem('features')}>Özellik Ekle</Button>
                    </CardContent>
                  </Card>

                  {/* FAQ Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>❓ Sıkça Sorulan Sorular</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-medium">Kimler İçin?</h3>
                        {config.faqSections.whoIsItFor.items.map((item: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={item} onChange={(e) => {
                              const newItems = [...config.faqSections.whoIsItFor.items];
                              newItems[index] = e.target.value;
                              updateConfig('faqSections.whoIsItFor.items', newItems);
                            }} />
                            <Button variant="ghost" size="icon" onClick={() => removeFaqItem('whoIsItFor', index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => addFaqItem('whoIsItFor')}>Soru Ekle</Button>
                      </div>
                      <div className="space-y-4 mt-4">
                        <h3 className="font-medium">Neler Yapabilir?</h3>
                        {config.faqSections.whatCanItDo.items.map((item: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={item} onChange={(e) => {
                              const newItems = [...config.faqSections.whatCanItDo.items];
                              newItems[index] = e.target.value;
                              updateConfig('faqSections.whatCanItDo.items', newItems);
                            }} />
                            <Button variant="ghost" size="icon" onClick={() => removeFaqItem('whatCanItDo', index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => addFaqItem('whatCanItDo')}>Soru Ekle</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Project Settings Section */}
                  <Card>
                      <CardHeader>
                        <CardTitle>⚙️ Proje Ayarları</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Public Toggle */}
                        <div className="flex items-center justify-between p-4 bg-lime-50 dark:bg-slate-700 rounded-lg">
                          <div className="flex-1">
                            <Label htmlFor="isPublic" className="font-bold text-gray-800 dark:text-gray-200">
                              {config.isPublic ? 'Herkese Açık Proje' : 'Özel Proje'}
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {config.isPublic 
                                ? 'Projenizi herkese açık yayınlayın.'
                                : 'Sadece link ile erişilebilir.'
                              }
                            </p>
                            {userPlan?.slug === 'free' && !config.isPublic && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                                ⚠️ Özel projeler sadece ücretli planlarda kullanılabilir
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <button
                              onClick={handlePrivacyToggle}
                              className="relative"
                              disabled={!canMakePrivate && config.isPublic}
                            >
                              {config.isPublic ? (
                                <ToggleRight className="h-10 w-10 text-lime-500" />
                              ) : (
                                <ToggleLeft className="h-10 w-10 text-gray-400" />
                              )}
                            </button>
                            {userPlan?.slug === 'free' && (
                              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                Ücretsiz Plan
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Plan restriction warning for free users */}
                        {userPlan?.slug === 'free' && (
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <Users className="h-5 w-5 text-orange-500" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                  Ücretsiz Plan Sınırlaması
                                </h4>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                  Ücretsiz planda tüm projeler herkese açıktır. Özel projeler için planınızı yükseltin.
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-orange-600 border-orange-300 hover:bg-orange-100"
                                  onClick={() => router.push('/pricing')}
                                >
                                  Planları Görüntüle
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                  </Card>

                  {/* Custom Domain Section */}
                  <Card>
                      <CardHeader>
                        <CardTitle>🌐 Özel Domain</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Projenizi özel bir domain ile yayınlamak isterseniz, buraya ekleyebilirsiniz.
                        </p>
                        <Input
                          placeholder="https://www.fikrininadi.com"
                          value={config.customDomain || ''}
                          onChange={(e) => updateConfig('customDomain', e.target.value)}
                          className="w-full"
                        />
                        <Button
                          onClick={handleCustomDomainSave}
                          variant="outline"
                          className="w-full"
                        >
                          Özel Domain Ayarla
                        </Button>
                      </CardContent>
                  </Card>

                  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 sticky bottom-4 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleSaveProject} 
                        className="flex-1 py-6 text-base font-medium" 
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isEditing ? 'Kaydediliyor...' : 'Oluşturuluyor...'}
                          </span>
                        ) : isEditing ? (
                          'Değişiklikleri Kaydet'
                        ) : (
                          'Projeyi Oluştur ve Yayınla'
                        )}
                      </Button>
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowDeleteDialog(true)}
                          disabled={loading}
                          className="py-6 text-base font-medium border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Projeyi Sil
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Değişiklikleriniz otomatik olarak kaydedilir</span>
                    </div>
                  </div>

                  {/* Delete Confirmation Dialog */}
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Projeyi Sil</DialogTitle>
                        <DialogDescription>
                          Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <Button 
                          type="button"
                          variant="destructive"
                          onClick={handleDeleteProject}
                        >
                          Sil
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            İptal
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Upgrade Dialog for Privacy */}
                  <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                      <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                  <Users className="h-5 w-5 text-orange-500" />
                                  Özel Projeler - Premium Özellik
                              </DialogTitle>
                              <DialogDescription className="space-y-3">
                                  <p>
                                      Özel projeler sadece ücretli planlarda kullanılabilir. Özel projeler:
                                  </p>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Showcase galerisinde görünmez</li>
                                      <li>Sadece direkt link ile erişilebilir</li>
                                      <li>Daha iyi gizlilik kontrolü sağlar</li>
                                      <li>Profesyonel kullanım için ideal</li>
                                  </ul>
                                  <p className="font-medium text-orange-600 dark:text-orange-400">
                                      Şu anda ücretsiz planda olduğunuz için tüm projeleriniz herkese açık olarak oluşturulur.
                                  </p>
                              </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button 
                                  onClick={() => {
                                      setShowUpgradeDialog(false);
                                      router.push('/pricing');
                                  }}
                                  className="w-full sm:w-auto"
                              >
                                  Planları Görüntüle
                              </Button>
                              <DialogClose asChild>
                                  <Button variant="outline" className="w-full sm:w-auto">
                                      Ücretsiz Devam Et
                                  </Button>
                              </DialogClose>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
                  </div>
                </div>
                
                {/* ===== Right Panel: Live Preview ===== */}
                <div className="lg:col-span-3 hidden lg:flex flex-col min-h-0">
                  <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
                    <div className="h-full overflow-y-auto pr-2"
                         style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 transparent' }}>
                      <ProjectPreview config={config} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}