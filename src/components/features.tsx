"use client";

import {
  Zap,
  Code,
  Gauge,
  Database,
  Globe,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: <Code size={32} className="text-gray-800"/>,
      title: "Founder Mode AI & Kodsuz Editör",
      description:
        "İster fikrini sesli anlat, yapay zeka senin için tasarlasın, ister sürükle-bırak kolaylığıyla kendi vizyonunu yarat. Teknik bilgi, geçmişte kaldı.",
    },
    {
      icon: <Zap size={32} className="text-gray-800"/>,
      title: "Anında Lansman",
      description:
        "Fikrin hazır olduğunda, dünya da hazır olmalı. Tek tıkla projen yayında ve ilk ziyaretçilerini karşılamaya hazır. Beklemek yok, sadece aksiyon.",
    },
    {
      icon: <Gauge size={32} className="text-gray-800"/>,
      title: "Büyüme Panelin",
      description:
        "Sadece rakamları değil, büyümeyi gör. İlk destekçilerinin nereden geldiğini anla, stratejini verilerle şekillendir ve bir sonraki adımını güvenle at.",
    },
    {
      icon: <Database size={32} className="text-gray-800"/>,
      title: "İlk Destekçilerin Güvende",
      description:
        "Topluluğun en değerli varlığın. Tüm veriler güvenle saklanır ve kontrol tamamen sendedir. Listeni dilediğin zaman al, kendi yolunda ilerle.",
    },
    {
      icon: <Globe size={32} className="text-gray-800"/>,
      title: "Markanı İnşa Et",
      description:
        "Girişimin büyüdükçe, markan da büyür. Kendi alan adını kolayca bağlayarak kurumsal kimliğini bir üst seviyeye taşı.",
    },
    {
      icon: <Wallet size={32} className="text-gray-800"/>,
      title: "Maliyetsiz Başlangıç",
      description:
        "Büyük fikirlerin önündeki en büyük engelin bütçe olmaması gerektiğine inanıyoruz. İlk adımlarını atarken cüzdanını düşünme. Sadece fikrine odaklan.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Kurucunun Cephaneliği</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Fikrini hayata geçirmek için ihtiyacın olan her şey burada. Hız, veri ve topluluk... Hepsi senin kontrolünde.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 border rounded-lg bg-white dark:bg-gray-800/50"
            >
              <div className="p-4 inline-block bg-primary/10 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 