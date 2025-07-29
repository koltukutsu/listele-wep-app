"use client";

import { motion } from "framer-motion";

export default function Importance() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-800">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-black dark:text-white"
        >
          Fikrini Test Et, Para Harcamadan Öğren
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-gray-900 dark:text-gray-300 mb-12 sm:mb-16"
        >
          En büyük şirketler bile küçük bir test ile başladı. Mükemmel ürünü beklemek, fırsatı kaçırmaktır. Fikrini bugün test et, pazarın ne istediğini onlardan öğren, rakiplerinden önce doğru yolda ilerle.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Fikrini Doğrula, Varsayma</h3>
            <p className="text-gray-900 dark:text-gray-300">
              Gerçek insanların e-postalarını bırakması, bir Excel tablosundaki tahminlerden daha değerlidir. Pazarın fikrine 'Evet' dediğini gör.
            </p>
          </div>
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">İlk Topluluğunu İnşa Et</h3>
            <p className="text-gray-900 dark:text-gray-300">
              Bunlar sadece e-postalar değil; senin vizyonuna inanan ilk insanlar. Onlarla konuş, öğren ve ürününü onlarla birlikte geliştir.
            </p>
          </div>
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Hikayeni Rakamlarla Anlat</h3>
            <p className="text-gray-900 dark:text-gray-300">
              Yatırımcılar ve ortaklar, vizyondan çok veriye inanır. "Harika bir fikrim var" yerine, "Bu fikri isteyen yüzlerce kişi var" de. Güç sende olsun.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 