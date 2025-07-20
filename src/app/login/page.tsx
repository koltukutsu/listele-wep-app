"use client";

import AuthForm from "~/components/auth-form";
import Link from "next/link";
import { Logo } from "~/components/svgs";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Logo />
          <span>Listele.io</span>
        </Link>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <AuthForm />
      </div>
    </main>
  );
} 