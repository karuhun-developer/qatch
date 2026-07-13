import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qris_transactions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('proof').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('proof')
    })
  }
}
