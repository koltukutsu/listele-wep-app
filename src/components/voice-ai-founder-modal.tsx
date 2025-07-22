"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Mic, Zap, PartyPopper, Square, Check, Type, Info } from 'lucide-react';
import { toast } from 'sonner';
import AuthForm from './auth-form';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { createProject, getUserProfile, UserProfile } from '~/lib/firestore';
import { useRouter } from 'next/navigation';
import { getPlanBySlug } from '~/lib/plans';
import Link from 'next/link';

type VoiceModalStep = 'idle' | 'recording' | 'text_input' | 'processing' | 'auth' | 'creating' | 'success';

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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [processingStep, setProcessingStep] = useState(0);
    const [textPrompt, setTextPrompt] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const profile = await getUserProfile(currentUser.uid);
                setUserProfile(profile);
            }
        });
        return () => unsubscribe();
    }, []);

    const currentPlan = userProfile ? getPlanBySlug(userProfile.plan) : null;
    const canCreateProject = currentPlan && (currentPlan.name === "Sınırsız" || (userProfile && userProfile.projectsCount < (currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] as string) : 0)));
    const voiceCredits = currentPlan ? (currentPlan.features.find(f => f.includes("Sesle Proje Oluşturma"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Sesle Proje Oluşturma"))?.split(" ")[0] as string) : 0) : 0;
    const hasVoiceCredits = currentPlan && voiceCredits > 0 && userProfile && userProfile.voiceCreditsUsed < voiceCredits;

    const handleStartRecording = async () => {
        if (!hasVoiceCredits) {
            toast.error("Sesle proje oluşturma krediniz bitti veya planınız desteklemiyor.");
            return;
        }
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
        if (step === 'processing' && (audioChunks.length > 0 || textPrompt)) {
            if(!user) {
                setStep('auth');
            } else {
                setStep('creating');
            }
        }
    }, [step, audioChunks, user, textPrompt]);

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
        if(step === 'creating' && (audioChunks.length > 0 || textPrompt) && user) {
            if (textPrompt) {
                processText();
            } else {
                processVoice();
            }
        }
    }, [step, audioChunks, textPrompt, user, router]);

    const processText = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/generate-project', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: textPrompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Bir hata oluştu.");
            }
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
            setTextPrompt("");
        }
    };


    const processVoice = async () => {
        if (!user) return;
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        const token = await user.getIdToken();

        try {
            const response = await fetch('/api/generate-project-from-voice', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Bir hata oluştu.");
            }
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


    const renderContent = () => {
        switch (step) {
            case 'idle':
                return (
                    <>
                        <Zap className="h-12 w-12 mx-auto text-yellow-400" />
                        <DialogTitle className="text-2xl font-bold">Fikrini Söyle, Gerçeğe Dönüşsün</DialogTitle>
                        <DialogDescription>Sadece bir ses kaydıyla projenizin ilk adımını atın.</DialogDescription>
                        <Button onClick={handleStartRecording} className="w-full mt-4" disabled={!hasVoiceCredits}>
                            <Mic className="mr-2 h-4 w-4" /> Kayda Başla
                        </Button>
                        {!hasVoiceCredits && user && (
                             <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>
                                    Sesle proje oluşturma hakkınız kalmadı.
                                    <Link href="/pricing" className="font-semibold underline ml-1">Planınızı yükseltin</Link>.
                                </span>
                            </div>
                        )}
                        <Button onClick={() => setStep('text_input')} variant="link" className="mt-2">
                            Veya metin olarak yaz
                        </Button>
                    </>
                );
            case 'text_input':
                return (
                    <>
                        <Type className="h-12 w-12 mx-auto text-blue-500" />
                        <DialogTitle className="text-2xl font-bold">Harika Fikrin Nedir?</DialogTitle>
                        <DialogDescription>Proje fikrini aşağıya yaz, yapay zeka senin için bir başlangıç yapsın.</DialogDescription>
                        <textarea 
                            className="w-full mt-4 p-2 border rounded"
                            rows={4}
                            value={textPrompt}
                            onChange={(e) => setTextPrompt(e.target.value)}
                            placeholder="Örn: Yerel sanatçıları alıcılarla buluşturan bir platform."
                            disabled={!canCreateProject}
                        />
                         {!canCreateProject && user && (
                             <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>
                                    Proje oluşturma limitinize ulaştınız.
                                    <Link href="/pricing" className="font-semibold underline ml-1">Planınızı yükseltin</Link>.
                                </span>
                            </div>
                        )}
                        <Button onClick={() => setStep('processing')} disabled={!textPrompt || !canCreateProject} className="w-full mt-4">
                            Projemi Oluştur
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