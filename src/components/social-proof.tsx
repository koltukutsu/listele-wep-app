"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SocialProof() {
  const [userCount, setUserCount] = useState("1,000"); // Example starting count

  // This could be updated with real data later
  useEffect(() => {
    // Example of fetching real data
    // fetch('/api/user-count').then(res => res.json()).then(data => setUserCount(data.count.toLocaleString()));
  }, []);

  const testimonials = [
    {
      name: "Selin Y.",
      title: "Kurucu, Organik Atölye",
      quote:
        "Fikrimi bir gecede hayata geçirdim ve ilk hafta 100'den fazla e-posta topladım. Bu hız, inanılmaz.",
    },
    {
      name: "Ahmet C.",
      title: "Girişimci",
      quote:
        "Aylarca sürecek bir işi dakikalar içinde başlattım. Yatırımcı sunumumda gösterdiğim ilk 500 kişilik liste, her şeyi değiştirdi.",
    },
    {
      name: "Elif T.",
      title: "Tasarımcı",
      quote:
        "Teknik bilgim sıfır olmasına rağmen, harika görünen bir sayfa oluşturdum. Süreç o kadar basitti ki, şaşırdım.",
    },
  ];
  
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-transparent bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text">{userCount}+</span> Girişimci Bize Güveniyor
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mt-4">
            Bizim gibi düşünen, fikrini hızla hayata geçirmek isteyenlerin
            yorumları.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 border border-lime-200 dark:border-slate-700 rounded-lg bg-lime-50 dark:bg-slate-800 hover:shadow-xl hover:border-lime-300 dark:hover:border-slate-600 transition-all duration-300"
            >
              <p className="text-lg mb-6 font-serif italic text-gray-800 dark:text-gray-200">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lime-400 to-green-500 text-black font-semibold flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 