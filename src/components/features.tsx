"use client";

import {
    Code,
    Zap,
    Gauge,
    Database,
    Globe,
    Wallet,
  } from "lucide-react";
  import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Features() {
  const features = [
    {
      icon: <Code size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Founder Mode AI & Kodsuz Editör",
      description:
        "İster fikrini sesli anlat, yapay zeka senin için tasarlasın, ister sürükle-bırak kolaylığıyla kendi vizyonunu yarat. Teknik bilgi, geçmişte kaldı.",
    },
    {
      icon: <Zap size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Anında Lansman",
      description:
        "Fikrin hazır olduğunda, dünya da hazır olmalı. Tek tıkla projen yayında ve ilk ziyaretçilerini karşılamaya hazır. Beklemek yok, sadece aksiyon.",
    },
    {
      icon: <Gauge size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Büyüme Panelin",
      description:
        "Sadece rakamları değil, büyümeyi gör. İlk destekçilerinin nereden geldiğini anla, stratejini verilerle şekillendir ve bir sonraki adımını güvenle at.",
    },
    {
      icon: <Database size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "İlk Destekçilerin Güvende",
      description:
        "Topluluğun en değerli varlığın. Tüm veriler güvenle saklanır ve kontrol tamamen sendedir. Listeni dilediğin zaman al, kendi yolunda ilerle.",
    },
    {
      icon: <Globe size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Markanı İnşa Et",
      description:
        "Girişimin büyüdükçe, markan da büyür. Kendi alan adını kolayca bağlayarak kurumsal kimliğini bir üst seviyeye taşı.",
    },
    {
      icon: <Wallet size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Maliyetsiz Başlangıç",
      description:
        "Büyük fikirlerin önündeki en büyük engelin bütçe olmaması gerektiğine inanıyoruz. İlk adımlarını atarken cüzdanını düşünme. Sadece fikrine odaklan.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">Kurucunun Cephaneliği</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-900 dark:text-gray-300 mt-4">
            Fikrini hayata geçirmek için ihtiyacın olan her şey burada. Hız, veri ve topluluk... Hepsi senin kontrolünde.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300"
            >
              <div className="p-4 inline-block bg-gray-100 dark:bg-slate-800 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{feature.title}</h3>
              <p className="text-gray-900 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 