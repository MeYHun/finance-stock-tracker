// Delete this file

export type Severity = "high" | "medium" | "low";
export type ActionType = "buy" | "sell" | "hold";
export type AssetType = "stock" | "crypto" | "etf";
export type TrendType = "up" | "down" | "stable";

export interface Insight {
	id: string;
	title: string;
	message: string;
	impact: number;
	severity: Severity;
	category: "spending" | "saving" | "investment";
	timestamp: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export interface PortfolioSuggestion {
	id: string;
	asset: string;
	type: AssetType;
	action: ActionType;
	reason: string;
	impact: {
		potential: number;
		risk: Severity;
	};
}

export interface SpendingPattern {
	category: string;
	currentSpending: number;
	averageSpending: number;
	trend: TrendType;
	percentage: number;
}

export interface AIAdvisorState {
	insights: Insight[];
	spendingPatterns: SpendingPattern[];
	portfolioSuggestions: PortfolioSuggestion[];
	lastUpdated: string;
}
