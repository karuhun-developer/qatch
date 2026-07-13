<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3'
import type { Data } from '@generated/data'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import UserLimits from '@/components/UserLimits.vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from '@lucide/vue'

defineOptions({ layout: DashboardLayout })

const page = usePage<Data.SharedProps>()
const props = defineProps<{
  plans: {
    id: number
    name: string
    price: number
    maxQris: number | null
    maxTransactionPerMonth: number | null
  }[]
}>()

const activePlanId = page.props.user?.plan?.id

function upgradeDowngrade(planId: number) {
  // To be implemented later as requested: "tampilan nya aja dulu logic nya belakangan"
  alert(`Upgrade/Downgrade to plan ID: ${planId} will be implemented later.`)
}
</script>

<template>
  <Head title="Plan Aktif" />

  <div class="space-y-6 max-w-5xl mx-auto w-full">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Plan Aktif</h1>
      <p class="text-muted-foreground mt-2">
        Kelola paket langganan Anda dan pantau sisa limit penggunaan bulan ini.
      </p>
    </div>

    <!-- Active Plan & Limits (Using UserLimits.vue) -->
    <UserLimits />

    <!-- Upgrade / Downgrade Plans -->
    <div class="mt-10">
      <h2 class="text-2xl font-bold tracking-tight mb-4">Pilihan Paket Langganan</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="plan in plans" :key="plan.id" class="flex flex-col relative" :class="{ 'border-primary shadow-sm': plan.id === activePlanId }">
          <div v-if="plan.id === activePlanId" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">Paket Saat Ini</span>
          </div>
          
          <CardHeader>
            <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
            <CardDescription>
              <span class="text-3xl font-bold text-foreground">
                {{ plan.price === 0 ? 'Gratis' : `Rp ${(plan.price / 1000).toLocaleString('id-ID')}rb` }}
              </span>
              <span v-if="plan.price > 0" class="text-muted-foreground"> / bulan</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent class="flex-1 space-y-4">
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary" />
                <span>
                  {{ plan.maxQris === null ? 'Unlimited' : plan.maxQris }} QRIS Statis
                </span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary" />
                <span>
                  {{ plan.maxTransactionPerMonth === null ? 'Unlimited' : plan.maxTransactionPerMonth }} Transaksi / Bulan
                </span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary" />
                <span>Akses QRIS Dinamis</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary" />
                <span>Notifikasi Webhook</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button
              v-if="plan.id !== activePlanId"
              class="w-full"
              :variant="plan.price === 0 ? 'outline' : 'default'"
              @click="upgradeDowngrade(plan.id)"
            >
              {{ plan.price === 0 ? 'Downgrade ke ' + plan.name : 'Upgrade ke ' + plan.name }}
            </Button>
            <Button v-else class="w-full" variant="secondary" disabled>
              Paket Aktif
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
