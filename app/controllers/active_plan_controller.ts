import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Plan from '#models/plan'
import UserSubscription from '#models/user_subscription'
import { PaymentService } from '#services/payment_service'
import { DateTime } from 'luxon'

@inject()
export default class ActivePlanController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Halaman Active Plan — tampilkan plan yang tersedia,
   * subscription aktif milik user, dan invoice pending.
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const plans = await Plan.query().orderBy('price', 'asc')

    // Subscription aktif milik user
    const activeSubscriptionRow = await UserSubscription.query()
      .where('userId', user.id)
      .where('status', 'active')
      .where('ends_at', '>', DateTime.now().toSQL()!)
      .preload('plan')
      .orderBy('endsAt', 'desc')
      .first()

    // Invoice pending yang belum dibayar
    const pendingInvoiceRows = await UserSubscription.query()
      .where('userId', user.id)
      .where('status', 'pending')
      .preload('plan')
      .orderBy('createdAt', 'desc')

    // Payment methods yang tersedia
    let paymentMethods: any[] = []
    try {
      paymentMethods = await this.paymentService.getPaymentMethods()
    } catch {
      paymentMethods = []
    }

    // Serialize ke plain object agar relasi 'plan' tidak hilang saat Inertia serializes
    const activeSubscription = activeSubscriptionRow
      ? {
          id: activeSubscriptionRow.id,
          planId: activeSubscriptionRow.planId,
          amount: activeSubscriptionRow.amount,
          status: activeSubscriptionRow.status,
          startsAt: activeSubscriptionRow.startsAt?.toISO() ?? null,
          endsAt: activeSubscriptionRow.endsAt?.toISO() ?? null,
          paidAt: activeSubscriptionRow.paidAt?.toISO() ?? null,
          plan: {
            id: activeSubscriptionRow.plan.id,
            name: activeSubscriptionRow.plan.name,
            price: activeSubscriptionRow.plan.price,
          },
        }
      : null

    const pendingInvoices = pendingInvoiceRows.map((inv) => ({
      id: inv.id,
      planId: inv.planId,
      orderId: inv.orderId,
      paymentUrl: inv.paymentUrl,
      paymentNumber: inv.paymentNumber,
      paymentMethod: inv.paymentMethod,
      amount: inv.amount,
      status: inv.status,
      createdAt: inv.createdAt.toISO(),
      plan: {
        id: inv.plan.id,
        name: inv.plan.name,
        price: inv.plan.price,
      },
    }))

    return inertia.render('active_plan/index', {
      plans,
      activeSubscription,
      pendingInvoices,
      paymentMethods,
      currentPlanId: user.planId,
    })
  }

  /**
   * Buat tagihan untuk plan baru (upgrade/beli plan baru).
   * Kalau plan gratis (price === 0), langsung aktifkan tanpa bayar.
   */
  async subscribe({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const planId = request.input('plan_id')
    const paymentMethod = request.input('payment_method', 'VA')

    const plan = await Plan.findOrFail(planId)

    // Plan gratis — langsung aktifkan
    if (plan.price === 0) {
      // Expire subscription aktif sebelumnya
      await UserSubscription.query()
        .where('userId', user.id)
        .where('status', 'active')
        .update({ status: 'expired' })

      // Buat subscription aktif tanpa tagihan
      await UserSubscription.create({
        userId: user.id,
        planId: plan.id,
        amount: 0,
        status: 'active',
        startsAt: DateTime.now(),
        endsAt: DateTime.fromISO('2099-12-31T23:59:59'), // "unlimited" untuk plan gratis
      })

      // Update planId di user
      await user.merge({ planId: plan.id }).save()

      session.flash('success', `Plan ${plan.name} berhasil diaktifkan!`)
      return response.redirect().toRoute('active-plan.index')
    }

    // Plan berbayar — buat invoice Paywuz
    try {
      const subscription = await this.paymentService.createSubscriptionInvoice(
        user,
        plan,
        paymentMethod
      )

      // Kalau ada payment URL, redirect ke sana
      if (subscription.paymentUrl) {
        return response.redirect(subscription.paymentUrl)
      }

      session.flash(
        'success',
        `Invoice berhasil dibuat! Silakan selesaikan pembayaran untuk mengaktifkan plan ${plan.name}.`
      )
      return response.redirect().toRoute('active-plan.index')
    } catch (err) {
      session.flash('error', `Gagal membuat invoice: ${(err as Error).message}`)
      return response.redirect().back()
    }
  }

  /**
   * Batalkan invoice pending
   */
  async cancelInvoice({ params, response, auth, session }: HttpContext) {
    const user = auth.user!

    try {
      await this.paymentService.cancelPendingInvoice(params.id, user.id)
      session.flash('success', 'Invoice berhasil dibatalkan.')
    } catch (err) {
      session.flash('error', `Gagal membatalkan invoice: ${(err as Error).message}`)
    }

    return response.redirect().toRoute('active-plan.index')
  }

  /**
   * Webhook handler — dipanggil Paywuz saat status pembayaran berubah.
   * Tidak butuh auth karena ini callback dari pihak ketiga.
   */
  async webhook({ request, response }: HttpContext) {
    const rawBody = JSON.stringify(request.body())
    const signature = request.header('x-paywuz-signature')
    const event = request.header('x-paywuz-event')

    // Verifikasi signature
    if (!this.paymentService.verifyWebhook(rawBody, signature)) {
      return response.status(403).json({ message: 'Invalid signature' })
    }

    const payload = request.body() as {
      orderId: string
      status: string
    }

    try {
      switch (event) {
        case 'transaction.paid':
        case 'transaction.settlement':
          if (payload.orderId?.startsWith('SUB-')) {
            await this.paymentService.activateSubscription(payload.orderId)
          }
          break

        case 'transaction.failed':
        case 'transaction.cancelled':
          // Optional: update status subscription ke cancelled
          await UserSubscription.query()
            .where('orderId', payload.orderId)
            .where('status', 'pending')
            .update({ status: 'cancelled' })
          break
      }
    } catch (err) {
      // Jangan throw — Paywuz harus dapat 200 supaya tidak retry terus
      console.error('[PaywuzWebhook] Error processing webhook:', err)
    }

    return response.json({ message: 'OK' })
  }
}
