"use client";

import { usePlausible } from 'next-plausible';

// Custom events type for better TypeScript support
type CustomEvents = {
  'Waitlist Signup': { source: string; domain?: string }
  'Project Created': { template: string; category?: string }
  'Feature Used': { feature: string; action: string }
  'Share Action': { method: string; type: string }
  'Onboarding Step': { step: string; action: string }
}

export function usePlausibleEvents() {
  const plausible = usePlausible<CustomEvents>();

  return {
    trackWaitlistSignup: (source: string, domain?: string) => {
      plausible('Waitlist Signup', { props: { source, domain } });
    },
    
    trackProjectCreated: (template: string, category?: string) => {
      plausible('Project Created', { props: { template, category } });
    },
    
    trackFeatureUsed: (feature: string, action: string) => {
      plausible('Feature Used', { props: { feature, action } });
    },
    
    trackShareAction: (method: string, type: string) => {
      plausible('Share Action', { props: { method, type } });
    },
    
    trackOnboardingStep: (step: string, action: string) => {
      plausible('Onboarding Step', { props: { step, action } });
    }
  };
}

// Example usage component
export function PlausibleEventExample() {
  const events = usePlausibleEvents();

  const handleWaitlistSignup = () => {
    events.trackWaitlistSignup('homepage', 'listelee.vercel.app');
  };

  const handleProjectCreated = () => {
    events.trackProjectCreated('saas', 'technology');
  };

  return (
    <div className="hidden">
      {/* This component is just for demonstration */}
      <button onClick={handleWaitlistSignup}>Track Waitlist</button>
      <button onClick={handleProjectCreated}>Track Project</button>
    </div>
  );
} 