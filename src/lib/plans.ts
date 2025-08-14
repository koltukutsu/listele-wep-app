export const tiers = [
    {
      name: "Free",
      slug: "free",
      price: "$0",
      priceMonthly: 0,
      features: [
        "2 Projects",
        "75 Form Submissions/Project",
        "Launch List branding",
        "Public Projects Only",
      ],
      lacks: ["Voice Project Creation", "Private Projects"],
    },
    {
      name: "Basic",
      slug: "basic",
      price: "$10",
      priceMonthly: 10,
      features: [
        "5 Projects",
        "200 Form Submissions/Project",
        "Publish without branding",
        "2 Voice Project Creations/month",
        "Private Projects",
      ],
      lacks: [],
    },
    {
      name: "Pro",
      slug: "pro",
      price: "$49",
      priceMonthly: 49,
      features: [
        "25 Projects",
        "2,000 Form Submissions/Project",
        "Publish without branding",
        "20 Voice Project Creations/month",
        "Private Projects",
      ],
      lacks: [],
    },
    {
      name: "Unlimited",
      slug: "unlimited",
      price: "$99",
      priceMonthly: 99,
      features: [
          "Unlimited Projects",
          "Unlimited Form Submissions",
          "Publish without branding",
          "100 Voice Project Creations/month",
          "Private Projects",
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