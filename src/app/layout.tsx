"use client";

import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";
import { useEffect } from "react";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";
import { CookiesProvider } from "react-cookie";
import { siteConfig, structuredData } from "~/lib/metadata";

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
	useEffect(() => {
		// Set document title
		document.title = siteConfig.openGraph.title;
		
		// Set meta description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', siteConfig.description);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content = siteConfig.description;
			document.head.appendChild(meta);
		}
		
		// Add structured data
		const existingScript = document.querySelector('script[type="application/ld+json"]');
		if (!existingScript) {
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.textContent = JSON.stringify(structuredData);
			document.head.appendChild(script);
		}
		
		// Set canonical URL
		const existingCanonical = document.querySelector('link[rel="canonical"]');
		if (!existingCanonical) {
			const canonical = document.createElement('link');
			canonical.rel = 'canonical';
			canonical.href = siteConfig.openGraph.url;
			document.head.appendChild(canonical);
		}
	}, []);

	return (
		<html lang="tr" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#e5ff00" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body
				className={`${interTight.variable} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors`}
			>
				<CookiesProvider>
					<ThemeProvider 
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex flex-col min-h-screen">
							<Header />
							<main className="flex-1">
								{children}
							</main>
							<Toaster 
								position="top-right"
								toastOptions={{
									style: {
										background: 'hsl(var(--background))',
										color: 'hsl(var(--foreground))',
										border: '1px solid hsl(var(--border))',
									},
								}}
							/>
						</div>
					</ThemeProvider>
				</CookiesProvider>
			</body>
		</html>
	);
}
