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
import { OnboardingChecklist } from "~/components/onboarding-checklist";
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
import { APP_URL } from "~/lib/config";
import { getPlanBySlug } from "~/lib/plans";
import { getUserProfile } from "~/lib/firestore";

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
    const [showChecklist, setShowChecklist] = useState(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

    const isEditing = projectId !== 'new';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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
                } else {
                    // This is a new project, show the checklist.
                    setShowChecklist(true);
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
        return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    };

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
                await updateProject(projectId, { config });
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
    <main>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} onConfettiComplete={() => setShowConfetti(false)} recycle={false} numberOfPieces={400} />}
      <AIFounderModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onApplyConfig={(aiConfig) => setConfig(aiConfig)} />

      {createdProjectId ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
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
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* ===== Left Panel: Editor ===== */}
            <div className="lg:col-span-2 sticky top-6">
              <div className="h-[88vh] overflow-y-auto space-y-6 pr-4">
                
                {showChecklist && <OnboardingChecklist config={config} setConfig={setConfig} />}

                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Proje Adı</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      id="projectName"
                      value={config.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateConfig('name', e.target.value)}
                      placeholder="Harika projenizin adı"
                    />
                    <Button onClick={() => setIsAiModalOpen(true)} variant="outline" className="w-full">
                      ✨ AI Founder Mode ile Otomatik Doldur
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Domain Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌐 Özel Alan Adı</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Projenize profesyonel bir dokunuş katmak için kendi alan adınızı bağlayın. (Pro Özellik)
                    </p>
                    <Input
                      id="customDomain"
                      placeholder="ornek.com"
                    />
                    <Button onClick={handleCustomDomainSave} className="w-full">
                      Alanı Kaydet
                    </Button>
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
                <div>
                  <Label htmlFor="buttonText">Buton Metni</Label>
                  <Input id="buttonText" value={config.buttonText} onChange={(e) => updateConfig('buttonText', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="thankYouMessage">Teşekkür Mesajı</Label>
                  <Input id="thankYouMessage" value={config.thankYouMessage} onChange={(e) => updateConfig('thankYouMessage', e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="formFields-name"
                    checked={config.formFields.name}
                    onCheckedChange={(checked) => updateConfig('formFields.name', checked)}
                  />
                  <Label htmlFor="formFields-name">İsim Alanı</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="formFields-email"
                    checked={config.formFields.email}
                    onCheckedChange={(checked) => updateConfig('formFields.email', checked)}
                  />
                  <Label htmlFor="formFields-email">E-posta Alanı</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="formFields-phone"
                    checked={config.formFields.phone}
                    onCheckedChange={(checked) => updateConfig('formFields.phone', checked)}
                  />
                  <Label htmlFor="formFields-phone">Telefon Alanı</Label>
                </div>
                <h3 className="text-md font-bold pt-4">Renkler</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border rounded-lg px-3 py-1.5">
                      <Label htmlFor="backgroundColor" className="text-sm font-medium">Arkaplan</Label>
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                        className="w-28 h-7 p-0.5 border-none rounded-md cursor-pointer"
                      />
                    </div>
                     <div className="flex items-center justify-between border rounded-lg px-3 py-1.5">
                      <Label htmlFor="textColor" className="text-sm font-medium">Metin</Label>
                      <Input
                        id="textColor"
                        type="color"
                        value={config.textColor}
                        onChange={(e) => updateConfig('textColor', e.target.value)}
                        className="w-28 h-7 p-0.5 border-none rounded-md cursor-pointer"
                      />
                    </div>
                     <div className="flex items-center justify-between border rounded-lg px-3 py-1.5">
                      <Label htmlFor="accentColor" className="text-sm font-medium">Vurgu</Label>
                      <Input
                        id="accentColor"
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                        className="w-28 h-7 p-0.5 border-none rounded-md cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>🌟 Değer Vaatleri</CardTitle>
                  <Button 
                    onClick={() => addListItem('benefits')} 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Yeni Ekle
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {config.benefits.map((benefit: Benefit, index: number) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">Değer {index + 1}</h3>
                        <Button 
                          onClick={() => removeListItem('benefits', index)} 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50"
                        >
                          Sil
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`benefit-title-${index}`} className="text-sm text-gray-600">Başlık</Label>
                          <Input 
                            id={`benefit-title-${index}`}
                            value={benefit.title} 
                            onChange={(e) => updateListItem('benefits', index, 'title', e.target.value)} 
                            placeholder="Örn: Hızlı Teslimat"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`benefit-desc-${index}`} className="text-sm text-gray-600">Açıklama</Label>
                          <Input 
                            id={`benefit-desc-${index}`}
                            value={benefit.description} 
                            onChange={(e) => updateListItem('benefits', index, 'description', e.target.value)} 
                            placeholder="Bu değer müşterinize ne sağlıyor?"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {config.benefits.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">Henüz değer vaadi eklenmemiş</p>
                      <Button 
                        onClick={() => addListItem('benefits')} 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        İlk Değeri Ekle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>🛠️ Ana Özellikler</CardTitle>
                  <Button 
                    onClick={() => addListItem('features')} 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Yeni Ekle
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {config.features.map((feature: Feature, index: number) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">Özellik {index + 1}</h3>
                        <Button 
                          onClick={() => removeListItem('features', index)} 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50"
                        >
                          Sil
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`feature-title-${index}`} className="text-sm text-gray-600">Başlık</Label>
                          <Input 
                            id={`feature-title-${index}`}
                            value={feature.title} 
                            onChange={(e) => updateListItem('features', index, 'title', e.target.value)} 
                            placeholder="Örn: Kolay Kullanım"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-desc-${index}`} className="text-sm text-gray-600">Açıklama</Label>
                          <Input 
                            id={`feature-desc-${index}`}
                            value={feature.description} 
                            onChange={(e) => updateListItem('features', index, 'description', e.target.value)} 
                            placeholder="Bu özellik ne işe yarıyor?"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {config.features.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">Henüz özellik eklenmemiş</p>
                      <Button 
                        onClick={() => addListItem('features')} 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        İlk Özelliği Ekle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>❓ Sıkça Sorulan Sorular</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-gray-200 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Label htmlFor="whoIsItForTitle" className="font-medium text-gray-800">Kimler İçin?</Label>
                        <p className="text-sm text-gray-500">Hedef kitlenizi tanımlayın</p>
                      </div>
                      <Button 
                        onClick={() => addFaqItem('whoIsItFor')} 
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Yeni Ekle
                      </Button>
                    </div>
                    <Input 
                      id="whoIsItForTitle" 
                      value={config.faqSections.whoIsItFor.title} 
                      onChange={(e) => updateConfig('faqSections.whoIsItFor.title', e.target.value)}
                      placeholder="Örn: Girişimciler için"
                      className="mt-2"
                    />
                    <div className="space-y-2">
                      {config.faqSections.whoIsItFor.items.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <div className="flex-1">
                            <Input 
                              value={item} 
                              onChange={(e) => updateConfig(`faqSections.whoIsItFor.items.${index}`, e.target.value)} 
                              placeholder="Hedef kitle öğesi ekleyin"
                              className="bg-gray-50"
                            />
                          </div>
                          <Button 
                            onClick={() => removeFaqItem('whoIsItFor', index)} 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {config.faqSections.whoIsItFor.items.length === 0 && (
                        <div className="text-center py-4 bg-gray-50 rounded-md text-sm text-gray-500">
                          Henüz hedef kitle eklenmemiş
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-200 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Label htmlFor="whatCanItDoTitle" className="font-medium text-gray-800">Neler Yapabilir?</Label>
                        <p className="text-sm text-gray-500">Ürün/hizmetinizin yeteneklerini listeleyin</p>
                      </div>
                      <Button 
                        onClick={() => addFaqItem('whatCanItDo')} 
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Yeni Ekle
                      </Button>
                    </div>
                    <Input 
                      id="whatCanItDoTitle" 
                      value={config.faqSections.whatCanItDo.title} 
                      onChange={(e) => updateConfig('faqSections.whatCanItDo.title', e.target.value)}
                      placeholder="Örn: İşinizi nasıl kolaylaştırır?"
                      className="mt-2"
                    />
                    <div className="space-y-2">
                      {config.faqSections.whatCanItDo.items.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <div className="flex-1">
                            <Input 
                              value={item} 
                              onChange={(e) => updateConfig(`faqSections.whatCanItDo.items.${index}`, e.target.value)} 
                              placeholder="Özellik veya yetenek ekleyin"
                              className="bg-gray-50"
                            />
                          </div>
                          <Button 
                            onClick={() => removeFaqItem('whatCanItDo', index)} 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {config.faqSections.whatCanItDo.items.length === 0 && (
                        <div className="text-center py-4 bg-gray-50 rounded-md text-sm text-gray-500">
                          Henüz özellik eklenmemiş
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* Upgrade Dialog */}
                <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Pro'ya Yükselt</DialogTitle>
                        <DialogDescription>
                            Özel alan adları bir Pro özelliğidir. Kendi alan adınızı bağlamak ve daha fazla özelliğin kilidini açmak için planınızı yükseltin.
                        </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => router.push('/pricing')}>Yükselt</Button>
                            <DialogClose asChild>
                                <Button variant="outline">İptal</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* ===== Right Panel: Live Preview ===== */}
            <div className="lg:col-span-3 hidden lg:block sticky top-6">
              <div className="w-full h-[88vh] border rounded-lg overflow-hidden shadow-lg">
                <ProjectPreview config={config} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}