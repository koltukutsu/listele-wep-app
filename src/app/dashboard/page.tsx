"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "~/lib/firebase";

type Project = {
  id: string;
  name: string;
  slug: string;
};

// Fake data for demo purposes
const FAKE_USER = {
  email: "demo@listele.io",
  uid: "fake-user-id",
};

const FAKE_PROJECTS: Project[] = [
  { id: "1", name: "Yapay Zeka Asistanım", slug: "ai-assistant" },
  { id: "2", name: "E-ticaret Platformu", slug: "ecommerce-platform" },
  { id: "3", name: "Mobil Uygulama Fikrim", slug: "mobile-app-idea" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FAKE DATA MODE
    const fetchUserData = async () => {
      // Simulate checking auth state
      const user = FAKE_USER;

      if (user) {
        // Simulate fetching projects from Firestore
        // const q = query(collection(db, "projects"), where("userId", "==", user.uid));
        // const querySnapshot = await getDocs(q);
        // const projectData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(FAKE_PROJECTS);
      }
      setLoading(false);
    };

    // Simulate a short delay
    const timer = setTimeout(fetchUserData, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // await signOut(auth);
    router.push("/");
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
          <h1 className="text-4xl font-bold">Projelerin</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{FAKE_USER.email}</p>
            <Link href="/dashboard/editor">
              <Button>Yeni Proje Oluştur</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Çıkış Yap
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                <p className="text-muted-foreground mb-4">/{project.slug}</p>
                <div className="flex justify-end gap-2">
                  <Link href={`/${project.slug}`} target="_blank">
                    <Button variant="outline" size="sm">Görüntüle</Button>
                  </Link>
                  <Link href={`/dashboard/editor/${project.id}`}>
                    <Button size="sm">Düzenle</Button>
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