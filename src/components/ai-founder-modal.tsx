"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Mic, Zap, PartyPopper, Rocket } from 'lucide-react';

type AIModalStep = 'idle' | 'recording' | 'processing' | 'success';

interface AIFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: any) => void;
}

const stepContent = {
  idle: {
    icon: <Mic className="h-12 w-12 mx-auto text-gray-400" />,
    title: "Fikrini Hayata Geçir",
    description: "Startup fikrini sesli olarak anlat, gerisini yapay zekaya bırak. Hazır olduğunda butona tıkla ve konuşmaya başla.",
    buttonText: "🚀 Fikrimi Anlatmaya Başlıyorum",
  },
  recording: {
    icon: (
      <div className="relative h-16 w-16 mx-auto">
        <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
        <Mic className="relative h-12 w-12 mx-auto text-white top-2" />
      </div>
    ),
    title: "Seni dinliyorum...",
    description: "Fikrinin ne olduğunu, kime hitap ettiğini ve hangi sorunu çözdüğünü anlat. Bitirdiğinde kaydı durdur.",
    buttonText: "🛑 Kaydı Durdur",
  },
  processing: {
    icon: <Zap className="h-12 w-12 mx-auto text-yellow-400 animate-spin" />,
    title: "Sihir yapılıyor...",
    description: "Harika fikir! Şimdi startup'ının ilk adımlarını hazırlıyorum. Bu işlem biraz zaman alabilir, lütfen bekle.",
    buttonText: "İşleniyor...",
  },
  success: {
    icon: <PartyPopper className="h-12 w-12 mx-auto text-green-500" />,
    title: "İşte Oldu!",
    description: "Girişiminin ilk sayfası hazır. Şimdi ince ayarları yapıp projenin lansmanını yapabilirsin!",
    buttonText: "Harika, Devam Et",
  },
};

export default function AIFounderModal({ isOpen, onClose, onApplyConfig }: AIFounderModalProps) {
  const [step, setStep] = useState<AIModalStep>('idle');

  const handleMainAction = async () => {
    if (step === 'idle') {
      setStep('recording');
      // TODO: Start voice recording
    } else if (step === 'recording') {
      setStep('processing');
      // TODO: Stop voice recording and send to OpenAI API
      // MOCKUP: Simulate API call and response
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockConfig = {
        name: 'Yapay Zeka ile Oluşturuldu',
        title: 'Devrim Niteliğinde Yeni Fikir',
        subtitle: 'Yapay zeka tarafından sizin için tasarlandı.',
        description: 'Bu proje, sesli anlatımınızdan yola çıkarak yapay zeka tarafından otomatik olarak oluşturulmuştur.',
      };
      onApplyConfig(mockConfig);
      setStep('success');
    } else if (step === 'success') {
      onClose();
    }
  };

  useEffect(() => {
    // Reset step when modal is closed
    if (!isOpen) {
      setTimeout(() => setStep('idle'), 300);
    }
  }, [isOpen]);

  const currentContent = stepContent[step];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] text-center">
        <DialogHeader>
          <div className="mx-auto mb-4">{currentContent.icon}</div>
          <DialogTitle className="text-2xl font-bold">{currentContent.title}</DialogTitle>
          <DialogDescription className="mt-2">
            {currentContent.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button 
            onClick={handleMainAction}
            disabled={step === 'processing'}
            className="w-full text-lg py-6"
          >
            {currentContent.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
