import User from '#models/user'
import Plan from '#models/plan'
import UserSubscription from '#models/user_subscription'
import { PaymentService } from '#services/payment_service'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

@inject()
export default class NewAccountController {
  constructor(private paymentService: PaymentService) {}

  async create({ request, inertia }: HttpContext) {
    const plans = await Plan.query().orderBy('price', 'asc')

    const planName = request.input('plan')
    const plan = planName ? (await Plan.query().where('name', planName).first())?.id : undefined

    let paymentMethods: any[] = []
    try {
      paymentMethods = await this.paymentService.getPaymentMethods()
    } catch {
      paymentMethods = []
    }

    return inertia.render('auth/signup', { plans, plan, paymentMethods })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const paymentMethod = request.input('payment_method', 'VA')

    const plan = await Plan.findOrFail(payload.planId)

    // Cari free plan sebagai fallback sementara untuk plan berbayar
    const freePlan = plan.price === 0
      ? plan
      : await Plan.query().where('price', 0).orderBy('id', 'asc').first()

    // Buat user — selalu assign planId ke free plan dulu
    // (akan di-upgrade ke plan berbayar setelah pembayaran dikonfirmasi via webhook)
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      roleId: 2,
      planId: freePlan?.id ?? null,
    })

    await auth.use('web').login(user)

    if (plan.price === 0) {
      // Plan gratis — aktifkan langsung
      await UserSubscription.create({
        userId: user.id,
        planId: plan.id,
        amount: 0,
        status: 'active',
        startsAt: DateTime.now(),
        endsAt: DateTime.fromISO('2099-12-31T23:59:59'),
      })

      return response.redirect().toRoute('dashboard')
    }

    // Plan berbayar:
    // 1. Aktifkan free plan dulu biar user bisa langsung pakai app
    if (freePlan) {
      await UserSubscription.create({
        userId: user.id,
        planId: freePlan.id,
        amount: 0,
        status: 'active',
        startsAt: DateTime.now(),
        endsAt: DateTime.fromISO('2099-12-31T23:59:59'),
      })
    }

    // 2. Buat invoice untuk plan berbayar yang dipilih
    try {
      const subscription = await this.paymentService.createSubscriptionInvoice(
        user,
        plan,
        paymentMethod
      )

      if (subscription.paymentUrl) {
        session.flash(
          'info',
          `Akun berhasil dibuat! Anda sudah bisa menggunakan plan gratis. Selesaikan pembayaran untuk mengaktifkan plan ${plan.name}.`
        )
        return response.redirect(subscription.paymentUrl)
      }
    } catch (err) {
      session.flash('error', `Gagal membuat invoice pembayaran: ${(err as Error).message}`)
    }

    // Fallback — redirect ke halaman active-plan supaya bisa bayar manual
    return response.redirect().toRoute('active-plan.index')
  }
}
