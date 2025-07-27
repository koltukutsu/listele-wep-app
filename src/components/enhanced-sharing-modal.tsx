"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Copy, Check, MessageCircle, Share2, Sparkles, Heart, Target, Rocket, Users, Gift } from "lucide-react";
import { toast } from "sonner";
import { trackFeatureUsage } from "~/lib/analytics";

interface EnhancedSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectUrl: string;
  projectName: string;
}

export function EnhancedSharingModal({ isOpen, onClose, projectUrl, projectName }: EnhancedSharingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sharingMessages = [
    {
      icon: <Rocket className="w-4 h-4 text-blue-500" />,
      title: "Heyecanlı Başlangıç",
      message: `🚀 Yeni girişim projem hazır! "${projectName}" hakkında ne düşünüyorsun? Geri bildirimini almak çok değerli: ${projectUrl}`
    },
    {
      icon: <Heart className="w-4 h-4 text-red-500" />,
      title: "Samimi ve Kişisel",
      message: `❤️ Uzun zamandır üzerinde çalıştığım projeyi sonunda paylaşabiliyorum! Görüşün benim için çok önemli: ${projectUrl}`
    },
    {
      icon: <Target className="w-4 h-4 text-green-500" />,
      title: "Geri Bildirim Odaklı",
      message: `🎯 İlk müşterilerimi arıyorum ve senin fikrini merak ediyorum! 2 dakika ayırıp bakabilir misin? ${projectUrl}`
    },
    {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      title: "Topluluk Desteği",
      message: `👥 Girişimcilik yolculuğumda yeni bir kilometre taşı! Destekçilerimden biri olmak ister misin? ${projectUrl}`
    },
    {
      icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
      title: "İlham Verici",
      message: `✨ Hayalimdeki projeyi hayata geçirdim! Bu yolculukta senin enerjine de ihtiyacım var: ${projectUrl}`
    },
    {
      icon: <MessageCircle className="w-4 h-4 text-cyan-500" />,
      title: "Sohbet Başlatıcı",
      message: `💬 Yeni projemle ilgili sohbet etmek ister miyiz? Kahve molasında şöyle bir göz atabilirsin: ${projectUrl}`
    },
    {
      icon: <Gift className="w-4 h-4 text-pink-500" />,
      title: "Değer Vurgusu",
      message: `🎁 Sana özel bir şey hazırladım! Bu proje senin gibi değerli insanlar için: ${projectUrl}`
    },
    {
      icon: <Share2 className="w-4 h-4 text-indigo-500" />,
      title: "Paylaşım Teşviki",
      message: `🔄 Eğer beğenirsen arkadaşlarına da önerebilirsin! İşte projeme bir göz at: ${projectUrl}`
    },
    {
      icon: <Target className="w-4 h-4 text-orange-500" />,
      title: "Profesyonel Yaklaşım",
      message: `🎯 İş fikrimi hayata geçirdim ve profesyonel görüşünü almak istiyorum. Değerlendirmen önemli: ${projectUrl}`
    },
    {
      icon: <Rocket className="w-4 h-4 text-emerald-500" />,
      title: "Başarı Odaklı",
      message: `🚀 Bu proje ile büyük hedeflerim var! İlk destekçilerimden biri olmanı çok isterim: ${projectUrl}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Proje linki kopyalandı! 📋");
      await trackFeatureUsage('project_sharing', 'used', { method: 'link_only' });
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  const handleCopyMessage = async (message: string, index: number, title: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedIndex(index);
      toast.success(`"${title}" mesajı kopyalandı! 📱`);
      await trackFeatureUsage('project_sharing', 'used', { 
        method: 'message_template',
        messageType: title.toLowerCase().replace(' ', '_')
      });
      
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("Mesaj kopyalanamadı");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border-lime-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-lime-500" />
            <span className="text-gray-900 dark:text-gray-100">Projenizi Paylaşın</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Projenizi etkili bir şekilde paylaşmak için hazır mesajlarımızı kullanabilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Direct Link Copy Section */}
          <div className="bg-lime-50 dark:bg-slate-800 rounded-lg p-4 border-2 border-dashed border-lime-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Sadece Link Kopyala</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Proje linkinizi direkt olarak paylaşın</p>
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="sm" className="border-lime-300 dark:border-slate-600 hover:bg-lime-100 dark:hover:bg-slate-700">
                <Copy className="w-4 h-4 mr-2" />
                Linki Kopyala
              </Button>
            </div>
            <div className="mt-3 p-2 bg-white dark:bg-slate-700 rounded border border-lime-200 dark:border-slate-600 text-sm text-gray-700 dark:text-gray-300 break-all">
              {projectUrl}
            </div>
          </div>

          {/* Sharing Messages Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-lime-500" />
              Hazır Paylaşım Mesajları
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Aşağıdaki mesajlardan birini seçip kopyalayabilirsiniz. Her mesaj sizin proje linkinizi içerir.
            </p>

            <div className="grid gap-3">
              {sharingMessages.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {item.title}
                          </h4>
                          <Button
                            onClick={() => handleCopyMessage(item.message, index, item.title)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-lime-100 dark:hover:bg-slate-700"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 mr-1 text-lime-500" />
                                <span className="text-lime-500 text-xs">Kopyalandı!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                <span className="text-xs">Kopyala</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-lime-50 dark:bg-slate-800 rounded-lg p-4 border border-lime-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-lime-500" />
              </div>
              <div>
                <h4 className="font-medium text-lime-800 dark:text-lime-400 mb-2">💡 Paylaşım İpuçları</h4>
                <ul className="text-sm text-lime-700 dark:text-lime-300 space-y-1">
                  <li>• <strong>WhatsApp</strong> için daha samimi mesajlar daha etkili olur</li>
                  <li>• <strong>LinkedIn</strong> için profesyonel yaklaşımı tercih edin</li>
                  <li>• <strong>Email</strong> için kişisel ve detaylı mesajlar kullanın</li>
                  <li>• Doğru zamanda paylaşın - mesai saatleri daha iyi sonuç verir</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300">
              Kapat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 