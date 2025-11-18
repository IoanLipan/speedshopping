import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import type { SupplyItem } from '../types/index.js'

dotenv.config()

export class NotificationService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendLowStockEmail(email: string, items: SupplyItem[]): Promise<void> {
    const itemsList = items
      .map(item => `- ${item.name}: ${item.daysRemaining} days remaining`)
      .join('\n')

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '⚠️ Low Stock Alert - SpeedShopping',
      text: `You have ${items.length} item(s) running low:\n\n${itemsList}\n\nPlease restock soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Low Stock Alert</h2>
          <p>You have <strong>${items.length}</strong> item(s) running low:</p>
          <ul>
            ${items.map(item => `
              <li style="margin: 10px 0;">
                <strong>${item.name}</strong>: ${item.daysRemaining} days remaining
                ${item.productUrl ? `<br><a href="${item.productUrl}" style="color: #0ea5e9;">View Product</a>` : ''}
                ${item.addToCartUrl ? `<br><a href="${item.addToCartUrl}" style="color: #10b981;">Add to Cart</a>` : ''}
              </li>
            `).join('')}
          </ul>
          <p>Please restock soon!</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
            SpeedShopping - Smart Inventory Manager
          </p>
        </div>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Low stock email sent to ${email}`)
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  async sendPriceAlertEmail(email: string, itemName: string, oldPrice: number, newPrice: number, productUrl?: string): Promise<void> {
    const priceChange = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1)
    const isIncrease = newPrice > oldPrice

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `${isIncrease ? '📈' : '📉'} Price Alert: ${itemName} - SpeedShopping`,
      text: `Price update for ${itemName}:\n\nOld price: $${oldPrice.toFixed(2)}\nNew price: $${newPrice.toFixed(2)}\nChange: ${isIncrease ? '+' : ''}${priceChange}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${isIncrease ? '#dc2626' : '#10b981'};">
            ${isIncrease ? '📈' : '📉'} Price ${isIncrease ? 'Increase' : 'Drop'} Alert
          </h2>
          <p>Price update for <strong>${itemName}</strong>:</p>
          <table style="margin: 20px 0;">
            <tr>
              <td style="padding: 5px 10px;">Old price:</td>
              <td style="padding: 5px 10px;"><strong>$${oldPrice.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 5px 10px;">New price:</td>
              <td style="padding: 5px 10px;"><strong style="color: ${isIncrease ? '#dc2626' : '#10b981'};">$${newPrice.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 5px 10px;">Change:</td>
              <td style="padding: 5px 10px;"><strong>${isIncrease ? '+' : ''}${priceChange}%</strong></td>
            </tr>
          </table>
          ${productUrl ? `<p><a href="${productUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a></p>` : ''}
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
            SpeedShopping - Smart Inventory Manager
          </p>
        </div>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Price alert email sent to ${email}`)
    } catch (error) {
      console.error('Failed to send price alert email:', error)
      throw error
    }
  }
}

export const notificationService = new NotificationService()
