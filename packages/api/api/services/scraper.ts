import puppeteer, { Browser, Page } from 'puppeteer'

export default class Scraper {
  private browser: Browser | null = null

  // Initialize the browser
  async initBrowser(headless: boolean = true): Promise<void> {
    this.browser = await puppeteer.launch({ headless })
  }

  // Close the browser
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  // Get a new page instance
  private async getPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initBrowser() first.')
    }
    return await this.browser.newPage()
  }

  // Navigate to a URL and log the page title
  async scrapePage(url: string): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initBrowser() first.')
    }

    const page = await this.getPage()

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      console.log(`Page Title: ${await page.title()}`)
    } catch (error) {
      console.error('Error scraping page:', error)
    } finally {
      await page.close() // Ensure the page is closed even if an error occurs
    }
  }
}
