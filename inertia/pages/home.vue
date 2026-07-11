<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { QrCode, Zap, Shield, LineChart } from '@lucide/vue'

defineOptions({ layout: DefaultLayout })
</script>

<template>
  <Head title="Home" />
  
  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-background">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-32 sm:py-40">
      <div class="max-w-4xl space-y-8 relative z-10">
        <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
          <Zap class="mr-2 h-4 w-4" />
          <span>Platform QRIS Dinamis Terbaik</span>
        </div>
        <h1 class="text-5xl font-extrabold tracking-tight lg:text-7xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Revolusi Transaksi <span class="text-primary block mt-2">Bisnis Anda</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Ubah cara Anda menerima pembayaran. Buat, kelola, dan lacak QRIS dinamis secara real-time dengan keamanan level enterprise.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button as-child size="lg" class="px-8 h-12 rounded-full text-md shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Link href="/signup">Mulai Gratis Sekarang</Link>
          </Button>
          <Button as-child size="lg" variant="outline" class="px-8 h-12 rounded-full text-md backdrop-blur-sm bg-background/50 border-muted hover:bg-muted transition-all">
            <Link href="/login">Masuk ke Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </div>
  </div>

  <!-- Bento Grid Features Section -->
  <div class="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-6xl">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Semua yang Anda butuhkan</h2>
      <p class="mt-4 text-lg text-muted-foreground">Dirancang untuk skala kecil hingga enterprise besar.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
      
      <!-- Bento Item 1 (Large) -->
      <Card class="md:col-span-2 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col justify-end">
          <div class="mb-auto p-3 bg-primary/10 w-fit rounded-xl">
            <QrCode class="h-8 w-8 text-primary" />
          </div>
          <div class="mt-8">
            <CardTitle class="text-2xl mb-2">QRIS Otomatis & Dinamis</CardTitle>
            <CardDescription class="text-base text-muted-foreground/80 max-w-md">Generate kode QR unik dengan nominal spesifik dalam hitungan milidetik. Hindari kesalahan transfer pelanggan.</CardDescription>
          </div>
        </CardHeader>
      </Card>
      
      <!-- Bento Item 2 (Tall/Square) -->
      <Card class="md:col-span-1 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col">
          <div class="p-3 bg-blue-500/10 w-fit rounded-xl mb-6">
            <Zap class="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle class="text-xl mb-2 mt-auto">Notifikasi Real-time</CardTitle>
          <CardDescription class="text-sm">Webhook dan notifikasi instan saat pembayaran berhasil diterima.</CardDescription>
        </CardHeader>
      </Card>
      
      <!-- Bento Item 3 (Small) -->
      <Card class="md:col-span-1 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent -z-10"></div>
        <CardHeader class="relative z-10 p-8 h-full flex flex-col">
          <div class="p-3 bg-emerald-500/10 w-fit rounded-xl mb-6">
            <Shield class="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle class="text-xl mb-2 mt-auto">Keamanan Bank-grade</CardTitle>
          <CardDescription class="text-sm">Enkripsi end-to-end dengan standar keamanan industri perbankan.</CardDescription>
        </CardHeader>
      </Card>
      
      <!-- Bento Item 4 (Large Horizontal) -->
      <Card class="md:col-span-2 row-span-1 bg-card/80 backdrop-blur-md border-muted/50 overflow-hidden relative group hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row items-center">
        <div class="p-8 flex-1 w-full h-full flex flex-col justify-center">
          <div class="p-3 bg-purple-500/10 w-fit rounded-xl mb-6">
            <LineChart class="h-8 w-8 text-purple-500" />
          </div>
          <CardTitle class="text-2xl mb-2">Analitik Komprehensif</CardTitle>
          <CardDescription class="text-base text-muted-foreground/80 max-w-sm">Pantau arus kas, tren penjualan, dan keberhasilan transaksi dalam satu dashboard intuitif.</CardDescription>
        </div>
        <div class="flex-1 w-full h-full bg-muted/20 relative hidden md:block border-l border-muted/50">
          <!-- Placeholder for chart graphic -->
          <div class="absolute inset-4 rounded-xl border border-muted bg-background/50 flex items-end justify-between p-4 gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
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
