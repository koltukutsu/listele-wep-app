import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { db, analytics } from "./firebase";
import { getAuth } from "firebase/auth";

// Helper function to safely track to Google Analytics
function trackToGA(eventName: string, parameters?: Record<string, any>) {
  if (analytics && typeof window !== 'undefined') {
    try {
      logEvent(analytics, eventName, parameters);
      console.log('📊 GA Event:', eventName, parameters);
    } catch (error) {
      console.error('Error tracking to GA:', error);
    }
  }
}

// Helper function to safely track to Plausible
function trackToPlausible(eventName: string, props?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.plausible) {
    try {
      if (props && Object.keys(props).length > 0) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
      console.log('📈 Plausible Event:', eventName, props);
    } catch (error) {
      console.error('Error tracking to Plausible:', error);
    }
  }
}

// Declare plausible function for TypeScript
declare global {
  interface Window {
    plausible: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export interface OnboardingEvent {
  userId: string;
  step: number;
  action: 'step_view' | 'completed' | 'demo_generated' | 'project_created' | 'time_to_project' | 'abandoned';
  timestamp: any;
  metadata?: Record<string, any>;
  sessionId: string;
  userAgent?: string;
  referrer?: string | null;
}

export interface UserActivationEvent {
  userId: string;
  eventType: 'first_login' | 'first_project' | '7_day_active' | 'first_lead' | 'first_share';
  timestamp: any;
  daysSinceSignup?: number;
  metadata?: Record<string, any>;
}

// Generate session ID for tracking user journey
let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

// Track onboarding steps and user behavior
export async function trackOnboardingStep(
  step: number, 
  action: OnboardingEvent['action'], 
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    const payload: any = {
      userId: user.uid,
      step,
      action,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null, // Changed from undefined to null
      timestamp: serverTimestamp()
    };

    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "onboarding_analytics"), payload);

    // Track to Google Analytics
    trackToGA('onboarding_step', {
      step_number: step,
      action: action,
      user_id: user.uid,
      session_id: getSessionId(),
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('Onboarding Step', {
      step: step.toString(),
      action: action,
      user_id: user.uid.substring(0, 8),
      ...metadata
    });

    // Also track in console for development
    console.log('📊 Onboarding Event:', { step, action, metadata });
  } catch (error) {
    console.error('Error tracking onboarding step:', error);
  }
}

// Track user activation milestones
export async function trackUserActivation(
  eventType: UserActivationEvent['eventType'],
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    const payload: any = {
      userId: user.uid,
      eventType,
      timestamp: serverTimestamp()
    };

    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "user_activation"), payload);

    // Track to Google Analytics
    trackToGA('user_activation', {
      event_type: eventType,
      user_id: user.uid,
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('User Activation', {
      event_type: eventType,
      user_id: user.uid.substring(0, 8),
      ...metadata
    });

    console.log('🎯 Activation Event:', { eventType, metadata });
  } catch (error) {
    console.error('Error tracking user activation:', error);
  }
}

// Track project sharing events
export async function trackProjectShare(
  projectId: string,
  shareMethod: 'copy_link' | 'whatsapp' | 'twitter' | 'linkedin' | 'email',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    const payload: any = {
      userId: user.uid,
      projectId,
      shareMethod,
      timestamp: serverTimestamp()
    };
    
    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "share_analytics"), payload);

    // Track to Google Analytics
    trackToGA('share', {
      method: shareMethod,
      content_type: 'project',
      item_id: projectId,
      user_id: user.uid,
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('Project Share', {
      method: shareMethod,
      project_id: projectId.substring(0, 8),
      user_id: user.uid.substring(0, 8),
      ...metadata
    });

    console.log('📤 Share Event:', { projectId, shareMethod, metadata });
  } catch (error) {
    console.error('Error tracking project share:', error);
  }
}

// Track feature usage
export async function trackFeatureUsage(
  feature: string,
  action: 'viewed' | 'used' | 'completed',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    const payload: any = {
      userId: user.uid,
      feature,
      action,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    };
    
    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "feature_analytics"), payload);

    // Track to Google Analytics
    trackToGA('feature_usage', {
      feature_name: feature,
      action: action,
      user_id: user.uid,
      session_id: getSessionId(),
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('Feature Usage', {
      feature: feature,
      action: action,
      user_id: user.uid.substring(0, 8),
      ...metadata
    });

    console.log('⚡ Feature Event:', { feature, action, metadata });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}

// Calculate onboarding funnel metrics (client-side analysis)
export interface OnboardingMetrics {
  step1Completion: number;
  step2Completion: number;
  step3Completion: number;
  step4Completion: number;
  step5Completion: number;
  averageTimeToFirstProject: number;
  abandonmentRate: number;
  sevenDayActivation: number;
}

// Track user journey completion
export async function trackOnboardingComplete(): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    await trackUserActivation('first_project', {
      completedOnboarding: true,
      sessionId: getSessionId()
    });

    // Set onboarding completion flag
    localStorage.setItem('listele_onboarding_completed', 'true');
    localStorage.setItem('listele_onboarding_date', new Date().toISOString());
  } catch (error) {
    console.error('Error tracking onboarding completion:', error);
  }
}

// Check if user has completed onboarding
export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem('listele_onboarding_completed') === 'true';
}

// Get user's onboarding completion date
export function getOnboardingCompletionDate(): Date | null {
  const dateStr = localStorage.getItem('listele_onboarding_date');
  return dateStr ? new Date(dateStr) : null;
}

// Calculate days since user signed up (for activation tracking)
export function getDaysSinceSignup(userCreatedAt: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - userCreatedAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Track page views for analytics
export async function trackPageView(page: string, metadata?: Record<string, any>): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    const payload: any = {
      userId: user?.uid || 'anonymous',
      page,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null, // Changed from undefined to null
    };

    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "page_analytics"), payload);

    // Track to Google Analytics
    trackToGA('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page,
      user_id: user?.uid,
      session_id: getSessionId(),
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('Page View', {
      page_title: document.title,
      page_path: page,
      user_id: user?.uid?.substring(0, 8) || 'anonymous',
      ...metadata
    });

  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// New function to track conversions (e.g., waitlist signups)
export async function trackConversion(
  type: 'waitlist_signup' | 'project_created' | 'upgrade' | 'signup',
  value?: number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    const payload: any = {
      userId: user?.uid || 'anonymous',
      type,
      value: value || 0,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    };

    if (metadata) {
      payload.metadata = metadata;
    }

    // Track to Firestore
    await addDoc(collection(db, "conversion_analytics"), payload);

    // Track to Google Analytics
    trackToGA('conversion', {
      conversion_type: type,
      value: value || 0,
      currency: 'USD',
      user_id: user?.uid,
      session_id: getSessionId(),
      ...metadata
    });

    // Track to Plausible
    trackToPlausible('Conversion', {
      type: type,
      value: value?.toString() || '0',
      user_id: user?.uid?.substring(0, 8) || 'anonymous',
      ...metadata
    });

    console.log('💰 Conversion Event:', { type, value, metadata });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
} 