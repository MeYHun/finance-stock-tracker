"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
	icon: LucideIcon;
	title: string;
	subtitle?: string;
	className?: string;
}

export function AnimatedTitle({
	icon: Icon,
	title,
	subtitle,
	className,
}: AnimatedTitleProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={cn("space-y-1.5", className)}
		>
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
					<Icon className="h-4 w-4 text-primary" />
				</div>
				<motion.h2
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-2xl font-bold tracking-tight"
				>
					{title}
				</motion.h2>
			</div>
			{subtitle && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="text-sm text-muted-foreground"
				>
					{subtitle}
				</motion.p>
			)}
		</motion.div>
	);
}
