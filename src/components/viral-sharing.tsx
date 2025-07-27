"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Share2, Copy, Check, MessageCircle, Twitter, Linkedin, Mail, Gift, Users } from "lucide-react";
import { toast } from "sonner";
import { trackProjectShare, trackFeatureUsage } from "~/lib/analytics";
import { APP_URL } from "~/lib/config";

interface ViralSharingProps {
  projectSlug: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  shareUrl: (url: string, text: string) => string;
  key: 'whatsapp' | 'twitter' | 'linkedin' | 'email' | 'copy_link';
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "WhatsApp",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "bg-green-500 hover:bg-green-600",
    key: "whatsapp",
    shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    name: "Twitter/X",
    icon: <Twitter className="w-5 h-5" />,
    color: "bg-black hover:bg-gray-800",
    key: "twitter",
    shareUrl: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    color: "bg-blue-600 hover:bg-blue-700",
    key: "linkedin",
    shareUrl: (url, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  {
    name: "E-posta",
    icon: <Mail className="w-5 h-5" />,
    color: "bg-gray-600 hover:bg-gray-700",
    key: "email",
    shareUrl: (url, text) => `mailto:?subject=${encodeURIComponent("Harika bir proje keşfettim!")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
  }
];

const SHARE_MESSAGES = [
  "Yeni girişimim için ilk müşterilerimi topluyorum! Fikri nasıl buluyorsun? 🚀",
  "Bu projeye ne düşünüyorsun? Görüşün çok değerli! 💡",
  "Girişimcilik yolculuğumda yeni bir adım! Desteğin önemli 🌟",
  "İş fikrim için geri bildirimini almak istiyorum! 🎯",
  "Yeni startup projem! İlk destekçilerimden biri olur musun? ⭐"
];

export function ViralSharing({ projectSlug, projectName, isOpen, onClose }: ViralSharingProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode] = useState(`REF_${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  
  const projectUrl = `${APP_URL}/${projectSlug}`;
  const referralUrl = `${projectUrl}?ref=${referralCode}`;
  const randomMessage = SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)];
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      toast.success("Link panoya kopyalandı! 📋");
      await trackProjectShare(projectSlug, 'copy_link', { referralCode });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  const handleSocialShare = async (platform: SocialPlatform) => {
    const shareUrl = platform.shareUrl(referralUrl, `"${projectName}" - ${randomMessage}`);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    await trackProjectShare(projectSlug, platform.key, { referralCode });
    await trackFeatureUsage('viral_sharing', 'used', { platform: platform.name });
    toast.success(`${platform.name} ile paylaştın! 🎉`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-lime-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-lime-500" />
            <span className="text-gray-900 dark:text-gray-100">Projenizi Paylaşın & Büyüyün</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Sosyal medyada paylaşarak daha fazla kişiye ulaşın ve ilk müşterilerinizi toplayın!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Copy Link */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Copy className="w-4 h-4 text-lime-500" />
              Hızlı Paylaşım Linki
            </h4>
            <div className="flex items-center space-x-2 p-3 bg-lime-50 dark:bg-slate-800 rounded-lg border border-lime-200 dark:border-slate-600">
              <input 
                type="text" 
                value={referralUrl} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant={copiedLink ? "default" : "outline"}
                className={copiedLink ? "bg-lime-500 hover:bg-lime-600 text-black" : "border-lime-300 dark:border-slate-600 hover:bg-lime-100 dark:hover:bg-slate-600"}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Sosyal Medyada Paylaş</h4>
            <div className="grid grid-cols-2 gap-3">
              {SOCIAL_PLATFORMS.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={() => handleSocialShare(platform)}
                  className={`${platform.color} text-white hover:opacity-90 transition-opacity`}
                  variant="default"
                >
                  {platform.icon}
                  <span className="ml-2">{platform.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Referral Benefits */}
          <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-700 rounded-lg p-4">
            <h4 className="font-medium text-lime-800 dark:text-lime-400 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Paylaşım Avantajları
            </h4>
            <ul className="text-sm text-lime-700 dark:text-lime-300 space-y-1">
              <li className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                Her başarılı davet için +1 proje hakkı
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                Arkadaşın 1 ay Temel plan ücretsiz
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                Toplulukta öne çıkan proje rozeti
              </li>
            </ul>
          </div>

          {/* Sharing Tips */}
          <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">💡 Paylaşım İpuçları</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Kendi hikayenizi ekleyin: "Bu fikrimi nasıl buluyorsun?"</li>
              <li>• WhatsApp'ta kişisel mesajlar daha etkili</li>
              <li>• LinkedIn'de profesyonel network'ünüzü hedefleyin</li>
              <li>• Twitter'da hashtag kullanın: #startup #girişimcilik</li>
            </ul>
          </div>

          {/* Preview Message */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Önizleme Mesajı:</h4>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 italic border border-gray-200 dark:border-slate-600">
              "{projectName}" - {randomMessage}
              <br />
              <span className="text-lime-600 dark:text-lime-400">{referralUrl}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 