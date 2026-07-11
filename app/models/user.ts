import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @column()
  declare roleId: number

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @column()
  declare hmacKey: string | null

  @column()
  declare apiKey: string | null

  @column()
  declare webhookListenApps: string | null

  @column()
  declare webhookTitleWildcard: string | null

  @column()
  declare webhookTextWildcard: string | null

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }

    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
