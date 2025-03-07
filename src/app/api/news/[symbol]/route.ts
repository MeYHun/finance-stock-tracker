import { NextResponse } from "next/server";
import { MarketDataService } from "@/lib/services/market-service";

const marketService = new MarketDataService({
	finnhubApiKey: process.env.FINNHUB_API_KEY || "",
	newsApiKey: process.env.NEWS_API_KEY || "",
	alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
});

export async function GET(
	request: Request,
	{ params }: { params: { symbol: string } }
) {
	try {
		const news = await marketService.getMarketNews([params.symbol]);

		// Add AI highlights for each news article
		const newsWithHighlights = news.map((article) => ({
			...article,
			aiHighlights: [
				"Impact on market sentiment",
				"Key financial metrics mentioned",
				"Potential market implications",
				"Related industry trends",
			],
		}));

		return NextResponse.json(newsWithHighlights);
	} catch (error) {
		console.error("Error fetching news:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}
