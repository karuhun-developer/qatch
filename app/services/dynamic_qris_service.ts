import QrisTransaction from '#models/qris_transaction'
import Qris from '#models/qris'
import User from '#models/user'
import QrisService from '#services/qris_service'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

@inject()
export default class DynamicQrisService {
  constructor(protected qrisService: QrisService) {}

  async generateDynamicQris(data: {
    userId: number
    qrisId: number
    amount: number
    feeType: 'none' | 'fixed' | 'percent'
    feeValue: number
    expiredHours: number
  }) {
    // 0. Check limits
    const user = await User.findOrFail(data.userId)
    await user.load('plan')
    if (
      user.plan &&
      user.plan.maxTransactionPerMonth !== null &&
      user.transactionTotal >= user.plan.maxTransactionPerMonth
    ) {
      throw new Error(
        `Limit transaksi tercapai. Anda hanya dapat membuat maksimal ${user.plan.maxTransactionPerMonth} transaksi per bulan.`
      )
    }

    // 1. Get the static QRIS
    const staticQris = await Qris.query()
      .where('id', data.qrisId)
      .where('userId', data.userId)
      .firstOrFail()

    // 2. Calculate Fee
    let feeAmount = 0
    if (data.feeType === 'fixed') {
      feeAmount = data.feeValue
    } else if (data.feeType === 'percent') {
      feeAmount = (data.amount * data.feeValue) / 100
    }

    // 3. Generate unique code for today (based on amount to differentiate)
    // Find the max unique code for transactions with the same base amount today for this static qris
    const today = DateTime.now().toSQLDate()
    const lastTx = await QrisTransaction.query()
      .where('qrisId', staticQris.id)
      .whereRaw('DATE(created_at) = ?', [today])
      .where('amount', data.amount) // unique code is to differentiate SAME amounts
      .orderBy('uniqueCode', 'desc')
      .first()

    const uniqueCode = lastTx ? lastTx.uniqueCode + 1 : 1

    // 4. Calculate total
    const total = data.amount + feeAmount + uniqueCode

    // 5. Generate Dynamic QRIS string
    const convertOptions: any = { amount: total }
    if (data.feeType !== 'none') {
      convertOptions.fee = {
        type: data.feeType === 'percent' ? 'percentage' : 'fixed',
        value: data.feeValue,
      }
    }
    const dynamicQrisString = this.qrisService.convert(staticQris.qrisString, convertOptions)

    // 6. Save to database
    const transactionCode = `TRX-${Date.now()}`

    const transaction = await QrisTransaction.create({
      transactionCode,
      qrisId: staticQris.id,
      userId: data.userId,
      amount: data.amount,
      feeType: data.feeType,
      feeValue: data.feeValue,
      feeAmount,
      uniqueCode,
      total,
      qrisString: dynamicQrisString,
      status: 'pending',
      expiredAt: DateTime.now().plus({ hours: data.expiredHours }),
    })

    // 7. Increment limit
    user.transactionTotal += 1
    await user.save()

    return transaction
  }

  async getTransactionsForUser(userId: number, page: number, limit: number) {
    return await QrisTransaction.query()
      .where('userId', userId)
      .preload('qris')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }
}
