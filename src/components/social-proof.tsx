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
      name: "Sarah Y.",
      title: "Founder, Organic Workshop",
      quote:
        "I brought my idea to life overnight and collected over 100 people on the waitlist in the first week. This speed is incredible.",
    },
    {
      name: "Alex C.",
      title: "Entrepreneur",
      quote:
        "I started what would have taken months in minutes. The 500-person waitlist I showed in my investor presentation changed everything.",
    },
    {
      name: "Emma T.",
      title: "Designer",
      quote:
        "Despite having zero technical knowledge, I created an impressive waitlist page. I got 50 registrations on the first day; I couldn't be more motivated.",
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
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            <span className="text-[#D8FF00]">{userCount}+</span> Entrepreneurs Trust Us
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-900 dark:text-gray-300 mt-4">
            Reviews from entrepreneurs who opened waitlists with Launch List.
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
              className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 hover:shadow-xl hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300"
            >
              <p className="text-lg mb-6 font-serif italic text-gray-900 dark:text-gray-200">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#D8FF00] text-black font-semibold flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-black dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-400">
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