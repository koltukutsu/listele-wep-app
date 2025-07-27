"use client";

import AuthForm from "~/components/auth-form";
import Link from "next/link";
import { Logo } from "~/components/svgs";
import { Suspense } from "react";

function AuthFormWrapper() {
  return <AuthForm />;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Logo />
          <span>Listelee.io</span>
        </Link>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
          </div>
        }>
          <AuthFormWrapper />
        </Suspense>
      </div>
    </main>
  );
} 