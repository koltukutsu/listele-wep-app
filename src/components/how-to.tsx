"use client";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HowTo() {
  return (
    <section id="nasil-calisir" className="py-20 sm:py-28 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-black dark:text-white"
        >
          Fikrinden Bekleyenlere: 3 Adımda Lansman Hazırlığı
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-gray-900 dark:text-gray-300 mb-12 sm:mb-16"
        >
          Üç basit adımla bekleme listeni kur, gerçek talebi gör ve ürünü güvenle inşa et.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-slate-700 -translate-y-1/2" />
          
          <div className="relative p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#D8FF00] text-black rounded-full font-bold text-2xl mr-4">
                1
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">Vizyonunu Tanımla</h3>
            </div>
            <p className="text-gray-900 dark:text-gray-300">
              Her büyük hikaye bir isimle başlar. Girişimine kimliğini kazandır, misyonunu tek cümlede anlat.
            </p>
          </div>
          <div className="relative p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#D8FF00] text-black rounded-full font-bold text-2xl mr-4">
                2
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">Bekleme Sayfanı Kur</h3>
            </div>
            <p className="text-gray-900 dark:text-gray-300">
              Founder Mode AI ile fikrini anlat, bekleme sayfan dakikalar içinde oluşsun ya da sürükle-bırak kolaylığıyla kendin tasarla.
            </p>
          </div>
          <div className="relative p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#D8FF00] text-black rounded-full font-bold text-2xl mr-4">
                3
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">Listeyi Büyüt ve İnşa Et</h3>
            </div>
            <p className="text-gray-900 dark:text-gray-300">
              İlk destekçilerini toplamaya başla. Artan sayı seni motive etsin; lansman gününde seni bekleyen bir kitle olsun.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <Link href="/onboarding">
            <Button size="lg" className="bg-[#D8FF00] hover:bg-[#B8E000] text-black font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
              🚀 Kendi Listeni Başlat
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 