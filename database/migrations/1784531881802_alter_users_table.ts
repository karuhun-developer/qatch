import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Alter user_subscriptions: change starts_at, ends_at, paid_at
 * from TIMESTAMP (max 2038-01-19) to DATETIME (max 9999-12-31)
 * so free-plan "lifetime" subscriptions (ends_at far in the future) don't fail.
 */
export default class extends BaseSchema {
  protected tableName = 'user_subscriptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('starts_at').nullable().alter()
      table.dateTime('ends_at').nullable().alter()
      table.dateTime('paid_at').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('starts_at').nullable().alter()
      table.timestamp('ends_at').nullable().alter()
      table.timestamp('paid_at').nullable().alter()
    })
  }
}