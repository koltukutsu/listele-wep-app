export const tiers = [
    {
      name: "Ücretsiz",
      slug: "free",
      price: "0 TL",
      priceMonthly: 0,
      features: [
        "2 Proje",
        "75 Form Doldurma/Proje",
        "listele.io Markası",
        "Sadece Herkese Açık Projeler",
      ],
      lacks: ["Sesle Proje Oluşturma", "Özel Projeler"],
    },
    {
      name: "Temel",
      slug: "basic",
      price: "10 TL",
      priceMonthly: 10,
      features: [
        "5 Proje",
        "200 Form Doldurma/Proje",
        "Marka olmadan yayınla",
        "2 Sesle Proje Oluşturma/ay",
        "Özel Projeler",
      ],
      lacks: [],
    },
    {
      name: "Pro",
      slug: "pro",
      price: "49 TL",
      priceMonthly: 49,
      features: [
        "25 Proje",
        "2,000 Form Doldurma/Proje",
        "Marka olmadan yayınla",
        "20 Sesle Proje Oluşturma/ay",
        "Özel Projeler",
      ],
      lacks: [],
    },
    {
      name: "Sınırsız",
      slug: "unlimited",
      price: "99 TL",
      priceMonthly: 99,
      features: [
          "Sınırsız Proje",
          "Sınırsız Form Doldurma",
          "Marka olmadan yayınla",
          "100 Sesle Proje Oluşturma/ay",
          "Özel Projeler",
      ],
      lacks: [],
    }
  ];
  
  export const freePlan = tiers[0];
  export const basicPlan = tiers[1];
  export const proPlan = tiers[2];
  export const unlimitedPlan = tiers[3];
  
  export const getPlanBySlug = (slug: string) => {
    return tiers.find(tier => tier.slug === slug);
  } 