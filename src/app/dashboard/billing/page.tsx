"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { getUserProfile, UserProfile, plans } from "~/lib/firestore";
import { toast } from 'sonner';

interface Plan {
  name: string;
  price: string;
  priceDescription: string;
  features: string[];
  maxProjects: number;
  maxSubmissions: number;
}

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChoosePlan = (planId: string) => {
    toast.info(`Plan seçildi: ${planId}. Ödeme entegrasyonu yakında eklenecektir.`);
    // TODO: Implement payment integration (e.g., Stripe)
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Billing & Plans</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(plans).map(([planId, plan]: [string, Plan]) => {
          const isCurrentPlan = userProfile?.plan === planId;
          return (
            <div key={planId} className={`rounded-lg border p-6 ${isCurrentPlan ? 'border-blue-500' : ''}`}>
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <p className="text-sm text-gray-500">{plan.priceDescription}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="mt-8 w-full rounded-md py-2 text-white font-semibold"
                disabled={isCurrentPlan}
                onClick={() => handleChoosePlan(planId)}
                style={{ backgroundColor: isCurrentPlan ? '#9ca3af' : '#3b82f6' }}
              >
                {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
