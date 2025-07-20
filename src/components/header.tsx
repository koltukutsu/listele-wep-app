"use client";

import Link from "next/link";
import { useScroll } from "~/hooks/use-scroll";
import { cn } from "~/lib/utils";
import { Logo } from "./svgs";
import { Button } from "./ui/button";

export default function Header() {
	const scrolled = useScroll();

	return (
		<header
			className={cn(
				"py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50",
				scrolled &&
					"bg-background/50 md:bg-transparent md:backdrop-blur-none backdrop-blur-sm",
			)}
		>
			<Link href="/" className="flex items-center gap-2">
				<Logo />
				<span className="font-bold">Listele.io</span>
			</Link>

			<div className="flex items-center gap-2">
				<Link href="/login">
					<Button variant="secondary">Giriş Yap</Button>
				</Link>
			</div>
		</header>
	);
}
