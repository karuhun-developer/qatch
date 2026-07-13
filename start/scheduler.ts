import cron from 'node-cron'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

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
