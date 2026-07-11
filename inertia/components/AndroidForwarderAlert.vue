<script setup lang="ts">
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Smartphone } from '@lucide/vue'

defineProps<{
  class?: string
}>()
</script>

<template>
  <Alert :class="['border-emerald-500/30 bg-emerald-500/10', $props.class]">
    <Smartphone class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    <AlertTitle class="font-semibold text-foreground">Info Penting: Aplikasi Forwarder Android</AlertTitle>
    <AlertDescription class="text-muted-foreground mt-1 leading-relaxed">
      Untuk mengaktifkan fitur verifikasi status pembayaran QRIS Dinamis secara otomatis (real-time), Anda harus menginstal 
      <a href="https://github.com/karuhun-developer/android-notification-forwarder/releases" target="_blank" class="font-medium underline underline-offset-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">Android Notification Forwarder</a> 
      di HP yang menerima notifikasi mutasi. Atur Webhook URL di HP tersebut dan arahkan ke pengaturan Webhook di aplikasi ini.
    </AlertDescription>
  </Alert>
</template>
