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
          className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          Fikirden Lansmana: 3 Adımda Yol Haritan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-12 sm:mb-16"
        >
          Karmaşık süreçleri unut. Senin görevin hayal etmek, bizimki ise onu gerçeğe dönüştürmek. İşte bu kadar basit.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-lime-200 dark:bg-slate-700 -translate-y-1/2" />
          
          <div className="relative p-8 border border-lime-200 dark:border-slate-700 rounded-lg bg-lime-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-lime-300 dark:hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-lime-400 to-green-500 text-black rounded-full font-bold text-2xl mr-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vizyonunu Tanımla</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Her büyük hikaye bir isimle başlar. Girişimine kimliğini kazandır, misyonunu tek cümlede anlat.
            </p>
          </div>
          <div className="relative p-8 border border-lime-200 dark:border-slate-700 rounded-lg bg-lime-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-lime-300 dark:hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-lime-400 to-green-500 text-black rounded-full font-bold text-2xl mr-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">İlk Vitrinini Oluştur</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Founder Mode AI ile fikrini anlat veya dakikalar içinde kendin tasarla. Potansiyel kullanıcılarınla ilk temas noktan hazır.
            </p>
          </div>
          <div className="relative p-8 border border-lime-200 dark:border-slate-700 rounded-lg bg-lime-50 dark:bg-slate-800 z-10 hover:shadow-lg hover:border-lime-300 dark:hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-lime-400 to-green-500 text-black rounded-full font-bold text-2xl mr-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Topluluğunu Ateşle</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              İlk destekçilerini toplamaya başla. Lansman gününde seni bekleyen bir kitle olsun. Büyümeyi gerçek zamanlı izle.
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
            <Button size="lg" className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
              🚀 Kendi Yolculuğunu Başlat
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 