import OpenAI from "openai";
import type {
	Insight,
	PortfolioSuggestion,
	SpendingPattern,
	AIAdvisorState,
} from "@/types/ai-advisor";

export class AIFinancialAdvisor {
	private openai: OpenAI | null = null;
	private isApiAvailable: boolean = false;
	private mockState: AIAdvisorState = {
		insights: [
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
		],
		spendingPatterns: [
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
		],
		portfolioSuggestions: [
			{
				id: "1",
				asset: "Tech Growth ETF",
				type: "etf",
				action: "buy",
				reason:
					"Strong sector performance and aligned with your risk profile",
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
		],
		lastUpdated: new Date().toISOString(),
	};

	constructor() {
		const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
		if (apiKey) {
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
	}

	private getMockSpendingPatterns(): SpendingPattern[] {
		return [
			{
				category: "Food & Dining",
				currentSpending: 850,
				averageSpending: 800,
				trend: "up",
				percentage: 6.25,
			},
			{
				category: "Entertainment",
				currentSpending: 200,
				averageSpending: 250,
				trend: "down",
				percentage: -20,
			},
			{
				category: "Transportation",
				currentSpending: 300,
				averageSpending: 300,
				trend: "stable",
				percentage: 0,
			},
		];
	}

	private getMockFinancialAdvice(): Insight[] {
		return this.mockState.insights;
	}

	private getMockPortfolioSuggestions(): PortfolioSuggestion[] {
		return this.mockState.portfolioSuggestions;
	}

	async analyzeSpendingPatterns(
		transactions: any[]
	): Promise<SpendingPattern[]> {
		if (!this.isApiAvailable || !this.openai) {
			return this.getMockSpendingPatterns();
		}

		try {
			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are a financial analysis AI specializing in identifying spending patterns and providing actionable insights.",
					},
					{
						role: "user",
						content: `Analyze these transactions and identify spending patterns: ${JSON.stringify(
							transactions
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
			return analysis.patterns || this.getMockSpendingPatterns();
		} catch (error) {
			console.error("Error analyzing spending patterns:", error);
			return this.getMockSpendingPatterns();
		}
	}

	async getFinancialAdvice(
		patterns: SpendingPattern[],
		budget: any,
		investments: any
	): Promise<Insight[]> {
		if (!this.isApiAvailable || !this.openai) {
			return this.getMockFinancialAdvice();
		}

		try {
			const context = {
				patterns,
				budget,
				investments,
			};

			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are a financial advisor AI providing personalized advice based on spending patterns and financial goals.",
					},
					{
						role: "user",
						content: `Provide financial advice based on this data: ${JSON.stringify(
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

			const advice = JSON.parse(content);
			return advice.recommendations || this.getMockFinancialAdvice();
		} catch (error) {
			console.error("Error getting financial advice:", error);
			return this.getMockFinancialAdvice();
		}
	}

	async getPortfolioSuggestions(
		portfolio: any
	): Promise<PortfolioSuggestion[]> {
		if (!this.isApiAvailable || !this.openai) {
			return this.getMockPortfolioSuggestions();
		}

		try {
			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are an investment advisor AI specializing in portfolio optimization and risk management.",
					},
					{
						role: "user",
						content: `Analyze this portfolio and provide suggestions: ${JSON.stringify(
							portfolio
						)}`,
					},
				],
				response_format: { type: "json_object" },
			});

			const content = response.choices[0].message.content;
			if (!content) {
				throw new Error("No content in OpenAI response");
			}

			const suggestions = JSON.parse(content);
			return (
				suggestions.recommendations || this.getMockPortfolioSuggestions()
			);
		} catch (error) {
			console.error("Error getting portfolio suggestions:", error);
			return this.getMockPortfolioSuggestions();
		}
	}

	async simulateInvestmentStrategy(
		strategy: any,
		historicalData: any
	): Promise<any> {
		if (!this.isApiAvailable || !this.openai) {
			return {
				expectedReturn: "8-10%",
				risk: "moderate",
				timeframe: "5 years",
				confidence: "medium",
			};
		}

		try {
			const context = {
				strategy,
				historicalData,
			};

			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are an investment simulation AI that analyzes historical data to project potential outcomes.",
					},
					{
						role: "user",
						content: `Simulate this investment strategy with historical data: ${JSON.stringify(
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

			return JSON.parse(content);
		} catch (error) {
			console.error("Error simulating investment strategy:", error);
			return {
				expectedReturn: "8-10%",
				risk: "moderate",
				timeframe: "5 years",
				confidence: "medium",
			};
		}
	}

	async getTaxOptimizationAdvice(financialData: any): Promise<Insight[]> {
		if (!this.isApiAvailable || !this.openai) {
			return this.getMockFinancialAdvice();
		}

		try {
			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{
						role: "system",
						content:
							"You are a tax optimization AI advisor that provides strategies to minimize tax liabilities.",
					},
					{
						role: "user",
						content: `Provide tax optimization advice based on this data: ${JSON.stringify(
							financialData
						)}`,
					},
				],
				response_format: { type: "json_object" },
			});

			const content = response.choices[0].message.content;
			if (!content) {
				throw new Error("No content in OpenAI response");
			}

			const advice = JSON.parse(content);
			return advice.recommendations || this.getMockFinancialAdvice();
		} catch (error) {
			console.error("Error getting tax optimization advice:", error);
			return this.getMockFinancialAdvice();
		}
	}
}
