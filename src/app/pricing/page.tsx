"use client";

import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { tiers } from "~/lib/plans";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { toast } from "sonner";
import AuthForm from "~/components/auth-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { loadStripe } from '@stripe/stripe-js';
import { isPaymentEnabled } from "~/lib/config";
import { StructuredData, pricingPageSchema } from "~/components/structured-data";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const freePlan = tiers[0];
const paidPlans = tiers.slice(1);

export default function PricingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{slug: string, price: string} | null>(null);
    const paymentEnabled = isPaymentEnabled();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChoosePlan = async (slug: string) => {
        if (!paymentEnabled) {
            toast.info("Fiyatlandırma sistemi henüz aktif değil. Şu anda sınırlı kullanım mevcuttur.");
            return;
        }

        if (!user) {
            setSelectedPlan({ slug, price: '' }); // Price is not needed here
            setShowAuthModal(true);
        } else {
            try {
                const token = await user.getIdToken();
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        planId: slug,
                        success_url: `${window.location.origin}/payment-success`,
                        cancel_url: `${window.location.origin}/payment-fail`,
                    })
                });
                
                if (!res.ok) {
                    throw new Error('Payment service temporarily unavailable');
                }
                
                const data = await res.json();
                if (data.sessionId) {
                    const stripe = await stripePromise;
                    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
                } else {
                    toast.error(data.error || 'Could not create payment link.');
                }
            } catch (error) {
                console.error('Payment error:', error);
                toast.error('Ödeme sistemi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
            }
        }
    };
    
    if (loading) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-900 dark:text-white">Yükleniyor...</div>
    }

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
      <StructuredData data={pricingPageSchema} />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-900 bg-primary/10 px-4 py-2 rounded-full inline-block dark:text-white">
            Özellikler & Planlar
          </h2>
          <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {paymentEnabled ? "Size Uygun Planı Keşfedin" : "Tüm Özellikleri Keşfedin"}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            {paymentEnabled 
              ? "Her plan özel olarak tasarlanmış güçlü özelliklerle geliyor. İhtiyaçlarınıza en uygun olanı seçin." 
              : "Listelee.io'nun sunduğu tüm özellikleri görün. Fiyatlandırma yakında aktif olacak."
            }
          </p>
          {!paymentEnabled && (
            <div className="mt-6 mx-auto max-w-md">
              <div className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl shadow-sm">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <span className="text-sm text-yellow-900 dark:text-yellow-100 font-semibold">
                  Fiyatlandırma yakında aktif olacak
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Free Plan */}
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 ring-2 ring-green-200 dark:ring-green-700 xl:p-10 lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-2xl font-bold leading-8 text-green-900 dark:text-green-100">
                  {freePlan.name}
                </h3>
                <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                  Aktif
                </div>
              </div>
              <p className="mt-4 text-base leading-6 text-green-700 dark:text-green-200 font-medium">
                {paymentEnabled ? "Hızlı başlangıç için temel özellikler" : "Şu anda tüm kullanıcılar için mevcut olan sınırlı kullanım paketi"}
              </p>
              {paymentEnabled && (
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-green-900 dark:text-green-100">
                    {freePlan.price}
                  </span>
                </p>
              )}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 uppercase tracking-wide mb-4">Özellikler</h4>
                <ul className="space-y-4">
                  {freePlan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2 className="h-6 w-6 flex-none text-green-600 dark:text-green-400" />
                      <span className="text-base text-green-800 dark:text-green-100 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href="/dashboard" className="mt-8">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg">
                {paymentEnabled ? "Başla" : "Sınırlı Kullanımla Başla"}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Paid Plans */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-8 sm:mt-20 sm:gap-y-0 lg:max-w-6xl lg:grid-cols-3 lg:gap-x-8">
          {paidPlans.map((plan, planIdx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: planIdx * 0.1 }}
              className={cn(
                "rounded-3xl p-8 xl:p-10 relative shadow-xl transform hover:scale-105 transition-all duration-300",
                plan.slug === 'pro' 
                  ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white ring-4 ring-blue-300 dark:ring-blue-500 lg:scale-105" 
                  : plan.slug === 'basic'
                  ? "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 ring-2 ring-orange-200 dark:ring-orange-700"
                  : "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 ring-2 ring-purple-200 dark:ring-purple-700"
              )}
            >
              {!paymentEnabled && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Clock className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Yakında</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bu plan çok yakında aktif olacak</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-x-4 mb-6">
                <h3
                  className={cn(
                    "text-2xl font-bold leading-8",
                    plan.slug === 'pro' ? "text-white" : 
                    plan.slug === 'basic' ? "text-orange-900 dark:text-orange-100" :
                    "text-purple-900 dark:text-purple-100"
                  )}
                >
                  {plan.name}
                </h3>
                {plan.slug === 'pro' && (
                  <div className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold border border-white/30">
                    ⭐ Önerilen
                  </div>
                )}
              </div>
              
              <p className={cn(
                "text-base leading-6 font-medium mb-6",
                plan.slug === 'pro' ? "text-blue-100" :
                plan.slug === 'basic' ? "text-orange-700 dark:text-orange-200" :
                "text-purple-700 dark:text-purple-200"
              )}>
                {plan.slug === 'basic' && "Büyümeye hazır olanlar için güçlü araçlar"}
                {plan.slug === 'pro' && "Profesyoneller için tam özellikli çözüm"}
                {plan.slug === 'unlimited' && "Sınırsız güç ve kontrolle zirveyi hedefleyin"}
              </p>

              {paymentEnabled && (
                <div className="mb-6">
                  <p className="flex items-baseline gap-x-2">
                    <span className={cn(
                      "text-4xl font-bold tracking-tight",
                      plan.slug === 'pro' ? "text-white" :
                      plan.slug === 'basic' ? "text-orange-900 dark:text-orange-100" :
                      "text-purple-900 dark:text-purple-100"
                    )}>
                      {plan.price}
                    </span>
                    <span className={cn(
                      "text-sm font-semibold",
                      plan.slug === 'pro' ? "text-blue-200" :
                      plan.slug === 'basic' ? "text-orange-600 dark:text-orange-300" :
                      "text-purple-600 dark:text-purple-300"
                    )}>
                      /ay
                    </span>
                  </p>
                </div>
              )}

              <div>
                <h4 className={cn(
                  "text-sm font-bold uppercase tracking-wide mb-4",
                  plan.slug === 'pro' ? "text-blue-200" :
                  plan.slug === 'basic' ? "text-orange-800 dark:text-orange-200" :
                  "text-purple-800 dark:text-purple-200"
                )}>
                  Bu Planda Neler Var?
                </h4>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2 className={cn(
                        "h-6 w-6 flex-none",
                        plan.slug === 'pro' ? "text-green-300" :
                        plan.slug === 'basic' ? "text-orange-600 dark:text-orange-400" :
                        "text-purple-600 dark:text-purple-400"
                      )} />
                      <span className={cn(
                        "text-base font-medium",
                        plan.slug === 'pro' ? "text-white" :
                        plan.slug === 'basic' ? "text-orange-900 dark:text-orange-100" :
                        "text-purple-900 dark:text-purple-100"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div onClick={() => paymentEnabled && handleChoosePlan(plan.slug)} className="w-full mt-8">
                <Button 
                  size="lg" 
                  disabled={!paymentEnabled}
                  className={cn(
                    "w-full font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl",
                    plan.slug === 'pro' 
                      ? "bg-white text-blue-600 hover:bg-blue-50 border-2 border-white" 
                      : plan.slug === 'basic'
                      ? "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                      : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
                    !paymentEnabled && "!bg-gray-400 !text-gray-600 cursor-not-allowed !opacity-70"
                  )}>
                  {paymentEnabled ? "Bu Planı Seç" : "Yakında Aktif"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">Devam Etmek İçin Giriş Yapın</DialogTitle>
              </DialogHeader>
              <AuthForm onSuccess={async () => {
                  setShowAuthModal(false);
                  if (selectedPlan) {
                      await handleChoosePlan(selectedPlan.slug);
                  }
              }} />
          </DialogContent>
      </Dialog>
    </section>
  );
}
