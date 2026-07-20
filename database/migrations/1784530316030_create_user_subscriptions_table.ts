import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('plan_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('plans')
        .onDelete('CASCADE')

      // Paywuz order ID used to track payment
      table.string('order_id').nullable().unique()

      // Paywuz transaction data
      table.string('paywuz_transaction_id').nullable()
      table.string('payment_method').nullable()
      table.string('payment_url').nullable()
      table.string('payment_number').nullable()

      // Amount billed (plan price at the time of subscription)
      table.integer('amount').notNullable().defaultTo(0)

      // 'pending'   – dibuat, menunggu pembayaran
      // 'active'    – sudah dibayar, plan sedang aktif
      // 'expired'   – masa aktif habis
      // 'cancelled' – dibatalkan sebelum dibayar
      table
        .enum('status', ['pending', 'active', 'expired', 'cancelled'])
        .notNullable()
        .defaultTo('pending')

      // Kapan plan ini mulai & berakhir (diisi setelah pembayaran)
      table.timestamp('starts_at').nullable()
      table.timestamp('ends_at').nullable()

      // Kapan pembayaran dikonfirmasi
      table.timestamp('paid_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}