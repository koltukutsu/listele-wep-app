import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

export default function Faq() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-10">
			<div className="flex flex-col items-center justify-center gap-2 max-w-md">
				<h2 className="sm:text-3xl text-2xl font-semibold text-foreground">
					Frequently Asked Questions
				</h2>
				<p className="sm:text-base text-sm text-muted-foreground text-center">
					Everything you need to know about Launch List. Find answers to common
					questions about our waitlist platform.
				</p>
			</div>
			<div className="w-full max-w-lg">
				<Accordion
					type="single"
					collapsible
					className="w-full flex flex-col gap-4"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger className="hover:no-underline">
							What is Launch List?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Launch List is a waitlist platform that helps entrepreneurs validate their ideas before building products. Create landing pages, collect customer interest, and build your audience before launch.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="hover:no-underline">
							How does the AI Founder Mode work?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Simply describe your idea in plain English, and our AI will automatically generate a professional waitlist page for you. No coding or design skills required.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="hover:no-underline">
							Is Launch List really free?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Yes! You can create up to 2 projects and collect up to 75 form submissions completely free. This gives you enough to validate your idea without any upfront costs.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger className="hover:no-underline">
							Can I use my own domain?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							Absolutely! You can easily connect your own domain to your waitlist page, giving your startup a professional appearance and building your brand from day one.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
