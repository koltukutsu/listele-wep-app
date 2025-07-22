"use client";

import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";
import { CookiesProvider } from "react-cookie";

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr" className="h-full" suppressHydrationWarning>
			<body
				className={`${interTight.variable} antialiased flex flex-col h-full`}
			>
				<CookiesProvider>
					<ThemeProvider>
						<Header />
						<Toaster />
						{children}
					</ThemeProvider>
				</CookiesProvider>
			</body>
		</html>
	);
}
