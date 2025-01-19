import GeminiService from "./gemini.service.js";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";


export default class Analyst {
    private geminiService: GeminiService;
    ticker: string;
    companyName?: string; 
    private db: Database | null = null; // Adjusted to Database from sqlite package

    constructor(ticker: string) {
        this.ticker = ticker;
        this.geminiService = new GeminiService(); 
    }

         public async initializeDB(dbPath: string = "stock.db"): Promise<void> {
        this.db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        console.log("Database connection established.");
        
        await this._createTable();
    }
    private async _getCompetitors(): Promise<string> {
      this.ticker = "AOS";
      this.companyName = "A. O. Smith";
  
      const prompt = `Given the company name "${this.companyName}" and ticker "${this.ticker}", identify the top three competitors to the company`;
      const result = await this.geminiService.Generate(prompt);
      console.log(result);
      return result
  }
  
  private async _createTable(): Promise<void> {
    if (!this.db) {
        console.error("Database not initialized.");
        return;
    }

    const createStockDataTableQuery= `
    CREATE TABLE IF NOT EXISTS unified_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        company_name TEXT,            -- Only for stock data
        news_sentiment TEXT,          -- Only for stock data
        period_type TEXT,             -- 'yearly' or 'quarterly' for financial data
        period TEXT,                  -- 'year' for yearly or 'quarter' for quarterly
        revenue BIGINT,               -- Nullable for stock data rows
        earnings BIGINT,              -- Nullable for stock data rows
        UNIQUE (ticker, period_type, period)  -- Ensures no duplicate entries for the same period and ticker
    );
`;


    // Run the queries to create the tables
    await this.db.run(createStockDataTableQuery);

    console.log("Tables created or already exist.");
}

}
