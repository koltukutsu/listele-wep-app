"use client";

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Zap, PartyPopper } from 'lucide-react';

interface AIFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: any) => void;
}

export default function AIFounderModal({ isOpen, onClose, onApplyConfig }: AIFounderModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Lütfen proje fikrinizi girin.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Proje oluşturulurken bir hata oluştu.');
      }

      const newConfig = await response.json();
      
      toast.success('Proje taslağı başarıyla oluşturuldu!');
      onApplyConfig(newConfig);
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>AI Founder Mode</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-left">
            Proje fikrinizi aşağıya yazın, yapay zeka sizin için bir başlangıç sayfası taslağı oluştursun.
            Neyi, kimin için ve neden yaptığınızı anlatın.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Örnek: Evcil hayvan sahiplerinin, güvenilir bakıcılar bulmasını sağlayan bir mobil uygulama..."
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            rows={5}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Oluşturuluyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5" />
                <span>Taslağı Oluştur</span>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
