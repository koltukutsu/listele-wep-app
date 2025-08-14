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
  "name": "Launch List",
  "url": "https://launchlist.io",
  "logo": "https://launchlist.io/Logo.png",
  "sameAs": [
    "https://twitter.com/launchlist"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Launch List",
  "url": "https://launchlist.io",
  "description": "Bring your ideas to life quickly. Create projects, collect customers, and grow with our AI-powered platform.",
  "inLanguage": "en",
  "author": {
    "@type": "Organization",
    "name": "Launch List"
  }
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Launch List",
  "description": "Create projects, collect customers, and grow with our AI-powered platform. The fastest landing page creator.",
  "url": "https://launchlist.io",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan available, paid plans start from $10"
  },
  "author": {
    "@type": "Organization", 
    "name": "Launch List"
  },
  "inLanguage": "en",
  "availableLanguage": "English",
  "featureList": [
    "Landing page creation",
    "AI-powered content creation", 
    "Lead collection",
    "Project validation",
    "Voice project creation"
  ]
}; 

export const pricingPageSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Launch List Landing Page Builder",
  "description": "AI-powered landing page creation platform",
  "brand": {
    "@type": "Brand",
    "name": "Launch List"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "description": "2 Projects, 75 Form Submissions/Project",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Basic",
      "price": "10",
      "priceCurrency": "USD",
      "description": "5 Projects, 200 Form Submissions/Project",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "49",
      "priceCurrency": "USD",
      "description": "25 Projects, 2,000 Form Submissions/Project",
      "availability": "InStock"
    },
    {
      "@type": "Offer",
      "name": "Unlimited",
      "price": "99",
      "priceCurrency": "USD",
      "description": "Unlimited Projects, Unlimited Form Submissions",
      "availability": "InStock"
    }
  ]
}; 