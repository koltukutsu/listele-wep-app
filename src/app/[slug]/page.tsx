import Faq from "~/components/faq";
import Footer from "~/components/footer";
import Form from "~/components/form";
import Demo from "~/components/demo";
import Powered from "~/components/powered";
import { Confetti } from "~/components/magicui/confetti";
import { notFound } from "next/navigation";
import { getProjectBySlug, trackVisit } from "~/lib/firestore";
import { headers } from "next/headers";


type Props = {
  params: {
    slug: string;
  };
};



export default async function ProjectPage({ params }: Props) {
  // Fetch project from Firestore
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  // Track visit for analytics
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
    const referrer = headersList.get('referer') || undefined;

    // Note: This should ideally be done client-side to avoid blocking the page render
    // For now, we'll track it here but in production, consider moving to client-side
    await trackVisit(project.id, {
      ipAddress,
      userAgent,
      referrer
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Don't block page render if analytics fails
  }

  return (
    <main className="mx-auto max-w-screen-2xl w-full h-full flex-1 flex flex-col relative">
      <Confetti
        className="fixed inset-0 z-50 pointer-events-none"
        manualstart={true}
      />
      <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-20 text-center md:py-32">
        <h1 className="text-4xl font-bold md:text-5xl" style={{ color: project.template.textColor }}>
          {project.template.title}
        </h1>
        <h2 className="text-xl font-semibold mb-2" style={{ color: project.template.textColor }}>
          {project.template.subtitle}
        </h2>
        <p className="text-muted-foreground mb-8">
          {project.template.description}
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
