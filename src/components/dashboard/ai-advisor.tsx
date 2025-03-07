"use client";

import { motion } from "framer-motion";
import {
	Brain,
	TrendingUp,
	LineChart,
	PieChart,
	Wallet,
	ArrowUpRight,
	ArrowDownRight,
	Sparkles,
	Zap,
	AlertTriangle,
	CheckCircle2,
	HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface AIAdvisorProps {
	className?: string;
}

type Severity = "high" | "medium" | "low";
type ActionType = "buy" | "sell" | "hold";
type AssetType = "stock" | "crypto" | "etf";
type TrendType = "up" | "down" | "stable";

interface Insight {
	id: string;
	title: string;
	message: string;
	impact: number;
	severity: Severity;
	category: "spending" | "saving" | "investment";
	timestamp: string;
}

interface PortfolioSuggestion {
	id: string;
	asset: string;
	type: AssetType;
	action: ActionType;
	reason: string;
	impact: {
		potential: number;
		risk: Severity;
	};
}

interface SpendingPattern {
	category: string;
	currentSpending: number;
	averageSpending: number;
	trend: TrendType;
	percentage: number;
}

const mockInsights: Insight[] = [
	{
		id: "1",
		title: "Unusual Spending Pattern Detected",
		message:
			"Your dining expenses have increased by 45% this month compared to your 3-month average.",
		impact: 45,
		severity: "high",
		category: "spending",
		timestamp: "2024-03-20",
	},
	{
		id: "2",
		title: "Savings Opportunity",
		message:
			"Setting up automatic transfers could help you save an additional $300 monthly.",
		impact: 30,
		severity: "medium",
		category: "saving",
		timestamp: "2024-03-19",
	},
	{
		id: "3",
		title: "Investment Recommendation",
		message:
			"Based on your risk profile, consider diversifying into tech sector ETFs.",
		impact: 25,
		severity: "low",
		category: "investment",
		timestamp: "2024-03-18",
	},
];

const mockSuggestions: PortfolioSuggestion[] = [
	{
		id: "1",
		asset: "Tech Growth ETF",
		type: "etf",
		action: "buy",
		reason: "Strong sector performance and aligned with your risk profile",
		impact: {
			potential: 12,
			risk: "medium",
		},
	},
	{
		id: "2",
		asset: "Green Energy Stock",
		type: "stock",
		action: "buy",
		reason: "Emerging sector with high growth potential",
		impact: {
			potential: 15,
			risk: "high",
		},
	},
	{
		id: "3",
		asset: "Stable Dividend Stock",
		type: "stock",
		action: "hold",
		reason: "Consistent performance and regular dividend payments",
		impact: {
			potential: 8,
			risk: "low",
		},
	},
];

const mockPatterns: SpendingPattern[] = [
	{
		category: "Dining",
		currentSpending: 450,
		averageSpending: 310,
		trend: "up",
		percentage: 45,
	},
	{
		category: "Entertainment",
		currentSpending: 200,
		averageSpending: 235,
		trend: "down",
		percentage: 15,
	},
	{
		category: "Shopping",
		currentSpending: 350,
		averageSpending: 350,
		trend: "stable",
		percentage: 20,
	},
];

export function AIAdvisor({ className }: AIAdvisorProps) {
	const [insights, setInsights] = useState<Insight[]>(mockInsights);
	const [portfolioSuggestions, setPortfolioSuggestions] =
		useState<PortfolioSuggestion[]>(mockSuggestions);
	const [spendingPatterns, setSpendingPatterns] =
		useState<SpendingPattern[]>(mockPatterns);
	const [activeInsight, setActiveInsight] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0 },
	};

	const pulseVariants = {
		pulse: {
			scale: [1, 1.05, 1],
			opacity: [0.8, 1, 0.8],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	const getBadgeVariant = (action: ActionType) => {
		switch (action) {
			case "buy":
				return "default";
			case "sell":
				return "destructive";
			case "hold":
				return "secondary";
			default:
				return "default";
		}
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className={`space-y-6 ${className}`}
		>
			{/* Header Section */}
			<div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 backdrop-blur-sm">
				<motion.div
					className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)]"
					animate={{
						opacity: [0.1, 0.15, 0.1],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<div className="relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="flex items-center gap-3 mb-4"
					>
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
							<div className="relative bg-primary/10 p-2.5 rounded-xl border border-primary/20">
								<Brain className="h-8 w-8 text-primary" />
							</div>
						</div>
						<div>
							<h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
								AI Financial Advisor
							</h2>
							<p className="text-sm text-muted-foreground">
								Personalized insights and recommendations for your
								financial growth
							</p>
						</div>
					</motion.div>

					<motion.div
						variants={pulseVariants}
						animate="pulse"
						className="grid gap-4 md:grid-cols-3 mt-6"
					>
						<Card className="p-4 backdrop-blur-sm bg-background/50 border-primary/20">
							<div className="flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-primary" />
								<span className="font-medium">Smart Insights</span>
							</div>
							<p className="text-sm text-muted-foreground mt-2">
								AI-powered analysis of your financial patterns
							</p>
						</Card>
						<Card className="p-4 backdrop-blur-sm bg-background/50 border-primary/20">
							<div className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5 text-primary" />
								<span className="font-medium">
									Portfolio Optimization
								</span>
							</div>
							<p className="text-sm text-muted-foreground mt-2">
								Data-driven investment suggestions
							</p>
						</Card>
						<Card className="p-4 backdrop-blur-sm bg-background/50 border-primary/20">
							<div className="flex items-center gap-2">
								<Zap className="h-5 w-5 text-primary" />
								<span className="font-medium">
									Real-time Monitoring
								</span>
							</div>
							<p className="text-sm text-muted-foreground mt-2">
								Continuous analysis of your financial health
							</p>
						</Card>
					</motion.div>
				</div>
			</div>

			{/* Key Insights Section */}
			<motion.div
				variants={itemVariants}
				className="grid gap-6 md:grid-cols-2"
			>
				<Card className="p-6 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
					<div className="relative">
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Brain className="h-5 w-5 text-primary" />
							Key Insights
						</h3>
						<div className="space-y-4">
							{insights.map((insight, index) => (
								<motion.div
									key={insight.timestamp}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02 }}
									className="p-4 rounded-lg bg-card border border-primary/10 hover:border-primary/20 transition-all cursor-pointer"
									onClick={() => setActiveInsight(insight.timestamp)}
								>
									<div className="flex items-start justify-between">
										<div>
											<div className="flex items-center gap-2 mb-2">
												<h4 className="font-medium">
													{insight.title}
												</h4>
												<Badge
													variant={
														insight.severity === "high"
															? "destructive"
															: insight.severity === "medium"
															? "secondary"
															: "outline"
													}
												>
													{insight.severity}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground">
												{insight.message}
											</p>
										</div>
										<div className="flex items-center gap-1 text-sm">
											{insight.impact}%
											{insight.impact > 0 ? (
												<ArrowUpRight className="h-4 w-4 text-destructive" />
											) : (
												<ArrowDownRight className="h-4 w-4 text-green-500" />
											)}
										</div>
									</div>
									{activeInsight === insight.timestamp && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											className="mt-4 pt-4 border-t"
										>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													Impact Score
												</span>
												<Progress
													value={insight.impact}
													className="w-32"
												/>
											</div>
										</motion.div>
									)}
								</motion.div>
							))}
						</div>
					</div>
				</Card>

				<Card className="p-6 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent" />
					<div className="relative">
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<PieChart className="h-5 w-5 text-primary" />
							Spending Patterns
						</h3>
						<div className="space-y-4">
							{spendingPatterns.map((pattern, index) => (
								<motion.div
									key={pattern.category}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="flex items-center justify-between p-4 rounded-lg bg-card border border-primary/10"
								>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-medium">
												{pattern.category}
											</span>
											{pattern.trend === "up" ? (
												<ArrowUpRight className="h-4 w-4 text-destructive" />
											) : pattern.trend === "down" ? (
												<ArrowDownRight className="h-4 w-4 text-green-500" />
											) : (
												<LineChart className="h-4 w-4 text-primary" />
											)}
										</div>
										<span className="text-sm text-muted-foreground">
											${pattern.currentSpending.toFixed(2)}
										</span>
									</div>
									<div className="flex items-center gap-4">
										<Progress
											value={pattern.percentage}
											className="w-24"
										/>
										<span className="text-sm font-medium">
											{pattern.percentage}%
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Portfolio Suggestions */}
			<motion.div variants={itemVariants} className="grid gap-4">
				<Card className="p-6 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
					<div className="relative">
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Wallet className="h-5 w-5 text-primary" />
							Portfolio Suggestions
						</h3>
						<div className="grid gap-4 md:grid-cols-3">
							{portfolioSuggestions.map((suggestion, index) => (
								<motion.div
									key={suggestion.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="p-4 rounded-lg bg-card border border-primary/10 hover:border-primary/20 transition-all"
								>
									<div className="flex items-start justify-between mb-2">
										<h4 className="font-medium">
											{suggestion.asset}
										</h4>
										<Badge
											variant={getBadgeVariant(suggestion.action)}
										>
											{suggestion.action}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-3">
										{suggestion.reason}
									</p>
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-1">
											<TrendingUp className="h-4 w-4 text-primary" />
											<span>
												{suggestion.impact.potential}% potential
											</span>
										</div>
										<Badge
											variant={
												suggestion.impact.risk === "high"
													? "destructive"
													: suggestion.impact.risk === "medium"
													? "secondary"
													: "outline"
											}
										>
											{suggestion.impact.risk} risk
										</Badge>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Action Buttons */}
			<motion.div variants={itemVariants} className="flex justify-end gap-4">
				<Button
					variant="outline"
					className="gap-2"
					onClick={() => setShowDetails(!showDetails)}
				>
					<HelpCircle className="h-4 w-4" />
					Learn More
				</Button>
				<Button
					className="gap-2"
					onClick={() => {
						setIsLoading(true);
						// Replace with actual fetchInsights function
					}}
				>
					<Sparkles className="h-4 w-4" />
					{isLoading ? "Analyzing..." : "Get New Insights"}
				</Button>
			</motion.div>
		</motion.div>
	);
}
