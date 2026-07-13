import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Plan from '#models/plan'

export default class extends BaseSeeder {
  async run() {
    await Plan.createMany([
      {
        name: 'Starter',
        price: 0,
        description: 'Cocok untuk mencoba dan usaha kecil',
        maxQris: 1,
        maxTransactionPerMonth: 1000,
        isFeatured: false,
        features: [
          'Hingga 1000 transaksi/bulan',
          '1 QRIS Statis',
          'Integrasi Webhook',
          'Community Support',
        ],
      },
      {
        name: 'Pro',
        price: 24999,
        description: 'Untuk bisnis yang sedang berkembang pesat',
        maxQris: 5,
        maxTransactionPerMonth: 10000,
        isFeatured: true,
        features: [
          'Semua yang ada di Starter',
          'Hingga 10.000 transaksi/bulan',
          '5 QRIS Statis',
          'Prioritas Email Support',
        ],
      },
      {
        name: 'Enterprise',
        price: 49999,
        description: 'Skala tak terbatas untuk bisnis besar',
        maxQris: null,
        maxTransactionPerMonth: null,
        isFeatured: false,
        features: [
          'Semua yang ada di Pro',
          'Transaksi Tanpa Batas (Unlimited)',
          'QRIS Statis Tanpa Batas',
          '24/7 Dedicated Support',
        ],
      },
    ])
  }
}
