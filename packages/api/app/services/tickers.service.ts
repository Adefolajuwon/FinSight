import puppeteer from 'puppeteer'

export default class TickerScraper {
    private url: string

    constructor(url: string){
        this.url = url
    }


  async fetchTickers(): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(this.url, { waitUntil: 'domcontentloaded' });

    // Scraping S&P 500 tickers from the Wikipedia page
    const tickers: string[] = await page.evaluate(() => {
        const tickersArray: string[] = [];
        // Scrape all tickers in the table with class 'wikitable'
        const rows = document.querySelectorAll('table.wikitable tbody tr');

        rows.forEach((row) => {
            const tickerCell = row.querySelector('td:nth-child(1)'); // The first column for tickers
            if (tickerCell) {
                const ticker = tickerCell.textContent?.trim();
                if (ticker) {
                    tickersArray.push(ticker);
                }
            }
        });
        return tickersArray;
    });

    await browser.close();
    return tickers;
}
async gettickers(){
    const tickers = await this.fetchTickers()
    console.log('S&P 500 Tickers:', tickers);
    return tickers
}

}

const wiki = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
const scraper = new TickerScraper(wiki)
scraper.gettickers()
