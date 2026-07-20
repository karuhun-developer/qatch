import { PaywuzClient, verifyWebhookSignature } from 'paywuz-sdk'
import paywuzConfig from '#config/paywuz'
import User from '#models/user'
import Plan from '#models/plan'
import UserSubscription from '#models/user_subscription'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

export class PaymentService {
  private client: PaywuzClient

  constructor() {
    this.client = new PaywuzClient({ apiKey: paywuzConfig.apiKey })
  }

  /**
   * Buat tagihan baru untuk berlangganan plan.
   * Kalau user sudah punya subscription pending untuk plan yang sama,
   * akan dikembalikan yang existing (idempotent via paywuz orderId).
   */
  async createSubscriptionInvoice(
    user: User,
    plan: Plan,
    paymentMethod: string = 'VA'
  ): Promise<UserSubscription> {
    // Cek apakah sudah ada invoice pending untuk plan ini
    const existing = await UserSubscription.query()
      .where('userId', user.id)
      .where('planId', plan.id)
      .where('status', 'pending')
      .orderBy('createdAt', 'desc')
      .first()

    if (existing) {
      return existing
    }

    // Buat order ID unik: SUB-{userId}-{timestamp}
    const orderId = `SUB-${user.id}-${Date.now()}`

    // Buat transaksi di Paywuz
    const tx = await this.client.createTransaction({
      orderId,
      amount: plan.price,
      paymentMethod,
      expiryMinutes: 1440, // 24 jam untuk bayar
      metadata: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
      },
    })

    // Simpan ke database
    const subscription = await UserSubscription.create({
      userId: user.id,
      planId: plan.id,
      orderId,
      paywuzTransactionId: tx.id,
      paymentMethod: tx.paymentMethod ?? paymentMethod,
      paymentUrl: tx.paymentUrl ?? null,
      paymentNumber: tx.paymentNumber ?? null,
      amount: plan.price,
      status: 'pending',
    })

    return subscription
  }

  /**
   * Aktivasi subscription setelah pembayaran dikonfirmasi.
   * Dipanggil dari webhook handler.
   */
  async activateSubscription(orderId: string): Promise<void> {
    const subscription = await UserSubscription.query()
      .where('orderId', orderId)
      .preload('plan')
      .firstOrFail()

    if (subscription.status === 'active') {
      logger.warn(`Subscription ${orderId} already active, skipping activation`)
      return
    }

    const now = DateTime.now()
    const endsAt = now.plus({ days: 30 })

    // Update subscription ke aktif
    subscription.status = 'active'
    subscription.paidAt = now
    subscription.startsAt = now
    subscription.endsAt = endsAt
    await subscription.save()

    // Update planId di user
    await User.query().where('id', subscription.userId).update({
      planId: subscription.planId,
    })

    logger.info(
      `Subscription ${orderId} activated for user ${subscription.userId}, plan ${subscription.planId}, expires ${endsAt.toISO()}`
    )
  }

  /**
   * Batalkan invoice yang masih pending
   */
  async cancelPendingInvoice(subscriptionId: number, userId: number): Promise<void> {
    const subscription = await UserSubscription.query()
      .where('id', subscriptionId)
      .where('userId', userId)
      .where('status', 'pending')
      .firstOrFail()

    // Coba cancel di Paywuz
    if (subscription.orderId) {
      try {
        await this.client.cancelTransaction(subscription.orderId)
      } catch (err) {
        logger.warn(`Could not cancel Paywuz transaction ${subscription.orderId}: ${err}`)
      }
    }

    subscription.status = 'cancelled'
    await subscription.save()
  }

  /**
   * Ambil daftar payment method yang tersedia
   */
  async getPaymentMethods() {
    return await this.client.listPaymentMethods()
  }

  /**
   * Cek status transaksi dari Paywuz secara langsung
   */
  async checkTransactionStatus(orderId: string) {
    return await this.client.getTransaction(orderId)
  }

  /**
   * Verifikasi signature webhook dari Paywuz.
   * @returns true jika signature valid
   */
  verifyWebhook(rawBody: string, signature: string | string[] | undefined): boolean {
    if (!signature || Array.isArray(signature)) return false
    return verifyWebhookSignature(rawBody, paywuzConfig.apiKey, signature)
  }
}
