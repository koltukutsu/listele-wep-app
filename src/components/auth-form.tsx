"use client";

import { useState, FormEvent, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "~/lib/firebase";
import { createUserProfile, getUserProfile } from "~/lib/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { trackUserActivation } from "~/lib/analytics";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cookies, setCookie] = useCookies(["firebase-auth-token"]);

  // Handle authentication state and redirects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !loading) {
        // User is authenticated, handle redirect
        const redirectPath = searchParams.get('redirect') || '/dashboard';
        const userProfile = await getUserProfile(user.uid);
        
        if (userProfile && userProfile.projectsCount > 0) {
          router.push(redirectPath.startsWith('/dashboard') ? redirectPath : '/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
    });

    return () => unsubscribe();
  }, [router, searchParams, loading]);

  const setAuthCookie = async (user: any) => {
    try {
      const idToken = await getIdToken(user, true); // Force refresh token
      setCookie("firebase-auth-token", idToken, { 
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    } catch (error) {
      console.error("Error setting auth cookie:", error);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let userCredential;
      
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user, 'email');
        await trackUserActivation('first_login');
        toast.success("Hesap başarıyla oluşturuldu!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Başarıyla giriş yapıldı!");
      }
      
      await setAuthCookie(userCredential.user);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Email auth error:", error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error("Bu e-posta adresi zaten kullanımda.");
          break;
        case 'auth/weak-password':
          toast.error("Şifre çok zayıf. En az 6 karakter olmalı.");
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          toast.error("E-posta veya şifre hatalı.");
          break;
        case 'auth/invalid-email':
          toast.error("Geçersiz e-posta adresi.");
          break;
        case 'auth/too-many-requests':
          toast.error("Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.");
          break;
        default:
          toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // Ensure the popup is triggered by direct user interaction
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      
      await setAuthCookie(user);
      await createUserProfile(user, 'google');
      
      // Check if this is a new user
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile || userProfile.projectsCount === 0) {
        await trackUserActivation('first_login');
      }
      
      toast.success("Google ile başarıyla giriş yapıldı!");
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          toast.error("Giriş işlemi iptal edildi.");
          break;
        case 'auth/popup-blocked':
          toast.error("Pop-up engellendi. Lütfen tarayıcınızda pop-up'ları etkinleştirin ve tekrar deneyin.");
          break;
        case 'auth/cancelled-popup-request':
          // Don't show error for this, user likely clicked multiple times
          break;
        case 'auth/network-request-failed':
          toast.error("Ağ hatası. İnternet bağlantınızı kontrol edin.");
          break;
        default:
          toast.error("Google ile giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        {isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
      </h2>
      
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            E-posta Adresi
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            className="mt-1 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Şifreniz
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifreniz"
            required
            className="mt-1 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold"
        >
          {loading ? "Yükleniyor..." : isSignUp ? "Kayıt Ol" : "Giriş Yap"}
        </Button>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-gray-400">veya</span>
        </div>
      </div>
      
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
        type="button"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google ile {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
      </Button>
      
      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline transition-colors"
          type="button"
        >
          {isSignUp
            ? "Zaten bir hesabın var mı? Giriş Yap"
            : "Hesabın yok mu? Kayıt Ol"}
        </button>
      </div>
    </div>
  );
} 