import cron from 'node-cron'
import User from '#models/user'
import QrisTransaction from '#models/qris_transaction'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

// Reset transaction_total every 1st day of the month at 00:00
cron.schedule('0 0 1 * *', async () => {
  logger.info('Running monthly transaction limit reset job...')
  try {
    await User.query().update({ transactionTotal: 0 })
    logger.info('Monthly transaction limit reset completed successfully.')
  } catch (error) {
    logger.error('Failed to reset monthly transaction limits', error)
  }
})

// Mark pending transactions as expired every hour
cron.schedule('0 * * * *', async () => {
  logger.info('Running expired transaction cleanup job...')
  try {
    const now = DateTime.now().toSQLDate()
    const result = await QrisTransaction.query()
      .where('status', 'pending')
      .where('expiredAt', '<=', now!)
      .update({ status: 'expired' })

    logger.info(`Expired transaction cleanup done. ${result} transaction(s) marked as expired.`)
  } catch (error) {
    logger.error('Failed to run expired transaction cleanup', error)
  }
})
