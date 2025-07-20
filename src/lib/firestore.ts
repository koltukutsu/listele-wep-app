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
  Timestamp 
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
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  projectsCount: number;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  config: any; // Using 'any' for flexibility, matches editor state
  stats: {
    totalVisits: number;
    totalSignups: number;
    conversionRate: number;
    lastVisitAt?: Timestamp;
    lastSignupAt?: Timestamp;
  };
}

export interface WaitlistEntry {
  id: string;
  projectId: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  customFields: Record<string, any>;
  createdAt: Timestamp;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  status: 'active' | 'contacted' | 'converted';
  notes?: string;
}

export const plans = {
  free: {
    name: 'Free',
    price: '0 TL',
    priceDescription: 'per month',
    features: ['1 Project', '50 Submissions', 'Basic Analytics'],
    maxProjects: 1,
    maxSubmissions: 50,
  },
  basic: {
    name: 'Basic',
    price: '5 TL',
    priceDescription: 'per month',
    features: ['3 Projects', '500 Submissions', 'Advanced Analytics', 'Email Support'],
    maxProjects: 3,
    maxSubmissions: 500,
  },
  pro: {
    name: 'Pro',
    price: '10 TL',
    priceDescription: 'per month',
    features: [
      '5 Projects',
      '2,500 Submissions',
      'Priority Support',
      'Custom Domain (soon)',
    ],
    maxProjects: 5,
    maxSubmissions: 2500,
  },
  enterprise: {
    name: 'Enterprise',
    price: '20 TL',
    priceDescription: 'per month',
    features: [
      '25 Projects',
      'Unlimited Submissions',
      'Dedicated Support',
      'Team Features (soon)',
    ],
    maxProjects: 25,
    maxSubmissions: -1, // Unlimited
  },
};

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
  const q = query(projectsRef, where("slug", "==", slug), where("status", "==", "published"));
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
    status: 'draft',
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

// Waitlist operations
export async function addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'createdAt'>): Promise<string> {
  const waitlistRef = collection(db, "waitlist");
  
  const newEntry = {
    ...entry,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(waitlistRef, newEntry);
  
  // Update project stats
  const projectRef = doc(db, "projects", entry.projectId);
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

export async function getProjectWaitlistEntries(projectId: string): Promise<WaitlistEntry[]> {
  const waitlistRef = collection(db, "waitlist");
  const q = query(waitlistRef, where("projectId", "==", projectId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WaitlistEntry[];
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
