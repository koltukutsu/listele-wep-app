import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Listele.io — Fikrini Listele, İşini Test Et",
	description:
		"Türkiye’deki girişimciler için dakikalar içinde bekleme listesi sayfası kurup fikrini gerçek kullanıcılarla test etmeyi sağlayan no-code platform.",
};

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
				<ThemeProvider>
					<Header />
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
