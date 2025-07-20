"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>
      <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 py-20 text-center md:py-32 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Fikrini Listele, Yatırıma Değil, Pazara Sun.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Girişim yolculuğunun en kritik adımı fikir doğrulamadır. Listele.io ile
          kod yazmadan, teknik bilgiye ihtiyaç duymadan dakikalar içinde bir
          bekleme listesi sayfası oluştur ve fikrinin ne kadar talep gördüğünü
          gerçek kullanıcılarla test et.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">Hemen Başla</Button>
          </Link>
          <Link href="#nasil-calisir">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Nasıl Çalışır?
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 