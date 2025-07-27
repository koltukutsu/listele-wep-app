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
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20"
        >
          <div className="blur-[106px] h-56 bg-gradient-to-br from-lime-400 to-green-500 dark:from-lime-600" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-green-400 to-lime-300 dark:to-green-600" />
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
                <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl leading-tight">
                  Listeleri Hayata <span className="text-transparent bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text">Geçir.</span>
                </h1>
                
                <div className="mt-6">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Fikirini Listelee, İşini Test Et.
                  </p>
                </div>

                <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                  <strong className="text-gray-900 dark:text-white">İş fikrinizi test etmek</strong> için güçlü form siteleri oluşturun. 
                  <strong className="text-gray-900 dark:text-white"> Gerçek talep</strong> ölçün, 
                  <strong className="text-gray-900 dark:text-white"> müşteri geri bildirimi</strong> toplayın ve 
                  <strong className="text-gray-900 dark:text-white"> para harcamadan doğrulayın</strong>. 
                  Başarısız olmak yerine, önceden öğrenin.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200 font-medium">
                    ✅ Fikir Doğrulama
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium">
                    📊 Talep Ölçümü
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium">
                    💰 Risk Azaltma
                  </span>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-y-4 gap-x-6">
                  <Link href={paymentEnabled ? "/onboarding" : "/dashboard"}>
                    <Button size="lg" className="relative w-full sm:w-auto bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                      🚀 Ücretsiz Başla
                    </Button>
                  </Link>
                  {paymentEnabled && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="relative w-full sm:w-auto group border-2 border-lime-400 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 font-semibold text-lg px-8 py-4"
                    >
                      <Mic className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Sesle Proje Oluştur
                    </Button>
                  )}
                </div>

                <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                  💳 Kredi kartı gerektirmez • 🎯 2 proje + 75 form ücretsiz • ⭐ Dakikalar içinde test et
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