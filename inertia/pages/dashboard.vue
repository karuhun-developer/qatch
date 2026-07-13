<script setup lang="ts">
import { Head, usePage, Link, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, QrCode, RefreshCw, Activity, Wallet, Calendar, Webhook } from '@lucide/vue'
import AndroidForwarderAlert from '@/components/AndroidForwarderAlert.vue'
import UserLimits from '@/components/UserLimits.vue'
import { computed } from 'vue'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  apiKey: string | null
  hasHmac: boolean
  stats: {
    totalUsers: number | null
    totalQris: number
    totalDynamicQris: number
  }
  chartData: {
    labels: string[]
    datasets: {
      generated: number[]
      paid: number[]
      expired: number[]
    }
  }
  recentTransactions: any[]
  systemHealth: string
  daysFilter: string
}>()

const page = usePage<any>()
const isSuperadmin = computed(() => page.props.user?.roleId === 1)

function updateFilter(value: string) {
  router.get('/dashboard', { days: value }, { preserveState: true })
}

const filterLabel = computed(() => {
  if (props.daysFilter === '7') return '7 Hari Terakhir'
  if (props.daysFilter === '30') return '30 Hari Terakhir'
  if (props.daysFilter === '90') return '90 Hari Terakhir'
  if (props.daysFilter === 'all') return 'Semua Waktu'
  return `${props.daysFilter} Hari Terakhir`
})

const chartDataConfig = computed(() => ({
  labels: props.chartData.labels,
  datasets: [
    {
      label: 'Generated (Pending)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      data: props.chartData.datasets.generated,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Berhasil Dibayar',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgb(16, 185, 129)',
      data: props.chartData.datasets.paid,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Expired',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgb(239, 68, 68)',
      data: props.chartData.datasets.expired,
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}
</script>

<template>
  <Head title="Dashboard" />

  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground mt-1">Pantau aktivitas dan analitik pembayaran Anda.</p>
    </div>
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
      <div class="flex items-center">
        <Calendar class="mr-2 h-4 w-4 text-muted-foreground hidden sm:block" />
        <Select :modelValue="props.daysFilter" @update:modelValue="updateFilter">
          <SelectTrigger class="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Hari Terakhir</SelectItem>
            <SelectItem value="30">30 Hari Terakhir</SelectItem>
            <SelectItem value="90">90 Hari Terakhir</SelectItem>
            <SelectItem value="all">Semua Waktu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <Button variant="outline" as-child class="flex-1 sm:flex-none">
          <Link href="/qris"><QrCode class="mr-2 h-4 w-4" /> QRIS Statis</Link>
        </Button>
        <Button variant="outline" as-child class="flex-1 sm:flex-none">
          <Link href="/webhook-settings"><Webhook class="mr-2 h-4 w-4" /> API & Webhook</Link>
        </Button>
        <Button as-child class="flex-1 sm:flex-none">
          <Link href="/qris-dynamic"><RefreshCw class="mr-2 h-4 w-4" /> QRIS Dinamis</Link>
        </Button>
      </div>
    </div>
  </div>

  <AndroidForwarderAlert class="mb-8" />

  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    <!-- Big Welcome/Main Chart Card (Span 3 cols) -->
    <Card
      class="md:col-span-3 bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
      ></div>
      <CardHeader class="pb-2 relative z-10">
        <CardTitle class="text-lg font-medium flex items-center">
          <Activity class="mr-2 h-5 w-5 text-primary" />
          Penggunaan QRIS Dinamis ({{ filterLabel }})
        </CardTitle>
      </CardHeader>
      <CardContent class="relative z-10 h-[300px] w-full pt-4">
        <Line
          v-if="props.chartData.labels.length > 0"
          :data="chartDataConfig"
          :options="chartOptions"
        />
        <div v-else class="h-full flex items-center justify-center text-muted-foreground text-sm">
          Belum ada data transaksi dalam 7 hari terakhir.
        </div>
      </CardContent>
    </Card>

    <!-- Stats Column (Span 1 col) -->
    <div class="md:col-span-1 space-y-4">
      <Card
        v-if="isSuperadmin"
        class="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-colors relative overflow-hidden"
      >
        <div
          class="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        ></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          <Users class="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ props.stats.totalUsers || 0 }}</div>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 transition-colors relative overflow-hidden"
      >
        <div
          class="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        ></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >QRIS Statis Disimpan</CardTitle
          >
          <QrCode class="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ props.stats.totalQris }}</div>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40 transition-colors relative overflow-hidden"
      >
        <div
          class="absolute -right-4 -top-4 bg-emerald-500/10 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        ></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground"
            >Total Transaksi Dinamis</CardTitle
          >
          <Wallet class="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ props.stats.totalDynamicQris }}</div>
        </CardContent>
      </Card>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <!-- Recent Transactions (Span 2/3 cols depending on layout, let's use 3) -->
    <Card class="md:col-span-3 border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle class="text-lg">Transaksi Dinamis Terbaru</CardTitle>
      </CardHeader>
      <CardContent class="flex-1 overflow-auto max-h-[400px]">
        <div class="space-y-4">
          <div
            v-for="tx in props.recentTransactions"
            :key="tx.id"
            class="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
          >
            <div class="flex items-center">
              <div
                class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4"
              >
                <RefreshCw class="h-5 w-5 text-primary" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">{{ tx.transactionCode }}</p>
                <p class="text-xs text-muted-foreground">
                  <span v-if="isSuperadmin && tx.user" class="font-medium text-foreground"
                    >@{{ tx.user.fullName }} &bull;</span
                  >
                  {{ new Date(tx.createdAt).toLocaleString('id-ID') }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="font-bold text-sm">
                  Rp {{ Number(tx.total).toLocaleString('id-ID') }}
                </div>
                <div
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1 uppercase"
                  :class="{
                    'bg-yellow-500/10 text-yellow-500': tx.status === 'pending',
                    'bg-emerald-500/10 text-emerald-500': tx.status === 'paid',
                    'bg-destructive/10 text-destructive': tx.status === 'expired',
                  }"
                >
                  {{ tx.status }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="props.recentTransactions.length === 0"
            class="text-center py-6 text-muted-foreground text-sm"
          >
            Belum ada transaksi.
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- System Health -->
    <div class="md:col-span-1 space-y-4">
      <Card
        class="bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group hover:border-primary/50 transition-colors"
      >
        <div
          class="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"
        ></div>
        <CardContent class="p-6">
          <div class="space-y-3 relative z-10">
            <div
              class="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              API Gateway {{ props.systemHealth }}
            </div>
            <h3 class="text-xl font-bold tracking-tight">Sistem Online</h3>
            <p class="text-sm text-muted-foreground">Layanan QRIS Generator beroperasi normal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <div class="mt-8">
    <UserLimits />
  </div>
</template>
