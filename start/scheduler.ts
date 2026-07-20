import cron from 'node-cron'
import User from '#models/user'
import Plan from '#models/plan'
import QrisTransaction from '#models/qris_transaction'
import UserSubscription from '#models/user_subscription'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

// ─── Reset transaction_total setiap tanggal 1 jam 00:00 ─────────────────────
cron.schedule('0 0 1 * *', async () => {
  logger.info('Running monthly transaction limit reset job...')
  try {
    await User.query().update({ transactionTotal: 0 })
    logger.info('Monthly transaction limit reset completed successfully.')
  } catch (error) {
    logger.error('Failed to reset monthly transaction limits', error)
  }
})

// ─── Mark pending QRIS transactions as expired setiap jam ───────────────────
cron.schedule('0 * * * *', async () => {
  logger.info('Running expired QRIS transaction cleanup job...')
  try {
    const now = DateTime.now().toSQLDate()
    const result = await QrisTransaction.query()
      .where('status', 'pending')
      .where('expiredAt', '<=', now!)
      .update({ status: 'expired' })

    logger.info(`Expired QRIS transaction cleanup done. ${result} transaction(s) marked as expired.`)
  } catch (error) {
    logger.error('Failed to run expired QRIS transaction cleanup', error)
  }
})

// ─── Cek subscription yang expired setiap jam ────────────────────────────────
// Kalau subscription aktif sudah melewati ends_at, tandai sebagai expired
// dan buat invoice baru (tagihan bulan berikutnya).
cron.schedule('30 * * * *', async () => {
  logger.info('Running subscription expiry check job...')
  try {
    const now = DateTime.now().toSQL()!

    // Ambil semua subscription aktif yang sudah melewati ends_at
    const expiredSubs = await UserSubscription.query()
      .where('status', 'active')
      .where('ends_at', '<', now)
      .preload('user')
      .preload('plan')

    if (expiredSubs.length === 0) {
      logger.info('No expired subscriptions found.')
      return
    }

    logger.info(`Found ${expiredSubs.length} expired subscription(s), processing...`)

    for (const sub of expiredSubs) {
      // Tandai subscription lama sebagai expired
      sub.status = 'expired'
      await sub.save()

      const plan = sub.plan
      const user = sub.user

      // Kalau plan berbayar → buat invoice baru (tagihan bulan berikutnya)
      if (plan.price > 0) {
        const orderId = `SUB-${user.id}-${Date.now()}`

        // Import PaywuzClient di sini untuk menghindari circular dependency di top-level
        const { PaywuzClient } = await import('paywuz-sdk')
        const paywuzConfig = (await import('#config/paywuz')).default
        const client = new PaywuzClient({ apiKey: paywuzConfig.apiKey })

        let paymentUrl: string | null = null
        let paywuzTxId: string | null = null
        let paymentNumber: string | null = null
        let paymentMethod: string | null = 'VA'

        try {
          const tx = await client.createTransaction({
            orderId,
            amount: plan.price,
            paymentMethod: 'VA',
            expiryMinutes: 1440, // 24 jam
            metadata: {
              userId: user.id,
              planId: plan.id,
              planName: plan.name,
              type: 'renewal',
            },
          })
          paymentUrl = tx.paymentUrl ?? null
          paywuzTxId = tx.id ?? null
          paymentNumber = tx.paymentNumber ?? null
          paymentMethod = tx.paymentMethod ?? 'VA'

          logger.info(
            `Created renewal invoice ${orderId} for user ${user.id} plan ${plan.name} — paymentUrl: ${paymentUrl}`
          )
        } catch (paywuzErr) {
          logger.error(
            `Failed to create Paywuz renewal for user ${user.id}: ${paywuzErr}`
          )
        }

        await UserSubscription.create({
          userId: user.id,
          planId: plan.id,
          orderId,
          paywuzTransactionId: paywuzTxId,
          paymentMethod,
          paymentUrl,
          paymentNumber,
          amount: plan.price,
          status: 'pending',
        })

        logger.info(`Renewal invoice created for user ${user.id}, plan ${plan.name}.`)
      } else {
        // Plan gratis — perpanjang otomatis tanpa tagihan
        await UserSubscription.create({
          userId: user.id,
          planId: plan.id,
          amount: 0,
          status: 'active',
          startsAt: DateTime.now(),
          endsAt: DateTime.fromISO('2099-12-31T23:59:59'),
        })
        logger.info(`Free plan auto-renewed for user ${user.id}.`)
      }

      // Jika tidak ada subscription aktif lain, downgrade ke free tier
      // supaya user tetap bisa pakai aplikasi sambil menunggu pembayaran renewal.
      const stillActive = await UserSubscription.query()
        .where('userId', user.id)
        .where('status', 'active')
        .where('ends_at', '>', now)
        .first()

      if (!stillActive) {
        const freePlan = await Plan.query().where('price', 0).orderBy('id', 'asc').first()

        if (freePlan) {
          // Buat subscription free tier aktif
          await UserSubscription.create({
            userId: user.id,
            planId: freePlan.id,
            amount: 0,
            status: 'active',
            startsAt: DateTime.now(),
            endsAt: DateTime.fromISO('2099-12-31T23:59:59'),
          })

          // Update planId user ke free plan
          await User.query().where('id', user.id).update({ planId: freePlan.id })
          logger.info(
            `User ${user.id} downgraded to free plan '${freePlan.name}' (subscription expired, renewal invoice pending).`
          )
        } else {
          // Tidak ada free plan — biarkan planId tetap seperti sebelumnya agar tidak blank
          logger.warn(
            `No free plan found to downgrade user ${user.id}. planId left unchanged.`
          )
        }
      }
    }

    logger.info('Subscription expiry check completed.')
  } catch (error) {
    logger.error('Failed to run subscription expiry check', error)
  }
})
