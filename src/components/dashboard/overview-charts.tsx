"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { PieChart as PieChartIcon, Wallet, CreditCard } from "lucide-react";

interface OverviewChartsProps {
	className?: string;
}

const ASSET_ALLOCATION_DATA = [
	{ name: "Stocks", value: 45000, color: "hsl(var(--primary))" },
	{ name: "Crypto", value: 15000, color: "hsl(var(--destructive))" },
	{ name: "Cash", value: 25000, color: "hsl(var(--secondary))" },
	{ name: "Real Estate", value: 35000, color: "hsl(var(--accent))" },
];

const SPENDING_DISTRIBUTION_DATA = [
	{ name: "Housing", value: 2500, color: "#2563eb" },
	{ name: "Food", value: 800, color: "#16a34a" },
	{ name: "Transport", value: 400, color: "#ca8a04" },
	{ name: "Entertainment", value: 300, color: "#9333ea" },
	{ name: "Utilities", value: 200, color: "#dc2626" },
	{ name: "Others", value: 500, color: "#64748b" },
];

const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-lg border bg-background p-3 shadow-xl">
				<p className="text-sm font-medium">{payload[0].name}</p>
				<div className="mt-1 flex items-baseline gap-2">
					<span className="text-sm font-mono">
						${payload[0].value.toLocaleString()}
					</span>
					<span className="text-xs text-muted-foreground">
						(
						{(
							(payload[0].value / payload[0].payload.total) *
							100
						).toFixed(1)}
						%)
					</span>
				</div>
			</div>
		);
	}
	return null;
};

const CustomLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	value,
	name,
}: any) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.85;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);
	const sin = Math.sin(-midAngle * RADIAN);
	const cos = Math.cos(-midAngle * RADIAN);
	const textAnchor = cos >= 0 ? "start" : "end";
	const labelLine = {
		x1: cx + (innerRadius + 2) * cos,
		y1: cy + (innerRadius + 2) * sin,
		x2: cx + (radius - 10) * cos,
		y2: cy + (radius - 10) * sin,
	};

	// Only show label if percentage is greater than 5%
	if (percent < 0.05) return null;

	return (
		<g>
			{/* Label line */}
			<path
				d={`M${labelLine.x1},${labelLine.y1}L${labelLine.x2},${labelLine.y2}L${x},${y}`}
				stroke="hsl(var(--muted-foreground))"
				strokeWidth={0.5}
				fill="none"
				opacity={0.5}
			/>
			{/* Background for better readability */}
			<rect
				x={textAnchor === "start" ? x - 2 : x - 28}
				y={y - 9}
				width="30"
				height="18"
				rx="4"
				fill="hsl(var(--background))"
				className="stroke-border"
				strokeWidth={1}
			/>
			{/* Percentage text */}
			<text
				x={x}
				y={y}
				fill="hsl(var(--foreground))"
				textAnchor={textAnchor}
				dominantBaseline="central"
				className="text-[11px] font-medium"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		</g>
	);
};

export function OverviewCharts({ className }: OverviewChartsProps) {
	// Calculate totals
	const assetTotal = ASSET_ALLOCATION_DATA.reduce(
		(sum, item) => sum + item.value,
		0
	);
	const spendingTotal = SPENDING_DISTRIBUTION_DATA.reduce(
		(sum, item) => sum + item.value,
		0
	);

	// Add total to each data item for percentage calculation
	const assetData = ASSET_ALLOCATION_DATA.map((item) => ({
		...item,
		total: assetTotal,
	}));
	const spendingData = SPENDING_DISTRIBUTION_DATA.map((item) => ({
		...item,
		total: spendingTotal,
	}));

	return (
		<div className={cn("space-y-8", className)}>
			<AnimatedTitle
				icon={PieChartIcon}
				title="Financial Overview"
				subtitle="Your asset allocation and spending distribution"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="group"
				>
					<Card className="overflow-hidden transition-colors hover:bg-muted/50">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Wallet className="h-5 w-5 text-primary" />
									<span>Asset Allocation</span>
								</div>
								<motion.span
									className="text-sm font-normal text-muted-foreground"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									Total: ${assetTotal.toLocaleString()}
								</motion.span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.div
								className="h-[320px]"
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={assetData}
											cx="50%"
											cy="45%"
											labelLine={false}
											label={CustomLabel}
											outerRadius={85}
											innerRadius={50}
											paddingAngle={2}
											dataKey="value"
										>
											{assetData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.color}
													className="stroke-background hover:opacity-80"
													strokeWidth={2}
												/>
											))}
										</Pie>
										<Tooltip content={<CustomTooltip />} />
										<Legend
											verticalAlign="bottom"
											height={48}
											content={({ payload }) => (
												<div className="mt-6 grid grid-cols-2 gap-3 px-2">
													{payload?.map((entry: any, index) => (
														<div
															key={`legend-${index}`}
															className="flex items-center gap-2 text-[11px]"
														>
															<div
																className="h-2.5 w-2.5 rounded-full"
																style={{
																	backgroundColor: entry.color,
																}}
															/>
															<span className="truncate">
																{entry.value}
															</span>
															<span className="ml-auto font-mono text-muted-foreground">
																$
																{assetData[
																	index
																].value.toLocaleString()}
															</span>
														</div>
													))}
												</div>
											)}
										/>
									</PieChart>
								</ResponsiveContainer>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="group"
				>
					<Card className="overflow-hidden transition-colors hover:bg-muted/50">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CreditCard className="h-5 w-5 text-primary" />
									<span>Monthly Spending</span>
								</div>
								<motion.span
									className="text-sm font-normal text-muted-foreground"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									Total: ${spendingTotal.toLocaleString()}
								</motion.span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.div
								className="h-[320px]"
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={spendingData}
											cx="50%"
											cy="45%"
											labelLine={false}
											label={CustomLabel}
											outerRadius={85}
											innerRadius={50}
											paddingAngle={2}
											dataKey="value"
										>
											{spendingData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.color}
													className="stroke-background hover:opacity-80"
													strokeWidth={2}
												/>
											))}
										</Pie>
										<Tooltip content={<CustomTooltip />} />
										<Legend
											verticalAlign="bottom"
											height={48}
											content={({ payload }) => (
												<div className="mt-6 grid grid-cols-2 gap-3 px-2">
													{payload?.map((entry: any, index) => (
														<div
															key={`legend-${index}`}
															className="flex items-center gap-2 text-[11px]"
														>
															<div
																className="h-2.5 w-2.5 rounded-full"
																style={{
																	backgroundColor: entry.color,
																}}
															/>
															<span className="truncate">
																{entry.value}
															</span>
															<span className="ml-auto font-mono text-muted-foreground">
																$
																{spendingData[
																	index
																].value.toLocaleString()}
															</span>
														</div>
													))}
												</div>
											)}
										/>
									</PieChart>
								</ResponsiveContainer>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
