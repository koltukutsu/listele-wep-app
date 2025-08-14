"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import VoiceAIFounderModal from "./voice-ai-founder-modal";
import { Mic } from "lucide-react";
import { isPaymentEnabled } from "~/lib/config";

export default function Hero() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const paymentEnabled = isPaymentEnabled();

  return (
    <>
      <section className="relative overflow-hidden bg-white dark:bg-slate-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-10"
        >
          <div className="blur-[106px] h-56 bg-[#D8FF00] dark:bg-[#D8FF00]/30" />
          <div className="blur-[106px] h-32 bg-[#D8FF00] dark:bg-[#D8FF00]/30" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                <h1 className="text-black dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl leading-tight">
                  Collect Your <span className="text-[#D8FF00]">Customers</span> First.
                </h1>

                <div className="mt-6">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    List Your Idea, Collect Your Waitlist.
                  </p>
                </div>

                <p className="mt-6 text-gray-900 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                  <strong className="text-black dark:text-white">Find your customers before developing your product.</strong> Set up a waitlist page in minutes with Launch List,
                  <strong className="text-black dark:text-white"> measure real demand</strong>,
                  <strong className="text-black dark:text-white"> collect first feedback</strong> and
                  <strong className="text-black dark:text-white"> get motivated by an audience waiting for you.</strong>
                  Don't waste effort on products without customers.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200 font-medium">
                    📮 Waitlist
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200 font-medium">
                    📊 Market Validation
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200 font-medium">
                    🔥 Product Motivation
                  </span>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-y-4 gap-x-6">
                  <Link href={paymentEnabled ? "/onboarding" : "/dashboard"}>
                    <Button size="lg" className="relative w-full sm:w-auto bg-[#D8FF00] hover:bg-[#B8E000] text-black font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                      🚀 Start Free
                    </Button>
                  </Link>
                  {paymentEnabled && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="relative w-full sm:w-auto group border-2 border-[#D8FF00] text-black dark:text-white hover:bg-[#D8FF00]/10 dark:hover:bg-[#D8FF00]/20 font-semibold text-lg px-8 py-4"
                    >
                      <Mic className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Create Project with Voice
                    </Button>
                  )}
                </div>

                <div className="mt-8 text-sm text-gray-800 dark:text-gray-400">
                  💳 No credit card required • 🎯 2 projects + 75 forms free • ⭐ Test in minutes
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {paymentEnabled && (
        <VoiceAIFounderModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      )}
    </>
  );
} 