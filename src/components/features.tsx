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
      title: "No-Code Editör",
      description:
        "Türkçe arayüz ve basit form alanları ile sayfanı anında kişiselleştir. Teknik bilgiye ihtiyacın yok.",
    },
    {
      icon: <Zap size={32} className="text-gray-800"/>,
      title: "Tek Tıkla Yayınla",
      description:
        "Projeni oluşturduğun an `senin-fikrin.listele.io` adresin hazır. Karmaşık hosting süreçlerini unut.",
    },
    {
      icon: <Gauge size={32} className="text-gray-800"/>,
      title: "Yönetim Paneli",
      description:
        "Kaç kişi kaydoldu? Hangi kanaldan daha çok ilgi geldi? Basit ve anlaşılır panelden takip et.",
    },
    {
      icon: <Database size={32} className="text-gray-800"/>,
      title: "Güvenli Veritabanı",
      description:
        "Tüm verilerin Supabase üzerinde güvenle saklanır. E-posta listeni dilediğin zaman dışa aktarabilirsin.",
    },
    {
      icon: <Globe size={32} className="text-gray-800"/>,
      title: "Özelleştirilebilir Alan Adı",
      description:
        "İlerleyen zamanlarda kendi alan adını bağlayarak markanı daha da güçlendirebilirsin. (Çok yakında)",
    },
    {
      icon: <Wallet size={32} className="text-gray-800"/>,
      title: "Tamamen Ücretsiz",
      description:
        "Fikrini test etmenin bir maliyeti olmamalı. İlk 1000 kullanıcıya kadar tüm özellikler ücretsiz.",
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
          <h2 className="text-3xl sm:text-4xl font-bold">Öne Çıkan Özellikler</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Listele.io, sadece bir bekleme listesi aracı değil, aynı zamanda
            girişimcilik yolculuğundaki ilk adımlarını kolaylaştıran bir
            yardımcıdır.
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