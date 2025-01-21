import GeminiService from "./gemini.service.js";
import * as sqlite3 from "sqlite3";
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
            driver: sqlite3.Database, // Ensure this correctly references sqlite3
        });
    
        console.log("Database connection established.");
        await this._createTable();
    }
    
    
    public async _getCompetitors(): Promise<string[]> {
        this.ticker = "AOS";
        this.companyName = "A. O. Smith";
      
        const prompt = `Given the company name "${this.companyName}" and ticker "${this.ticker}", identify the top three competitors to the company. Return the result as a JSON array of ticker symbols.`;
      
        try {
          const result = await this.geminiService.Generate(prompt); // result is likely a JSON string
      
          // Attempt to parse the response as JSON
          const competitors = JSON.parse(result);
      
          if (Array.isArray(competitors) && competitors.every((item) => typeof item === "string")) {
            return competitors;
          } else {
            throw new Error("Invalid response format: Expected a JSON array of strings.");
          }
        } catch (error) {
          console.error("Error fetching competitors:", error);
          throw new Error("Failed to fetch competitors.");
        }
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
        competitors TEXT,
    );
`;


    // Run the queries to create the tables
    await this.db.run(createStockDataTableQuery);

    console.log("Tables created or already exist.");
}

}
(async () => {
    const analyst = new Analyst("AOS"); // Create an instance with a ticker
    try {
        const competitors = await analyst._getCompetitors();
        console.log("Competitors:", competitors);
    } catch (error) {
        console.error("Error:", error);
    }
})();