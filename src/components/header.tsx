"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useScroll } from "~/hooks/use-scroll";
import { cn } from "~/lib/utils";
import { Logo } from "./svgs";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { auth } from "~/lib/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import VoiceAIFounderModal from "./voice-ai-founder-modal";
import { Mic } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { isPaymentEnabled } from "~/lib/config";

export default function Header() {
  const scrolled = useScroll();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const paymentEnabled = isPaymentEnabled();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear the cookie by setting its expiration date to the past
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      toast.success('Başarıyla çıkış yapıldı');
      if (pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  return (
    <>
      <header
        className={cn(
          "py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50 border-b border-lime-200/50 dark:border-slate-700/50",
          scrolled &&
            "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-gray-900 dark:text-white">Listelee.io</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/showcase">
            <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20">
              Tüm Projeler
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20">
              Fiyatlandırma
            </Button>
          </Link>
          <ModeToggle />
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                {/* Connected User Menu and Quick Access */}
                <div className="flex items-center bg-lime-50 dark:bg-slate-800 border border-lime-200 dark:border-slate-700 rounded-lg p-2">
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-lime-100 dark:hover:bg-slate-700">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback className="bg-gradient-to-r from-lime-400 to-green-500 text-black text-xs font-bold">
                            {user.displayName 
                              ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                              : user.email?.[0].toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Kullanıcı menüsü</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 shadow-lg">
                      <DropdownMenuLabel className="font-normal bg-lime-50 dark:bg-slate-700 rounded-md mx-1 mb-1">
                        <div className="flex flex-col space-y-1 p-2">
                          <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                            {user.displayName || 'Kullanıcı'}
                          </p>
                          <p className="text-xs leading-none text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-lime-200 dark:bg-slate-600" />
                      
                      {/* Mobile navigation items */}
                      <div className="md:hidden">
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="w-full cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-lime-900/20">
                            Panelim
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile" className="w-full cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-lime-900/20">
                            Profilim
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-lime-200 dark:bg-slate-600" />
                      </div>
                      
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                      >
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Separator Line */}
                  <div className="hidden md:block w-px h-6 bg-lime-200 dark:bg-slate-600 mx-3"></div>

                  {/* Quick Access Buttons */}
                  <div className="hidden md:flex items-center gap-1">
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-lime-700 dark:text-lime-300 hover:text-lime-800 dark:hover:text-lime-200 hover:bg-lime-100 dark:hover:bg-lime-900/20 font-medium">
                        Panelim
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="ghost" size="sm" className="text-lime-700 dark:text-lime-300 hover:text-lime-800 dark:hover:text-lime-200 hover:bg-lime-100 dark:hover:bg-lime-900/20 font-medium">
                        Profilim
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Voice Button */}
                {paymentEnabled && (
                  <Button 
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-400 hover:from-lime-500 hover:via-yellow-500 hover:to-orange-500 text-black font-bold shadow-lg animate-pulse"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Fikrini Söyle
                  </Button>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="secondary" className="bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200 hover:bg-lime-200 dark:hover:bg-lime-800 border-lime-300 dark:border-lime-700">
                  Giriş Yap
                </Button>
              </Link>
            )
          )}
        </div>
      </header>
      {paymentEnabled && (
        <VoiceAIFounderModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      )}
    </>
  );
}
