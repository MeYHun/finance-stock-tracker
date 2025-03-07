"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketData, AIAnalysis, NewsArticle } from "@/types/market";
import { HistoricalDataPoint } from "@/lib/services/market-service";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Area,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
	TrendingUp,
	TrendingDown,
	AlertCircle,
	Brain,
	Newspaper,
	RefreshCw,
	ArrowUp,
	ArrowDown,
	ArrowRight,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface MarketAnalysisProps {
	symbol: string;
	type: "stock" | "crypto";
	compact?: boolean;
}

// Calculate Simple Moving Average (SMA)
function calculateSMA(data: HistoricalDataPoint[], period: number) {
	return data.map((point, index) => {
		if (index < period - 1) return { ...point, sma: null };
		const slice = data.slice(index - period + 1, index + 1);
		const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
		return { ...point, sma: sum / period };
	});
}

// Calculate Bollinger Bands
function calculateBollingerBands(
	data: HistoricalDataPoint[],
	period: number = 30,
	stdDev: number = 2
) {
	// First calculate SMA
	const smaData = calculateSMA(data, period);

	// Then calculate standard deviation and bands
	const processedData = smaData.map((point, index) => {
		if (index < period - 1) {
			return { ...point, upperBand: null, lowerBand: null };
		}

		const slice = data.slice(index - period + 1, index + 1);
		const avg = point.sma!;
		const squaredDiffs = slice.map((p) => Math.pow(p.price - avg, 2));
		const variance =
			squaredDiffs.reduce((acc, curr) => acc + curr, 0) / period;
		const standardDeviation = Math.sqrt(variance);

		return {
			...point,
			upperBand: avg + standardDeviation * stdDev,
			lowerBand: avg - standardDeviation * stdDev,
		};
	});

	// Filter out data points where indicators are not available
	return processedData.filter(
		(point) =>
			point.sma !== null &&
			point.upperBand !== null &&
			point.lowerBand !== null
	);
}

export function MarketAnalysis({
	symbol,
	type,
	compact = false,
}: MarketAnalysisProps) {
	const [marketData, setMarketData] = React.useState<MarketData | null>(null);
	const [aiAnalysis, setAiAnalysis] = React.useState<AIAnalysis | null>(null);
	const [news, setNews] = React.useState<NewsArticle[]>([]);
	const [selectedNews, setSelectedNews] = React.useState<NewsArticle | null>(
		null
	);
	const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
	const [historicalData, setHistoricalData] = React.useState<
		HistoricalDataPoint[]
	>([]);
	const [showIndicators, setShowIndicators] = React.useState(true);

	const fetchData = React.useCallback(async () => {
		try {
			const response = await fetch(`/api/market/${type}/${symbol}`);
			const data = await response.json();

			const analysis = await fetch(`/api/analysis/${type}/${symbol}`).then(
				(res) => res.json()
			);
			const newsData = await fetch(`/api/news/${symbol}`).then((res) =>
				res.json()
			);

			setMarketData(data);
			setHistoricalData(data.historicalData || []);
			setAiAnalysis(analysis);
			setNews(newsData);
		} catch (error) {
			console.error("Error fetching market data:", error);
		}
	}, [symbol, type]);

	React.useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 60000); // Update every minute
		return () => clearInterval(interval);
	}, [fetchData]);

	// Process data with technical indicators
	const processedData = React.useMemo(() => {
		if (!historicalData.length) return [];
		const data = calculateBollingerBands(historicalData);
		return data;
	}, [historicalData]);

	if (!marketData) return <div>Loading...</div>;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-lg border bg-card p-4 relative overflow-hidden"
		>
			{/* Decorative background elements */}
			<div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-primary/5 rounded-full blur-2xl -z-10" />

			{/* Header section */}
			<div className="relative">
				<div className="flex items-start justify-between mb-6 pr-8">
					<HoverCard>
						<HoverCardTrigger asChild>
							<div className="cursor-help">
								<h3 className="text-2xl font-ingenious bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
									{symbol.toUpperCase()}
								</h3>
								<p className="text-sm text-muted-foreground">
									{type === "stock" ? "Stock" : "Cryptocurrency"}
								</p>
							</div>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold">
									{symbol.toUpperCase()} Overview
								</h4>
								<p className="text-sm">
									{type === "stock"
										? "Stock trading on major exchanges"
										: "Digital cryptocurrency asset"}
								</p>
								<div className="flex items-center gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">24h High</p>
										<p className="font-medium">
											${marketData.high24h?.toFixed(2) || "N/A"}
										</p>
									</div>
									<Separator orientation="vertical" className="h-8" />
									<div>
										<p className="text-muted-foreground">24h Low</p>
										<p className="font-medium">
											${marketData.low24h?.toFixed(2) || "N/A"}
										</p>
									</div>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>

					<motion.div
						initial={{ scale: 0.95 }}
						animate={{ scale: 1 }}
						className="flex flex-col items-end"
					>
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-2xl font-bold">
								${marketData.price.toFixed(2)}
							</span>
							<Badge
								variant={
									marketData.changePercent >= 0
										? "success"
										: "destructive"
								}
								className="flex items-center gap-1 px-2 py-1 text-xs transition-colors duration-200"
							>
								{marketData.changePercent >= 0 ? (
									<TrendingUp className="h-3 w-3" />
								) : (
									<TrendingDown className="h-3 w-3" />
								)}
								{Math.abs(marketData.changePercent).toFixed(2)}%
							</Badge>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
							onClick={fetchData}
						>
							<RefreshCw className="h-3 w-3" />
							Refresh
						</motion.button>
					</motion.div>
				</div>
			</div>

			{!compact && (
				<>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mt-4 bg-card/50 rounded-lg p-4 border"
					>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2 text-sm">
								<Badge variant="outline" className="font-mono">
									MA(30)
								</Badge>
								<Badge variant="outline" className="font-mono">
									Bollinger Bands (30d)
								</Badge>
							</div>
						</div>
						<ResponsiveContainer width="100%" height={150}>
							<LineChart data={processedData}>
								<defs>
									<linearGradient
										id="bandFill"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="0%"
											stopColor="hsl(var(--primary))"
											stopOpacity={0.1}
										/>
										<stop
											offset="100%"
											stopColor="hsl(var(--primary))"
											stopOpacity={0.02}
										/>
									</linearGradient>
								</defs>
								<XAxis
									dataKey="date"
									fontSize={10}
									tickFormatter={(value) => {
										const date = new Date(value);
										return `${date.getMonth() + 1}/${date.getDate()}`;
									}}
									stroke="#888888"
								/>
								<YAxis
									domain={["auto", "auto"]}
									fontSize={10}
									tickFormatter={(value) => `$${value.toFixed(0)}`}
									stroke="#888888"
								/>
								<Tooltip
									formatter={(value: any, name: string) => {
										const formattedValue = `$${Number(value).toFixed(
											2
										)}`;
										let displayName = "";
										let color = "";

										switch (name) {
											case "price":
												displayName = "Current Price";
												color = "#2563eb"; // blue
												break;
											case "sma":
												displayName = "MA(30)";
												color = "#22c55e"; // green
												break;
											case "upperBand":
												displayName = "Upper Bollinger Band";
												color = "hsl(var(--primary))";
												break;
											case "lowerBand":
												displayName = "Lower Bollinger Band";
												color = "hsl(var(--primary))";
												break;
										}

										return [
											formattedValue,
											<span
												style={{
													color,
													display: "flex",
													alignItems: "center",
													gap: "6px",
												}}
											>
												<span
													style={{
														width: "8px",
														height: "8px",
														borderRadius: "50%",
														backgroundColor: color,
														display: "inline-block",
													}}
												></span>
												{displayName}
											</span>,
										];
									}}
									labelFormatter={(label) =>
										format(new Date(label), "MMM d, yyyy")
									}
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										borderColor: "hsl(var(--border))",
										borderRadius: "8px",
										padding: "12px",
										boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
										border: "1px solid hsl(var(--border))",
									}}
									itemStyle={{
										color: "hsl(var(--foreground))",
										fontSize: "12px",
										padding: "4px 0",
									}}
									labelStyle={{
										color: "hsl(var(--muted-foreground))",
										fontSize: "12px",
										fontWeight: "500",
										marginBottom: "8px",
										borderBottom: "1px solid hsl(var(--border))",
										paddingBottom: "6px",
									}}
									wrapperStyle={{
										outline: "none",
									}}
								/>
								{/* Bollinger Bands Area */}
								<Area
									dataKey="upperBand"
									stroke="transparent"
									fill="url(#bandFill)"
									fillOpacity={1}
								/>
								<Area
									dataKey="lowerBand"
									stroke="transparent"
									fill="transparent"
									fillOpacity={1}
								/>
								{/* Moving Average */}
								<Line
									type="monotone"
									dataKey="sma"
									stroke="#22c55e"
									strokeWidth={1.5}
									dot={false}
									name="MA(30)"
								/>
								{/* Bollinger Bands */}
								<Line
									type="monotone"
									dataKey="upperBand"
									stroke="hsl(var(--primary))"
									strokeWidth={1}
									strokeDasharray="3 3"
									dot={false}
									name="Upper Band"
								/>
								<Line
									type="monotone"
									dataKey="lowerBand"
									stroke="hsl(var(--primary))"
									strokeWidth={1}
									strokeDasharray="3 3"
									dot={false}
									name="Lower Band"
								/>
								{/* Price Line */}
								<Line
									type="monotone"
									dataKey="price"
									stroke="#2563eb"
									strokeWidth={2}
									dot={false}
									name="Price"
								/>
							</LineChart>
						</ResponsiveContainer>
					</motion.div>

					{/* AI Insights section */}
					{aiAnalysis && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="mt-6 bg-card/50 rounded-lg p-4 border"
						>
							<div className="flex items-center gap-2 mb-4">
								<Brain className="h-5 w-5 text-primary" />
								<h4 className="font-semibold text-lg">AI Insights</h4>
							</div>
							<div className="text-sm space-y-4">
								<div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
									<Badge variant="outline">Summary</Badge>
									<p className="text-muted-foreground">
										{aiAnalysis.summary}
									</p>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
									<div className="bg-muted/50 rounded-lg p-3 space-y-1">
										<p className="text-xs text-muted-foreground">
											Sentiment
										</p>
										<Badge
											variant={
												aiAnalysis.sentiment === "positive"
													? "success"
													: aiAnalysis.sentiment === "negative"
													? "destructive"
													: "secondary"
											}
											className="w-full justify-center"
										>
											{String(aiAnalysis.sentiment).toUpperCase()}
										</Badge>
									</div>
									<div className="bg-muted/50 rounded-lg p-3 space-y-1">
										<p className="text-xs text-muted-foreground">
											RSI
										</p>
										<p className="font-semibold">
											{aiAnalysis.technicalAnalysis.rsi.toFixed(2)}
										</p>
									</div>
									<div className="bg-muted/50 rounded-lg p-3 space-y-1">
										<p className="text-xs text-muted-foreground">
											MACD
										</p>
										<Badge
											variant={
												aiAnalysis.technicalAnalysis.macd ===
												"bullish"
													? "success"
													: aiAnalysis.technicalAnalysis.macd ===
													  "bearish"
													? "destructive"
													: "secondary"
											}
											className="w-full justify-center"
										>
											{aiAnalysis.technicalAnalysis.macd.toUpperCase()}
										</Badge>
									</div>
									<div className="bg-muted/50 rounded-lg p-3 space-y-1">
										<p className="text-xs text-muted-foreground">
											Moving Avg
										</p>
										<p className="font-semibold capitalize">
											{aiAnalysis.technicalAnalysis.movingAverages}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<h5 className="font-medium flex items-center gap-2">
										<ArrowRight className="h-4 w-4 text-primary" />
										Recommendations
									</h5>
									<ul className="grid gap-2">
										{aiAnalysis.recommendations.map((rec, index) => (
											<motion.li
												key={index}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground"
											>
												{rec}
											</motion.li>
										))}
									</ul>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Badge variant="outline">Confidence</Badge>
										<span className="text-sm font-medium">
											{(aiAnalysis.confidence * 100).toFixed(0)}%
										</span>
									</div>
									<div className="h-2 rounded-full bg-muted overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{
												width: `${aiAnalysis.confidence * 100}%`,
											}}
											transition={{ duration: 1, ease: "easeOut" }}
											className="h-full bg-primary rounded-full"
										/>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{/* News section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-6"
					>
						<div className="flex items-center gap-2 mb-4">
							<Newspaper className="h-5 w-5 text-primary" />
							<h4 className="font-semibold text-lg">Latest News</h4>
						</div>
						<ScrollArea className="h-[300px] pr-4">
							<div className="space-y-4">
								{news.map((article, index) => (
									<motion.div
										key={article.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<Card
											className={cn(
												"group p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer border-l-4",
												String(article.sentiment) === "POSITIVE"
													? "border-l-green-500"
													: String(article.sentiment) ===
													  "NEGATIVE"
													? "border-l-red-500"
													: "border-l-primary"
											)}
											onClick={() => {
												setSelectedNews(article);
												setIsNewsModalOpen(true);
											}}
										>
											<div className="space-y-2">
												<div className="flex items-start justify-between gap-2">
													<h5 className="font-ingenious text-base leading-tight group-hover:text-primary transition-colors">
														{article.title}
													</h5>
													<Badge
														variant="outline"
														className="shrink-0"
													>
														{format(
															new Date(article.publishedAt),
															"MMM d"
														)}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground line-clamp-2">
													{article.summary}
												</p>
												<div className="flex items-center gap-2 text-xs">
													<span className="font-medium text-primary">
														{article.source}
													</span>
													<span className="text-muted-foreground">
														•
													</span>
													<span className="text-muted-foreground">
														{format(
															new Date(article.publishedAt),
															"h:mm a"
														)}
													</span>
												</div>
											</div>
										</Card>
									</motion.div>
								))}
							</div>
						</ScrollArea>
					</motion.div>

					{/* News Modal */}
					<Dialog open={isNewsModalOpen} onOpenChange={setIsNewsModalOpen}>
						<DialogContent className="sm:max-w-[600px]">
							{selectedNews && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<DialogHeader>
										<DialogTitle className="font-ingenious text-xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
											{selectedNews.title}
										</DialogTitle>
										<DialogDescription className="flex items-center gap-2">
											<span className="font-medium text-primary">
												{selectedNews.source}
											</span>
											<span>•</span>
											<span>
												{format(
													new Date(selectedNews.publishedAt),
													"MMMM d, yyyy 'at' h:mm a"
												)}
											</span>
										</DialogDescription>
									</DialogHeader>
									<Separator className="my-4" />
									<div className="space-y-4">
										<p className="text-muted-foreground leading-relaxed">
											{selectedNews.summary}
										</p>
										{selectedNews.aiHighlights && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.2 }}
												className="space-y-3 bg-muted/50 rounded-lg p-4"
											>
												<h4 className="font-semibold flex items-center gap-2 text-primary">
													<Brain className="h-4 w-4" />
													Key Insights
												</h4>
												<ul className="space-y-2">
													{selectedNews.aiHighlights.map(
														(highlight, index) => (
															<motion.li
																key={index}
																initial={{ opacity: 0, x: -20 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{
																	delay: 0.2 + index * 0.1,
																}}
																className="flex gap-2 text-sm"
															>
																<span className="text-primary">
																	•
																</span>
																{highlight}
															</motion.li>
														)
													)}
												</ul>
											</motion.div>
										)}
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
											className="pt-4"
										>
											<Button
												asChild
												className="w-full bg-primary hover:bg-primary/90"
											>
												<a
													href={selectedNews.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2"
												>
													Read Full Article
													<ArrowRight className="h-4 w-4" />
												</a>
											</Button>
										</motion.div>
									</div>
								</motion.div>
							)}
						</DialogContent>
					</Dialog>
				</>
			)}
		</motion.div>
	);
}
