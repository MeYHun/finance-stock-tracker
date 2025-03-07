import { NextResponse } from "next/server";
import {
	MarketDataService,
	HistoricalDataPoint,
} from "@/lib/services/market-service";
import { MarketData } from "@/types/market";

const marketService = new MarketDataService({
	finnhubApiKey: process.env.FINNHUB_API_KEY || "",
	newsApiKey: process.env.NEWS_API_KEY || "",
	alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
});

// Simple in-memory cache for historical data
const historicalDataCache = new Map<
	string,
	{ data: HistoricalDataPoint[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(
	request: Request,
	{ params }: { params: { type: string; symbol: string } }
) {
	try {
		const { type, symbol } = params;
		let currentData: MarketData;
		let historicalData: HistoricalDataPoint[] | undefined;

		if (type === "stock") {
			currentData = await marketService.getStockData(symbol);

			// Check cache first
			const cacheKey = `stock-${symbol}`;
			const cachedData = historicalDataCache.get(cacheKey);
			const now = Date.now();

			if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
				console.log(`Using cached historical data for ${symbol}`);
				historicalData = cachedData.data;
			} else {
				historicalData = await marketService.getStockHistoricalData(symbol);

				// Cache the new data if it's valid
				if (historicalData?.length) {
					historicalDataCache.set(cacheKey, {
						data: historicalData,
						timestamp: now,
					});
				}
			}

			// If no historical data available, generate fallback data
			if (!historicalData?.length && currentData?.price) {
				console.log(`Generating fallback data for ${symbol}`);
				const days = 30;
				historicalData = Array.from({ length: days }, (_, i) => {
					const date = new Date();
					date.setDate(date.getDate() - (days - i - 1));
					// Use current price as base and add small random variations
					const randomVariation =
						(Math.random() - 0.5) * (currentData.price * 0.02); // 2% variation
					return {
						date: date.toISOString().split("T")[0],
						price: currentData.price + randomVariation,
						volume: currentData.volume || 0,
					};
				});
			}
		} else if (type === "crypto") {
			currentData = await marketService.getCryptoData(symbol);
			historicalData = await marketService.getCryptoHistoricalData(symbol);
		} else {
			return NextResponse.json(
				{ error: "Invalid market type" },
				{ status: 400 }
			);
		}

		// Log the response size
		console.log(
			`Returning data for ${symbol} with ${
				historicalData?.length || 0
			} historical points`
		);

		return NextResponse.json({
			...currentData,
			historicalData: historicalData || [],
		});
	} catch (error) {
		console.error("Error fetching market data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch market data" },
			{ status: 500 }
		);
	}
}
