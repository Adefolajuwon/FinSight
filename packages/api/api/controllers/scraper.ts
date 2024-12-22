import Scraper from '../services/scraper.js';
import { HttpContext } from '@adonisjs/core/http'


export default class ScrapePage {
  private scraper: Scraper;

  constructor() {
    this.scraper = new Scraper();
  }

  public async pageData({ request, response }: HttpContextContract) {
    try {
      const url = request.input('url');
      if (!url) {
        return response.badRequest({ message: 'URL is required' });
      }

      await this.scraper.initBrowser();

      const pageTitle = await this.scraper.scrapePage(url);

      await this.scraper.closeBrowser();

      return response.ok({ title: pageTitle });
    } catch (error) {
      console.error('Error scraping page:', error);

      await this.scraper.closeBrowser();

      return response.internalServerError({
        message: 'Failed to scrape the page',
        error: error.message,
      });
    }
  }
}
