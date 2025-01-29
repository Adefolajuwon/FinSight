import yahooFinance from 'yahoo-finance2'

export default class Data {
  async fetchTickerData(tickers: string[] = []) {
    try {
      const stockDataPromises = tickers.map(async (ticker) => {
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
            // 'majorHolders',
            'institutionOwnership',
          ],
        })
        return { ticker, data: stockData }
      })

      const allStockData = await Promise.all(stockDataPromises)

      allStockData.forEach(({ ticker, data }) => {
        console.log(`Data for ${ticker}:`, data)
      })

      return allStockData
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}
