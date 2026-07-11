<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import SecuritySettings from '@/components/SecuritySettings.vue'
import { Webhook, Shield, Link as LinkIcon, Save, Copy, Check, Terminal, Smartphone } from '@lucide/vue'
import { ref } from 'vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  apiKey: string | null
  hasHmac: boolean
  webhookSettings: {
    listenApps: string[]
    titleWildcard: string
    textWildcard: string
    targetUrl: string
  }
  webhookUrl: string
}>()

const form = useForm({
  listenApps: props.webhookSettings.listenApps.join(', '),
  titleWildcard: props.webhookSettings.titleWildcard,
  textWildcard: props.webhookSettings.textWildcard,
  targetUrl: props.webhookSettings.targetUrl,
})

const isCopied = ref(false)

function copyUrl() {
  navigator.clipboard.writeText(props.webhookUrl)
  isCopied.value = true
  setTimeout(() => isCopied.value = false, 2000)
}

function submit() {
  // Convert comma separated string to array before submitting
  const appsArray = form.listenApps
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    
  form.transform((data) => ({
    ...data,
    listenApps: appsArray
  })).post('/webhook-settings', {
    preserveScroll: true
  })
}

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/static-qris', desc: 'Mendapatkan daftar semua QRIS statis' },
  { method: 'POST', path: '/api/v1/static-qris', desc: 'Menambahkan QRIS statis baru' },
  { method: 'GET', path: '/api/v1/static-qris/:id', desc: 'Melihat detail QRIS statis' },
  { method: 'PUT', path: '/api/v1/static-qris/:id', desc: 'Mengubah data QRIS statis' },
  { method: 'DELETE', path: '/api/v1/static-qris/:id', desc: 'Menghapus QRIS statis' },
  { method: 'POST', path: '/api/v1/dynamic-qris', desc: 'Generate QRIS dinamis baru' },
  { method: 'GET', path: '/api/v1/dynamic-qris/:id', desc: 'Cek status transaksi dinamis' },
  { method: 'PUT', path: '/api/v1/dynamic-qris/:id', desc: 'Update status manual' },
  { method: 'POST', path: '/api/v1/dynamic-qris/callback', desc: 'Webhook untuk menerima notifikasi pembayaran' },
]
</script>

<template>
  <Head title="Pengaturan Webhook & API" />

  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">API & Webhook</h2>
      <p class="text-muted-foreground mt-1">Kelola integrasi, webhook otomatisasi, dan kredensial API Anda.</p>
    </div>
  </div>

  <Alert class="mb-8 border-primary/20 bg-primary/5">
    <Smartphone class="h-5 w-5 text-primary" />
    <AlertTitle class="font-semibold text-primary">Info Penting: Aplikasi Forwarder Android</AlertTitle>
    <AlertDescription class="text-muted-foreground mt-1 leading-relaxed">
      Untuk mengaktifkan fitur verifikasi status pembayaran QRIS Dinamis secara otomatis (real-time), Anda harus menginstal 
      <a href="https://github.com/karuhun-developer/android-notification-forwarder/releases" target="_blank" class="font-medium underline underline-offset-4 text-primary hover:text-primary/80 transition-colors">Android Notification Forwarder</a> 
      di HP yang menerima notifikasi mutasi. Atur Webhook URL di HP tersebut dan arahkan ke pengaturan Webhook di aplikasi ini.
    </AlertDescription>
  </Alert>

  <div class="mb-6 space-y-4">
    <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
      <div class="absolute -right-4 -top-4 bg-primary/10 w-24 h-24 rounded-full blur-2xl pointer-events-none"></div>
      <div class="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
        <Shield class="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 class="font-bold text-base">Kredensial Aman</h3>
        <p class="text-sm text-muted-foreground">Gunakan API Key dan HMAC untuk mengamankan integrasi dari pihak ketiga.</p>
      </div>
    </div>
    <SecuritySettings :api-key="apiKey" :has-hmac="hasHmac" />
  </div>

  <div class="space-y-6">
    <!-- Webhook Settings -->
      <Card class="bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Webhook class="h-5 w-5 text-primary" />
            Konfigurasi Webhook Listener
          </CardTitle>
          <CardDescription>
            Atur bagaimana sistem memfilter notifikasi aplikasi untuk menandai transaksi menjadi PAID secara otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent class="relative z-10">
          <div class="mb-6 p-4 bg-muted/30 rounded-lg border flex items-center justify-between gap-4 flex-wrap">
            <div class="flex-1 min-w-[200px]">
              <p class="text-sm font-medium text-muted-foreground mb-1">URL Endpoint Webhook</p>
              <p class="font-mono text-sm break-all">{{ webhookUrl }}</p>
            </div>
            <Button variant="outline" size="sm" @click="copyUrl">
              <Check v-if="isCopied" class="h-4 w-4 mr-2 text-green-500" />
              <Copy v-else class="h-4 w-4 mr-2" />
              {{ isCopied ? 'Tersalin' : 'Copy URL' }}
            </Button>
          </div>

          <form @submit.prevent="submit" class="space-y-5">
            <div class="space-y-2">
              <Label>Aplikasi yang Didengarkan (Listen To Apps)</Label>
              <Input 
                v-model="form.listenApps" 
                placeholder="Dana Merchant, Gojek Merchant, Shopee Pay" 
              />
              <p class="text-xs text-muted-foreground">Pisahkan dengan koma. Contoh: <code>Dana Merchant, Gojek Merchant</code></p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Wildcard Notification Title</Label>
                <Input 
                  v-model="form.titleWildcard" 
                  placeholder="Contoh: Pembayaran diterima" 
                />
                <p class="text-xs text-muted-foreground">Pesan notifikasi (judul) harus mengandung kata ini.</p>
              </div>
              <div class="space-y-2">
                <Label>Wildcard Notification Text</Label>
                <Input 
                  v-model="form.textWildcard" 
                  placeholder="Contoh: Transaksi QRIS berhasil" 
                />
                <p class="text-xs text-muted-foreground">Pesan notifikasi (isi) harus mengandung kata ini.</p>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Target Webhook URL</Label>
              <Input 
                v-model="form.targetUrl" 
                placeholder="https://api.websiteanda.com/qris/callback" 
                type="url"
              />
              <p class="text-xs text-muted-foreground">URL yang akan dipanggil (POST) oleh sistem saat status transaksi berubah menjadi PAID.</p>
            </div>

            <Button type="submit" :disabled="form.processing">
              <Save class="h-4 w-4 mr-2" />
              {{ form.processing ? 'Menyimpan...' : 'Simpan Pengaturan' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- API Endpoints Info -->
      <Card class="bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Terminal class="h-5 w-5 text-emerald-500" />
            Daftar API Endpoint
          </CardTitle>
          <CardDescription>
            Gunakan <code>x-api-key</code> di header untuk mengakses endpoint di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="rounded-md border overflow-hidden">
            <table class="w-full text-sm text-left">
              <thead class="bg-muted/50 text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 font-medium">Method</th>
                  <th class="px-4 py-3 font-medium">Endpoint</th>
                  <th class="px-4 py-3 font-medium">Deskripsi</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="(api, i) in apiEndpoints" :key="i" class="hover:bg-muted/20">
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                      :class="{
                        'bg-blue-500/10 text-blue-500': api.method === 'GET',
                        'bg-emerald-500/10 text-emerald-500': api.method === 'POST',
                        'bg-amber-500/10 text-amber-500': api.method === 'PUT',
                        'bg-destructive/10 text-destructive': api.method === 'DELETE'
                      }">
                      {{ api.method }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-mono text-xs">{{ api.path }}</td>
                  <td class="px-4 py-3 text-muted-foreground">{{ api.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
  </div>
</template>
