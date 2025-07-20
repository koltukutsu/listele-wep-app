"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowTo() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="nasil-calisir" className="py-20 sm:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Sadece 3 Basit Adım
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12 sm:mb-16"
        >
          Teknik detaylarla veya karmaşık arayüzlerle uğraşmana gerek yok.
          Fikrini hayata geçirmek hiç bu kadar hızlı olmamıştı.
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
          
          <motion.div
            variants={itemVariants}
            className="relative p-8 border rounded-lg bg-white dark:bg-gray-800/50 z-10"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-2xl mr-4">
                1
              </div>
              <h3 className="text-xl font-bold">Fikrini Özetle</h3>
            </div>
            <p className="text-muted-foreground">
              Projen için akılda kalıcı bir isim ve basit bir açıklama gir.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="relative p-8 border rounded-lg bg-white dark:bg-gray-800/50 z-10"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-2xl mr-4">
                2
              </div>
              <h3 className="text-xl font-bold">Sayfanı Oluştur</h3>
            </div>
            <p className="text-muted-foreground">
              Hazır şablonumuzu kullanarak bekleme listesi sayfanı anında
              oluştur.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="relative p-8 border rounded-lg bg-white dark:bg-gray-800/50 z-10"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-2xl mr-4">
                3
              </div>
              <h3 className="text-xl font-bold">Paylaş ve İzle</h3>
            </div>
            <p className="text-muted-foreground">
              Oluşturduğun linki sosyal medyada paylaş ve panodan kayıtları
              takip et.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Link href="/dashboard">
            <Button size="lg">Vakit Kaybetme, Şimdi Başla</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 