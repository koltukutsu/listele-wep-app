"use client";

import {
    Code,
    Zap,
    Gauge,
    Database,
    Globe,
    Wallet,
  } from "lucide-react";
  import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Features() {
  const features = [
    {
      icon: <Code size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Founder Mode AI & No-Code Editor",
      description:
        "Either describe your waitlist page with voice and let AI build it, or design it yourself with drag-and-drop ease. No coding knowledge required.",
    },
    {
      icon: <Zap size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Instant Launch",
      description:
        "When your page is ready, publish it with one click and start collecting your waitlist. No waiting, just action.",
    },
    {
      icon: <Gauge size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Your Growth Dashboard",
      description:
        "See who's joining your list and where they're coming from. Shape your strategy with data, take the next step with confidence.",
    },
    {
      icon: <Database size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Your Waitlist is Secure",
      description:
        "All the records you collect are stored securely and you have complete control. Take your list whenever you want, move forward on your own path.",
    },
    {
      icon: <Globe size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Build Your Brand",
      description:
        "As your startup grows, so does your brand. Easily connect your own domain to take your corporate identity to the next level.",
    },
    {
      icon: <Wallet size={32} className="text-black dark:text-[#D8FF00]"/>,
      title: "Cost-Free Start",
      description:
        "We believe that budget shouldn't be the biggest obstacle in front of great ideas. Don't think about your wallet when taking your first steps. Just focus on your idea.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">Founder's Arsenal</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-900 dark:text-gray-300 mt-4">
            Everything you need to create and grow your waitlist is here. Speed, data, and community are under your control.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300"
            >
              <div className="p-4 inline-block bg-gray-100 dark:bg-slate-800 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{feature.title}</h3>
              <p className="text-gray-900 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 