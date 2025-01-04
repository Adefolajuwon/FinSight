import puppeteer from 'puppeteer';
import fs from 'fs/promises';

export default class TickerScraper {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async fetchTickers(): Promise<{ [key: string]: string }> {
        console.log("[Scraping ticker data from Wikipedia]");
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(this.url, { waitUntil: 'domcontentloaded' });
    
            const tickers: { [key: string]: string } = await page.evaluate(() => {
                const tickersObject: { [key: string]: string } = {};
                const rows = document.querySelectorAll('table.wikitable tbody tr');
    
                rows.forEach((row) => {
                    const tickerCell = row.querySelector('td:nth-child(1)');
                    const companyCell = row.querySelector('td:nth-child(2)');
    
                    if (tickerCell && companyCell) {
                        const ticker = tickerCell.textContent?.trim();
                        const company = companyCell.textContent?.trim();
    
                        if (ticker && company) {
                            tickersObject[ticker] = company;
                        }
                    }
                });
                return tickersObject;
            });
    
            return tickers;
        } catch (error) {
            console.error("Error while fetching tickers:", error);
            throw error; // Rethrow for higher-level handling
        } finally {
            if (browser) await browser.close();
        }
    }
    

    async getTickersAndSave(): Promise<void> {
        const tickers = await this.fetchTickers();
        console.log('S&P 500 Tickers:', tickers);
        
        // Save the tickers to a JSON file
        const filePath = './sp500_tickers.json';
        await fs.writeFile(filePath, JSON.stringify(tickers, null, 2));
        console.log(`Tickers saved to ${filePath}`);
    }
}

const wiki = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';
const scraper = new TickerScraper(wiki);
scraper.getTickersAndSave();
