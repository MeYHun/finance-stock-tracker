import OpenAI from "openai";
import { NewsArticle, MarketSentiment, PredictionResult } from "@/types/market";

interface MarketAnalysis {
	overallSentiment: string;
	keyPoints: string[];
	riskLevel: string;
	recommendation: string;
}

export class AIMarketAnalyzer {
	private openai: OpenAI | null = null;
	private isApiAvailable: boolean = false;

	constructor() {
		const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
		if (!apiKey) {
			console.warn("OpenAI API key is not set. Using mock data.");
			this.isApiAvailable = false;
			return;
		}

		try {
			this.openai = new OpenAI({
				apiKey,
				dangerouslyAllowBrowser: true,
			});
			this.isApiAvailable = true;
		} catch (error) {
			console.error("Failed to initialize OpenAI client:", error);
			this.isApiAvailable = false;
		}
	}

	async analyzeMarketData(data: any): Promise<MarketAnalysis> {
		if (!this.isApiAvailable || !this.openai) {
			return this.getMockAnalysis();
		}

		try {
			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are a financial market analysis AI specializing in technical and fundamental analysis.",
					},
					{
						role: "user",
						content: `Analyze this market data and provide insights: ${JSON.stringify(
							data
						)}`,
					},
				],
				response_format: { type: "json_object" },
			});

			const content = response.choices[0].message.content;
			if (!content) {
				throw new Error("No content in OpenAI response");
			}

			const analysis = JSON.parse(content);

			return {
				overallSentiment: analysis.sentiment || "neutral",
				keyPoints: analysis.keyPoints || [],
				riskLevel: analysis.riskLevel || "moderate",
				recommendation: analysis.recommendation || "hold",
			};
		} catch (error) {
			console.error("Error analyzing market data:", error);
			return this.getMockAnalysis();
		}
	}

	private getMockAnalysis(): MarketAnalysis {
		return {
			overallSentiment: "neutral",
			keyPoints: [
				"Market showing mixed signals",
				"Volume remains consistent",
				"Technical indicators suggest consolidation",
			],
			riskLevel: "moderate",
			recommendation: "hold",
		};
	}

	private getMockSentiment(): MarketSentiment {
		return {
			overallSentiment: "neutral",
			confidenceScore: 0.7,
			keyFactors: [
				"Market showing mixed signals",
				"Recent economic data indicates stability",
				"Tech sector performance remains strong",
				"Global market conditions are balanced",
			],
			timestamp: new Date().toISOString(),
		};
	}

	async analyzeSentiment(news: NewsArticle[]): Promise<MarketSentiment> {
		if (!this.isApiAvailable || !this.openai) {
			console.warn("OpenAI service unavailable, using mock sentiment data");
			return this.getMockSentiment();
		}

		if (!news || news.length === 0) {
			console.warn("No news articles provided for analysis");
			return {
				overallSentiment: "neutral",
				confidenceScore: 0,
				keyFactors: ["No news data available for analysis"],
				timestamp: new Date().toISOString(),
			};
		}

		try {
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

			const content = response.choices[0].message.content;
			if (!content) {
				throw new Error("No content in OpenAI response");
			}

			const analysis = JSON.parse(content);

			return {
				overallSentiment: analysis.sentiment || "neutral",
				confidenceScore: analysis.confidence || 0.5,
				keyFactors: analysis.factors || ["Analysis results unavailable"],
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error analyzing market sentiment:", error);
			return this.getMockSentiment();
		}
	}

	async predictMarketMovement(
		symbol: string,
		historicalData: any[],
		sentiment: MarketSentiment
	): Promise<PredictionResult> {
		if (!this.isApiAvailable || !this.openai) {
			return {
				symbol,
				predictedMovement: "sideways",
				confidenceScore: 0.5,
				timeframe: "short-term",
				supportingFactors: ["AI service unavailable"],
				timestamp: new Date().toISOString(),
			};
		}

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

		const content = response.choices[0].message.content;
		if (!content) {
			throw new Error("No content in OpenAI response");
		}

		const prediction = JSON.parse(content);

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
