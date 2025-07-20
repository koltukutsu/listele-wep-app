"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EditablePage from "./editable-page";
import Preview from "./preview";
import { Button } from "~/components/ui/button";

export default function ProjectEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    name: "Haket.io",
    tagline: "Yapı Denetimde Evrak Hazırlamanın En Hızlı Yolu",
    description: "Haket.io ile UYDS’den verileri çek, hakediş evraklarını saniyeler içinde otomatik oluştur. Zamanını sahaya ayır, ofiste kaybetme.",
    features: [
      { title: "Zaman Tasarrufu", description: "1 hakediş evrakı 30-45 dakikada hazırlanırken, bu uygulama 2-3 dakikada tamamlar." },
      { title: "Hata Azaltımı", description: "Manuel veri girişi ve kopyalama hatalarını tamamen ortadan kaldırır." },
      { title: "Dijital Arşiv", description: "Tüm hakediş evraklarınızı dijital olarak güvenli ve düzenli bir şekilde saklayın." }
    ],
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

  const addFeature = () => {
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, { title: "Yeni Özellik", description: "Açıklama yazın" }]
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
      <div className="lg:col-span-1 overflow-y-auto bg-white dark:bg-gray-950">
        <EditablePage 
          config={config}
          updateConfig={updateConfig}
          addFeature={addFeature}
          removeFeature={removeFeature}
        />
        <div className="p-6">
          <Button onClick={handleCreateProject} disabled={loading} className="w-full">
            {loading ? "Oluşturuluyor..." : "Proje Oluştur"}
          </Button>
        </div>
      </div>
      <div className="lg:col-span-1 overflow-y-auto">
        <Preview config={config} />
      </div>
    </main>
  );
} 