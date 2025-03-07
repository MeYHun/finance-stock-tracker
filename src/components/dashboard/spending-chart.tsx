"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface SpendingChartProps {
	className?: string;
}

const data = [
	{
		name: "Jan",
		total: 4136,
	},
	{
		name: "Feb",
		total: 4200,
	},
	{
		name: "Mar",
		total: 3800,
	},
	{
		name: "Apr",
		total: 4500,
	},
	{
		name: "May",
		total: 3900,
	},
	{
		name: "Jun",
		total: 5163,
	},
];

const currentMonth = data[data.length - 1];
const previousMonth = data[data.length - 2];
const monthlyChange =
	((currentMonth.total - previousMonth.total) / previousMonth.total) * 100;

export function SpendingChart({ className }: SpendingChartProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl font-semibold">
						Monthly Spending Overview
					</CardTitle>
					<Badge variant="outline" className="font-mono">
						<DollarSign className="h-3 w-3 mr-1" />
						YTD Avg: $3,500
					</Badge>
				</div>
				<div className="mt-4 space-y-2">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">
								Current Month
							</p>
							<p className="text-2xl font-bold">
								${currentMonth.total.toLocaleString()}
							</p>
						</div>
						<Badge
							variant={monthlyChange >= 0 ? "destructive" : "success"}
							className="flex items-center gap-1"
						>
							{monthlyChange >= 0 ? (
								<ArrowUp className="h-3 w-3" />
							) : (
								<ArrowDown className="h-3 w-3" />
							)}
							{Math.abs(monthlyChange).toFixed(1)}%
						</Badge>
					</div>
					<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-primary"
							initial={{ width: 0 }}
							animate={{
								width: `${(currentMonth.total / 7000) * 100}%`,
							}}
							transition={{ duration: 1, ease: "easeOut" }}
						/>
					</div>
					<p className="text-xs text-muted-foreground text-right">
						Monthly Budget: $7,000
					</p>
				</div>
			</CardHeader>
			<CardContent className="pl-2">
				<div className="h-[300px] w-full mt-4">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<defs>
								<linearGradient
									id="barGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0.8}
									/>
									<stop
										offset="100%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0.4}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="name"
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `$${value}`}
							/>
							<Tooltip
								cursor={{ fill: "hsl(var(--muted))" }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										return (
											<div className="rounded-lg border bg-background p-2 shadow-xl">
												<div className="flex items-center gap-2">
													<div className="h-1.5 w-1.5 rounded-full bg-primary" />
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														Total
													</span>
													<span className="font-bold text-sm ml-auto">
														${payload[0].value}
													</span>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Bar
								dataKey="total"
								fill="url(#barGradient)"
								radius={[4, 4, 0, 0]}
								maxBarSize={50}
							>
								{data.map((entry, index) => (
									<motion.rect
										key={`bar-${index}`}
										initial={{ y: 300, height: 0 }}
										animate={{ y: 0, height: entry.total / 20 }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
