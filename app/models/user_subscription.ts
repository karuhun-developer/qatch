import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Plan from '#models/plan'

export default class UserSubscription extends BaseModel {
  static table = 'user_subscriptions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare planId: number

  /** Paywuz order ID — format: SUB-{userId}-{timestamp} */
  @column()
  declare orderId: string | null

  @column()
  declare paywuzTransactionId: string | null

  @column()
  declare paymentMethod: string | null

  @column()
  declare paymentUrl: string | null

  @column()
  declare paymentNumber: string | null

  /** Nominal yang harus dibayar (harga plan saat berlangganan) */
  @column()
  declare amount: number

  @column()
  declare status: 'pending' | 'active' | 'expired' | 'cancelled'

  /** Tanggal mulai plan (diisi setelah bayar) */
  @column.dateTime()
  declare startsAt: DateTime | null

  /** Tanggal plan berakhir (diisi setelah bayar, biasanya +30 hari) */
  @column.dateTime()
  declare endsAt: DateTime | null

  /** Tanggal konfirmasi pembayaran dari Paywuz */
  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>

  /** Returns true if this subscription is currently active */
  get isActive() {
    if (this.status !== 'active') return false
    if (!this.endsAt) return true
    return this.endsAt > DateTime.now()
  }
}
