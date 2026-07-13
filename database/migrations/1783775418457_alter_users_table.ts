import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('webhook_listen_apps').nullable()
      table.string('webhook_title_wildcard').nullable()
      table.string('webhook_text_wildcard').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('webhook_listen_apps', 'webhook_title_wildcard', 'webhook_text_wildcard')
    })
  }
}
