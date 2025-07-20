"use client";

import Features from "~/components/features";
import Hero from "~/components/hero";
import HowTo from "~/components/how-to";
import Importance from "~/components/importance";
import SocialProof from "~/components/social-proof";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Importance />
      <HowTo />
      <Features />
      <SocialProof />
    </main>
  );
} 