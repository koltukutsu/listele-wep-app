"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page simply redirects to the dynamic editor route for creating a new project.
export default function NewProjectRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/editor/new');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p>Creating new project...</p>
    </main>
  );
}
