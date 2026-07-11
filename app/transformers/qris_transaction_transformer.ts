import { BaseTransformer } from '@adonisjs/core/transformers'
import QrisTransaction from '#models/qris_transaction'

export default class QrisTransactionTransformer extends BaseTransformer<QrisTransaction> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}