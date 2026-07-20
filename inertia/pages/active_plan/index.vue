<script setup lang="ts">
import { Head, usePage, useForm, router } from '@inertiajs/vue3'
import type { Data } from '@generated/data'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import UserLimits from '@/components/UserLimits.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  Star,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Loader2,
  XCircle,
  Calendar,
  Receipt,
} from '@lucide/vue'
import { ref, computed } from 'vue'

defineOptions({ layout: DashboardLayout })

const page = usePage<Data.SharedProps>()

const props = defineProps<{
  plans: {
    id: number
    name: string
    price: number
    description: string | null
    maxQris: number | null
    maxTransactionPerMonth: number | null
    isFeatured: boolean
    features: string[] | null
  }[]
  activeSubscription: {
    id: number
    planId: number
    amount: number
    status: string
    startsAt: string | null
    endsAt: string | null
    paidAt: string | null
    plan: { id: number; name: string; price: number }
  } | null
  pendingInvoices: {
    id: number
    planId: number
    orderId: string | null
    paymentUrl: string | null
    paymentNumber: string | null
    paymentMethod: string | null
    amount: number
    status: string
    createdAt: string
    plan: { id: number; name: string; price: number }
  }[]
  paymentMethods: {
    code: string
    name: string
    type: string
    fee: { flatIdr: number; percentBps: number }
    limits: { minIdr: number; maxIdr: number }
  }[]
  currentPlanId: number | null
}>()

// ─── State ───────────────────────────────────────────────────────────────────
const subscribeModalOpen = ref(false)
const cancelModalOpen = ref(false)
const selectedPlan = ref<(typeof props.plans)[0] | null>(null)
const selectedInvoiceId = ref<number | null>(null)
const selectedPaymentMethod = ref('VA')
const isSubmitting = ref(false)
const isCancelling = ref(false)

// ─── Computed ─────────────────────────────────────────────────────────────────
const activePlanId = computed(() => props.activeSubscription?.planId ?? props.currentPlanId)

const daysLeft = computed(() => {
  if (!props.activeSubscription?.endsAt) return null
  // Free plan = lifetime, jangan tampilkan countdown
  if (props.activeSubscription.plan?.price === 0) return null
  const end = new Date(props.activeSubscription.endsAt)
  const now = new Date()
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

const isExpiringSoon = computed(() => daysLeft.value !== null && daysLeft.value <= 7)

const vaPaymentMethods = computed(() =>
  props.paymentMethods.filter((m) => m.type === 'virtual_account')
)
const qrisPaymentMethods = computed(() => props.paymentMethods.filter((m) => m.type === 'qris'))

function isPlanUpgrade(plan: (typeof props.plans)[0]) {
  const currentPlan = props.plans.find((p) => p.id === activePlanId.value)
  if (!currentPlan) return plan.price > 0
  return plan.price > currentPlan.price
}

function planActionLabel(plan: (typeof props.plans)[0]) {
  if (plan.id === activePlanId.value) return 'Plan Aktif'
  return isPlanUpgrade(plan) ? `Upgrade ke ${plan.name}` : `Ganti ke ${plan.name}`
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function feeLabel(pm: (typeof props.paymentMethods)[0]) {
  if (!pm.fee) return 'Gratis'
  if (pm.fee.flatIdr > 0 && pm.fee.percentBps > 0) {
    return `+ ${formatRupiah(pm.fee.flatIdr)} + ${pm.fee.percentBps / 100}%`
  }
  if (pm.fee.flatIdr > 0) return `+ ${formatRupiah(pm.fee.flatIdr)}`
  if (pm.fee.percentBps > 0) return `+ ${pm.fee.percentBps / 100}%`
  return 'Gratis'
}

// ─── Actions ─────────────────────────────────────────────────────────────────
function openSubscribeModal(plan: (typeof props.plans)[0]) {
  selectedPlan.value = plan
  selectedPaymentMethod.value = 'VA'
  subscribeModalOpen.value = true
}

function openCancelModal(invoiceId: number) {
  selectedInvoiceId.value = invoiceId
  cancelModalOpen.value = true
}

function submitSubscribe() {
  if (!selectedPlan.value) return
  isSubmitting.value = true
  router.post(
    '/active-plan/subscribe',
    { plan_id: selectedPlan.value.id, payment_method: selectedPaymentMethod.value },
    {
      onFinish: () => {
        isSubmitting.value = false
        subscribeModalOpen.value = false
        window.location.reload()
      },
    }
  )
}

function confirmCancel() {
  if (!selectedInvoiceId.value) return
  isCancelling.value = true
  router.delete(`/active-plan/${selectedInvoiceId.value}/cancel`, {
    onFinish: () => {
      isCancelling.value = false
      cancelModalOpen.value = false
      selectedInvoiceId.value = null
    },
  })
}
</script>

<template>
  <Head title="Plan & Tagihan" />

  <div class="space-y-8 max-w-5xl mx-auto w-full">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Plan & Tagihan</h1>
      <p class="text-muted-foreground mt-1">
        Kelola paket langganan Anda, pantau tagihan, dan upgrade kapan saja.
      </p>
    </div>

    <!-- ── Active Subscription Status ── -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Current Plan Card -->
      <Card
        class="md:col-span-2 relative overflow-hidden"
        :class="
          activeSubscription
            ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30'
            : 'border-dashed border-muted-foreground/30'
        "
      >
        <div
          v-if="activeSubscription"
          class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />
        <CardHeader class="pb-3 relative z-10">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <CardTitle class="flex items-center gap-2 text-lg">
              <Package class="h-5 w-5 text-primary" />
              Plan Aktif
            </CardTitle>
            <span
              v-if="activeSubscription"
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                isExpiringSoon
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              "
            >
              <span
                class="w-1.5 h-1.5 rounded-full animate-pulse"
                :class="isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'"
              />
              {{ isExpiringSoon ? 'Segera Berakhir' : 'Aktif' }}
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
            >
              Tidak ada plan aktif
            </span>
          </div>
        </CardHeader>

        <CardContent class="relative z-10">
          <div v-if="activeSubscription" class="space-y-4">
            <div>
              <div class="text-4xl font-bold tracking-tight">
                {{ activeSubscription.plan.name }}
              </div>
              <div class="text-muted-foreground text-sm mt-1">
                {{
                  activeSubscription.plan.price === 0
                    ? 'Gratis'
                    : formatRupiah(activeSubscription.plan.price) + ' / bulan'
                }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="space-y-0.5">
                <p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Mulai
                </p>
                <p class="text-sm font-medium">{{ formatDate(activeSubscription.startsAt) }}</p>
              </div>
              <div class="space-y-0.5">
                <p
                  class="text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-1"
                >
                  <Calendar class="h-3 w-3" /> Berakhir
                </p>
                <p class="text-sm font-medium" :class="isExpiringSoon ? 'text-amber-500' : ''">
                  {{
                    activeSubscription.plan.price === 0
                      ? 'Selamanya'
                      : formatDate(activeSubscription.endsAt)
                  }}
                </p>
              </div>
            </div>

            <div
              v-if="daysLeft !== null && activeSubscription.plan.price > 0"
              class="flex items-center gap-2 pt-1"
            >
              <AlertTriangle v-if="isExpiringSoon" class="h-4 w-4 text-amber-500 shrink-0" />
              <Clock v-else class="h-4 w-4 text-muted-foreground shrink-0" />
              <span
                class="text-sm"
                :class="isExpiringSoon ? 'text-amber-500 font-medium' : 'text-muted-foreground'"
              >
                {{ daysLeft }} hari lagi sebelum perlu perpanjangan
              </span>
            </div>
          </div>

          <div v-else class="py-4 text-center space-y-2">
            <Package class="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p class="text-muted-foreground text-sm">
              Anda belum memiliki plan aktif. Pilih paket di bawah untuk memulai.
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Limits Card -->
      <div class="md:col-span-1">
        <UserLimits />
      </div>
    </div>

    <!-- ── Pending Invoices ── -->
    <div v-if="pendingInvoices.length > 0" class="space-y-3">
      <div class="flex items-center gap-2">
        <Receipt class="h-5 w-5 text-amber-500" />
        <h2 class="text-lg font-semibold">Tagihan Menunggu Pembayaran</h2>
        <span
          class="inline-flex items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2 py-0.5"
        >
          {{ pendingInvoices.length }}
        </span>
      </div>

      <div class="space-y-3">
        <Card
          v-for="invoice in pendingInvoices"
          :key="invoice.id"
          class="border-amber-500/30 bg-amber-500/5 relative overflow-hidden"
        >
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-lg" />
          <CardContent class="p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-start gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0"
                >
                  <CreditCard class="h-5 w-5 text-amber-500" />
                </div>
                <div class="space-y-0.5">
                  <p class="font-semibold">{{ invoice.plan.name }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ formatRupiah(invoice.amount) }}
                    <span v-if="invoice.paymentMethod" class="ml-1 text-xs">
                      via {{ invoice.paymentMethod }}
                    </span>
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Dibuat {{ formatDate(invoice.createdAt) }}
                  </p>
                  <p
                    v-if="invoice.paymentNumber"
                    class="text-xs font-mono bg-muted px-2 py-0.5 rounded inline-block mt-1"
                  >
                    {{ invoice.paymentNumber }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0 sm:flex-col sm:items-end">
                <a
                  v-if="invoice.paymentUrl"
                  :href="invoice.paymentUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  <ExternalLink class="h-3.5 w-3.5" />
                  Bayar Sekarang
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs h-7"
                  @click="openCancelModal(invoice.id)"
                >
                  <XCircle class="h-3.5 w-3.5 mr-1" />
                  Batalkan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- ── Plan Selection ── -->
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight">Pilihan Paket Langganan</h2>
        <p class="text-muted-foreground text-sm mt-1">
          Upgrade atau ganti paket sesuai kebutuhan Anda. Pembayaran diproses via Paywuz.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          class="flex flex-col relative transition-all duration-200"
          :class="{
            'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20':
              plan.id === activePlanId,
            'hover:border-muted-foreground/30 hover:shadow-md': plan.id !== activePlanId,
          }"
        >
          <!-- Current plan badge -->
          <div
            v-if="plan.id === activePlanId"
            class="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          >
            <span
              class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm"
            >
              <CheckCircle2 class="h-3 w-3" />
              Paket Saat Ini
            </span>
          </div>

          <!-- Featured badge -->
          <div
            v-if="plan.isFeatured && plan.id !== activePlanId"
            class="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          >
            <span
              class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5 text-xs font-semibold text-white shadow-sm"
            >
              <Star class="h-3 w-3 fill-white" />
              Paling Populer
            </span>
          </div>

          <!-- Gradient overlay for featured/active -->
          <div
            v-if="plan.isFeatured || plan.id === activePlanId"
            class="absolute inset-0 rounded-lg pointer-events-none"
            :class="
              plan.id === activePlanId
                ? 'bg-gradient-to-br from-primary/5 via-transparent to-transparent'
                : 'bg-gradient-to-br from-amber-500/5 via-transparent to-transparent'
            "
          />

          <CardHeader class="relative z-10 pb-3">
            <CardTitle class="text-lg">{{ plan.name }}</CardTitle>
            <CardDescription>
              <span class="text-3xl font-bold text-foreground">
                {{ plan.price === 0 ? 'Gratis' : formatRupiah(plan.price) }}
              </span>
              <span v-if="plan.price > 0" class="text-muted-foreground text-sm"> / bulan</span>
            </CardDescription>
            <p v-if="plan.description" class="text-sm text-muted-foreground mt-1">
              {{ plan.description }}
            </p>
          </CardHeader>

          <CardContent class="flex-1 space-y-3 relative z-10">
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
                <span class="text-muted-foreground">
                  {{ plan.maxQris === null ? 'Unlimited' : plan.maxQris }} QRIS Statis
                </span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
                <span class="text-muted-foreground">
                  {{
                    plan.maxTransactionPerMonth === null ? 'Unlimited' : plan.maxTransactionPerMonth
                  }}
                  Transaksi / Bulan
                </span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
                <span class="text-muted-foreground">Akses QRIS Dinamis</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
                <span class="text-muted-foreground">Notifikasi Webhook</span>
              </li>
              <template v-if="plan.features && plan.features.length > 0">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                  <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
                  <span class="text-muted-foreground">{{ feature }}</span>
                </li>
              </template>
            </ul>
          </CardContent>

          <CardFooter class="relative z-10 pt-0">
            <!-- Already on this plan -->
            <Button v-if="plan.id === activePlanId" class="w-full" variant="secondary" disabled>
              <CheckCircle2 class="h-4 w-4 mr-2" />
              Paket Aktif
            </Button>

            <!-- Free plan -->
            <Button
              v-else-if="plan.price === 0"
              class="w-full"
              variant="outline"
              @click="openSubscribeModal(plan)"
            >
              <ArrowDownCircle class="h-4 w-4 mr-2" />
              Downgrade ke {{ plan.name }}
            </Button>

            <!-- Paid plan -->
            <Button
              v-else
              class="w-full"
              :class="
                plan.isFeatured
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0'
                  : ''
              "
              @click="openSubscribeModal(plan)"
            >
              <ArrowUpCircle v-if="isPlanUpgrade(plan)" class="h-4 w-4 mr-2" />
              <ArrowDownCircle v-else class="h-4 w-4 mr-2" />
              {{ planActionLabel(plan) }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>

  <!-- ── Subscribe / Upgrade Modal ── -->
  <Dialog :open="subscribeModalOpen" @update:open="subscribeModalOpen = $event">
    <DialogContent class="sm:max-w-[520px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Fixed Header -->
      <DialogHeader class="px-6 pt-6 pb-4 shrink-0">
        <DialogTitle class="flex items-center gap-2 text-xl">
          <CreditCard class="h-5 w-5 text-primary" />
          {{
            selectedPlan?.price === 0
              ? `Ganti ke Plan ${selectedPlan?.name}`
              : `Berlangganan ${selectedPlan?.name}`
          }}
        </DialogTitle>
        <DialogDescription class="mt-1">
          <span v-if="selectedPlan?.price === 0">
            Anda akan downgrade ke plan gratis. Fitur berbayar akan dinonaktifkan.
          </span>
          <span v-else> Pilih metode pembayaran untuk menyelesaikan berlangganan. </span>
        </DialogDescription>
      </DialogHeader>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto px-6 pb-2 space-y-4">
        <!-- Plan Summary -->
        <div class="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Paket</span>
            <span class="font-bold">{{ selectedPlan?.name }}</span>
          </div>
          <div class="flex items-center justify-between border-t pt-3">
            <span class="text-sm font-medium">Total Tagihan</span>
            <span class="text-xl font-bold text-primary">
              {{ selectedPlan?.price === 0 ? 'Gratis' : formatRupiah(selectedPlan?.price ?? 0) }}
            </span>
          </div>
          <div
            v-if="(selectedPlan?.price ?? 0) > 0"
            class="text-xs text-muted-foreground text-right"
          >
            Tagihan diperbarui setiap 30 hari
          </div>
        </div>

        <!-- Payment Method Selection (only for paid plans) -->
        <div v-if="(selectedPlan?.price ?? 0) > 0" class="space-y-3">
          <p class="text-sm font-semibold">Metode Pembayaran</p>

          <!-- Grid 2 kolom -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Combined VA option -->
            <label
              class="flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all select-none"
              :class="
                selectedPaymentMethod === 'VA'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : 'border-muted hover:border-muted-foreground/40 hover:bg-muted/30'
              "
            >
              <input v-model="selectedPaymentMethod" type="radio" value="VA" class="sr-only" />
              <span class="text-xs font-semibold leading-tight">VA Pilihan Bank</span>
              <span class="text-[11px] text-muted-foreground leading-tight"
                >BCA, BNI, BRI & lainnya</span
              >
              <span
                class="text-[10px] mt-1 font-medium"
                :class="selectedPaymentMethod === 'VA' ? 'text-primary' : 'text-muted-foreground'"
              >
                Fee sesuai bank
              </span>
            </label>

            <!-- VA specific options -->
            <template v-if="vaPaymentMethods.length > 0">
              <label
                v-for="pm in vaPaymentMethods"
                :key="pm.code"
                class="flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all select-none"
                :class="
                  selectedPaymentMethod === pm.code
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-muted hover:border-muted-foreground/40 hover:bg-muted/30'
                "
              >
                <input
                  v-model="selectedPaymentMethod"
                  type="radio"
                  :value="pm.code"
                  class="sr-only"
                />
                <span class="text-xs font-semibold leading-tight">{{ pm.name }}</span>
                <span class="text-[11px] text-muted-foreground leading-tight capitalize">{{
                  pm.type.replace('_', ' ')
                }}</span>
                <span
                  class="text-[10px] mt-1 font-medium"
                  :class="
                    selectedPaymentMethod === pm.code ? 'text-primary' : 'text-muted-foreground'
                  "
                >
                  {{ feeLabel(pm) }}
                </span>
              </label>
            </template>

            <!-- QRIS options -->
            <template v-if="qrisPaymentMethods.length > 0">
              <label
                v-for="pm in qrisPaymentMethods"
                :key="pm.code"
                class="flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all select-none"
                :class="
                  selectedPaymentMethod === pm.code
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-muted hover:border-muted-foreground/40 hover:bg-muted/30'
                "
              >
                <input
                  v-model="selectedPaymentMethod"
                  type="radio"
                  :value="pm.code"
                  class="sr-only"
                />
                <span class="text-xs font-semibold leading-tight">{{ pm.name }}</span>
                <span class="text-[11px] text-muted-foreground leading-tight capitalize">{{
                  pm.type.replace('_', ' ')
                }}</span>
                <span
                  class="text-[10px] mt-1 font-medium"
                  :class="
                    selectedPaymentMethod === pm.code ? 'text-primary' : 'text-muted-foreground'
                  "
                >
                  {{ feeLabel(pm) }}
                </span>
              </label>
            </template>
          </div>

          <!-- Fallback jika payment methods kosong -->
          <div
            v-if="paymentMethods.length === 0"
            class="rounded-lg border border-dashed border-muted p-3 text-sm text-muted-foreground text-center"
          >
            Menggunakan Virtual Account (metode default)
          </div>
        </div>
      </div>

      <!-- Fixed Footer -->
      <DialogFooter
        class="px-6 py-4 bg-muted/20 border-t border-muted/40 gap-2 sm:justify-end shrink-0"
      >
        <Button
          type="button"
          variant="outline"
          :disabled="isSubmitting"
          @click="subscribeModalOpen = false"
        >
          Batal
        </Button>
        <Button type="button" :disabled="isSubmitting" @click="submitSubscribe">
          <Loader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
          <CreditCard v-else-if="(selectedPlan?.price ?? 0) > 0" class="h-4 w-4 mr-2" />
          <CheckCircle2 v-else class="h-4 w-4 mr-2" />
          {{
            isSubmitting
              ? 'Memproses...'
              : (selectedPlan?.price ?? 0) > 0
                ? 'Lanjut ke Pembayaran'
                : 'Aktifkan Plan Gratis'
          }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- ── Cancel Invoice Confirmation Modal ── -->
  <Dialog :open="cancelModalOpen" @update:open="cancelModalOpen = $event">
    <DialogContent class="sm:max-w-[420px] p-0 overflow-hidden">
      <DialogHeader class="p-6 pb-2">
        <DialogTitle class="flex items-center gap-2 text-xl">
          <XCircle class="h-5 w-5 text-destructive" />
          Batalkan Tagihan
        </DialogTitle>
        <DialogDescription class="mt-2">
          Apakah Anda yakin ingin membatalkan tagihan ini? Tindakan ini tidak dapat dibatalkan dan
          Anda perlu membuat tagihan baru untuk berlangganan.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter
        class="px-6 py-4 bg-muted/20 border-t border-muted/40 mt-4 gap-2 sm:justify-end"
      >
        <Button
          type="button"
          variant="outline"
          :disabled="isCancelling"
          @click="cancelModalOpen = false"
        >
          Kembali
        </Button>
        <Button type="button" variant="destructive" :disabled="isCancelling" @click="confirmCancel">
          <Loader2 v-if="isCancelling" class="h-4 w-4 mr-2 animate-spin" />
          {{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Tagihan' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
