import Faq from "~/components/faq";
import Footer from "~/components/footer";
import Form from "~/components/form";
import Demo from "~/components/demo";
import Powered from "~/components/powered";
import { Confetti } from "~/components/magicui/confetti";
import { notFound } from "next/navigation";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "~/lib/firebase";


type Props = {
  params: {
    slug: string;
  };
};

const getFakeProjectBySlug = (slug: string) => {
  const projects: Record<string, { id: string; name: string }> = {
    "ai-assistant": { id: "1", name: "Yapay Zeka Asistanım" },
    "ecommerce-platform": { id: "2", name: "E-ticaret Platformu" },
    "mobile-app-idea": { id: "3", name: "Mobil Uygulama Fikrim" },
  };
  return projects[slug];
};

export default function ProjectPage({ params }: Props) {
  // FAKE DATA MODE
  const project = getFakeProjectBySlug(params.slug);
  
  // Real logic would be:
  // const q = query(collection(db, "projects"), where("slug", "==", params.slug), limit(1));
  // const querySnapshot = await getDocs(q);
  // const projectDoc = querySnapshot.docs[0];
  // const project = projectDoc ? { id: projectDoc.id, ...projectDoc.data() } : null;

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-screen-2xl w-full h-full flex-1 flex flex-col relative">
      <Confetti
        className="fixed inset-0 z-50 pointer-events-none"
        manualstart={true}
      />
      <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-20 text-center md:py-32">
        <h1 className="text-4xl font-bold md:text-5xl">{project.name}</h1>
        <p className="text-muted-foreground">
          Dakikalar içinde bekleme listesi sayfası oluştur, talebi ölç.
        </p>
        <Form projectId={project.id} />
      </section>
      <Demo videoSrc="/demo.mp4" thumbnailSrc="/demo.png" />
      <Powered />
      <Faq />
      <Footer />
    </main>
  );
}
