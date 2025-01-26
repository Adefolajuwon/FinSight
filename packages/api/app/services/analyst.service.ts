import GeminiService from "./gemini.service.js";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Ensure sqlite3 has verbose mode enabled
sqlite3.verbose();

export default class Analyst{
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
    
    
    public async _getCompetitors(): Promise<string[]> {
      this.companyName = "A.O SMITH"
      
        const prompt = `Given the company name A.O SMITH and ticker "${this.ticker}", identify the top three competitors to the company. Return the result as a JSON array of ticker symbols.`;
       console.log(prompt)
       try {
        const result = await this.geminiService.Generate(prompt);
        
        // Sanitize the response: Remove backticks and trim whitespace
        const cleanedResult = result.replace(/```json|```/g, "").trim();
        
        // Attempt to parse the cleaned response as JSON
        const competitors = JSON.parse(cleanedResult);
        console.log(competitors);
    
        if (Array.isArray(competitors) && competitors.every((item) => typeof item === "string")) {
            return competitors;
        } else {
            throw new Error("Invalid response format: Expected an array of strings");
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
        revenue BIGINT,               -- Nullable for stock data rows
        earnings BIGINT,              -- Nullable for stock data rows
        competitors TEXT
    );
`;


    // Run the queries to create the tables
    await this.db.run(createStockDataTableQuery);

    console.log("Tables created or already exist.");
}

}
