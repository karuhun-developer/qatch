<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { QrCode, Zap, Shield } from '@lucide/vue'

defineOptions({ layout: DefaultLayout })
</script>

<template>
  <Head title="Home" />
  
  <div class="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 bg-gradient-to-b from-background to-muted/20">
    <div class="max-w-3xl space-y-6">
      <h1 class="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
        Solusi Terbaik untuk <span class="text-primary">QRIS Dinamis</span> Anda
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Buat dan kelola pembayaran QRIS dengan mudah, cepat, dan aman. Mulai sekarang untuk meningkatkan pengalaman transaksi pelanggan Anda.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button as-child size="lg" class="px-8">
          <Link href="/register">Mulai Gratis</Link>
        </Button>
        <Button as-child size="lg" variant="outline" class="px-8">
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    </div>
  </div>

  <div class="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-3 gap-8">
      <Card class="bg-card/50 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors">
        <CardHeader>
          <QrCode class="h-10 w-10 text-primary mb-2" />
          <CardTitle>QRIS Otomatis</CardTitle>
          <CardDescription>Generate QRIS dinamis secara instan dengan nominal spesifik.</CardDescription>
        </CardHeader>
      </Card>
      <Card class="bg-card/50 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors">
        <CardHeader>
          <Zap class="h-10 w-10 text-primary mb-2" />
          <CardTitle>Cepat & Real-time</CardTitle>
          <CardDescription>Notifikasi pembayaran masuk secara real-time ke sistem Anda.</CardDescription>
        </CardHeader>
      </Card>
      <Card class="bg-card/50 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors">
        <CardHeader>
          <Shield class="h-10 w-10 text-primary mb-2" />
          <CardTitle>Aman Terpercaya</CardTitle>
          <CardDescription>Keamanan tingkat tinggi untuk setiap transaksi yang diproses.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
