import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qris_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('transaction_code').notNullable().unique()
      table.integer('qris_id').unsigned().references('id').inTable('qris').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      table.decimal('amount', 12, 2).notNullable()
      table.enum('fee_type', ['none', 'fixed', 'percent']).defaultTo('none')
      table.decimal('fee_value', 12, 2).defaultTo(0)
      table.decimal('fee_amount', 12, 2).defaultTo(0)
      table.integer('unique_code').defaultTo(0)
      table.decimal('total', 12, 2).notNullable()
      
      table.text('qris_string').notNullable()
      table.enum('status', ['pending', 'paid', 'expired']).defaultTo('pending')
      
      table.timestamp('paid_at').nullable()
      table.timestamp('expired_at').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}