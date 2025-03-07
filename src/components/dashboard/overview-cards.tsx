"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	DollarSignIcon,
	CreditCardIcon,
	TrendingUp,
	TrendingDown,
	Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
	className?: string;
}

interface StatCardProps {
	title: string;
	value: string;
	change: number;
	icon: React.ReactNode;
	changeText: string;
	index: number;
}

function StatCard({
	title,
	value,
	change,
	icon,
	changeText,
	index,
}: StatCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Card className="relative overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
					<div
						className={cn(
							"rounded-full p-2",
							change >= 0
								? "bg-green-500/10 text-green-500"
								: "bg-red-500/10 text-red-500"
						)}
					>
						{icon}
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold font-mono">{value}</div>
					<div className="flex items-center gap-2 mt-1">
						<div
							className={cn(
								"flex items-center gap-1 text-xs rounded-full px-2 py-0.5",
								change >= 0
									? "text-green-500 bg-green-500/10"
									: "text-red-500 bg-red-500/10"
							)}
						>
							{change >= 0 ? (
								<TrendingUp className="h-3 w-3" />
							) : (
								<TrendingDown className="h-3 w-3" />
							)}
							{Math.abs(change)}%
						</div>
						<p className="text-xs text-muted-foreground">{changeText}</p>
					</div>
				</CardContent>
				<div
					className={cn(
						"absolute bottom-0 left-0 h-1 w-full",
						change >= 0 ? "bg-green-500/10" : "bg-red-500/10"
					)}
				>
					<motion.div
						className={cn(
							"h-full",
							change >= 0 ? "bg-green-500" : "bg-red-500"
						)}
						initial={{ width: 0 }}
						animate={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
						transition={{ duration: 1, ease: "easeOut" }}
					/>
				</div>
			</Card>
		</motion.div>
	);
}

export function OverviewCards({ className }: OverviewCardsProps) {
	const stats = [
		{
			title: "Total Balance",
			value: "$45,231.89",
			change: 20.1,
			icon: <Wallet className="h-4 w-4" />,
			changeText: "from last month",
		},
		{
			title: "Monthly Spending",
			value: "$3,891.23",
			change: -4,
			icon: <ArrowDownIcon className="h-4 w-4" />,
			changeText: "from last month",
		},
		{
			title: "Monthly Income",
			value: "$6,593.21",
			change: 8,
			icon: <ArrowUpIcon className="h-4 w-4" />,
			changeText: "from last month",
		},
		{
			title: "Credit Utilization",
			value: "28%",
			change: -5,
			icon: <CreditCardIcon className="h-4 w-4" />,
			changeText: "Good standing",
		},
	];

	return (
		<div className={`grid gap-4 md:grid-cols-2 ${className}`}>
			{stats.map((stat, index) => (
				<StatCard key={stat.title} {...stat} index={index} />
			))}
		</div>
	);
}
