"use client";

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Pre-defined structured data schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Listele.io",
  "url": "https://listele.io",
  "logo": "https://listele.io/Logo.png",
  "sameAs": [
    "https://twitter.com/listeleio"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Turkish"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Listele.io",
  "url": "https://listele.io",
  "description": "Fikirlerini hızla hayata geçir. AI destekli platform ile projelerini oluştur, müşteri topla ve büyü.",
  "inLanguage": "tr",
  "author": {
    "@type": "Organization",
    "name": "Listele.io"
  }
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Listele.io",
  "description": "AI destekli platform ile projelerini oluştur, müşteri topla ve büyü. Türkiye'nin en hızlı landing page oluşturucusu.",
  "url": "https://listele.io",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "TRY",
    "description": "Ücretsiz plan mevcut, ücretli planlar 10 TL'den başlar"
  },
  "author": {
    "@type": "Organization", 
    "name": "Listele.io"
  },
  "inLanguage": "tr",
  "availableLanguage": "Turkish",
  "featureList": [
    "Landing page oluşturma",
    "AI destekli içerik oluşturma", 
    "Lead toplama",
    "Proje validasyonu",
    "Sesli proje oluşturma"
  ]
}; 

export const pricingPageSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Listele.io Landing Page Builder",
  "description": "AI destekli landing page oluşturma platformu",
  "brand": {
    "@type": "Brand",
    "name": "Listele.io"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Ücretsiz",
      "price": "0",
      "priceCurrency": "TRY",
      "description": "2 Proje, 75 Form Doldurma/Proje",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Temel",
      "price": "10",
      "priceCurrency": "TRY",
      "description": "5 Proje, 200 Form Doldurma/Proje",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "49",
      "priceCurrency": "TRY",
      "description": "25 Proje, 2,000 Form Doldurma/Proje",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Sınırsız",
      "price": "99",
      "priceCurrency": "TRY",
      "description": "Sınırsız Proje, Sınırsız Form Doldurma",
      "availability": "InStock"
    }
  ]
}; 