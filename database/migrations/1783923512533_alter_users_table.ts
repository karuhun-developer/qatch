import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('plan_id')
        .unsigned()
        .references('id')
        .inTable('plans')
        .onDelete('SET NULL')
        .nullable()
      table.integer('qris_total').notNullable().defaultTo(0)
      table.integer('transaction_total').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('plan_id')
      table.dropColumn('qris_total')
      table.dropColumn('transaction_total')
    })
  }
}
