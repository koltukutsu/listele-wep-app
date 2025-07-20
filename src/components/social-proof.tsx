"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function SocialProof() {
  const [userCount, setUserCount] = useState(500);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prevCount) => prevCount + 1);
    }, 2000); // Increment every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Ayşe Y.",
      title: "Kurucu, Atölye App",
      avatar: 1,
      quote:
        "Listele.io sayesinde fikrimi bir hafta sonunda teste açtım. Gelen 200'den fazla kayıt, yatırımcı sunumumun en güçlü slaytı oldu.",
    },
    {
      name: "Mehmet Ö.",
      title: "Girişimci",
      avatar: 2,
      quote:
        "Teknik bilgim sıfır. Buna rağmen 15 dakika içinde sayfamı yayına alıp ilk e-postaları toplamaya başladım. İnanılmaz bir hız.",
    },
    {
      name: "Elif K.",
      title: "Tasarımcı & Kurucu",
      avatar: 3,
      quote:
        "Aylarca ürün geliştirmek yerine, talebi en başta görmek bize aylar kazandırdı. Her girişimci mutlaka kullanmalı.",
    },
    {
      name: "Can T.",
      title: "Öğrenci Girişimci",
      avatar: 4,
      quote:
        "Kampüsteki projem için anında bir sayfa oluşturup arkadaşlarımın ne kadar ilgi gösterdiğini gördüm. Harika bir başlangıç noktası!",
    },
    {
      name: "Zeynep A.",
      title: "Serbest Çalışan",
      avatar: 1,
      quote:
        "Yeni hizmetimi duyurmak için kullandım. Sadece birkaç saat içinde 50'den fazla potansiyel müşteri kazandım.",
    },
    {
      name: "Ahmet B.",
      title: "Mühendis",
      avatar: 2,
      quote:
        "Karmaşık araçlarla uğraşmak yerine Listele.io ile direkt sonuca ulaştım. Hız ve basitlik arayanlar için mükemmel.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">{userCount}+</span> Girişimci Bize Güveniyor
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
            Bizim gibi düşünen, fikrini hızla hayata geçirmek isteyenlerin
            yorumları.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 border border-gray-100 rounded-lg bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <p className="text-lg mb-6 font-serif italic text-gray-700">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 