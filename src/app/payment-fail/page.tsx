"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "sonner";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentFailPage() {
    const searchParams = useSearchParams();
    const planId = searchParams.get('planId');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleTryAgain = async () => {
        if (!user || !planId) return;

        const token = await user.getIdToken();
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                planId,
                success_url: `${window.location.origin}/payment-success`,
                cancel_url: `${window.location.origin}/payment-fail`,
            })
        });
        const data = await res.json();
        if (data.sessionId) {
            const stripe = await stripePromise;
            await stripe?.redirectToCheckout({ sessionId: data.sessionId });
        } else {
            toast.error(data.error || 'Could not create payment link.');
        }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Ödeme Başarısız Oldu</h1>
      <p className="text-gray-600 mb-8">Ödemenizi işleme alamadık. Lütfen tekrar deneyin.</p>
      <div className="flex gap-4">
        <Link href="/pricing">
            <Button variant="outline">Fiyatlandırmaya Geri Dön</Button>
        </Link>
        <Button onClick={handleTryAgain}>Tekrar Dene</Button>
      </div>
    </div>
  );
} 