import axios from 'axios'
import * as cheerio from 'cheerio'
import { db } from '../config/firebase.js'

const PRICE_HISTORY_COLLECTION = 'priceHistory'

export class PriceScraperService {
  /**
   * Scrapes price from a product URL
   * This is a basic implementation - in production, you'd need to handle
   * different e-commerce sites with different selectors
   */
  async scrapePrice(url: string): Promise<number | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })

      const $ = cheerio.load(response.data)

      // Common price selectors for popular e-commerce sites
      const priceSelectors = [
        '.price',
        '[data-price]',
        '.product-price',
        '.a-price-whole', // Amazon
        '[itemprop="price"]',
        '.price-current',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
      ]

      for (const selector of priceSelectors) {
        const element = $(selector).first()
        if (element.length > 0) {
          let priceText = element.text() || element.attr('content') || ''

          // Extract numbers from price text
          const priceMatch = priceText.match(/[\d,]+\.?\d*/);
          if (priceMatch) {
            const price = parseFloat(priceMatch[0].replace(',', ''))
            if (!isNaN(price)) {
              return price
            }
          }
        }
      }

      return null
    } catch (error) {
      console.error('Price scraping error:', error)
      return null
    }
  }

  /**
   * Saves price to history
   */
  async savePriceHistory(itemId: string, price: number): Promise<void> {
    await db.collection(PRICE_HISTORY_COLLECTION).add({
      itemId,
      price,
      scrapedAt: new Date(),
    })
  }

  /**
   * Gets price history for an item
   */
  async getPriceHistory(itemId: string, limit: number = 30): Promise<Array<{ price: number; scrapedAt: Date }>> {
    const snapshot = await db
      .collection(PRICE_HISTORY_COLLECTION)
      .where('itemId', '==', itemId)
      .orderBy('scrapedAt', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map(doc => ({
      price: doc.data().price,
      scrapedAt: doc.data().scrapedAt.toDate(),
    }))
  }

  /**
   * Scrapes price and saves to history
   */
  async scrapePriceAndSave(itemId: string, url: string): Promise<{ price: number | null; scrapedAt: Date }> {
    const price = await this.scrapePrice(url)
    const scrapedAt = new Date()

    if (price !== null) {
      await this.savePriceHistory(itemId, price)
    }

    return { price, scrapedAt }
  }
}

export const priceScraperService = new PriceScraperService()
