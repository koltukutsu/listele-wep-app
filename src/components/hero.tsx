"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import VoiceAIFounderModal from "./voice-ai-founder-modal";
import { Mic } from "lucide-react";

export default function Hero() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <>
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
            Fikrini Saniyeler İçinde Hayata Geçir.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Bir fikrin var. Parlak, cesur, ezber bozan. Ama kodlama, tasarım ve saatler süren geliştirmeler... İşte bu, fikrinle arandaki en büyük engel. Listele.io, bu engeli ortadan kaldırıyor. Sadece fikrini anlat, gerisini biz halledelim. İlk adımını bugün at, geleceği şimdi başlat.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold shadow-lg animate-pulse"
              onClick={() => setIsVoiceModalOpen(true)}
            >
              <Mic className="mr-2 h-4 w-4" />
              Fikrini Söyle, Hayata Geçir
            </Button>
            <Link href="#nasil-calisir">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Nasıl Çalışır?
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <VoiceAIFounderModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </>
  );
} 