import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

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

    await addDoc(collection(db, "onboarding_analytics"), payload);

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

    await addDoc(collection(db, "user_activation"), payload);

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

    await addDoc(collection(db, "share_analytics"), payload);

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

    await addDoc(collection(db, "feature_analytics"), payload);

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

    await addDoc(collection(db, "page_analytics"), payload);

  } catch (error) {
    console.error('Error tracking page view:', error);
  }
} 