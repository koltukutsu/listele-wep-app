"use client";

import { useState, FormEvent } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { auth } from "~/lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // FAKE DATA MODE
    setTimeout(() => {
      if (isSignUp) {
        toast.success("Hesap oluşturuldu! Doğrulama e-postası gönderildi.");
      } else {
        toast.success("Başarıyla giriş yapıldı!");
        window.location.href = "/dashboard";
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
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
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
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
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full !bg-primary hover:!bg-primary/90 !text-primary-foreground"
        >
          {loading ? "Yükleniyor..." : isSignUp ? "Kayıt Ol" : "Giriş Yap"}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-600 hover:underline"
        >
          {isSignUp
            ? "Zaten bir hesabın var mı? Giriş Yap"
            : "Hesabın yok mu? Kayıt Ol"}
        </button>
      </div>
    </div>
  );
} 