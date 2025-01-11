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

    // Create the stock_data table if it doesn't already exist
    const createStockDataTableQuery = `
        CREATE TABLE IF NOT EXISTS stock_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL,
            company_name TEXT,
            news_sentiment TEXT
        );
    `;

    // Create the financials_yearly table if it doesn't already exist
    const createFinancialsYearlyTableQuery = `
        CREATE TABLE IF NOT EXISTS financials_yearly (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL,
            year INTEGER NOT NULL,
            revenue BIGINT NOT NULL,
            earnings BIGINT NOT NULL,
            UNIQUE (ticker, year)  -- Ensure no duplicate entries for the same year and ticker
        );
    `;

    // Create the financials_quarterly table if it doesn't already exist
    const createFinancialsQuarterlyTableQuery = `
        CREATE TABLE IF NOT EXISTS financials_quarterly (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL,
            quarter TEXT NOT NULL,
            revenue BIGINT NOT NULL,
            earnings BIGINT NOT NULL,
            UNIQUE (ticker, quarter)  -- Ensure no duplicate entries for the same quarter and ticker
        );
    `;

    // Run the queries to create the tables
    await this.db.run(createStockDataTableQuery);
    await this.db.run(createFinancialsYearlyTableQuery);
    await this.db.run(createFinancialsQuarterlyTableQuery);

    console.log("Tables created or already exist.");
}
}
