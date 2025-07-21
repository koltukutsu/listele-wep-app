"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "~/lib/firebase";
import { signOut as firebaseSignOut, User } from "firebase/auth";
import { toast } from "sonner";
import { deleteUser as deleteFirebaseUser } from "firebase/auth";
import { deleteUser as deleteFirestoreUser } from "~/lib/firestore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear the cookie
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/');
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // First delete from Firestore
      await deleteFirestoreUser(user.uid);
      
      // Then delete auth user
      await deleteFirebaseUser(user);
      
      toast.success('Hesabınız başarıyla silindi');
      router.push('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Hesap silinirken bir hata oluştu');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profilim</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
            <CardDescription>Temel hesap bilgileriniz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">E-posta</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Üyelik Türü</p>
                <p className="mt-1">Ücretsiz Plan</p>
                <Button asChild className="mt-2">
                  <Link href="/pricing">Yükselt</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600">Tehlikeli Bölge</CardTitle>
            <CardDescription>Bu işlemler geri alınamaz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                  Çıkış Yap
                </Button>
              </div>
              <div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full sm:w-auto"
                >
                  Hesabımı Sil
                </Button>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Hesabınızı silmek tüm verilerinizin kalıcı olarak silinmesine neden olur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hesabınızı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Tüm projeleriniz ve verileriniz kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
