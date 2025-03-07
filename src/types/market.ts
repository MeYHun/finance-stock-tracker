export interface NewsArticle {
	id: string;
	title: string;
	summary: string;
	url: string;
	source: string;
	publishedAt: string;
	sentiment?: number;
	aiHighlights?: string[];
}

export interface MarketSentiment {
	overallSentiment: "bullish" | "bearish" | "neutral";
	confidenceScore: number;
	keyFactors: string[];
	timestamp: string;
}

export interface PredictionResult {
	symbol: string;
	predictedMovement: "up" | "down" | "sideways";
	confidenceScore: number;
	timeframe: string;
	supportingFactors: string[];
	timestamp: string;
}

export interface MarketData {
	symbol: string;
	price: number;
	change: number;
	changePercent: number;
	volume: number;
	marketCap?: number;
	high24h?: number;
	low24h?: number;
	lastUpdated: string;
}

export interface TechnicalIndicators {
	rsi: number;
	macd: "bullish" | "bearish" | "neutral";
	movingAverages: "above" | "below" | "crossing";
	volume: number;
	volatility: number;
}

export interface AIAnalysis {
	summary: string;
	sentiment: "positive" | "negative" | "neutral";
	technicalAnalysis: {
		rsi: number;
		macd: "bullish" | "bearish" | "neutral";
		movingAverages: "above" | "below" | "crossing";
	};
	confidence: number;
	recommendations: string[];
	lastUpdated: string;
}

export interface Portfolio {
	assets: PortfolioAsset[];
	totalValue: number;
	dailyChange: number;
	dailyChangePercent: number;
	lastUpdated: string;
}

export interface PortfolioAsset {
	symbol: string;
	type: "stock" | "crypto";
	quantity: number;
	averagePrice: number;
	currentPrice: number;
	totalValue: number;
	profit: number;
	profitPercent: number;
	aiAnalysis?: AIAnalysis;
}
