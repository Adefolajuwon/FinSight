import GeminiService from "./gemini.service.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default class Analyst {
    private geminiService: GeminiService;
    ticker: string;
    companyName?: string; 
    private db: sqlite3.Database | null = null;


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
  
      // Ensure the table exists.
      await this._createTable();
    }
    public async fetchRecords(): Promise<any[]> {
      if (!this.db) throw new Error("Database connection not initialized.");
      const selectSQL = `SELECT * FROM analysts WHERE ticker = ?`;
      const records = await this.db.all(selectSQL, [this.ticker]);
      return records;
    }
    
    private async _createTable(): Promise<void> {
      if (!this.db) throw new Error("Database connection not initialized.");
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS analysts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ticker TEXT NOT NULL,
          companyName TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await this.db.exec(createTableSQL);
      console.log("Table 'analysts' is ready.");
    }
    public async closeDB(): Promise<void> {
      if (this.db) {
        await this.db.close();
        console.log("Database connection closed.");
      }
    }
  }
  