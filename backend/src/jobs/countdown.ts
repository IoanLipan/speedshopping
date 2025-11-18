import cron from 'node-cron'
import { supabase } from '../config/supabase.js'
import { notificationService } from '../services/notification.service.js'

const SUPPLY_TABLE = 'supply_items'
const SETTINGS_TABLE = 'notification_settings'

/**
 * Daily countdown job
 * Decrements quantity based on daily consumption and sends low stock notifications
 */
export async function runCountdown() {
  console.log('Running daily countdown job...')

  try {
    const { data: items, error } = await supabase
      .from(SUPPLY_TABLE)
      .select('*')

    if (error) {
      throw new Error(`Failed to fetch supply items: ${error.message}`)
    }

    let updatedCount = 0
    const lowStockByUser: Record<string, any[]> = {}

    for (const item of items || []) {
      if (item.daily_consumption > 0 && item.quantity > 0) {
        const newQuantity = Math.max(0, item.quantity - item.daily_consumption)
        const newDaysRemaining = newQuantity > 0 && item.daily_consumption > 0
          ? Math.floor(newQuantity / item.daily_consumption)
          : 0

        const { error: updateError } = await supabase
          .from(SUPPLY_TABLE)
          .update({
            quantity: newQuantity,
            days_remaining: newDaysRemaining,
            last_updated: new Date().toISOString(),
          })
          .eq('id', item.id)

        if (updateError) {
          console.error(`Failed to update item ${item.id}:`, updateError)
          continue
        }

        updatedCount++

        // Track low stock items
        if (newDaysRemaining <= item.low_stock_threshold) {
          if (!lowStockByUser[item.user_id]) {
            lowStockByUser[item.user_id] = []
          }
          lowStockByUser[item.user_id].push({
            ...item,
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
    const { data: settings, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !settings) {
      console.log(`No notification settings found for user ${userId}`)
      return
    }

    // Send email notification
    if (settings.email_notifications && settings.email) {
      await notificationService.sendLowStockEmail(settings.email, items)
      console.log(`Sent low stock email to ${settings.email}`)
    }

    // TODO: Send push notification
    if (settings.push_notifications) {
      console.log(`Push notification would be sent to user ${userId}`)
      // Implement push notifications using a service like OneSignal or Pusher
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
