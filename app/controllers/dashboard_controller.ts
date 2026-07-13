import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Qris from '#models/qris'
import QrisTransaction from '#models/qris_transaction'
import encryption from '@adonisjs/core/services/encryption'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    const isSuperadmin = user.roleId === 1

    let decryptedApiKey: string | null = null
    if (user.apiKey) {
      decryptedApiKey = encryption.decrypt(user.apiKey) as string
    }

    const daysFilter = request.input('days', '7')

    // Common query builder base based on role
    const qrisQuery = Qris.query()
    const txQuery = QrisTransaction.query()

    if (!isSuperadmin) {
      qrisQuery.where('userId', user.id)
      txQuery.where('userId', user.id)
    }

    // Apply date filter
    if (daysFilter !== 'all') {
      const days = Number.parseInt(daysFilter, 10)
      if (!isNaN(days)) {
        const targetDate = DateTime.now().minus({ days }).toSQLDate()
        qrisQuery.where('created_at', '>=', targetDate as string)
        txQuery.where('created_at', '>=', targetDate as string)
      }
    }

    // Dashboard Stats
    const totalQris = await qrisQuery.clone().count('* as total').first()
    const totalTransactions = await txQuery.clone().count('* as total').first()

    let totalUsers = null
    if (isSuperadmin) {
      const userQuery = User.query()
      if (daysFilter !== 'all') {
        const days = Number.parseInt(daysFilter, 10)
        if (!isNaN(days)) {
          const targetDate = DateTime.now().minus({ days }).toSQLDate()
          userQuery.where('created_at', '>=', targetDate as string)
        }
      }
      totalUsers = (await userQuery.count('* as total').first())?.$extras.total || 0
    }

    // Chart Data (Grouped by date)
    const chartDataQuery = txQuery
      .clone()
      .select(db.raw('DATE(created_at) as date'))
      .select(db.raw('COUNT(*) as total'))
      .select(db.raw(`SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid`))
      .select(db.raw(`SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired`))
      .groupByRaw('DATE(created_at)')
      .orderByRaw('DATE(created_at) ASC')

    const rawChartData = await chartDataQuery

    // Formatting chart data for frontend
    const dates = []
    const generated = []
    const paid = []
    const expired = []

    for (const row of rawChartData) {
      dates.push(row.$extras.date)
      generated.push(row.$extras.total)
      paid.push(row.$extras.paid)
      expired.push(row.$extras.expired)
    }

    // Recent Transactions
    const recentTxQuery = txQuery.clone().orderBy('createdAt', 'desc').limit(10)

    if (isSuperadmin) {
      recentTxQuery.preload('user')
    }

    const recentTransactions = await recentTxQuery

    return inertia.render('dashboard', {
      apiKey: decryptedApiKey,
      hasHmac: !!user.hmacKey,
      stats: {
        totalUsers: Number(totalUsers),
        totalQris: Number(totalQris?.$extras.total || 0),
        totalDynamicQris: Number(totalTransactions?.$extras.total || 0),
      },
      chartData: {
        labels: dates,
        datasets: {
          generated,
          paid,
          expired,
        },
      },
      recentTransactions: recentTransactions.map((tx) => {
        return {
          id: tx.id,
          transactionCode: tx.transactionCode,
          amount: tx.amount,
          total: tx.total,
          status: tx.status,
          createdAt: tx.createdAt,
          user: isSuperadmin
            ? {
                fullName: tx.user?.fullName,
                email: tx.user?.email,
              }
            : undefined,
        }
      }),
      systemHealth: 'OK',
      daysFilter,
    })
  }
}
