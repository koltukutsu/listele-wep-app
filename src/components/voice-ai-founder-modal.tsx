"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Mic, Zap, PartyPopper, Square, Check } from 'lucide-react';
import { toast } from 'sonner';
import AuthForm from './auth-form';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { createProject } from '~/lib/firestore';
import { useRouter } from 'next/navigation';

type VoiceModalStep = 'idle' | 'recording' | 'processing' | 'auth' | 'creating' | 'success';

interface VoiceAIFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const processingSteps = [
    "Fikrin analiz ediliyor...",
    "Pazar araştırması yapılıyor...",
    "Marka kimliği oluşturuluyor...",
    "Tasarım elementleri seçiliyor...",
    "Son sihirli dokunuşlar yapılıyor..."
];

export default function VoiceAIFounderModal({ isOpen, onClose }: VoiceAIFounderModalProps) {
    const [step, setStep] = useState<VoiceModalStep>('idle');
    const [user, setUser] = useState<User | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [processingStep, setProcessingStep] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            recorder.ondataavailable = (event) => {
                setAudioChunks(prev => [...prev, event.data]);
            };
            recorder.start();
            setStep('recording');
        } catch (err) {
            toast.error("Mikrofon erişimi reddedildi.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setStep('processing');
        }
    };

    useEffect(() => {
        if (step === 'processing' && audioChunks.length > 0) {
            if(!user) {
                setStep('auth');
            } else {
                setStep('creating');
            }
        }
    }, [step, audioChunks, user]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'processing' || step === 'creating') {
            interval = setInterval(() => {
                setProcessingStep(prev => (prev + 1) % processingSteps.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [step]);
    
    useEffect(() => {
        if(step === 'creating' && audioChunks.length > 0 && user) {
            const processVoice = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.webm');

                try {
                    const response = await fetch('/api/generate-project-from-voice', {
                        method: 'POST',
                        body: formData,
                    });
                    
                    if (!response.ok) throw new Error("Bir hata oluştu.");

                    const config = await response.json();
                    
                    const newProjectId = await createProject(user.uid, {
                        name: config.name,
                        slug: config.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
                        config: config,
                        status: 'published',
                    });

                    setStep('success');
                    router.push(`/dashboard/editor/${newProjectId}`);

                } catch (error) {
                    toast.error("Proje oluşturulamadı.");
                    setStep('idle');
                } finally {
                    setAudioChunks([]);
                }
            };
            processVoice();
        }
    }, [step, audioChunks, user, router]);


    const renderContent = () => {
        switch (step) {
            case 'idle':
                return (
                    <>
                        <Zap className="h-12 w-12 mx-auto text-yellow-400" />
                        <DialogTitle className="text-2xl font-bold">Fikrini Söyle, Gerçeğe Dönüşsün</DialogTitle>
                        <DialogDescription>Sadece bir ses kaydıyla projenizin ilk adımını atın.</DialogDescription>
                        <Button onClick={handleStartRecording} className="w-full mt-4">
                            <Mic className="mr-2 h-4 w-4" /> Kayda Başla
                        </Button>
                    </>
                );
            case 'recording':
                return (
                    <>
                        <div className="relative h-16 w-16 mx-auto">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                            <Mic className="relative h-12 w-12 mx-auto text-white top-2" />
                        </div>
                        <DialogTitle>Seni Dinliyoruz...</DialogTitle>
                        <DialogDescription>Fikrini anlat, bitince kaydı durdur.</DialogDescription>
                        <Button onClick={handleStopRecording} variant="destructive" className="w-full mt-4">
                            <Square className="mr-2 h-4 w-4" /> Kaydı Durdur
                        </Button>
                    </>
                );
            case 'processing':
            case 'creating':
                return (
                    <>
                        <Zap className="h-12 w-12 mx-auto text-yellow-400 animate-spin" />
                        <DialogTitle>Sihir Başlıyor...</DialogTitle>
                        <DialogDescription>
                            {processingSteps[processingStep]}
                        </DialogDescription>
                    </>
                );
            case 'auth':
                return(
                    <>
                        <DialogTitle>Neredeyse Tamam!</DialogTitle>
                        <DialogDescription>Projeni kaydetmek için giriş yap veya kayıt ol.</DialogDescription>
                        <AuthForm onSuccess={() => setStep('creating')} />
                    </>
                );
            case 'success':
                 return (
                    <>
                        <PartyPopper className="h-12 w-12 mx-auto text-green-500" />
                        <DialogTitle>Projen Hazır!</DialogTitle>
                        <DialogDescription>Seni editöre yönlendiriyoruz...</DialogDescription>
                    </>
                );
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] text-center">
                <DialogHeader>
                    {renderContent()}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
} 