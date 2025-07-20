"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import ProjectPreview from "~/components/project-preview";

export default function ProjectEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Project configuration state
  const [config, setConfig] = useState({
    name: "",
    tagline: "Yapı Denetimde Evrak Hazırlamanın En Hızlı Yolu",
    description: "Haket.io ile UYDS'den vereceğiniz evrakların hazırlanması saniyeler içinde otomatik oluştur. Zamanını sahaya ayır, ofiste kaybetme.",
    formFields: {
      name: true,
      phone: true,
      email: true,
    },
    buttonText: "Erken Erişim Listesine Katıl",
    buttonColor: "#FACC15",
    pros: [
      { title: "Zaman Tasarrufu", description: "1 hakediş evrakı 30-45 dakikada hazırlanırken, bu uygulama 2-3 dakikada tamamlar.", icon: "clock" },
      { title: "Hata Azaltımı", description: "Manuel veri girişi ve kopyalama hatalarını tamamen ortadan kaldırır.", icon: "bug" },
      { title: "Dijital Arşiv", description: "Tüm hakediş evraklarınızı dijital olarak güvenli ve düzenli bir şekilde saklayın.", icon: "archive" }
    ],
    targetAudience: {
      title: "Evrak İşini Dert Etmeyin",
      description: "Yapı denetim firmalarını için hakelik evrakları hazırlamak artık bir çok olmaktan çıkıyor. Haket.io, UYDS veritabanı kullanarak tüm süreci otomatize ediyor, size sadece işinize odaklanmak kalır."
    },
    features: [
      { title: "Otomasyon", description: "Her ay tekrar eden angarya işi yükünü otomatikleştirerek size ve ekibinize zaman kazandırır.", icon: "automation" },
      { title: "Profesyonel Görünüm", description: "Evraklarınız standart ve şık bir formatta oluşturularak kurum imajınızı güçlendirir.", icon: "professional" },
      { title: "Kolay Raporlama", description: "Tüm projelerinizin hakediş süreçlerini tek bir panelden takip edin ve raporlayın.", icon: "report" }
    ]
  });

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newConfig;
    });
  };

  const addPro = () => {
    setConfig(prev => ({
      ...prev,
      pros: [...prev.pros, { title: "Yeni Avantaj", description: "Açıklama yazın", icon: "clock" }]
    }));
  };

  const removePro = (index: number) => {
    setConfig(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, { title: "Yeni Özellik", description: "Açıklama yazın", icon: "automation" }]
    }));
  };

  const removeFeature = (index: number) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCreateProject = async () => {
    if (!config.name || !config.tagline) {
      toast.error("Lütfen proje adı ve başlık alanlarını doldurun");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const fakeProjectId = Math.random().toString(36).substring(7);
      toast.success("Proje başarıyla oluşturuldu!");
      setLoading(false);
      router.push(`/dashboard/editor/${fakeProjectId}`);
    }, 1000);
  };

  return (
    <main className="grid lg:grid-cols-2 h-[calc(100vh-80px)]">
      {/* Editor Panel */}
      <div className="lg:col-span-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-center">Yeni Proje Oluştur</h1>
          
          {/* Basic Project Info */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
            <div>
              <Label htmlFor="name">Proje Adı</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => updateConfig('name', e.target.value)}
                placeholder="Örn: Harika Fikrim"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Ana Başlık</Label>
              <Input
                id="tagline"
                value={config.tagline}
                onChange={(e) => updateConfig('tagline', e.target.value)}
                placeholder="Ana başlık"
              />
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <textarea
                id="description"
                value={config.description}
                onChange={(e) => updateConfig('description', e.target.value)}
                placeholder="Proje açıklaması"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Form Fields Configuration */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold">Form Alanları</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.formFields.name}
                  onChange={(e) => updateConfig('formFields.name', e.target.checked)}
                />
                <span>Ad Soyad</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.formFields.phone}
                  onChange={(e) => updateConfig('formFields.phone', e.target.checked)}
                />
                <span>Telefon</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.formFields.email}
                  onChange={(e) => updateConfig('formFields.email', e.target.checked)}
                />
                <span>E-posta</span>
              </label>
            </div>
            <div>
              <Label htmlFor="buttonText">Buton Metni</Label>
              <Input
                id="buttonText"
                value={config.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonColor">Buton Rengi</Label>
              <input
                type="color"
                id="buttonColor"
                value={config.buttonColor}
                onChange={(e) => updateConfig('buttonColor', e.target.value)}
                className="w-full h-10 rounded border"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold">Hedef Kitle</h2>
            <div>
              <Label htmlFor="audienceTitle">Başlık</Label>
              <Input
                id="audienceTitle"
                value={config.targetAudience.title}
                onChange={(e) => updateConfig('targetAudience.title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="audienceDesc">Açıklama</Label>
              <textarea
                id="audienceDesc"
                value={config.targetAudience.description}
                onChange={(e) => updateConfig('targetAudience.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Pros Section */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Avantajlar</h2>
              <Button onClick={addPro} size="sm">Ekle</Button>
            </div>
            {config.pros.map((pro, index) => (
              <div key={index} className="border p-4 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Avantaj {index + 1}</span>
                  <Button onClick={() => removePro(index)} variant="outline" size="sm">Sil</Button>
                </div>
                <Input
                  value={pro.title}
                  onChange={(e) => updateConfig(`pros.${index}.title`, e.target.value)}
                  placeholder="Avantaj başlığı"
                />
                <textarea
                  value={pro.description}
                  onChange={(e) => updateConfig(`pros.${index}.description`, e.target.value)}
                  placeholder="Avantaj açıklaması"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <select
                  value={pro.icon}
                  onChange={(e) => updateConfig(`pros.${index}.icon`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="clock">⏰ Saat</option>
                  <option value="bug">🐛 Hata</option>
                  <option value="archive">📁 Arşiv</option>
                  <option value="automation">🤖 Otomasyon</option>
                  <option value="professional">💼 Profesyonel</option>
                  <option value="report">📊 Rapor</option>
                </select>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Özellikler</h2>
              <Button onClick={addFeature} size="sm">Ekle</Button>
            </div>
            {config.features.map((feature, index) => (
              <div key={index} className="border p-4 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Özellik {index + 1}</span>
                  <Button onClick={() => removeFeature(index)} variant="outline" size="sm">Sil</Button>
                </div>
                <Input
                  value={feature.title}
                  onChange={(e) => updateConfig(`features.${index}.title`, e.target.value)}
                  placeholder="Özellik başlığı"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) => updateConfig(`features.${index}.description`, e.target.value)}
                  placeholder="Özellik açıklaması"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <select
                  value={feature.icon}
                  onChange={(e) => updateConfig(`features.${index}.icon`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="automation">🤖 Otomasyon</option>
                  <option value="professional">💼 Profesyonel</option>
                  <option value="report">📊 Rapor</option>
                  <option value="clock">⏰ Saat</option>
                  <option value="bug">🐛 Hata</option>
                  <option value="archive">📁 Arşiv</option>
                </select>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleCreateProject} 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Oluşturuluyor..." : "Projeyi Oluştur"}
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-1 p-6 hidden lg:block">
        <ProjectPreview config={config} />
      </div>
    </main>
  );
} 