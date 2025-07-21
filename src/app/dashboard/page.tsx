"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { getUserProjects, Project, getUserProfile, UserProfile, plans, deleteProject } from "~/lib/firestore";
import { BarChart, Users, Edit, Share2, ExternalLink, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { APP_URL } from '~/lib/config';


export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          const userProjects = await getUserProjects(currentUser.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Veriler yüklenirken bir hata oluştu.");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleShare = (slug: string) => {
    const url = `${APP_URL}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Proje linki panoya kopyalandı!');
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete);
      setProjects(projects.filter(p => p.id !== projectToDelete));
      toast.success("Proje başarıyla silindi.");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Proje silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p>Yükleniyor...</p>
      </main>
    );
  }

  const canCreateProject = userProfile && userProfile.projectsCount < plans[userProfile.plan].maxProjects;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projelerim</h1>
          <p className="text-muted-foreground">Mevcut projelerinizi yönetin ve yenilerini oluşturun.</p>
        </div>
        <div className="flex flex-col items-end">
            <Link href="/dashboard/editor/new">
              <Button disabled={!canCreateProject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Proje Oluştur
              </Button>
            </Link>
            {!canCreateProject && (
              <p className="text-sm text-red-500 mt-2 text-right">
                Proje limitinize ulaştınız. <Link href="/pricing" className="underline font-semibold">Plan Yükselt</Link>
              </p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold mb-1">{project.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
                <CardDescription>/{project.slug}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
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
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-3 flex justify-end items-center gap-2 border-t">
                 <Button variant="ghost" size="sm" onClick={() => handleShare(project.slug)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                <Link href={`/dashboard/leads/${project.id}`}>
                  <Button variant="ghost" size="sm">
                    <BarChart className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/editor/${project.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`${APP_URL}/${project.slug}`} target="_blank">
                  <Button variant="default" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setProjectToDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">İlk projenizi oluşturun</h3>
            <p className="text-muted-foreground mt-2 mb-4">Harika fikirlerinizi hayata geçirme zamanı.</p>
            <Link href="/dashboard/editor/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Proje Oluştur
              </Button>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projeyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Projeyi ve ilişkili tüm verileri kalıcı olarak silmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setProjectToDelete(null)}>İptal</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteProject}
            >
              {isDeleting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 