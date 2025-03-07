import { NextResponse } from "next/server";
import { MarketDataService } from "@/lib/services/market-service";

const marketService = new MarketDataService({
	finnhubApiKey: process.env.FINNHUB_API_KEY || "",
	newsApiKey: process.env.NEWS_API_KEY || "",
	alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
});

export async function GET(
	request: Request,
	{ params }: { params: { type: string; symbol: string } }
) {
	try {
		const { type, symbol } = params;
		const technicalIndicators = await marketService.getTechnicalIndicators(
			symbol
		);

		// Get market data for additional context
		const marketData = await marketService.getStockData(symbol);
		const historicalData = await marketService.getStockHistoricalData(symbol);

		// Calculate price trends
		const priceChange =
			historicalData.length > 1
				? ((historicalData[historicalData.length - 1].price -
						historicalData[0].price) /
						historicalData[0].price) *
				  100
				: 0;

		// Generate AI analysis
		const analysis = {
			summary: generateMarketSummary(
				marketData,
				technicalIndicators,
				priceChange
			),
			sentiment: determineSentiment(technicalIndicators, priceChange),
			technicalAnalysis: {
				rsi: technicalIndicators.rsi,
				macd: technicalIndicators.macd,
				movingAverages: technicalIndicators.movingAverages,
			},
			recommendations: generateRecommendations(
				technicalIndicators,
				priceChange
			),
			confidence: calculateConfidence(technicalIndicators),
			lastUpdated: new Date().toISOString(),
		};

		return NextResponse.json(analysis);
	} catch (error) {
		console.error("Error generating analysis:", error);
		return NextResponse.json(
			{ error: "Failed to generate analysis" },
			{ status: 500 }
		);
	}
}

function generateMarketSummary(
	marketData: any,
	technicalIndicators: any,
	priceChange: number
): string {
	const trendStrength =
		Math.abs(priceChange) > 10
			? "strong"
			: Math.abs(priceChange) > 5
			? "moderate"
			: "mild";
	const trend = priceChange > 0 ? "upward" : "downward";

	const rsiCondition =
		technicalIndicators.rsi > 70
			? "overbought"
			: technicalIndicators.rsi < 30
			? "oversold"
			: "neutral";

	return `The asset is showing a ${trendStrength} ${trend} trend with ${rsiCondition} conditions. Technical indicators suggest ${technicalIndicators.macd} momentum with ${technicalIndicators.movingAverages} moving average signals.`;
}

function determineSentiment(
	technicalIndicators: any,
	priceChange: number
): "positive" | "negative" | "neutral" {
	const signals = [
		technicalIndicators.rsi > 50,
		technicalIndicators.macd === "bullish",
		technicalIndicators.movingAverages === "above",
		priceChange > 0,
	];

	const positiveSignals = signals.filter(Boolean).length;

	if (positiveSignals >= 3) return "positive";
	if (positiveSignals <= 1) return "negative";
	return "neutral";
}

function generateRecommendations(
	technicalIndicators: any,
	priceChange: number
): string[] {
	const recommendations = [];

	if (technicalIndicators.rsi > 70) {
		recommendations.push(
			"RSI indicates overbought conditions - consider taking profits"
		);
	} else if (technicalIndicators.rsi < 30) {
		recommendations.push(
			"RSI indicates oversold conditions - potential buying opportunity"
		);
	}

	if (technicalIndicators.macd === "bullish") {
		recommendations.push(
			"MACD shows bullish momentum - upward trend may continue"
		);
	} else if (technicalIndicators.macd === "bearish") {
		recommendations.push(
			"MACD shows bearish momentum - downward pressure expected"
		);
	}

	if (technicalIndicators.movingAverages === "above") {
		recommendations.push(
			"Price above moving averages - trend remains bullish"
		);
	} else if (technicalIndicators.movingAverages === "below") {
		recommendations.push(
			"Price below moving averages - trend remains bearish"
		);
	}

	if (Math.abs(priceChange) > 10) {
		recommendations.push(
			`Strong ${
				priceChange > 0 ? "bullish" : "bearish"
			} movement - watch for potential ${
				priceChange > 0 ? "reversal" : "bounce"
			}`
		);
	}

	return recommendations;
}

function calculateConfidence(technicalIndicators: any): number {
	// Calculate confidence based on alignment of technical indicators
	const signals = [
		technicalIndicators.rsi > 50,
		technicalIndicators.macd === "bullish",
		technicalIndicators.movingAverages === "above",
	];

	const alignedSignals = signals.filter(Boolean).length;
	return alignedSignals / signals.length;
}
