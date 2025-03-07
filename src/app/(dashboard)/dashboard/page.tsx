"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { MarketAnalysis } from "@/components/dashboard/market-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
	LineChart,
	Wallet,
	BarChart3,
	TrendingUp,
	History,
	Settings,
	BarChart4,
	Brain,
	Sparkles,
	Zap,
	ArrowRight,
} from "lucide-react";
import { TrackedAssets } from "@/components/dashboard/tracked-assets";
import { AIAdvisor } from "@/components/dashboard/ai-advisor";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const tabItems = [
	{ value: "overview", icon: LineChart, label: "Overview" },
	{ value: "market", icon: TrendingUp, label: "Market" },
	{ value: "markets", icon: BarChart4, label: "Markets" },
	{ value: "advisor", icon: Brain, label: "AI Advisor" },
	{ value: "spending", icon: BarChart3, label: "Spending" },
	{ value: "portfolio", icon: Wallet, label: "Portfolio" },
	{ value: "history", icon: History, label: "History" },
	{ value: "settings", icon: Settings, label: "Settings" },
];

const glowVariants = {
	initial: { opacity: 0, scale: 0.8 },
	animate: {
		opacity: [0.4, 1, 0.4],
		scale: [0.8, 1, 0.8],
		transition: {
			duration: 3,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
} as const;

const floatingVariants = {
	initial: { y: 0 },
	animate: {
		y: [-10, 10],
		transition: {
			duration: 4,
			repeat: Infinity,
			repeatType: "reverse" as const,
			ease: "easeInOut",
		},
	},
} as const;

export default function DashboardPage() {
	const [activeTab, setActiveTab] = React.useState("overview");
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<DashboardShell className="overflow-x-hidden">
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="relative min-h-[300px] flex items-center justify-center py-12"
					>
						{/* Background Effects */}
						<div className="absolute inset-0 overflow-hidden">
							<motion.div
								className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_60%)]"
								animate={{
									opacity: [0.1, 0.15, 0.1],
									scale: [0.8, 1, 0.8],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
							<div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,var(--primary)_50%,transparent_100%)] opacity-[0.02]" />

							{/* Animated Particles */}
							{[...Array(8)].map((_, i) => (
								<motion.div
									key={i}
									className="absolute w-1 h-1 bg-primary rounded-full"
									initial={{
										x: Math.random() * window.innerWidth,
										y: Math.random() * 300,
										opacity: 0,
									}}
									animate={{
										y: Math.random() * -100,
										opacity: [0, 0.8, 0],
										scale: [1, 1.5, 1],
									}}
									transition={{
										duration: 3,
										repeat: Infinity,
										ease: "easeInOut",
										delay: i * 0.3,
									}}
								/>
							))}
						</div>

						{/* Main Content */}
						<div className="relative z-10 max-w-5xl mx-auto px-4">
							<motion.div
								initial={{ y: 0 }}
								animate={{ y: [-10, 10] }}
								transition={{
									duration: 4,
									repeat: Infinity,
									repeatType: "reverse",
									ease: "easeInOut",
								}}
								className="text-center space-y-6"
							>
								{/* Top Badge */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full"
								>
									<Sparkles className="w-4 h-4 text-primary animate-pulse" />
									<span className="text-sm font-medium text-primary">
										Pro Dashboard 2.0
									</span>
									<span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
								</motion.div>

								{/* Title */}
								<div className="relative">
									<motion.h1
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3 }}
										className="text-6xl font-bold tracking-tight modern-gradient-text"
									>
										Financial Dashboard
									</motion.h1>
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: "100%" }}
										transition={{ delay: 0.5, duration: 0.8 }}
										className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
									/>
								</div>

								{/* Description */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="flex flex-col items-center gap-4"
								>
									<p className="text-xl text-muted-foreground max-w-3xl">
										Your complete financial overview with{" "}
										<motion.span
											animate={{ opacity: [0.5, 1, 0.5] }}
											transition={{ duration: 2, repeat: Infinity }}
											className="text-primary font-medium inline-flex items-center gap-1"
										>
											<Zap className="w-5 h-5" />
											AI-powered
										</motion.span>{" "}
										insights and real-time market analysis
									</p>

									{/* Feature Tags */}
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.6 }}
										className="flex flex-wrap justify-center gap-2 mt-2"
									>
										{[
											"Real-time Updates",
											"Smart Analytics",
											"Portfolio Tracking",
											"AI Insights",
										].map((tag, i) => (
											<motion.span
												key={tag}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.7 + i * 0.1 }}
												className="px-3 py-1 rounded-full text-sm bg-primary/5 text-primary border border-primary/10 backdrop-blur-sm"
											>
												{tag}
											</motion.span>
										))}
									</motion.div>
								</motion.div>
							</motion.div>
						</div>

						{/* Decorative Elements */}
						<div className="absolute inset-0 pointer-events-none overflow-hidden">
							{[...Array(3)].map((_, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{
										opacity: [0.4, 1, 0.4],
										scale: [0.8, 1, 0.8],
									}}
									transition={{
										duration: 3,
										repeat: Infinity,
										ease: "easeInOut",
										delay: i * 0.5,
									}}
									className="absolute rounded-full blur-3xl"
									style={{
										background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
										width: `${200 + i * 100}px`,
										height: `${200 + i * 100}px`,
										left: `${20 + i * 30}%`,
										top: `${10 + i * 20}%`,
										opacity: 0.1,
									}}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4 mt-8"
			>
				<TabsList className="grid w-full grid-cols-8 relative">
					<motion.div
						className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg opacity-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						transition={{ duration: 1 }}
					/>
					{tabItems.map((item, index) => (
						<TabsTrigger
							key={item.value}
							value={item.value}
							className="relative flex items-center gap-2 transition-all"
							onClick={() => setActiveTab(item.value)}
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: "spring",
									duration: 0.5,
									delay: index * 0.1,
								}}
								className="flex items-center gap-2"
							>
								<item.icon className="h-4 w-4" />
								<span>{item.label}</span>
							</motion.div>
							{activeTab === item.value && (
								<motion.div
									className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
									layoutId="activeTab"
									transition={{
										type: "spring",
										stiffness: 380,
										damping: 30,
									}}
								/>
							)}
						</TabsTrigger>
					))}
				</TabsList>

				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						duration: 0.4,
						type: "spring",
						stiffness: 300,
						damping: 25,
					}}
				>
					<TabsContent value="overview" className="space-y-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="col-span-4"
							>
								<OverviewCards className="hover:scale-[1.02] transform transition-transform duration-300" />
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="col-span-3"
							>
								<SpendingChart className="hover:scale-[1.02] transform transition-transform duration-300" />
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OverviewCharts />
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							<RecentTransactions />
						</motion.div>
					</TabsContent>

					<TabsContent value="market" className="space-y-4">
						<div className="grid gap-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								whileHover={{ scale: 1.01 }}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg -z-10" />
								<Card className="p-4 bg-background/50 backdrop-blur-sm">
									<TrackedAssets type="stock" title="Stocks" />
								</Card>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								whileHover={{ scale: 1.01 }}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg -z-10" />
								<Card className="p-4 bg-background/50 backdrop-blur-sm">
									<TrackedAssets
										type="crypto"
										title="Cryptocurrencies"
									/>
								</Card>
							</motion.div>
						</div>
					</TabsContent>

					<TabsContent value="markets" className="space-y-4">
						<div className="grid gap-4">
							<Card className="p-6 overflow-hidden relative">
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)] opacity-10" />
								<div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary)_0%,transparent_10%,transparent_90%,var(--primary)_100%)] opacity-5" />
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className="relative"
								>
									<div className="flex items-center justify-between mb-8">
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.2 }}
											className="flex items-center gap-3"
										>
											<div className="relative">
												<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
												<div className="relative bg-primary/10 p-2.5 rounded-xl border border-primary/20 backdrop-blur-sm">
													<TrendingUp className="h-6 w-6 text-primary" />
												</div>
											</div>
											<div>
												<h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
													Top Recommendations
												</h2>
												<p className="text-sm text-muted-foreground">
													AI-powered market analysis and
													predictions
												</p>
											</div>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.3 }}
											className="hidden md:flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 backdrop-blur-sm"
										>
											<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
											<span className="text-sm text-primary">
												Live Updates
											</span>
										</motion.div>
									</div>

									<div className="grid gap-6 md:grid-cols-2 mb-8">
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 }}
											className="space-y-4"
										>
											<div className="flex items-center gap-2 mb-4">
												<div className="bg-primary/10 p-1.5 rounded-lg">
													<BarChart4 className="h-5 w-5 text-primary" />
												</div>
												<h3 className="text-lg font-semibold text-primary">
													Stocks to Watch
												</h3>
											</div>
											<div className="grid gap-4">
												<motion.div
													initial={{ scale: 0.95, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{
														duration: 0.5,
														delay: 0.1,
													}}
													className="group"
												>
													<Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
														<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
														<div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 group-hover:opacity-100 transition-opacity" />
														<div className="relative p-4">
															<MarketAnalysis
																symbol="NVDA"
																type="stock"
																compact
															/>
														</div>
													</Card>
												</motion.div>
												<motion.div
													initial={{ scale: 0.95, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{
														duration: 0.5,
														delay: 0.2,
													}}
													className="group"
												>
													<Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
														<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
														<div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 group-hover:opacity-100 transition-opacity" />
														<div className="relative p-4">
															<MarketAnalysis
																symbol="AMD"
																type="stock"
																compact
															/>
														</div>
													</Card>
												</motion.div>
											</div>
										</motion.div>

										<motion.div
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 }}
											className="space-y-4"
										>
											<div className="flex items-center gap-2 mb-4">
												<div className="bg-primary/10 p-1.5 rounded-lg">
													<Wallet className="h-5 w-5 text-primary" />
												</div>
												<h3 className="text-lg font-semibold text-primary">
													Crypto Opportunities
												</h3>
											</div>
											<div className="grid gap-4">
												<motion.div
													initial={{ scale: 0.95, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{
														duration: 0.5,
														delay: 0.3,
													}}
													className="group"
												>
													<Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
														<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
														<div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 group-hover:opacity-100 transition-opacity" />
														<div className="relative p-4">
															<MarketAnalysis
																symbol="ethereum"
																type="crypto"
																compact
															/>
														</div>
													</Card>
												</motion.div>
												<motion.div
													initial={{ scale: 0.95, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{
														duration: 0.5,
														delay: 0.4,
													}}
													className="group"
												>
													<Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
														<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
														<div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 group-hover:opacity-100 transition-opacity" />
														<div className="relative p-4">
															<MarketAnalysis
																symbol="solana"
																type="crypto"
																compact
															/>
														</div>
													</Card>
												</motion.div>
											</div>
										</motion.div>
									</div>
								</motion.div>
								<h2 className="text-xl font-semibold mb-4">
									Popular Stocks
								</h2>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									<MarketAnalysis symbol="AAPL" type="stock" compact />
									<MarketAnalysis symbol="MSFT" type="stock" compact />
									<MarketAnalysis symbol="NVDA" type="stock" compact />
									<MarketAnalysis
										symbol="GOOGL"
										type="stock"
										compact
									/>
									<MarketAnalysis symbol="AMZN" type="stock" compact />
									<MarketAnalysis symbol="TSLA" type="stock" compact />
									<MarketAnalysis symbol="META" type="stock" compact />
									<MarketAnalysis symbol="AMD" type="stock" compact />
									<MarketAnalysis symbol="NFLX" type="stock" compact />
								</div>
							</Card>
							<Card className="p-4">
								<h2 className="text-xl font-semibold mb-4">
									Cryptocurrencies
								</h2>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									<MarketAnalysis
										symbol="bitcoin"
										type="crypto"
										compact
									/>
									<MarketAnalysis
										symbol="ethereum"
										type="crypto"
										compact
									/>
									<MarketAnalysis symbol="xrp" type="crypto" compact />
									<MarketAnalysis
										symbol="cardano"
										type="crypto"
										compact
									/>
									<MarketAnalysis
										symbol="solana"
										type="crypto"
										compact
									/>
									<MarketAnalysis
										symbol="polkadot"
										type="crypto"
										compact
									/>
								</div>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="spending" className="space-y-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-lg -z-10" />
							<Card className="p-6 bg-background/50 backdrop-blur-sm">
								<motion.h2
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="text-2xl font-bold mb-4 gradient-text"
								>
									Spending Analysis
								</motion.h2>
								<SpendingChart className="w-full" />
							</Card>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<RecentTransactions />
						</motion.div>
					</TabsContent>

					<TabsContent value="portfolio" className="space-y-4">
						<Card className="p-6">
							<h2 className="text-2xl font-bold">Portfolio</h2>
							<p className="text-muted-foreground">
								Coming soon: Portfolio management features
							</p>
						</Card>
					</TabsContent>

					<TabsContent value="history" className="space-y-4">
						<Card className="p-6">
							<h2 className="text-2xl font-bold">Transaction History</h2>
							<RecentTransactions />
						</Card>
					</TabsContent>

					<TabsContent value="advisor" className="space-y-4">
						<AIAdvisor />
					</TabsContent>

					<TabsContent value="settings" className="space-y-4">
						<Card className="p-6">
							<h2 className="text-2xl font-bold">Settings</h2>
							<p className="text-muted-foreground">
								Coming soon: Customize your dashboard
							</p>
						</Card>
					</TabsContent>
				</motion.div>
			</Tabs>
		</DashboardShell>
	);
}

const styles = `
	.gradient-text {
		@apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80;
	}
	.modern-gradient-text {
		@apply bg-clip-text text-transparent bg-[linear-gradient(to_right,var(--primary)_0%,theme(colors.primary/.7)_30%,theme(colors.primary/.9)_70%,var(--primary)_100%)];
		text-shadow: 0 0 80px rgb(var(--primary) / 0.2);
	}
`;
