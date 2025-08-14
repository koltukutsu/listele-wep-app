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
    "Analyzing your idea...",
    "Conducting market research...",
    "Creating brand identity...",
    "Selecting design elements...",
    "Adding final magical touches..."
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
    const canCreateProject = currentPlan && (currentPlan.name === "Unlimited" || (userProfile && userProfile.projectsCount < (currentPlan.features.find(f => f.includes("Project"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Project"))?.split(" ")[0] as string) : 0)));
    const voiceCredits = currentPlan ? (currentPlan.features.find(f => f.includes("Voice Project Creation"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Voice Project Creation"))?.split(" ")[0] as string) : 0) : 0;
    const hasVoiceCredits = currentPlan && voiceCredits > 0 && userProfile && userProfile.voiceCreditsUsed < voiceCredits;

    const handleStartRecording = async () => {
        if (!hasVoiceCredits) {
            toast.error("Your voice project creation credits have run out or your plan doesn't support it.");
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
            toast.error("Microphone access denied.");
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
                throw new Error(errorData.error || "An error occurred.");
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
            toast.error("Project creation failed.");
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
                throw new Error(errorData.error || "An error occurred.");
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
            toast.error("Project creation failed.");
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
                        <DialogTitle className="text-2xl font-bold">Tell Your Idea, Make It Real</DialogTitle>
                        <DialogDescription>Take the first step of your project with just a voice recording.</DialogDescription>
                        <Button onClick={handleStartRecording} className="w-full mt-4" disabled={!hasVoiceCredits}>
                            <Mic className="mr-2 h-4 w-4" /> Start Recording
                        </Button>
                        {!hasVoiceCredits && user && (
                             <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>
                                    You have no voice project creation credits left.
                                    <Link href="/pricing" className="font-semibold underline ml-1">Upgrade your plan</Link>.
                                </span>
                            </div>
                        )}
                        <Button onClick={() => setStep('text_input')} variant="link" className="mt-2">
                            Or write as text
                        </Button>
                    </>
                );
            case 'text_input':
                return (
                    <>
                        <Type className="h-12 w-12 mx-auto text-blue-500" />
                        <DialogTitle className="text-2xl font-bold">What's Your Great Idea?</DialogTitle>
                        <DialogDescription>Write your project idea below, and let AI make a start for you.</DialogDescription>
                        <textarea 
                            className="w-full mt-4 p-2 border rounded"
                            rows={4}
                            value={textPrompt}
                            onChange={(e) => setTextPrompt(e.target.value)}
                            placeholder="E.g., A platform that connects local artists with buyers."
                            disabled={!canCreateProject}
                        />
                         {!canCreateProject && user && (
                             <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>
                                    You have reached your project creation limit.
                                    <Link href="/pricing" className="font-semibold underline ml-1">Upgrade your plan</Link>.
                                </span>
                            </div>
                        )}
                        <Button onClick={() => setStep('processing')} disabled={!textPrompt || !canCreateProject} className="w-full mt-4">
                            Create My Project
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
                        <DialogTitle>We're Listening...</DialogTitle>
                        <DialogDescription>Tell us your idea, then stop the recording when you're done.</DialogDescription>
                        <Button onClick={handleStopRecording} variant="destructive" className="w-full mt-4">
                            <Square className="mr-2 h-4 w-4" /> Stop Recording
                        </Button>
                    </>
                );
            case 'processing':
            case 'creating':
                return (
                    <>
                        <Zap className="h-12 w-12 mx-auto text-yellow-400 animate-spin" />
                        <DialogTitle>Magic is Starting...</DialogTitle>
                        <DialogDescription>
                            {processingSteps[processingStep]}
                        </DialogDescription>
                    </>
                );
            case 'auth':
                return(
                    <>
                        <DialogTitle>Almost Done!</DialogTitle>
                        <DialogDescription>Sign in or sign up to save your project.</DialogDescription>
                        <AuthForm onSuccess={() => setStep('creating')} />
                    </>
                );
            case 'success':
                 return (
                    <>
                        <PartyPopper className="h-12 w-12 mx-auto text-green-500" />
                        <DialogTitle>Your Project is Ready!</DialogTitle>
                        <DialogDescription>Redirecting you to the editor...</DialogDescription>
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