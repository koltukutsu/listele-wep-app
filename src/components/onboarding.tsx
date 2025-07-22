"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Confetti } from "./magicui/confetti";
import { Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";
import { app } from "~/lib/firebase";

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle user not signed in
        setLoading(false);
        return;
      }
      
      const token = await user.getIdToken();

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate project");
      }

      const data = await response.json();
      
      if (data.projectId) {
        setProjectId(data.projectId);
        setStep(3);
      } else {
        throw new Error("Project ID not found in response");
      }

    } catch (error) {
      console.error(error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3 && projectId) {
      setTimeout(() => {
        router.push(`/dashboard/editor/${projectId}`);
      }, 3000); // 3-second delay to enjoy the confetti
    }
  }, [step, projectId, router]);


  if (step === 1) {
    return (
      <div className="p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold">Welcome to listele.io</h1>
        <p className="mt-2 text-muted-foreground">Let's bring your idea to life.</p>
        <button onClick={() => setStep(2)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">
          Let's start
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-8 max-w-lg w-full">
        <h2 className="text-xl font-semibold">What is your amazing idea?</h2>
        <p className="mt-2 text-muted-foreground mb-4">Describe your project, and our AI founder will build the first version for you in seconds.</p>
        <textarea
          className="mt-2 w-full p-2 border rounded"
          placeholder="e.g., A subscription box for rare indoor plants."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <button onClick={handleGenerate} disabled={loading || !prompt} className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded flex items-center justify-center disabled:bg-gray-400">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Project"}
        </button>
      </div>
    );
  }
  
  if (step === 3) {
    return (
        <div className="text-center">
          <Confetti />
          <h2 className="text-2xl font-semibold">We're building your vision!</h2>
          <p className="mt-2 text-lg">Your new project is being created.</p>
          <p className="mt-4">Redirecting you to the editor...</p>
        </div>
    )
  }

  return null;
} 