import type { Metadata } from "next";
import {
	ztBrosOskon,
	ztFormom,
	helveticaBold,
	ingenious,
	relationshipMelodrame,
} from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "Finance Tracker",
	description: "Track your investments and market trends",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${ztBrosOskon.variable} ${ztFormom.variable} ${helveticaBold.variable} ${ingenious.variable} ${relationshipMelodrame.variable}`}
			suppressHydrationWarning
		>
			<body
				className={`${ztBrosOskon.variable} ${ztFormom.variable} ${helveticaBold.variable} ${ingenious.variable} ${relationshipMelodrame.variable}`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
