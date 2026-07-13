import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price: number

  @column()
  declare description: string | null

  @column()
  declare maxQris: number | null

  @column()
  declare maxTransactionPerMonth: number | null

  @column()
  declare isFeatured: boolean

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare features: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}