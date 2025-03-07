import OpenAI from "openai";
import { NewsArticle, MarketSentiment, PredictionResult } from "@/types/market";

export class AIMarketAnalyzer {
	private openai: OpenAI;

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async analyzeSentiment(news: NewsArticle[]): Promise<MarketSentiment> {
		const newsContext = news
			.map((article) => `${article.title}: ${article.summary}`)
			.join("\n");

		const response = await this.openai.chat.completions.create({
			model: "gpt-4-turbo-preview",
			messages: [
				{
					role: "system",
					content:
						"You are a financial expert AI analyzing market sentiment. Provide detailed analysis with confidence scores.",
				},
				{
					role: "user",
					content: `Analyze the market sentiment from these news articles and provide a structured analysis:\n${newsContext}`,
				},
			],
			response_format: { type: "json_object" },
		});

		const analysis = JSON.parse(response.choices[0].message.content);

		return {
			overallSentiment: analysis.sentiment,
			confidenceScore: analysis.confidence,
			keyFactors: analysis.factors,
			timestamp: new Date().toISOString(),
		};
	}

	async predictMarketMovement(
		symbol: string,
		historicalData: any[],
		sentiment: MarketSentiment
	): Promise<PredictionResult> {
		const context = {
			symbol,
			historicalTrend: this.analyzeTrend(historicalData),
			sentiment,
			marketConditions: await this.getCurrentMarketConditions(),
		};

		const response = await this.openai.chat.completions.create({
			model: "gpt-4-turbo-preview",
			messages: [
				{
					role: "system",
					content:
						"You are a financial prediction AI using advanced market analysis and sentiment data.",
				},
				{
					role: "user",
					content: `Predict market movement for ${symbol} based on this data: ${JSON.stringify(
						context
					)}`,
				},
			],
			response_format: { type: "json_object" },
		});

		const prediction = JSON.parse(response.choices[0].message.content);

		return {
			symbol,
			predictedMovement: prediction.movement,
			confidenceScore: prediction.confidence,
			timeframe: prediction.timeframe,
			supportingFactors: prediction.factors,
			timestamp: new Date().toISOString(),
		};
	}

	private analyzeTrend(historicalData: any[]) {
		// Implement technical analysis using TensorFlow.js
		// This is a placeholder for the actual implementation
		return {
			trend: "upward",
			strength: 0.8,
			indicators: {
				rsi: 65,
				macd: "bullish",
				movingAverages: "above",
			},
		};
	}

	private async getCurrentMarketConditions() {
		// Implement market conditions analysis
		// This is a placeholder for the actual implementation
		return {
			volatilityIndex: 15.5,
			marketPhase: "bullish",
			sectorPerformance: "technology_leading",
		};
	}
}
