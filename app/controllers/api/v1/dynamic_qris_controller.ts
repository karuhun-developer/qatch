import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DynamicQrisService from '#services/dynamic_qris_service'
import WebhookService from '#services/webhook_service'
import { generateDynamicQrisValidator, updateDynamicQrisStatusValidator } from '#validators/qris_transaction'
import QrisTransaction from '#models/qris_transaction'
import { DateTime } from 'luxon'

@inject()
export default class DynamicQrisController {
  constructor(
    protected dynamicQrisService: DynamicQrisService,
    protected webhookService: WebhookService
  ) {}

  async show({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const transaction = await QrisTransaction.query()
      .where('id', params.id)
      .where('userId', user.id)
      .first()

    if (!transaction) {
      return response.notFound({ message: 'Dynamic QRIS not found' })
    }

    return response.ok({
      message: 'Success get dynamic QRIS',
      data: transaction
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(generateDynamicQrisValidator)
    const user = auth.user!

    const transaction = await this.dynamicQrisService.generateDynamicQris({
      ...payload,
      userId: user.id,
      expiredHours: payload.expiredHours || 24
    })

    return response.created({
      message: 'Dynamic QRIS generated successfully',
      data: transaction
    })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateDynamicQrisStatusValidator)
    const user = auth.user!
    const string = (await import('@adonisjs/core/helpers/string')).default
    const app = (await import('@adonisjs/core/services/app')).default

    const transaction = await QrisTransaction.query()
      .where('id', params.id)
      .where('userId', user.id)
      .first()

    if (!transaction) {
      return response.notFound({ message: 'Dynamic QRIS not found' })
    }

    transaction.status = payload.status

    if (payload.status === 'paid') {
      transaction.paidAt = DateTime.now()
      
      if (payload.proof) {
        await payload.proof.move(app.makePath('public/uploads/proofs'), {
          name: `${string.random(32)}.${payload.proof.extname}`
        })
        transaction.proof = `uploads/proofs/${payload.proof.fileName}`
      }

      if (user.webhookUrl) {
        this.webhookService.dispatchTransactionPaid(user.webhookUrl, user.hmacKey, transaction.toJSON())
      }
    } else {
      transaction.paidAt = null
      transaction.proof = null
    }

    await transaction.save()

    return response.ok({
      message: 'Dynamic QRIS status updated successfully',
      data: transaction
    })
  }

  async callback({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const payload = request.only(['app_name', 'notification_title', 'notification_text', 'timestamp_ms'])
    
    if (!payload.notification_text) {
      return response.badRequest({ message: 'notification_text is required' })
    }

    // --- Webhook Settings Validation ---
    
    // 1. Check listen apps
    if (user.webhookListenApps) {
      const allowedApps = user.webhookListenApps.split(',').map(a => a.trim().toLowerCase())
      const currentApp = (payload.app_name || '').toLowerCase()
      if (allowedApps.length > 0 && currentApp && !allowedApps.includes(currentApp)) {
        return response.ok({ message: `Ignored: App '${payload.app_name}' is not in listenApps` })
      }
    }

    // 2. Check title wildcards (OR logic — match any one)
    if (user.webhookTitleWildcard) {
      const titleStr = (payload.notification_title || '').toLowerCase()
      const wildcards = user.webhookTitleWildcard.split(',').map((w: string) => w.trim().toLowerCase()).filter(Boolean)
      const matched = wildcards.some((w: string) => titleStr.includes(w))
      if (!matched) {
        return response.ok({ message: `Ignored: Title does not match any wildcard` })
      }
    }

    // 3. Check text wildcards (OR logic — match any one)
    if (user.webhookTextWildcard) {
      const textStr = (payload.notification_text || '').toLowerCase()
      const wildcards = user.webhookTextWildcard.split(',').map((w: string) => w.trim().toLowerCase()).filter(Boolean)
      const matched = wildcards.some((w: string) => textStr.includes(w))
      if (!matched) {
        return response.ok({ message: `Ignored: Text does not match any wildcard` })
      }
    }

    // --- End Webhook Settings Validation ---

    // Ambil semua transaksi yang masih pending milik user ini
    const pendingTransactions = await QrisTransaction.query()
      .where('userId', user.id)
      .where('status', 'pending')
      .where('expired_at', '>', DateTime.now().toSQL())

    // Ekstrak semua angka yang muncul di teks notifikasi
    // Contoh: "Pembayaran Rp 50.021 diterima" → [50021]
    const numbersInText = [...payload.notification_text.matchAll(/[\d.,]+/g)]
      .map((m) => parseInt(m[0].replace(/[.,]/g, ''), 10))
      .filter((n) => !isNaN(n))

    let matchedTransaction: QrisTransaction | null = null

    for (const tx of pendingTransactions) {
      // total sudah mencakup amount + uniqueCode, jadi ini yang muncul di mutasi bank
      const expectedTotal = tx.total
      if (numbersInText.includes(expectedTotal)) {
        matchedTransaction = tx
        break
      }
    }

    if (matchedTransaction) {
      matchedTransaction.status = 'paid'
      matchedTransaction.paidAt = DateTime.now()
      await matchedTransaction.save()

      if (user.webhookUrl) {
        this.webhookService.dispatchTransactionPaid(user.webhookUrl, user.hmacKey, matchedTransaction.toJSON())
      }

      return response.ok({
        message: 'Callback processed successfully, transaction marked as paid',
        data: matchedTransaction
      })
    }

    return response.ok({
      message: 'Callback processed, but no matching pending transaction found',
    })
  }
}