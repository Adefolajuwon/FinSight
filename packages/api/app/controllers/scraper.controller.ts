import DataIngestion from '../services/Data.service.js'
import { HttpContext } from '@adonisjs/core/http'

export default class DataController {
  private scraper: DataIngestion

  constructor() {
    this.scraper = new DataIngestion()
  }

  public async pageData({ request, response }: HttpContext) {
    try {
      const url = request.input('url')
      if (!url) {
        return response.badRequest({ message: 'URL is required' })
      }

      await this.scraper.initBrowser()

      const pageTitle = await this.scraper.scrapePage(url)

      await this.scraper.closeBrowser()

      return response.ok({ title: pageTitle })
    } catch (error) {
      console.error('Error scraping page:', error)

      await this.scraper.closeBrowser()

      return response.internalServerError({
        message: 'Failed to scrape the page',
        error: error.message,
      })
    }
  }
  public async StockData() {
    try {
      const stock = await this.scraper.fetchTickerData()
      console.log(stock)
      return { stock }
    } catch (error) {
      console.log(error)
    }
  }
}
