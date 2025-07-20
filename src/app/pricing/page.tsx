"use client";

import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Kurucu",
    price: "₺0",
    description: "Fikrini hayata geçirmek için ilk adımı at. Maliyetsiz, risksiz.",
    features: [
      "1 Proje",
      "Yapay Zeka ile Proje Oluşturma (1 kredi)",
      "500 Katılımcı Limiti",
      "listele.io Alan Adı",
      "Topluluk Desteği",
    ],
    cta: "Yolculuğa Başla",
    isFeatured: false,
  },
  {
    name: "Girişimci",
    price: "₺199",
    pricePeriod: "/ay",
    description: "Büyümeye hazır olanlar için. Limitleri kaldır, potansiyelini ortaya çıkar.",
    features: [
      "5 Proje",
      "Yapay Zeka ile Proje Oluşturma (10 kredi/ay)",
      "Sınırsız Katılımcı",
      "Özel Alan Adı Bağlama",
      "Detaylı Analizler",
      "Öncelikli Destek",
    ],
    cta: "Büyümeye Geç",
    isFeatured: true,
  },
  {
    name: "Scale-Up",
    price: "Özel",
    description: "Zirveyi hedefleyenler için. İhtiyaçlarınıza özel çözümler.",
    features: [
      "Sınırsız Proje",
      "Sınırsız AI Kredisi",
      "API Erişimi",
      "Özel Entegrasyonlar",
      "Kişisel Destek Yöneticisi",
    ],
    cta: "Teklif Al",
    isFeatured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Girişimine Uygun Yakıtı Seç
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground"
        >
          Her büyük yolculuk doğru kaynaklarla başlar. Fikrini ister test et, ister pazar lideri yap. Sana uygun bir planımız var.
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`p-8 border rounded-2xl flex flex-col ${plan.isFeatured ? 'bg-gray-800 text-white border-primary scale-105' : 'bg-white dark:bg-gray-800/50'}`}
            >
              <h2 className={`text-2xl font-bold ${plan.isFeatured ? 'text-primary' : ''}`}>{plan.name}</h2>
              <p className={`mt-4 text-4xl font-bold`}>
                {plan.price} <span className="text-lg font-normal text-muted-foreground">{plan.pricePeriod}</span>
              </p>
              <p className="mt-4 h-12 text-muted-foreground">{plan.description}</p>
              <ul className="mt-8 space-y-4 text-left flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <CheckCircle2 className={`h-6 w-6 mr-2 ${plan.isFeatured ? 'text-primary' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="w-full mt-8">
                <Button size="lg" className={`w-full ${plan.isFeatured ? 'bg-primary text-primary-foreground' : 'bg-gray-800 text-white'}`}>
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
