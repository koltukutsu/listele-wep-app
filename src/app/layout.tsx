import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { metadata as appMetadata, viewport as appViewport } from "./metadata";
import { structuredData } from "~/lib/metadata";

import "./globals.css";
import ClientLayout from "./client-layout";

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = appMetadata;
export const viewport = appViewport;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={interTight.variable} suppressHydrationWarning>
			<head>
				{structuredData.map((data, index) => (
					<script
						key={index}
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(data),
						}}
					/>
				))}
			</head>
			<body className="font-inter-tight antialiased">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
