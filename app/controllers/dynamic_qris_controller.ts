import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DynamicQrisService from '#services/dynamic_qris_service'
import QrisManagementService from '#services/qris_management_service'
import QrisService from '#services/qris_service'
import { generateDynamicQrisValidator } from '#validators/qris_transaction'

@inject()
export default class DynamicQrisController {
  constructor(
    protected dynamicQrisService: DynamicQrisService,
    protected qrisManagementService: QrisManagementService,
    protected qrisService: QrisService
  ) {}

  async index({ request, inertia, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    
    // Get static QRIS list for the dropdown
    const qrisList = await this.qrisManagementService.getAllForUser(user.id, 1, 100)
    
    // We want to parse the static QRIS strings so the frontend can display merchant info
    const staticQrisOptions = qrisList.all().map((q) => {
      try {
        const parsed = this.qrisService.parse(q.qrisString)
        return {
          id: q.id,
          name: q.name,
          merchantName: parsed.merchantName,
          merchantCity: parsed.merchantCity,
          postalCode: parsed.postalCode,
          merchantCategoryCode: parsed.merchantCategoryCode,
          transactionCurrency: parsed.currency
        }
      } catch (e) {
        return {
          id: q.id,
          name: q.name,
          merchantName: 'Unknown',
          merchantCity: 'Unknown',
        }
      }
    })

    // Get transactions history
    const transactions = await this.dynamicQrisService.getTransactionsForUser(user.id, page, 10)

    // @ts-ignore
    return inertia.render('qris-dynamic/index', {
      staticQrisOptions,
      transactions: transactions.serialize() as any
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(generateDynamicQrisValidator)
    const user = auth.user!

    await this.dynamicQrisService.generateDynamicQris({
      ...payload,
      userId: user.id,
      expiredHours: payload.expiredHours || 24
    })

    session.flash('success', 'QRIS Dinamis berhasil digenerate!')
    return response.redirect().back()
  }

  async updateStatus({ params, request, response, auth, session }: HttpContext) {
    const { updateDynamicQrisStatusValidator } = await import('#validators/qris_transaction')
    const payload = await request.validateUsing(updateDynamicQrisStatusValidator)
    const QrisTransaction = (await import('#models/qris_transaction')).default
    const string = (await import('@adonisjs/core/helpers/string')).default
    const app = (await import('@adonisjs/core/services/app')).default
    const { DateTime } = await import('luxon')

    const transaction = await QrisTransaction.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .firstOrFail()

    transaction.status = payload.status

    if (payload.status === 'paid') {
      transaction.paidAt = DateTime.now()
      
      if (payload.proof) {
        await payload.proof.move(app.makePath('public/uploads/proofs'), {
          name: `${string.random(32)}.${payload.proof.extname}`
        })
        transaction.proof = `uploads/proofs/${payload.proof.fileName}`
      }
    } else {
      transaction.paidAt = null
      transaction.proof = null
    }

    await transaction.save()

    session.flash('success', 'Status transaksi berhasil diperbarui!')
    return response.redirect().back()
  }
}