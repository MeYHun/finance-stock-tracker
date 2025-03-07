import { MarketData, NewsArticle } from "@/types/market";

export interface HistoricalDataPoint {
	date: string;
	price: number;
	volume?: number;
}

export class MarketDataService {
	private finnhubApiKey: string;
	private newsApiKey: string;
	private alphaVantageApiKey: string;

	constructor(config: {
		finnhubApiKey: string;
		newsApiKey: string;
		alphaVantageApiKey: string;
	}) {
		this.finnhubApiKey = config.finnhubApiKey;
		this.newsApiKey = config.newsApiKey;
		this.alphaVantageApiKey = config.alphaVantageApiKey;
	}

	async getStockData(symbol: string): Promise<MarketData> {
		try {
			const response = await fetch(
				`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.finnhubApiKey}`
			);
			const data = await response.json();

			if (!data || data.error) {
				throw new Error(data.error || "Failed to fetch stock data");
			}

			return {
				symbol,
				price: data.c || 0,
				change: data.d || 0,
				changePercent: data.dp || 0,
				volume: data.v || 0,
				high24h: data.h || 0,
				low24h: data.l || 0,
				lastUpdated: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error fetching stock data:", error);
			return {
				symbol,
				price: 0,
				change: 0,
				changePercent: 0,
				volume: 0,
				high24h: 0,
				low24h: 0,
				lastUpdated: new Date().toISOString(),
			};
		}
	}

	async getCryptoData(symbol: string): Promise<MarketData> {
		try {
			// CoinGecko uses different IDs for some cryptocurrencies
			const cryptoIds: { [key: string]: string } = {
				BTC: "bitcoin",
				ETH: "ethereum",
				XRP: "ripple",
				DOGE: "dogecoin",
				// Add more mappings as needed
			};

			const coinId = cryptoIds[symbol.toUpperCase()] || symbol.toLowerCase();

			const response = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
			);
			const data = await response.json();

			if (!data || !data[coinId]) {
				throw new Error("Failed to fetch crypto data");
			}

			const coinData = data[coinId];

			return {
				symbol,
				price: coinData.usd || 0,
				change: coinData.usd_24h_change || 0,
				changePercent: coinData.usd_24h_change || 0,
				volume: coinData.usd_24h_vol || 0,
				marketCap: coinData.usd_market_cap || 0,
				lastUpdated: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error fetching crypto data:", error);
			return {
				symbol,
				price: 0,
				change: 0,
				changePercent: 0,
				volume: 0,
				marketCap: 0,
				lastUpdated: new Date().toISOString(),
			};
		}
	}

	async getMarketNews(symbols: string[]): Promise<NewsArticle[]> {
		try {
			const response = await fetch(
				`https://newsapi.org/v2/everything?q=${symbols.join(
					" OR "
				)}&apiKey=${this.newsApiKey}&sortBy=publishedAt&language=en`
			);
			const data = await response.json();

			if (!data || !data.articles) {
				return [];
			}

			// Filter out non-English news and ensure title is in English
			const englishNews = data.articles.filter((article: any) => {
				// Simple check for English characters in title
				const hasNonEnglishChars = /[^\x00-\x7F]+/.test(article.title);
				return !hasNonEnglishChars;
			});

			return englishNews.map((article: any) => ({
				id: article.url,
				title: article.title,
				summary: article.description || "No description available",
				url: article.url,
				source: article.source.name,
				publishedAt: article.publishedAt,
			}));
		} catch (error) {
			console.error("Error fetching news:", error);
			return [];
		}
	}

	async getTechnicalIndicators(symbol: string) {
		try {
			const response = await fetch(
				`https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&apikey=${this.alphaVantageApiKey}`
			);
			const data = await response.json();

			if (!data || data.error) {
				throw new Error(
					data.error || "Failed to fetch technical indicators"
				);
			}

			return {
				rsi: this.calculateRSI(data),
				macd: this.calculateMACD(data),
				movingAverages: this.calculateMA(data),
				volume: 0,
				volatility: 0,
			};
		} catch (error) {
			console.error("Error fetching technical indicators:", error);
			return {
				rsi: 0,
				macd: "neutral",
				movingAverages: "neutral",
				volume: 0,
				volatility: 0,
			};
		}
	}

	private calculateRSI(data: any): number {
		if (data["Technical Analysis: RSI"]) {
			const latestDate = Object.keys(data["Technical Analysis: RSI"])[0];
			return parseFloat(data["Technical Analysis: RSI"][latestDate].RSI);
		}
		return 0;
	}

	private calculateMACD(data: any): "bullish" | "bearish" | "neutral" {
		// Simplified MACD calculation
		return "neutral";
	}

	private calculateMA(data: any): "above" | "below" | "crossing" {
		// Simplified MA calculation - default to "crossing" when we can't calculate
		return "crossing";
	}

	async getStockHistoricalData(
		symbol: string,
		days: number = 90
	): Promise<HistoricalDataPoint[]> {
		try {
			// Use Yahoo Finance API for more data points
			const endDate = Math.floor(Date.now() / 1000);
			const startDate = endDate - days * 24 * 60 * 60;

			const response = await fetch(
				`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`
			);
			const data = await response.json();

			if (!data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
				console.error(`No historical data available for ${symbol}`);
				return this.getAlphaVantageHistoricalData(symbol, days);
			}

			const timestamps = data.chart.result[0].timestamp;
			const quotes = data.chart.result[0].indicators.quote[0];
			const historicalData: HistoricalDataPoint[] = [];

			for (let i = 0; i < timestamps.length; i++) {
				const price = quotes.close[i];
				if (price !== null && price !== undefined) {
					historicalData.push({
						date: new Date(timestamps[i] * 1000)
							.toISOString()
							.split("T")[0],
						price: price,
						volume: quotes.volume[i] || 0,
					});
				}
			}

			// Sort by date ascending
			historicalData.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
			);

			return historicalData;
		} catch (error) {
			console.error(
				`Error fetching stock historical data for ${symbol}:`,
				error
			);
			return this.getAlphaVantageHistoricalData(symbol, days);
		}
	}

	private async getAlphaVantageHistoricalData(
		symbol: string,
		days: number = 90
	): Promise<HistoricalDataPoint[]> {
		try {
			const response = await fetch(
				`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${this.alphaVantageApiKey}`
			);
			const data = await response.json();

			if (!data || !data["Time Series (Daily)"]) {
				return [];
			}

			const timeSeriesData = data["Time Series (Daily)"];
			const historicalData: HistoricalDataPoint[] = [];

			Object.entries(timeSeriesData)
				.slice(0, days)
				.forEach(([date, values]: [string, any]) => {
					historicalData.push({
						date,
						price: parseFloat(values["4. close"]),
						volume: parseFloat(values["6. volume"]),
					});
				});

			historicalData.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
			);
			return historicalData;
		} catch (error) {
			console.error(`Alpha Vantage fallback failed for ${symbol}:`, error);
			return [];
		}
	}

	async getCryptoHistoricalData(
		symbol: string,
		days: number = 90
	): Promise<HistoricalDataPoint[]> {
		try {
			const cryptoIds: { [key: string]: string } = {
				BTC: "bitcoin",
				ETH: "ethereum",
				XRP: "ripple",
				DOGE: "dogecoin",
				SOL: "solana",
				DOT: "polkadot",
			};

			const coinId = cryptoIds[symbol.toUpperCase()] || symbol.toLowerCase();

			const response = await fetch(
				`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
			);
			const data = await response.json();

			if (!data || !data.prices) {
				throw new Error("Failed to fetch crypto historical data");
			}

			return data.prices.map(([timestamp, price]: [number, number]) => ({
				date: new Date(timestamp).toISOString().split("T")[0],
				price: price,
				volume: 0,
			}));
		} catch (error) {
			console.error("Error fetching crypto historical data:", error);
			return [];
		}
	}
}
