import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  increment,
  orderBy,
  limit
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'email';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  plan: 'free' | 'basic' | 'pro' | 'unlimited';
  projectsCount: number;
  voiceCreditsUsed: number;
  stripeCustomerId?: string;
  subscription: {
    planId: string;
    maxForms: number;
    maxResponsesPerForm: number;
    currentPeriodStart: Timestamp;
    currentPeriodEnd: Timestamp;
    status: 'active' | 'canceled' | 'past_due';
  };
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'paused';
  createdAt: Timestamp | number;
  updatedAt: Timestamp | number;
  config: any; // Using 'any' for flexibility, matches editor state
  stats: {
    totalVisits: number;
    totalSignups: number;
    conversionRate: number;
    lastVisitAt?: Timestamp | number;
    lastSignupAt?: Timestamp | number;
  };
}

export interface Lead {
  id: string;
  projectId: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  createdAt: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  status: 'new' | 'contacted' | 'converted';
  notes?: string;
}

// This is an old plan structure and will be removed.
// The new plan structure is in a different file.
// export const plans = {
//   free: {
//     name: 'Free',
//     price: '0 TL',
//     priceDescription: 'per month',
//     features: ['1 Project', '50 Submissions', 'Basic Analytics'],
//     maxProjects: 1,
//     maxSubmissions: 50,
//   },
//   basic: {
//     name: 'Basic',
//     price: '5 TL',
//     priceDescription: 'per month',
//     features: ['3 Projects', '500 Submissions', 'Advanced Analytics', 'Email Support'],
//     maxProjects: 3,
//     maxSubmissions: 500,
//   },
//   pro: {
//     name: 'Pro',
//     price: '10 TL',
//     priceDescription: 'per month',
//     features: [
//       '5 Projects',
//       '2,500 Submissions',
//       'Priority Support',
//       'Custom Domain (soon)',
//     ],
//     maxProjects: 5,
//     maxSubmissions: 2500,
//   },
//   enterprise: {
//     name: 'Enterprise',
//     price: '20 TL',
//     priceDescription: 'per month',
//     features: [
//       '25 Projects',
//       'Unlimited Submissions',
//       'Dedicated Support',
//       'Team Features (soon)',
//     ],
//     maxProjects: 25,
//     maxSubmissions: -1, // Unlimited
//   },
// };

// User operations
export async function createUserProfile(user: User, provider: 'google' | 'email'): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  
  // Check if user already exists
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    // Update last login time
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    });
    return;
  }

  // Create new user profile
  const userProfile: Omit<UserProfile, 'uid' | 'createdAt' | 'lastLoginAt'> = {
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || undefined,
    provider,
    plan: 'free',
    projectsCount: 0,
    voiceCreditsUsed: 0,
    subscription: {
      planId: 'free',
      maxForms: 1,
      maxResponsesPerForm: 50,
      currentPeriodStart: serverTimestamp() as Timestamp,
      currentPeriodEnd: serverTimestamp() as Timestamp, // This should be updated based on subscription period
      status: 'active'
    }
  };

  await setDoc(userRef, {
    ...userProfile,
    uid: user.uid,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
}

export async function getUserByTransactionId(transactionId: string): Promise<UserProfile | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("invoice_id", "==", transactionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return {
        ...doc.data(),
        uid: doc.id,
    } as UserProfile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export const decrementVoiceCredits = async (uid: string) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    voiceCreditsUsed: increment(1)
  });
};

// Project operations
export async function getUserProjects(userId: string): Promise<Project[]> {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Project;
}

export async function createProject(userId: string, projectData: Partial<Project>): Promise<string> {
  const projectsRef = collection(db, "projects");
  
  const newProject: Omit<Project, 'id'> = {
    userId,
    name: projectData.name || 'Yeni Proje',
    slug: projectData.slug || '',
    status: 'published',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    config: projectData.config || {},
    stats: {
      totalVisits: 0,
      totalSignups: 0,
      conversionRate: 0,
    }
  };

  const docRef = await addDoc(projectsRef, newProject);
  
  // Update user's project count
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const currentCount = userSnap.data().projectsCount || 0;
    await updateDoc(userRef, {
      projectsCount: currentCount + 1
    });
  }
  
  return docRef.id;
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    return {
      id: projectSnap.id,
      ...projectSnap.data()
    } as Project;
  }
  
  return null;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    // Get project data first to get userId for updating user's project count
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const project = projectSnap.data() as Project;
    
    // Delete the project document
    await deleteDoc(projectRef);
    
    // Delete all waitlist entries for this project
    const waitlistRef = collection(db, "waitlist");
    const waitlistQuery = query(waitlistRef, where("projectId", "==", projectId));
    const waitlistSnapshot = await getDocs(waitlistQuery);
    
    const deleteWaitlistPromises = waitlistSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteWaitlistPromises);
    
    // Delete analytics data for this project
    const analyticsRef = collection(db, "analytics");
    const analyticsQuery = query(analyticsRef, where("projectId", "==", projectId));
    const analyticsSnapshot = await getDocs(analyticsQuery);
    
    const deleteAnalyticsPromises = analyticsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteAnalyticsPromises);
    
    // Update user's project count
    const userRef = doc(db, "users", project.userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentCount = userSnap.data().projectsCount || 0;
      await updateDoc(userRef, {
        projectsCount: Math.max(0, currentCount - 1)
      });
    }
    
    console.log(`Successfully deleted project ${projectId} and all related data`);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Lead operations
export async function addLead(projectId: string, leadData: {
  name?: string | null;
  email: string;
  phone?: string | null;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}): Promise<string> {
  const leadsRef = collection(db, "leads");
  
  const newLead = {
    projectId,
    ...leadData,
    status: 'new',
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(leadsRef, newLead);
  
  // Update project stats
  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    const project = projectSnap.data() as Project;
    const newSignupCount = (project.stats.totalSignups || 0) + 1;
    const conversionRate = project.stats.totalVisits > 0 
      ? (newSignupCount / project.stats.totalVisits) * 100 
      : 0;
    
    await updateDoc(projectRef, {
      'stats.totalSignups': newSignupCount,
      'stats.conversionRate': conversionRate,
      'stats.lastSignupAt': serverTimestamp()
    });
  }
  
  return docRef.id;
}

export async function getProjectLeads(projectId: string): Promise<Lead[]> {
  const leadsRef = collection(db, "leads");
  const q = query(leadsRef, where("projectId", "==", projectId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lead[];
}

export async function getPublicProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef, 
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(1000) // Limit to prevent too many URLs in sitemap
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  } catch (error) {
    console.error("Error fetching public projects for sitemap:", error);
    return [];
  }
}

// Analytics operations
export async function deleteUser(uid: string): Promise<void> {
  try {
    // Delete user document
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    
    // Delete user's projects
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted user ${uid} and their projects`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function trackVisit(projectId: string, metadata: {
  ipAddress: string;
  userAgent: string;
  referrer?: string;
}): Promise<void> {
  const analyticsRef = collection(db, "analytics");
  
  await addDoc(analyticsRef, {
    projectId,
    type: 'visit',
    timestamp: serverTimestamp(),
    ...metadata
  });
  
  // Update project visit stats
  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    const project = projectSnap.data() as Project;
    const newVisitCount = (project.stats.totalVisits || 0) + 1;
    const conversionRate = newVisitCount > 0 
      ? ((project.stats.totalSignups || 0) / newVisitCount) * 100 
      : 0;
    
    await updateDoc(projectRef, {
      'stats.totalVisits': newVisitCount,
      'stats.conversionRate': conversionRate,
      'stats.lastVisitAt': serverTimestamp()
    });
  }
}

// Referral operations
export async function trackReferral(referredUserId: string, referrerCode: string, metadata?: Record<string, any>): Promise<void> {
  try {
    const referralsRef = collection(db, "referrals");
    
    await addDoc(referralsRef, {
      referredUserId,
      referrerCode,
      status: 'pending',
      createdAt: serverTimestamp(),
      metadata
    });

    console.log('🔗 Referral tracked:', { referredUserId, referrerCode });
  } catch (error) {
    console.error('Error tracking referral:', error);
  }
}

export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  bonusProjectsEarned: number;
}> {
  try {
    const referralsRef = collection(db, "referrals");
    const q = query(referralsRef, where("referrerCode", "==", `REF_${userId.slice(-8).toUpperCase()}`));
    const snapshot = await getDocs(q);
    
    const referrals = snapshot.docs.map(doc => doc.data());
    const successful = referrals.filter(r => r.status === 'completed').length;
    const pending = referrals.filter(r => r.status === 'pending').length;
    
    return {
      totalReferrals: referrals.length,
      successfulReferrals: successful,
      pendingReferrals: pending,
      bonusProjectsEarned: successful
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return { totalReferrals: 0, successfulReferrals: 0, pendingReferrals: 0, bonusProjectsEarned: 0 };
  }
}

// Public project gallery operations
export async function getFeaturedProjects(limitCount: number = 12): Promise<Project[]> {
  try {
    const projectsRef = collection(db, "projects");
    // Simplified query to avoid complex indexing requirements
    const q = query(
      projectsRef,
      where("status", "==", "published"),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
    
    // Sort by totalSignups in memory since we can't use multiple orderBy easily
    return projects.sort((a, b) => {
      const aSignups = a.stats?.totalSignups || 0;
      const bSignups = b.stats?.totalSignups || 0;
      return bSignups - aSignups;
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getPublicProjectsByCategory(category?: string, limitCount: number = 20): Promise<Project[]> {
  try {
    const projectsRef = collection(db, "projects");
    let q;
    
    if (category) {
      // Query with category filter
      q = query(
        projectsRef,
        where("status", "==", "published"),
        where("config.isPublic", "==", true),
        where("config.category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    } else {
      // Query without category filter
      q = query(
        projectsRef,
        where("status", "==", "published"),
        where("config.isPublic", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    }
    
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
    
    // Sort by totalSignups in memory to avoid complex indexing requirements
    return projects.sort((a, b) => {
      const aSignups = a.stats?.totalSignups || 0;
      const bSignups = b.stats?.totalSignups || 0;
      return bSignups - aSignups;
    });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
}

export async function toggleProjectPublicStatus(projectId: string, isPublic: boolean): Promise<void> {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      'config.isPublic': isPublic,
      'config.publishedToGallery': isPublic ? serverTimestamp() : null
    });
  } catch (error) {
    console.error('Error toggling project public status:', error);
    throw error;
  }
}

export async function incrementProjectViews(projectId: string): Promise<void> {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      'stats.galleryViews': increment(1),
      'stats.lastGalleryView': serverTimestamp()
    });
  } catch (error) {
    console.error('Error incrementing project views:', error);
  }
}
