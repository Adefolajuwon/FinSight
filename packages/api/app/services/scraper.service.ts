import yahooFinance from 'yahoo-finance2';

export default class DataIngestion {
    async fetchTickerData(
        ticker = 'AAPL',
        modules = [
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
    ) {
        if (!ticker || typeof ticker !== 'string') {
            throw new Error('Invalid ticker provided');
        }

        try {
            const stockData = await yahooFinance.quoteSummary(ticker, {
                modules,
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
}
