"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Ödeme Başarısız Oldu</h1>
      <p className="text-gray-600 mb-8">Ödemenizi işleme alamadık. Lütfen tekrar deneyin.</p>
      <Link href="/pricing">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Fiyatlandırmaya Geri Dön
        </button>
      </Link>
    </div>
  );
} 