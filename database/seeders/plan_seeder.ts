import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Plan from '#models/plan'

export default class extends BaseSeeder {
  async run() {
    await Plan.createMany([
      {
        name: 'Starter',
        price: 0,
        description: 'Cocok untuk mencoba dan usaha kecil',
        maxQris: 5,
        maxTransactionPerMonth: 100000,
        isFeatured: false,
        features: [
          'Hingga 100.000 transaksi/bulan',
          '5 QRIS Statis',
          'Integrasi API & Webhook',
          'Community Support',
        ],
      },
      {
        name: 'Pro',
        price: 19999,
        description: 'Untuk bisnis yang sedang berkembang pesat',
        maxQris: 100,
        maxTransactionPerMonth: 1000000,
        isFeatured: true,
        features: [
          'Semua yang ada di Starter',
          'Hingga 1.000.000 transaksi/bulan',
          '100 QRIS Statis',
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
