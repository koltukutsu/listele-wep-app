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
import { Mic, Menu } from "lucide-react";
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
      toast.success('Successfully signed out');
      if (pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred while signing out');
    }
  };

  return (
    <>
      <header
        className={cn(
          "py-3 md:py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-3 sticky top-0 z-50 border-b border-gray-200/50 dark:border-slate-700/50",
          scrolled &&
            "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm"
        )}
      >
        <Link href="/" className="flex items-center gap-1 md:gap-2 shrink-0">
          <Logo />
          <span className="font-bold text-black dark:text-white text-sm md:text-base">Launch List</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/showcase">
              <Button variant="ghost" className="text-gray-900 dark:text-gray-300 hover:text-[#D8FF00] hover:bg-gray-50 dark:hover:bg-slate-800">
                All Projects
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="text-gray-900 dark:text-gray-300 hover:text-[#D8FF00] hover:bg-gray-50 dark:hover:bg-slate-800">
                Blog
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" className="text-gray-900 dark:text-gray-300 hover:text-[#D8FF00] hover:bg-gray-50 dark:hover:bg-slate-800">
                Pricing
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-2 md:gap-3">
                {/* Voice Button - Mobile (Icon Only) */}
                {paymentEnabled && (
                  <Button 
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="md:hidden bg-[#D8FF00] hover:bg-[#B8E000] text-black font-bold shadow-lg p-2 h-8 w-8"
                    size="sm"
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Tell Your Idea</span>
                  </Button>
                )}

                {/* Connected User Menu and Quick Access */}
                <div className="flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1 md:p-2">
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <Avatar className="h-7 w-7 md:h-8 md:w-8">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback className="bg-[#D8FF00] text-black text-xs font-bold">
                            {user.displayName 
                              ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                              : user.email?.[0].toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-lg">
                      <DropdownMenuLabel className="font-normal bg-gray-50 dark:bg-slate-700 rounded-md mx-1 mb-1">
                        <div className="flex flex-col space-y-1 p-2">
                          <p className="text-sm font-medium leading-none text-black dark:text-white">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-xs leading-none text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                      
                      {/* Navigation items for mobile */}
                      <div className="md:hidden">
                        <DropdownMenuItem asChild>
                          <Link href="/showcase" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                            All Projects
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/blog" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                            Blog
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/pricing" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                            Pricing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                      </div>
                      
                      {/* User menu items */}
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      
                      {/* Mode toggle for mobile */}
                      <div className="md:hidden">
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                        <div className="px-2 py-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 dark:text-gray-300">Theme</span>
                            <ModeToggle />
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Separator Line */}
                  <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-slate-600 mx-3"></div>

                  {/* Quick Access Buttons - Desktop Only */}
                  <div className="hidden md:flex items-center gap-1">
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-gray-900 dark:text-gray-300 hover:text-[#D8FF00] hover:bg-gray-100 dark:hover:bg-slate-700 font-medium">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="ghost" size="sm" className="text-gray-900 dark:text-gray-300 hover:text-[#D8FF00] hover:bg-gray-100 dark:hover:bg-slate-700 font-medium">
                        Profile
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Voice Button - Desktop */}
                {paymentEnabled && (
                  <Button 
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="hidden md:flex bg-[#D8FF00] hover:bg-[#B8E000] text-black font-bold shadow-lg"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Tell Your Idea
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Mobile Menu for Unauthenticated Users */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Menu className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-lg">
                      <DropdownMenuItem asChild>
                        <Link href="/showcase" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                          All Projects
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/blog" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                          Blog
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/pricing" className="w-full cursor-pointer text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                          Pricing
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                      <div className="px-2 py-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900 dark:text-gray-300">Theme</span>
                          <ModeToggle />
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200 hover:bg-[#D8FF00] hover:text-black border-gray-300 dark:border-slate-600 text-xs md:text-sm px-2 md:px-4">
                    Sign In
                  </Button>
                </Link>
              </div>
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
