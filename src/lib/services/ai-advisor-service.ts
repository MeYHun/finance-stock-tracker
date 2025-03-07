import OpenAI from "openai";
import {
	FinancialAdvice,
	SpendingPattern,
	PortfolioSuggestion,
	AIAdvisorState,
} from "@/types/ai-advisor";

export class AIFinancialAdvisor {
	private openai: OpenAI | null = null;
	private isApiAvailable: boolean = false;

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
				trend: "increasing",
				percentage: 6.25,
			},
			{
				category: "Entertainment",
				currentSpending: 200,
				averageSpending: 250,
				trend: "decreasing",
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

	private getMockFinancialAdvice(): FinancialAdvice[] {
		return [
			{
				type: "spending",
				message:
					"Your food expenses are trending higher than usual this month.",
				severity: "warning",
				category: "Budget Alert",
				timestamp: new Date().toISOString(),
				metadata: {
					currentAmount: 850,
					threshold: 800,
					category: "Food & Dining",
					trend: "up",
					percentage: 6.25,
				},
			},
			{
				type: "budget",
				message:
					"You're under budget in entertainment spending - great job!",
				severity: "info",
				category: "Achievement",
				timestamp: new Date().toISOString(),
				metadata: {
					currentAmount: 200,
					threshold: 250,
					category: "Entertainment",
					trend: "down",
					percentage: 20,
				},
			},
		];
	}

	private getMockPortfolioSuggestions(): PortfolioSuggestion[] {
		return [
			{
				type: "diversify",
				suggestion:
					"Consider adding more international stocks to your portfolio for better diversification.",
				impact: {
					risk: "low",
					potential_benefit: "Reduced volatility",
					timeframe: "6-12 months",
				},
			},
			{
				type: "rebalance",
				suggestion:
					"Your tech allocation is higher than recommended. Consider rebalancing.",
				impact: {
					risk: "medium",
					potential_benefit: "Better risk management",
					timeframe: "1-3 months",
				},
			},
		];
	}

	async analyzeSpendingPatterns(
		transactions: any[]
	): Promise<SpendingPattern[]> {
		if (!this.isApiAvailable) {
			return this.getMockSpendingPatterns();
		}

		try {
			const response = await this.openai!.chat.completions.create({
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

			const analysis = JSON.parse(
				response.choices[0].message.content || "{}"
			);
			return analysis.patterns || [];
		} catch (error) {
			console.error("Error analyzing spending patterns:", error);
			return this.getMockSpendingPatterns();
		}
	}

	async getFinancialAdvice(
		spendingPatterns: SpendingPattern[],
		budget: any,
		investments: any
	): Promise<FinancialAdvice[]> {
		if (!this.isApiAvailable) {
			return this.getMockFinancialAdvice();
		}

		try {
			const context = {
				spendingPatterns,
				budget,
				investments,
			};

			const response = await this.openai!.chat.completions.create({
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

			const advice = JSON.parse(response.choices[0].message.content || "{}");
			return advice.recommendations || [];
		} catch (error) {
			console.error("Error getting financial advice:", error);
			return this.getMockFinancialAdvice();
		}
	}

	async getPortfolioSuggestions(
		portfolio: any
	): Promise<PortfolioSuggestion[]> {
		if (!this.isApiAvailable) {
			return this.getMockPortfolioSuggestions();
		}

		try {
			const response = await this.openai!.chat.completions.create({
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

			const suggestions = JSON.parse(
				response.choices[0].message.content || "{}"
			);
			return suggestions.recommendations || [];
		} catch (error) {
			console.error("Error getting portfolio suggestions:", error);
			return this.getMockPortfolioSuggestions();
		}
	}

	async simulateInvestmentStrategy(
		strategy: any,
		historicalData: any
	): Promise<any> {
		if (!this.isApiAvailable) {
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

			const response = await this.openai!.chat.completions.create({
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

			return JSON.parse(response.choices[0].message.content || "{}");
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

	async getTaxOptimizationAdvice(
		financialData: any
	): Promise<FinancialAdvice[]> {
		if (!this.isApiAvailable) {
			return [
				{
					type: "tax",
					message:
						"Consider maximizing your retirement contributions to reduce taxable income.",
					severity: "info",
					category: "Tax Planning",
					timestamp: new Date().toISOString(),
				},
			];
		}

		try {
			const response = await this.openai!.chat.completions.create({
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

			const advice = JSON.parse(response.choices[0].message.content || "{}");
			return advice.recommendations || [];
		} catch (error) {
			console.error("Error getting tax optimization advice:", error);
			return [
				{
					type: "tax",
					message:
						"Consider maximizing your retirement contributions to reduce taxable income.",
					severity: "info",
					category: "Tax Planning",
					timestamp: new Date().toISOString(),
				},
			];
		}
	}
}
