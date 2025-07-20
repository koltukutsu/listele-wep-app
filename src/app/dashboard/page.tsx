"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { getUserProjects, Project, getUserProfile, UserProfile, plans } from "~/lib/firestore";
import { BarChart, Users, Edit, Share2, ExternalLink } from 'lucide-react';
import { toast } from "sonner";



export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Fetch user profile
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          
          // Fetch user's projects
          const userProjects = await getUserProjects(currentUser.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Veriler yüklenirken bir hata oluştu.");
        }
      } else {
        // User is not authenticated, redirect to login
        router.push("/login");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Başarıyla çıkış yapıldı.");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Çıkış yapılırken bir hata oluştu.");
    }
  };

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Proje linki panoya kopyalandı!');
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Projelerin</h1>
            {userProfile && (
              <p className="text-sm text-muted-foreground mt-1">
                {userProfile.projectsCount} proje • {userProfile.plan === 'free' ? 'Ücretsiz Plan' : 'Premium Plan'}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.displayName || 'Kullanıcı'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <Link href="/dashboard/billing">
              <Button variant="outline">Faturalandırma</Button>
            </Link>
            <div>
              <Link href="/dashboard/editor">
                <Button 
                  disabled={!!(userProfile && userProfile.projectsCount >= plans[userProfile.plan].maxProjects)}
                >
                  Yeni Proje Oluştur
                </Button>
              </Link>
              {userProfile && userProfile.projectsCount >= plans[userProfile.plan].maxProjects && (
                <p className="text-xs text-red-500 mt-1">
                  Proje limitinize ulaştınız.
                </p>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline">
              Çıkış Yap
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold mb-1">{project.name}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">/{project.slug}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>{project.stats?.totalVisits || 0} Görüntülenme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project.stats?.totalSignups || 0} Kayıt</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex justify-end items-center gap-2 border-t">
                  <Button variant="ghost" size="sm" onClick={() => handleShare(project.slug)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                  <Link href={`/dashboard/editor/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                  </Link>
                  <Link href={`/${project.slug}`} target="_blank">
                    <Button variant="default" size="sm">
                      Sayfaya Git
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
              <p>Henüz projeniz yok.</p>
              <Link href="/dashboard/editor">
                <Button className="mt-4">İlk Projeni Oluştur</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 