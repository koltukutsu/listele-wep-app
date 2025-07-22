"use client";

import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { tiers } from "~/lib/plans";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { toast } from "sonner";
import AuthForm from "~/components/auth-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";

const freePlan = tiers[0];
const paidPlans = tiers.slice(1);

export default function PricingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{slug: string, price: string} | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChoosePlan = async (slug: string, price: string) => {
        if (!user) {
            setSelectedPlan({ slug, price });
            setShowAuthModal(true);
        } else {
            const res = await fetch('/api/sipay/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: price.replace(' TL', ''),
                    email: user.email,
                    name: user.displayName,
                    userId: user.uid,
                    planId: slug,
                })
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.error(data.error || 'Ödeme bağlantısı oluşturulamadı.');
            }
        }
    };
    
    if (loading) {
        return <div>Yükleniyor...</div>
    }

  return (
    <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-400"
        >
          Girişimine Uygun Yakıtı Seç
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground"
        >
          Her büyük yolculuk doğru kaynaklarla başlar. Fikrini ister test et, ister pazar lideri yap. Sana uygun bir planımız var.
        </motion.p>
        
        {/* Free Plan Special Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-white">{freePlan.name}</h2>
              <p className="mt-2 text-gray-300">Fikrini hayata geçirmek için ilk adımı at. Maliyetsiz, risksiz.</p>
              <ul className="mt-6 space-y-3">
                {freePlan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
                {freePlan.lacks.map((lack, i) => (
                   <li key={i} className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span>{lack}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center flex-shrink-0">
               <p className="text-5xl font-bold text-white">{freePlan.price}</p>
               <p className="text-gray-400">/ömürboyu</p>
               <Link href="/dashboard" className="mt-6">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 w-full">
                  Hemen Başla
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Paid Plans Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
          {paidPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={cn(
                "relative p-8 border rounded-2xl flex flex-col dark:border-gray-700",
                plan.slug === 'pro' ? 'bg-gray-900 text-white border-primary scale-105 shadow-2xl' : 'bg-white dark:bg-gray-900/50'
              )}
            >
              {plan.slug === 'pro' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="px-4 py-1 text-sm font-semibold text-white bg-primary rounded-full shadow-md">
                    En Popüler
                  </span>
                </div>
              )}
              <h2 className={cn("text-2xl font-bold", plan.slug === 'pro' ? 'text-white' : 'text-gray-900 dark:text-white')}>{plan.name}</h2>
              <p className={cn("mt-4 text-4xl font-bold", plan.slug === 'pro' ? 'text-white' : 'text-gray-900 dark:text-white')}>
                {plan.price} <span className="text-lg font-normal text-muted-foreground">/ay</span>
              </p>
              <p className={cn("mt-4 h-12", plan.slug === 'pro' ? 'text-gray-300' : 'text-muted-foreground')}>
                {plan.slug === 'basic' && "Büyümeye hazır olanlar için."}
                {plan.slug === 'pro' && "Potansiyelini ortaya çıkar, limitleri kaldır."}
                {plan.slug === 'unlimited' && "Zirveyi hedefleyenler için özel çözümler."}
              </p>
              <ul className="mt-8 space-y-4 text-left flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <CheckCircle2 className={cn("h-6 w-6 mr-2", plan.slug === 'pro' ? 'text-primary' : 'text-green-500')} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div onClick={() => handleChoosePlan(plan.slug, plan.price)} className="w-full mt-8">
                <Button size="lg" className={cn(
                  "w-full",
                   plan.slug === 'pro' 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'
                  )}>
                  Planı Seç
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Devam Etmek İçin Giriş Yapın</DialogTitle>
              </DialogHeader>
              <AuthForm onSuccess={() => {
                  setShowAuthModal(false);
                  if (selectedPlan) {
                      handleChoosePlan(selectedPlan.slug, selectedPlan.price);
                  }
              }} />
          </DialogContent>
      </Dialog>
    </section>
  );
}
