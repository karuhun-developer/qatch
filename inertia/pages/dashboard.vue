<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, ArrowUpRight, CreditCard, CheckCircle, QrCode, ArrowRight, Download, Calendar } from '@lucide/vue'
import SecuritySettings from '@/components/SecuritySettings.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  apiKey: string | null
  hasHmac: boolean
}>()
</script>

<template>
  <Head title="Dashboard" />
  
  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground mt-1">Pantau aktivitas dan analitik pembayaran Anda.</p>
    </div>
    <div class="flex items-center space-x-2">
      <Button variant="outline" class="hidden sm:flex">
        <Calendar class="mr-2 h-4 w-4" />
        Hari ini
      </Button>
      <Button>
        <Download class="mr-2 h-4 w-4" />
        Download Report
      </Button>
    </div>
  </div>
  
  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
    
    <!-- Big Welcome/Main Chart Card (Span 3 cols, 2 rows) -->
    <Card class="md:col-span-3 md:row-span-2 bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
      <CardHeader class="pb-2 relative z-10">
        <CardTitle class="text-lg font-medium flex items-center">
          <Activity class="mr-2 h-5 w-5 text-primary" />
          Tren Pendapatan
        </CardTitle>
      </CardHeader>
      <CardContent class="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div class="text-4xl font-bold tracking-tight">Rp 45.231.890</div>
          <p class="text-sm text-emerald-500 font-medium flex items-center mt-1">
            <ArrowUpRight class="h-4 w-4 mr-1" />
            +20.1% dari bulan lalu
          </p>
        </div>
        
        <!-- CSS Chart Placeholder -->
        <div class="mt-8 flex items-end justify-between h-[180px] gap-2 pb-4 opacity-80 group-hover:opacity-100 transition-opacity">
          <div v-for="i in 12" :key="i" class="w-full bg-primary/20 rounded-t-md relative group/bar hover:bg-primary/40 transition-colors" :style="{ height: `${Math.max(20, Math.random() * 100)}%` }">
            <div class="absolute inset-x-0 bottom-0 bg-primary rounded-t-md opacity-0 group-hover/bar:opacity-100 transition-all duration-300" :style="{ height: `${Math.max(10, Math.random() * 80)}%` }"></div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stat 1 (Span 1 col, 1 row) -->
    <Card class="md:col-span-1 md:row-span-1 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 transition-colors relative overflow-hidden">
      <div class="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full blur-2xl"></div>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">Total Transaksi</CardTitle>
        <CreditCard class="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div class="text-3xl font-bold">+2,350</div>
        <p class="text-xs text-blue-500 font-medium mt-1">+18% dari bulan lalu</p>
      </CardContent>
    </Card>

    <!-- Stat 2 (Span 1 col, 1 row) -->
    <Card class="md:col-span-1 md:row-span-1 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40 transition-colors relative overflow-hidden">
      <div class="absolute -right-4 -top-4 bg-emerald-500/10 w-24 h-24 rounded-full blur-2xl"></div>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">Sukses Rate</CardTitle>
        <CheckCircle class="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div class="text-3xl font-bold">99.8%</div>
        <p class="text-xs text-emerald-500 font-medium mt-1">+0.5% peningkatan</p>
      </CardContent>
    </Card>

    <!-- Recent Transactions (Span 2 cols, 2 rows) -->
    <Card class="md:col-span-2 md:row-span-2 border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle class="text-lg">Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <div class="space-y-6">
          <div v-for="i in 4" :key="i" class="flex items-center">
            <div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <QrCode class="h-4 w-4 text-primary" />
            </div>
            <div class="space-y-1 flex-1">
              <p class="text-sm font-medium leading-none">Pembayaran QRIS-{{ Math.floor(Math.random() * 9000) + 1000 }}</p>
              <p class="text-sm text-muted-foreground">Oleh Customer #{{ i }}</p>
            </div>
            <div class="font-medium text-emerald-500">+ Rp {{ (Math.floor(Math.random() * 900) + 100).toLocaleString('id-ID') }}.000</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Action / Status (Span 2 cols, 1 row) -->
    <Card class="md:col-span-2 md:row-span-1 bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent"></div>
      <CardContent class="p-6 flex items-center justify-between h-full">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            System Online
          </div>
          <h3 class="text-xl font-bold tracking-tight">API Gateway Aktif</h3>
          <p class="text-sm text-muted-foreground max-w-[80%]">Semua layanan pembayaran beroperasi normal tanpa kendala.</p>
        </div>
        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowRight class="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>

  </div>

  <div class="mt-4">
    <SecuritySettings :api-key="apiKey" :has-hmac="hasHmac" />
  </div>
</template>
