"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '~/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track initial page view
    trackPageView(pathname, {
      search_params: searchParams.toString(),
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    // Initialize analytics on client side
    console.log('🔥 Analytics Provider initialized');
    
    // Track initial app load
    trackPageView('/', {
      event_type: 'app_load',
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  }, []);

  return <>{children}</>;
} 