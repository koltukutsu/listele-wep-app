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
          Build Your Waitlist First, Then Build Your Product
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-lg text-gray-900 dark:text-gray-300 mb-12 sm:mb-16"
        >
          Why build if no one is waiting? Announce your idea today with Launch List, see if the market is ready, and move forward without wasting time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Prove Demand, Leave Assumptions</h3>
            <p className="text-gray-900 dark:text-gray-300">
              Real people signing up for your waitlist are more valuable than assumptions. See instantly if anyone actually wants your idea.
            </p>
          </div>
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Build Your First Community</h3>
            <p className="text-gray-900 dark:text-gray-300">
              These aren't just emails; they're your first supporters who believe in your vision. Talk to them, learn from them, and develop your product with them.
            </p>
          </div>
          <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:shadow-lg hover:border-[#D8FF00] dark:hover:border-[#D8FF00] transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Keep Your Motivation Alive</h3>
            <p className="text-gray-900 dark:text-gray-300">
              Every new person on your list is a reason to start building. Don't procrastinate when you have an audience waiting for you, start building.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}