import cron from 'node-cron'
import { db } from '../config/firebase.js'
import { notificationService } from '../services/notification.service.js'

const SUPPLY_COLLECTION = 'supplyItems'
const SETTINGS_COLLECTION = 'notificationSettings'

/**
 * Daily countdown job
 * Decrements quantity based on daily consumption and sends low stock notifications
 */
export async function runCountdown() {
  console.log('Running daily countdown job...')

  try {
    const snapshot = await db.collection(SUPPLY_COLLECTION).get()
    let updatedCount = 0
    const lowStockByUser: Record<string, any[]> = {}

    for (const doc of snapshot.docs) {
      const item = doc.data()

      if (item.dailyConsumption > 0 && item.quantity > 0) {
        const newQuantity = Math.max(0, item.quantity - item.dailyConsumption)
        const newDaysRemaining = newQuantity > 0 && item.dailyConsumption > 0
          ? Math.floor(newQuantity / item.dailyConsumption)
          : 0

        await doc.ref.update({
          quantity: newQuantity,
          daysRemaining: newDaysRemaining,
          lastUpdated: new Date(),
        })

        updatedCount++

        // Track low stock items
        if (newDaysRemaining <= item.lowStockThreshold) {
          if (!lowStockByUser[item.userId]) {
            lowStockByUser[item.userId] = []
          }
          lowStockByUser[item.userId].push({
            ...item,
            id: doc.id,
            quantity: newQuantity,
            daysRemaining: newDaysRemaining,
          })
        }
      }
    }

    console.log(`Updated ${updatedCount} items`)

    // Send notifications for low stock items
    for (const [userId, items] of Object.entries(lowStockByUser)) {
      await sendLowStockNotifications(userId, items)
    }

    console.log('Countdown job completed')
  } catch (error) {
    console.error('Countdown job error:', error)
  }
}

async function sendLowStockNotifications(userId: string, items: any[]) {
  try {
    // Get user's notification settings
    const settingsDoc = await db.collection(SETTINGS_COLLECTION).doc(userId).get()
    const settings = settingsDoc.data()

    if (!settings) {
      console.log(`No notification settings found for user ${userId}`)
      return
    }

    // Send email notification
    if (settings.emailNotifications && settings.email) {
      await notificationService.sendLowStockEmail(settings.email, items)
      console.log(`Sent low stock email to ${settings.email}`)
    }

    // TODO: Send push notification
    if (settings.pushNotifications) {
      console.log(`Push notification would be sent to user ${userId}`)
      // Implement push notifications using Firebase Cloud Messaging
    }
  } catch (error) {
    console.error(`Failed to send notifications for user ${userId}:`, error)
  }
}

/**
 * Schedule the countdown job to run daily at midnight
 */
export function scheduleCountdown() {
  // Run every day at midnight
  cron.schedule('0 0 * * *', runCountdown)
  console.log('Countdown job scheduled to run daily at midnight')
}

// If running this file directly, execute the job once
if (import.meta.url === `file://${process.argv[1]}`) {
  runCountdown().then(() => {
    console.log('Job completed, exiting...')
    process.exit(0)
  })
}
