import type { SVGProps } from "react";

export default function Logo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="logo"
			role="img"
			{...props}
		>
			<rect width="48" height="48" rx="14" fill="#D8FF00" />
			<path
				d="M12 24L20 32L36 16"
				stroke="#000000"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}
