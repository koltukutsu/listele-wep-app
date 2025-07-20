"use client";

import { useState } from "react";

interface ProjectPreviewProps {
  config: {
    name: string;
    tagline: string;
    description: string;
    formFields: {
      name: boolean;
      phone: boolean;
      email: boolean;
    };
    buttonText: string;
    buttonColor: string;
    pros: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    targetAudience: {
      title: string;
      description: string;
    };
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export default function ProjectPreview({ config }: ProjectPreviewProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Form submitted!");
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.JSX.Element> = {
      clock: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">⏰</div>,
      bug: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">🐛</div>,
      archive: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">📁</div>,
      automation: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">🤖</div>,
      professional: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">💼</div>,
      report: <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">📊</div>,
    };
    return iconMap[iconName] || <div className="w-8 h-8 bg-gray-300 rounded-full"></div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full border">
      <div className="w-full h-full overflow-y-auto">
        {/* Header with Logo */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">L</span>
            </div>
            <span className="font-bold">Listele.io</span>
          </div>
          <button className="text-sm text-gray-600">Giriş Yap</button>
        </div>

        {/* Main Hero Section */}
        <section className="text-center px-8 py-16 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-black text-2xl font-bold">L</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {config.tagline || "Yapı Denetimde Evrak Hazırlamanın En Hızlı Yolu"}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 text-lg">
            {config.description || "Haket.io ile UYDS'den vereceğiniz evrakların hazırlanması saniyeler içinde otomatik oluştur. Zamanını sahaya ayır, ofiste kaybetme."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            {config.formFields.name && (
              <input
                type="text"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {config.formFields.phone && (
              <input
                type="tel"
                placeholder="+90 555 555 55 55"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {config.formFields.email && (
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: config.buttonColor || '#FACC15', color: '#000' }}
            >
              {config.buttonText || "Erken Erişim Listesine Katıl"}
            </button>
            
            <p className="text-xs text-gray-500">
              Verilerinizi yeni ürün erken erişim duyurularında işin haberleşmek için kullanıyoruz. Spam göndermeyiz.
            </p>
          </form>
        </section>

        {/* Target Audience Section */}
        <section className="px-8 py-16 bg-gray-50 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {config.targetAudience.title || "Evrak İşini Dert Etmeyin"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {config.targetAudience.description || "Yapı denetim firmalarını için hakelik evrakları hazırlamak artık bir çok olmaktan çıkıyor. Haket.io, UYDS veritabanı kullanarak tüm süreci otomatize ediyor, size sadece işinize odaklanmak kalır."}
          </p>
        </section>

        {/* Features Grid */}
        <section className="px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {config.features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {getIconComponent(feature.icon)}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-8 py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Kimler için?</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">• Yapı Denetim Firmaları</h3>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">• Bağlı çalışanlar / Hakediş sorumluları</h3>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">• Proje Müdürleri ve Kontrol Mühendisleri</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 text-center text-gray-500 text-sm border-t">
          <p>Haket.io şu anda derst sayısı kullanıcıyla test ediliyor.</p>
          <p>Erken erişim kazanmak için hemen başvur!</p>
          <p className="mt-4">© 2025 Haket.io</p>
        </footer>
      </div>
    </div>
  );
} 