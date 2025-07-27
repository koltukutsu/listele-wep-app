# Firebase/Firestore Implementation Plan for Listelee.io

## Overview
This document outlines the Firebase/Firestore integration plan for the listele.io waitlist platform, including authentication, database structure, and feature implementations.

## 1. Authentication System

### 1.1 Google Sign-In Integration
- **Location**: `/src/app/login/page.tsx` and `/src/components/auth-form.tsx`
- **Requirements**:
  - Add Google OAuth provider to Firebase Auth
  - Implement Google sign-in button alongside email/password form
  - Handle Google sign-in flow with proper error handling
  - Redirect to dashboard after successful authentication

### 1.2 User Creation Flow
When a user signs up (Google or email/password), the following Firestore documents must be created:

```typescript
// Users collection
{
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  provider: 'google' | 'email',
  createdAt: Timestamp,
  lastLoginAt: Timestamp,
  plan: 'free' | 'premium',
  projectsCount: number
}
```

## 2. Firestore Database Structure

### 2.1 Collections Schema

#### Users Collection (`users/{uid}`)
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'email';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  plan: 'free' | 'premium';
  projectsCount: number;
}
```

#### Projects Collection (`projects/{projectId}`)
```typescript
interface Project {
  id: string;
  userId: string; // Owner of the project
  name: string;
  slug: string; // Unique slug for the waitlist URL
  description: string;
  status: 'draft' | 'published' | 'paused';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Waitlist configuration
  config: {
    collectName: boolean;
    collectEmail: boolean;
    collectPhone: boolean;
    customFields: Array<{
      name: string;
      type: 'text' | 'email' | 'phone' | 'select';
      required: boolean;
      options?: string[]; // For select type
    }>;
    thankYouMessage: string;
    redirectUrl?: string;
  };
  
  // Template and design
  template: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  
  // Statistics
  stats: {
    totalVisits: number;
    totalSignups: number;
    conversionRate: number;
    lastVisitAt?: Timestamp;
    lastSignupAt?: Timestamp;
  };
}
```

#### Waitlist Entries Collection (`waitlist/{entryId}`)
```typescript
interface WaitlistEntry {
  id: string;
  projectId: string;
  userId?: string; // If user is logged in
  
  // Collected data based on project config
  name?: string;
  email?: string;
  phone?: string;
  customFields: Record<string, any>;
  
  // Metadata
  createdAt: Timestamp;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  
  // Status
  status: 'active' | 'contacted' | 'converted';
  notes?: string;
}
```

#### Analytics Collection (`analytics/{analyticsId}`)
```typescript
interface Analytics {
  id: string;
  projectId: string;
  type: 'visit' | 'signup';
  timestamp: Timestamp;
  
  // Visit data
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  country?: string;
  city?: string;
  
  // Signup data (if type === 'signup')
  entryId?: string;
}
```

## 3. Feature Implementation Plan

### 3.1 Google Sign-In Implementation
**Files to modify:**
- `/src/components/auth-form.tsx`
- `/src/lib/firebase.ts`

**Steps:**
1. Add Google Auth provider configuration
2. Create Google sign-in button component
3. Implement `signInWithGoogle()` function
4. Handle user creation in Firestore on first sign-in
5. Add proper error handling and loading states

### 3.2 Dashboard Data Integration
**Files to modify:**
- `/src/app/dashboard/page.tsx`
- Create `/src/lib/firestore.ts` for database operations

**Steps:**
1. Remove fake data and implement real Firestore queries
2. Create `getUserProjects(userId)` function
3. Implement real-time project updates
4. Add loading and error states
5. Implement project creation flow

### 3.3 Waitlist Pages from Database
**Files to modify:**
- `/src/app/[slug]/page.tsx`
- Create waitlist form components

**Steps:**
1. Implement `getProjectBySlug(slug)` function
2. Create dynamic waitlist page component
3. Implement form submission to Firestore
4. Add analytics tracking for visits and signups
5. Handle custom fields based on project configuration

### 3.4 Editor Improvements
**Files to modify:**
- `/src/app/dashboard/editor/[slug]/page.tsx`
- Create editor components

**Steps:**
1. Implement project loading by ID
2. Create form for project configuration
3. Add template customization options
4. Implement real-time preview
5. Add save/publish functionality

### 3.5 Admin Dashboard Features
**Files to create:**
- `/src/app/dashboard/analytics/[projectId]/page.tsx`
- `/src/app/dashboard/leads/[projectId]/page.tsx`

**Features:**
1. **Leads Management:**
   - Display waitlist entries based on project configuration
   - Show collected fields (name, email, phone, custom fields)
   - Export to CSV functionality
   - Filter and search capabilities
   - Contact status tracking

2. **Analytics Dashboard:**
   - Total visits and signups
   - Conversion rate calculation
   - Time-series charts for visits/signups
   - Geographic data (if available)
   - Referrer analysis

## 4. Security Rules

### 4.1 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      // Allow public read for published projects (for waitlist pages)
      allow read: if resource.data.status == 'published';
    }
    
    // Anyone can create waitlist entries, but only project owners can read them
    match /waitlist/{entryId} {
      allow create: if true;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
    }
    
    // Only project owners can read analytics
    match /analytics/{analyticsId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
      allow create: if true; // Allow analytics creation from client
    }
  }
}
```

## 5. Implementation Order

1. **Phase 1: Authentication**
   - Implement Google Sign-In
   - Fix user creation in Firestore
   - Update auth form component

2. **Phase 2: Core Data Flow**
   - Create Firestore helper functions
   - Update dashboard to use real data
   - Implement project CRUD operations

3. **Phase 3: Waitlist Functionality**
   - Create dynamic waitlist pages
   - Implement form submissions
   - Add analytics tracking

4. **Phase 4: Editor Improvements**
   - Build project editor interface
   - Add template customization
   - Implement save/publish flow

5. **Phase 5: Admin Features**
   - Create leads management interface
   - Build analytics dashboard
   - Add export functionality

## 6. Environment Variables Required

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional: Firebase Admin SDK (for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## 7. Testing Strategy

1. **Unit Tests**: Test Firestore helper functions
2. **Integration Tests**: Test auth flow and data operations
3. **E2E Tests**: Test complete user journeys
4. **Security Tests**: Verify Firestore security rules

This plan provides a comprehensive roadmap for implementing the Firebase/Firestore integration while maintaining security, performance, and user experience standards.
