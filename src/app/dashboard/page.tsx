"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { getUserProjects, Project, getUserProfile, UserProfile, deleteProject } from "~/lib/firestore";
import { getPlanBySlug } from "~/lib/plans";
import { BarChart, Users, Edit, Share2, ExternalLink, PlusCircle, Trash2, Eye } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { APP_URL } from '~/lib/config';
import { EnhancedSharingModal } from "~/components/enhanced-sharing-modal";
import { hasCompletedOnboarding, trackFeatureUsage } from "~/lib/analytics";
import { ReferralDashboard } from "~/components/referral-dashboard";


export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sharingProject, setSharingProject] = useState<Project | null>(null);

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

  const handleShare = async (project: Project) => {
    setSharingProject(project);
    await trackFeatureUsage('viral_sharing', 'used', { projectId: project.id });
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
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-slate-900">
        <p className="text-gray-800 dark:text-gray-200">Yükleniyor...</p>
      </main>
    );
  }

  const currentPlan = userProfile ? getPlanBySlug(userProfile.plan) : null;
  const canCreateProject = currentPlan && (currentPlan.name === "Sınırsız" || (userProfile && userProfile.projectsCount < (currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] as string) : 0)));

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projelerim</h1>
          <p className="text-muted-foreground dark:text-gray-400">Mevcut projelerinizi yönetin ve yenilerini oluşturun.</p>
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
            <Card key={project.id} className="flex flex-col bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold mb-1">{project.name}</CardTitle>
                  {project.status === 'published' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      Yayında!
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400">
                      Taslak
                    </span>
                  )}
                </div>
                <CardDescription className="dark:text-gray-400">/{project.slug}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                  <BarChart className="h-4 w-4" />
                  <span>{project.stats?.totalVisits || 0} Görüntülenme</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>
                      {currentPlan && currentPlan.name !== "Sınırsız" && project.stats?.totalSignups >= 50 ? '50+' : project.stats?.totalSignups || 0} Kayıt
                    </span>
                  </div>
                  <Link href={`/dashboard/leads/${project.id}`} passHref>
                    <Button size="sm" variant="default">Kayıtları Gör</Button>
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-slate-800/50 p-3 flex justify-end items-center gap-2 border-t dark:border-slate-700">
                 <Button variant="outline" size="sm" onClick={() => handleShare(project)}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Paylaş!
                  </Button>
                <Link href={`/dashboard/editor/${project.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`${APP_URL}/${project.slug}`} target="_blank">
                  <Button variant="ghost" size="sm">
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
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg border-gray-300 dark:border-slate-700">
            <h3 className="text-xl font-semibold">İlk projenizi oluşturun</h3>
            <p className="text-muted-foreground dark:text-gray-400 mt-2 mb-4">Harika fikirlerinizi hayata geçirme zamanı.</p>
            <Link href="/dashboard/editor/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Proje Oluştur
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            🌟 Başarılı Projelerden İlham Al!
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Listele.io ile hayata geçirilmiş projelerden öğren ve kendi başarı hikayeni oluştur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/showcase">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Eye className="w-5 h-5 mr-2" />
                Proje Galerisini Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Dashboard */}
      <section className="mt-12">
        <ReferralDashboard />
      </section>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Projeyi Sil</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
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

      <EnhancedSharingModal
        isOpen={!!sharingProject}
        onClose={() => setSharingProject(null)}
        projectUrl={sharingProject ? `${APP_URL}/${sharingProject.slug}` : ''}
        projectName={sharingProject?.name || ''}
      />
    </div>
  );
} 