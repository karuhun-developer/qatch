import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Qris from './qris.js'
import User from './user.js'

export default class QrisTransaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionCode: string

  @column()
  declare qrisId: number

  @column()
  declare userId: number

  @column()
  declare amount: number

  @column()
  declare feeType: 'none' | 'fixed' | 'percent'

  @column()
  declare feeValue: number

  @column()
  declare feeAmount: number

  @column()
  declare uniqueCode: number

  @column()
  declare total: number

  @column()
  declare qrisString: string

  @column()
  declare status: 'pending' | 'paid' | 'expired'

  @column()
  declare proof: string | null

  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime()
  declare expiredAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Qris)
  declare qris: BelongsTo<typeof Qris>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}