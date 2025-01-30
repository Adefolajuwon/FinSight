import yahooFinance from 'yahoo-finance2';
import axios from 'axios';
import env from '../../config/env.js';

interface CompanyFinancialDTO {
    companyName: string;
    tickerSymbol: string;
    marketCap: number;
    industry: string;
    quickRatio: 0.745;
    currentRatio: number;
    totalRevenue: number;
    debtToEquity: number;
    grossProfits: number;
    earningsGrowth: number;
    revenueGrowth: number;
    totalDebt: string;
    peRatio: number | null;
    dividendYield: number | null;
    earningsHistory: QuarterlyEarningsDTO[];
}

interface QuarterlyEarningsDTO {
    fiscalQuarter: string;
    revenue: number;
    netIncome: number;
    earningsPerShare: number;
    operatingMargin: number;
    guidance: string | null;
    reportDate: string;
}

export default class DataIngestion {
    async fetchTickerData(ticker: string) {
        if (!ticker || typeof ticker !== 'string') {
            throw new Error('Invalid ticker provided');
        }

        try {
            const stockData = await yahooFinance.quoteSummary(ticker, {
                modules: [
                    'price',
                    'summaryDetail',
                    'financialData',
                    'defaultKeyStatistics',
                    'incomeStatementHistory',
                    'balanceSheetHistory',
                    'cashflowStatementHistory',
                    'recommendationTrend',
                    'earnings',
                    'institutionOwnership',
                ],
            });
            console.log(`Successfully fetched data for ${ticker}`);
            return stockData;
        } catch (error) {
            if (error.response) {
                console.error(`API error for ${ticker}:`, error.response.data);
            } else if (error.request) {
                console.error(`Network error fetching data for ${ticker}`);
            } else {
                console.error(
                    `Unexpected error fetching data for ${ticker}:`,
                    error.message,
                );
            }
            throw error; // Propagate the error for higher-level handling
        }
    }
    public async fetchNews(companyName: string): Promise<any[] | null> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 3);

        const url = `https://newsapi.org/v2/everything?q=${companyName}&from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}&sortBy=popularity&apiKey=${config.NEWS_API_KEY}`;

        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const newsData = response.data;
                return newsData.articles;
            } else {
                console.error(`Error fetching news: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            return null;
        }
    }
}
