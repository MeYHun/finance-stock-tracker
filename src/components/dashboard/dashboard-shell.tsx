import * as React from "react";

interface DashboardShellProps {
	children: React.ReactNode;
	className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen flex-col gap-8">
			<main className="container grid items-center gap-8 pb-8 pt-6 md:py-8">
				{children}
			</main>
		</div>
	);
}
