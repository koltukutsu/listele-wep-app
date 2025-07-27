"use client";

import { Toaster } from "sonner";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";
import { CookiesProvider } from "react-cookie";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CookiesProvider>
			<ThemeProvider 
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
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
	);
} 