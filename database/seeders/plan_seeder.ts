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
        maxTransactionPerMonth: 100,
        isFeatured: false,
        features: [
          'Hingga 100 transaksi/bulan',
          '1 QRIS Statis',
          'Integrasi Webhook Dasar',
          'Community Support',
        ],
      },
      {
        name: 'Pro',
        price: 24999,
        description: 'Untuk bisnis yang sedang berkembang pesat',
        maxQris: 5,
        maxTransactionPerMonth: 1500,
        isFeatured: true,
        features: [
          'Hingga 1.500 transaksi/bulan',
          '5 QRIS Statis',
          'Webhook Lanjutan (Wildcard)',
          'Analitik & Laporan',
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
          'Transaksi Tanpa Batas (Unlimited)',
          'QRIS Statis Tanpa Batas',
          'Akses Full API & Custom Domain',
          'Multiple Users & Roles',
          '24/7 Dedicated Support',
        ],
      },
    ])
  }
}
