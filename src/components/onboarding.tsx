"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Confetti } from "./magicui/confetti";
import { Loader2 } from "lucide-react";
import { auth } from "~/lib/firebase";

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const router = useRouter();

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
      <div className="p-8 max-w-lg w-full text-center bg-white dark:bg-slate-800 border border-lime-200 dark:border-slate-700 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to Launch List</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">It's time to bring your idea to life.</p>
        <button 
          onClick={() => setStep(2)} 
          className="mt-4 px-6 py-3 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold rounded-lg transition-all hover:shadow-lg transform hover:scale-105"
        >
          Let's Get Started
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-8 max-w-lg w-full bg-white dark:bg-slate-800 border border-lime-200 dark:border-slate-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">What's Your Great Idea?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 mb-4">Describe your project, and our AI founder will create the first version for you in minutes.</p>
        <textarea
          className="mt-2 w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
          placeholder="e.g., Subscription box for rare indoor plants."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading || !prompt} 
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-black font-semibold rounded-lg flex items-center justify-center transition-all hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:shadow-none"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Project"}
        </button>
      </div>
    );
  }
  
  if (step === 3) {
    return (
        <div className="text-center text-gray-900 dark:text-gray-100">
          <Confetti />
          <h2 className="text-2xl font-semibold">Your Vision is Coming to Life!</h2>
          <p className="mt-2 text-lg">Your new project is being created.</p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to editor...</p>
        </div>
    )
  }

  return null;
} 