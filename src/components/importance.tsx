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
          Hız, Kurucunun Süper Gücüdür
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12 sm:mb-16"
        >
          En büyük şirketler bile küçük bir adımla başladı. Mükemmel ürünü beklemek, fırsatı kaçırmaktır. Fikrini bugün doğrula, pazarın ne istediğini onlardan öğren, rakiplerinden önce harekete geç.
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
            <h3 className="text-2xl font-bold mb-4">Fikrini Doğrula, Varsayma</h3>
            <p className="text-muted-foreground">
              Gerçek insanların e-postalarını bırakması, bir Excel tablosundaki tahminlerden daha değerlidir. Pazarın fikrine 'Evet' dediğini gör.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="p-8 border rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">İlk Topluluğunu İnşa Et</h3>
            <p className="text-muted-foreground">
              Bunlar sadece e-postalar değil; senin vizyonuna inanan ilk insanlar. Onlarla konuş, öğren ve ürününü onlarla birlikte geliştir.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="p-8 border rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold mb-4">Hikayeni Rakamlarla Anlat</h3>
            <p className="text-muted-foreground">
              Yatırımcılar ve ortaklar, vizyondan çok veriye inanır. "Harika bir fikrim var" yerine, "Bu fikri isteyen yüzlerce kişi var" de. Güç sende olsun.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 