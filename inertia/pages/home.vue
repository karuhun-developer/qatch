<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { QrCode, Zap, Shield, LineChart, Check } from '@lucide/vue'

defineOptions({ layout: DefaultLayout })

const props = defineProps<{
  plans: {
    id: number
    name: string
    price: number
    description: string | null
    isFeatured: boolean
    features: string[] | null
  }[]
}>()

import { computed } from 'vue'

const displayPlans = computed(() => {
  const plansCopy = [...props.plans]
  const featuredIndex = plansCopy.findIndex((p) => p.isFeatured)

  if (featuredIndex !== -1 && plansCopy.length > 2) {
    // Extract the featured plan
    const featured = plansCopy.splice(featuredIndex, 1)[0]
    // Insert it in the middle
    const middleIndex = Math.floor(plansCopy.length / 2)
    plansCopy.splice(middleIndex, 0, featured)
  }

  return plansCopy
})
</script>

<template>
  <Head>
    <title>Qatch — Alternative Payment Gateway QRIS Dinamis Otomatis untuk Bisnis Indonesia</title>
    <meta
      name="description"
      content="Qatch adalah alternative payment gateway berbasis QRIS untuk UMKM dan developer Indonesia. Ubah QRIS statis menjadi QRIS dinamis dengan nominal otomatis, kode unik anti-duplikat, API Key, Webhook, dan Android Listener."
    />
    <meta
      name="keywords"
      content="alternative payment gateway, QRIS dinamis, QRIS statis, generate QRIS, QRIS otomatis, API QRIS, webhook pembayaran, QR code pembayaran, payment gateway indonesia, QRIS nominal otomatis, Qatch, alternative midtrans, alternative xendit, QRIS UMKM"
    />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Karuhun Developer" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Qatch — Alternative Payment Gateway QRIS Dinamis Otomatis" />
    <meta
      property="og:description"
      content="Alternative payment gateway ringan untuk UMKM & developer. Konversi QRIS statis ke dinamis secara real-time. Dilengkapi API, Webhook, dan Android Notification Forwarder."
    />
    <meta property="og:url" :content="String($page.props.appUrl)" />
    <meta property="og:image" :content="String($page.props.appUrl) + '/QATCHLOGO.jpeg'" />
    <meta property="og:site_name" content="Qatch" />
    <meta property="og:locale" content="id_ID" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Qatch — Alternative Payment Gateway QRIS Dinamis" />
    <meta
      name="twitter:description"
      content="Alternative payment gateway berbasis QRIS. Konversi QRIS statis ke dinamis dengan nominal otomatis, API & Webhook siap pakai."
    />
    <meta name="twitter:image" :content="String($page.props.appUrl) + '/QATCHLOGO.jpeg'" />
    <!-- Canonical -->
    <link rel="canonical" :href="String($page.props.appUrl)" />
    <link rel="icon" type="image/x-icon" href="/QATCHLOGO.ico" />
  </Head>

  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-background">
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    ></div>
    <div
      class="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-32 sm:py-40"
    >
      <div class="max-w-4xl space-y-8 relative z-10">
        <div
          class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm"
        >
          <Zap class="mr-2 h-4 w-4" />
          <span>Alternative Payment Gateway Berbasis QRIS</span>
        </div>
        <h1
          class="text-5xl font-extrabold tracking-tight lg:text-7xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        >
          Sulap QRIS Statis Jadi <span class="text-primary block mt-2">Dinamis & Otomatis</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Alternative payment gateway ringan untuk UMKM, Developer, dan Freelancer. Tingkatkan QRIS
          statis biasa menjadi sistem pembayaran pintar dengan integrasi API yang seamless — tanpa
          biaya per transaksi.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-left max-w-3xl mx-auto pt-4"
        >
          <ul class="space-y-3">
            <li class="flex items-center">
              <Check class="mr-2 h-5 w-5 text-primary" /> Nominal pembayaran otomatis terkunci
            </li>
            <li class="flex items-center">
              <Check class="mr-2 h-5 w-5 text-primary" /> Kode unik cerdas untuk tracking instan
            </li>
          </ul>
          <ul class="space-y-3">
            <li class="flex items-center">
              <Check class="mr-2 h-5 w-5 text-primary" /> API Key gratis untuk integrasi aplikasi
            </li>
            <li class="flex items-center">
              <Check class="mr-2 h-5 w-5 text-primary" /> Webhook & Android Listener notifikasi
              real-time
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            as-child
            size="lg"
            class="px-8 h-12 rounded-full text-md shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <Link href="/register">Mulai Gratis Sekarang</Link>
          </Button>
          <Button
            as-child
            size="lg"
            variant="outline"
            class="px-8 h-12 rounded-full text-md backdrop-blur-sm bg-background/50 border-muted hover:bg-muted transition-all"
          >
            <Link href="/login">Masuk ke Dashboard</Link>
          </Button>
          <Button
            as-child
            size="lg"
            variant="ghost"
            class="px-8 h-12 rounded-full text-md font-medium text-primary hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Link href="/demo">Coba Live Demo Interaktif</Link>
          </Button>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"
      ></div>
    </div>
  </div>

  <!-- Pricing Section -->
  <div class="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Pilih Paket Sesuai Kebutuhan</h2>
      <p class="mt-4 text-lg text-muted-foreground">
        Harga transparan, tanpa biaya tersembunyi. Bebas potongan per transaksi.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <Card
        v-for="plan in displayPlans"
        :key="plan.id"
        class="flex flex-col relative transition-colors"
        :class="[
          plan.isFeatured
            ? 'border-primary shadow-lg shadow-primary/10 bg-card/80 backdrop-blur-md scale-105 z-10'
            : 'border-muted/50 bg-card/50 backdrop-blur-sm hover:border-primary/50',
        ]"
      >
        <div v-if="plan.isFeatured" class="absolute -top-4 inset-x-0 flex justify-center">
          <span
            class="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            >Paling Populer</span
          >
        </div>
        <CardHeader>
          <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
          <CardDescription>{{ plan.description }}</CardDescription>
          <div class="mt-4 flex items-baseline text-5xl font-extrabold">
            <span v-if="plan.price === 0">Gratis</span>
            <span v-else>{{ (plan.price / 1000).toLocaleString('id-ID') }}</span>
            <span class="ml-1 text-xl font-medium text-muted-foreground">{{
              plan.price === 0 ? '/selamanya' : '/bulan'
            }}</span>
          </div>
        </CardHeader>
        <CardContent class="flex-1">
          <ul class="space-y-4 text-sm">
            <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-center">
              <Check class="mr-2 h-4 w-4 text-primary" /> {{ feature }}
            </li>
          </ul>
        </CardContent>
        <div class="p-6 pt-0 mt-auto">
          <Button as-child class="w-full" :variant="plan.price === 0 ? 'outline' : 'default'">
            <Link
              :href="plan.price === 0 ? '/register' : `/register?plan=${plan.name.toLowerCase()}`"
            >
              {{ plan.price === 0 ? 'Mulai Gratis' : `Pilih ${plan.name}` }}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  </div>

  <!-- Bento Grid Features Section -->
  <div class="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-6xl">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Semua yang Anda butuhkan</h2>
      <p class="mt-4 text-lg text-muted-foreground">
        Dirancang untuk skala kecil hingga enterprise besar.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
      <!-- Bento Item 1 (Large) -->
      <Card
        class="md:col-span-2 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col justify-end">
          <div class="mb-auto p-3 bg-primary/10 w-fit rounded-xl">
            <QrCode class="h-8 w-8 text-primary" />
          </div>
          <div class="mt-8">
            <CardTitle class="text-2xl mb-2">QRIS Otomatis & Dinamis</CardTitle>
            <CardDescription class="text-base text-muted-foreground/80 max-w-md"
              >Generate kode QR unik dengan nominal spesifik dalam hitungan milidetik. Hindari
              kesalahan transfer pelanggan.</CardDescription
            >
          </div>
        </CardHeader>
      </Card>

      <!-- Bento Item 2 (Tall/Square) -->
      <Card
        class="md:col-span-1 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"
        ></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col">
          <div class="p-3 bg-blue-500/10 w-fit rounded-xl mb-6">
            <Zap class="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle class="text-xl mb-2 mt-auto">Notifikasi Real-time</CardTitle>
          <CardDescription class="text-sm"
            >Webhook dan notifikasi instan saat pembayaran berhasil diterima.</CardDescription
          >
        </CardHeader>
      </Card>

      <!-- Bento Item 3 (Small) -->
      <Card
        class="md:col-span-1 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300"
      >
        <div
          class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent -z-10"
        ></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col">
          <div class="p-3 bg-emerald-500/10 w-fit rounded-xl mb-6">
            <Shield class="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle class="text-xl mb-2 mt-auto">Keamanan Bank-grade</CardTitle>
          <CardDescription class="text-sm"
            >Enkripsi end-to-end dengan standar keamanan industri perbankan.</CardDescription
          >
        </CardHeader>
      </Card>

      <!-- Bento Item 4 (Large Horizontal) -->
      <Card
        class="md:col-span-2 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row items-center"
      >
        <div class="p-8 flex-1 w-full h-full flex flex-col justify-center">
          <div class="p-3 bg-purple-500/10 w-fit rounded-xl mb-6">
            <LineChart class="h-8 w-8 text-purple-500" />
          </div>
          <CardTitle class="text-2xl mb-2">Analitik Komprehensif</CardTitle>
          <CardDescription class="text-base text-muted-foreground/80 max-w-sm"
            >Pantau arus kas, tren penjualan, dan keberhasilan transaksi dalam satu dashboard
            intuitif.</CardDescription
          >
        </div>
        <div
          class="flex-1 w-full h-full bg-muted/20 relative hidden md:block border-l border-muted/50"
        >
          <!-- Placeholder for chart graphic -->
          <div
            class="absolute inset-4 rounded-xl border border-muted bg-background/50 flex items-end justify-between p-4 gap-2 opacity-50 group-hover:opacity-80 transition-opacity"
          >
            <div class="w-full bg-primary/40 rounded-t-sm h-[30%]"></div>
            <div class="w-full bg-primary/60 rounded-t-sm h-[50%]"></div>
            <div class="w-full bg-primary/80 rounded-t-sm h-[40%]"></div>
            <div class="w-full bg-primary/50 rounded-t-sm h-[70%]"></div>
            <div class="w-full bg-primary rounded-t-sm h-[90%]"></div>
            <div class="w-full bg-primary/70 rounded-t-sm h-[60%]"></div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
