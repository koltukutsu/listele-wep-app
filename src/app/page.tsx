"use client";

import Features from "~/components/features";
import Hero from "~/components/hero";
import HowTo from "~/components/how-to";
import Importance from "~/components/importance";
import SocialProof from "~/components/social-proof";
import { StructuredData, websiteSchema, softwareApplicationSchema, organizationSchema } from "~/components/structured-data";

export default function LandingPage() {
  return (
    <main>
      <StructuredData data={websiteSchema} />
      <StructuredData data={softwareApplicationSchema} />
      <StructuredData data={organizationSchema} />
      <Hero />
      <Importance />
      <HowTo />
      <Features />
      <SocialProof />
    </main>
  );
} 