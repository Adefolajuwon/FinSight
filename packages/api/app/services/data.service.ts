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
    async fetchTickerData(ticker: string): Promise<CompanyFinancialDTO> {
        if (!ticker || typeof ticker !== 'string') {
            throw new Error('Invalid ticker provided');
        }
    
        try {
            const response = await yahooFinance.quoteSummary(ticker, {
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
            const stockData = response.stock; // Access the nested 'stock' object
            console.log(`Successfully fetched data for ${ticker}`);
    
            // Extracting relevant data from the stockData
            const financialData = stockData.financialData || {};
            const summaryDetail = stockData.summaryDetail || {};
            const earningsHistory = stockData.earnings?.financialsChart?.quarterly || [];
    
            // Mapping data to the CompanyFinancialDTO
            const companyData: CompanyFinancialDTO = {
                companyName: stockData.price?.longName || '',
                tickerSymbol: ticker,
                marketCap: summaryDetail?.marketCap || 0,
                industry: stockData.price?.industry || '',
                quickRatio: financialData?.quickRatio || 0,
                currentRatio: financialData?.currentRatio || 0,
                totalRevenue: financialData?.totalRevenue || 0,
                debtToEquity: financialData?.debtToEquity || 0,
                grossProfits: financialData?.grossProfits || 0,
                earningsGrowth: financialData?.earningsGrowth || 0,
                revenueGrowth: financialData?.revenueGrowth || 0,
                totalDebt: financialData?.totalDebt?.toString() || '',
                peRatio: summaryDetail?.peRatio || null,
                dividendYield: summaryDetail?.dividendYield || null,
                earningsHistory: earningsHistory.map((earn: any) => ({
                    date: earn.date || '',
                    revenue: earn.revenue || 0,
                    earnings: earn.earnings || 0,
                })),
            };
    
            return companyData;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error(`API error for ${ticker}:`, error.response?.data);
            } else if (error.request) {
                console.error(`Network error fetching data for ${ticker}`);
            } else {
                console.error(`Unexpected error fetching data for ${ticker}:`, error.message);
            }
            throw error;
        }
    }
    public async fetchNews(companyName: string): Promise<any[] | null> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 3);

        const url = `https://newsapi.org/v2/everything?q=${companyName}&from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}&sortBy=popularity&apiKey=${env.NEWS_API_KEY}`;
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
