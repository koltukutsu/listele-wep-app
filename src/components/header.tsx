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

export default function Header() {
  const scrolled = useScroll();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      toast.success('Başarıyla çıkış yapıldı');
      if (pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <header className="py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold">Listele.io</span>
        </Link>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50",
        scrolled &&
          "bg-background/50 md:bg-transparent md:backdrop-blur-none backdrop-blur-sm",
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="font-bold">Listele.io</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/pricing">
          <Button variant="ghost">Fiyatlandırma</Button>
        </Link>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback>
                    {user.displayName 
                      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                      : user.email?.[0].toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Kullanıcı menüsü</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName || 'Kullanıcı'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="w-full cursor-pointer">
                  Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="w-full cursor-pointer">
                  Profilim
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="secondary">Giriş Yap</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
