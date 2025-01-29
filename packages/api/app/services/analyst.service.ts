import GeminiService from './gemini.service.js'
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import TickerScraper from './tickers.service.js'

// Ensure sqlite3 has verbose mode enabled
sqlite3.verbose()

export default class Analyzer {
  private geminiService: GeminiService
  ticker: string
  companyName?: string
  tinkerObject?: object
  private db: Database | null = null

  constructor(companyName: string, ticker: string) {
    this.ticker = ticker
    this.companyName = this.companyName
    this.geminiService = new GeminiService()
  }
  public async initializeDB(dbPath: string = 'stock.db'): Promise<void> {
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    console.log('Database connection established.')
    await this._createTable()
  }

  private async _createTable(): Promise<void> {
    if (!this.db) {
      console.error('Database not initialized.')
      return
    }

    const createStockDataTableQuery = `
    CREATE TABLE IF NOT EXISTS unified_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        company_name TEXT,            -- Only for stock data
        news_sentiment TEXT,          -- Only for stock data
        revenue BIGINT,               -- Nullable for stock data rows
        earnings BIGINT,              -- Nullable for stock data rows
        competitors TEXT
    );
`

    // Run the queries to create the tables
    await this.db.run(createStockDataTableQuery)

    console.log('Tables created or already exist.')
  }
  private async fetchData() {
    const tasks = {
      competitors: getCompetitors(),
      stock_data: getStockData(),
      company_info: getCompanyInfo(),
      financial_statements: getFinancialStatements(),
      news: getNews(),
    }

    const results = await Promise.allSettled(
      Object.entries(tasks).map(([key, promise]) =>
        promise.then((value) => ({ key, value })).catch((error) => ({ key, error }))
      )
    )

    const data: Record<string, any> = {}
    for (const result of results) {
      if (result.status === 'fulfilled') {
        data[result.value.key] = result.value.value
      } else {
        console.error(`Error fetching ${result.reason.key}:`, result.reason.error)
        data[result.reason.key] = null
      }
    }

    return data
  }

  public async _getCompetitors(tinker: string, companyName: string): Promise<string[]> {
    this.companyName = 'A.O SMITH'

    const prompt = `Given the company name A.O SMITH and ticker "${this.ticker}", identify the top three competitors to the company. Return the result as a JSON array of ticker symbols.`
    console.log(prompt)
    try {
      const result = await this.geminiService.Generate(prompt)

      // Sanitize the response: Remove backticks and trim whitespace
      const cleanedResult = result.replace(/```json|```/g, '').trim()

      // Attempt to parse the cleaned response as JSON
      const competitors = JSON.parse(cleanedResult)
      console.log(competitors)

      if (Array.isArray(competitors) && competitors.every((item) => typeof item === 'string')) {
        return competitors
      } else {
        throw new Error('Invalid response format: Expected an array of strings')
      }
    } catch (error) {
      console.error('Error fetching competitors:', error)
      throw new Error('Failed to fetch competitors.')
    }
  }
  public async _getEarnings(tinker: string) {}
}

function getTickers() {
  const scraper = new TickerScraper('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
  const tickerObject = scraper.fetchTickers()
  return tickerObject
}
async function analyzeTickers() {
  const tickers = await getTickers()
  const companies: Record<string, string> = {}

  for (const [companyName, ticker] of Object.entries(tickers)) {
    companies[companyName] = ticker
  }

  for (const [companyName, ticker] of Object.entries(companies)) {
    const analyzer = new Analyzer(companyName, ticker)
  }
}
