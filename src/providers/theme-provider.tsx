"use client";

import { Attribute, ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
	children: ReactNode;
	attribute?: string;
	defaultTheme?: string;
	enableSystem?: boolean;
	disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
	children, 
	attribute = "class",
	defaultTheme = "system",
	enableSystem = true,
	disableTransitionOnChange = false,
	...props 
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute={attribute as Attribute}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
			disableTransitionOnChange={disableTransitionOnChange}
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
