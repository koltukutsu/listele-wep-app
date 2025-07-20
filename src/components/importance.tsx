"use client";

import { motion } from "framer-motion";

export default function Importance() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Neden Bekleme Listesi Oluşturmalısın?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12 sm:mb-16"
        >
          Bir fikrin peşinden aylarca koşup, sonunda kimsenin istemediği bir ürün
          geliştirmek her girişimcinin en büyük kabusudur. Bekleme listesi, bu
          riski ortadan kaldırmanın en hızlı ve en ucuz yoludur.
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="p-8 border rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">Pazar Talebini Ölç</h3>
            <p className="text-muted-foreground">
              Gerçek kullanıcıların e-posta adreslerini bırakması, fikrinin
              sandalyeden daha fazlası olduğunun en net kanıtıdır.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="p-8 border rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">Erken Geri Bildirim Topla</h3>
            <p className="text-muted-foreground">
              İlk kullanıcılarınla doğrudan iletişim kurarak ürününü onların
              ihtiyaçlarına göre şekillendir.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="p-8 border rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">Yatırımcıya Kanıt Sun</h3>
            <p className="text-muted-foreground">
              "Bir fikrim var" demek yerine, "Elimde X kişilik bir bekleme
              listesi var" de. Aradaki fark, gece ile gündüz gibidir.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 