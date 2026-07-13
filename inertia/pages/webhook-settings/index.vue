<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SecuritySettings from '@/components/SecuritySettings.vue'
import AndroidForwarderAlert from '@/components/AndroidForwarderAlert.vue'
import TagInput from '@/components/TagInput.vue'
import { Webhook, Link as LinkIcon, Save, Copy, Check, Terminal } from '@lucide/vue'
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

// Parse stored comma-separated wildcards back to arrays for TagInput
function parseWildcards(value: string): string[] {
  return value
    ? value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}

const form = useForm({
  listenApps: props.webhookSettings.listenApps ?? [],
  titleWildcards: parseWildcards(props.webhookSettings.titleWildcard),
  textWildcards: parseWildcards(props.webhookSettings.textWildcard),
  targetUrl: props.webhookSettings.targetUrl,
})

const isCopied = ref(false)

function copyUrl() {
  navigator.clipboard.writeText(props.webhookUrl)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 2000)
}

function submit() {
  form
    .transform((data) => ({
      listenApps: data.listenApps,
      titleWildcard: data.titleWildcards.join(','),
      textWildcard: data.textWildcards.join(','),
      targetUrl: data.targetUrl,
    }))
    .post('/webhook-settings', {
      preserveScroll: true,
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
  {
    method: 'POST',
    path: '/api/v1/dynamic-qris/callback',
    desc: 'Webhook untuk menerima notifikasi pembayaran',
  },
]
</script>

<template>
  <Head title="Pengaturan Webhook & API" />

  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">API & Webhook</h2>
      <p class="text-muted-foreground mt-1">
        Kelola integrasi, webhook otomatisasi, dan kredensial API Anda.
        <a
          href="/docs"
          target="_blank"
          class="text-primary hover:underline font-medium inline-flex items-center gap-1"
        >
          Baca dokumentasi lengkap di sini <LinkIcon class="h-3 w-3" />
        </a>
      </p>
    </div>
  </div>

  <AndroidForwarderAlert class="mb-8" />

  <div class="mb-6 space-y-4">
    <SecuritySettings :api-key="apiKey" :has-hmac="hasHmac" />
  </div>

  <div class="space-y-6">
    <!-- Webhook Settings -->
    <Card class="bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden group">
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
      ></div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Webhook class="h-5 w-5 text-primary" />
          Konfigurasi Webhook Listener
        </CardTitle>
        <CardDescription>
          Atur bagaimana sistem memfilter notifikasi aplikasi untuk menandai transaksi menjadi PAID
          secara otomatis.
        </CardDescription>
      </CardHeader>
      <CardContent class="relative z-10">
        <div
          class="mb-6 p-4 bg-muted/30 rounded-lg border flex items-center justify-between gap-4 flex-wrap"
        >
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

        <form class="space-y-5" @submit.prevent="submit">
          <div class="space-y-2">
            <Label>Aplikasi yang Didengarkan (Listen To Apps)</Label>
            <TagInput
              v-model="form.listenApps"
              :separators="[',']"
              placeholder="Ketik nama app lalu Enter atau koma... (Dana, Gojek)"
            />
            <p class="text-xs text-muted-foreground">
              Tekan <kbd class="rounded border px-1 text-xs">Enter</kbd> atau
              <kbd class="rounded border px-1 text-xs">,</kbd> untuk menambah. Kosongkan untuk
              terima dari semua aplikasi.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Wildcard Notification Title</Label>
              <TagInput
                v-model="form.titleWildcards"
                :separators="[',']"
                placeholder="Pembayaran Diterima, QRIS..."
              />
              <p class="text-xs text-muted-foreground">
                Judul notifikasi harus mengandung <em>salah satu</em> kata ini. Kosongkan untuk
                melewati pengecekan.
              </p>
            </div>
            <div class="space-y-2">
              <Label>Wildcard Notification Text</Label>
              <TagInput
                v-model="form.textWildcards"
                :separators="[',']"
                placeholder="Transaksi QRIS, berhasil..."
              />
              <p class="text-xs text-muted-foreground">
                Isi notifikasi harus mengandung <em>salah satu</em> kata ini. Kosongkan untuk
                melewati pengecekan.
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Target Webhook URL</Label>
            <Input
              v-model="form.targetUrl"
              placeholder="https://api.websiteanda.com/qris/callback"
              type="url"
            />
            <p class="text-xs text-muted-foreground">
              URL yang akan dipanggil (POST) oleh sistem saat status transaksi berubah menjadi PAID.
            </p>
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
        <CardDescription class="flex items-center justify-between">
          <span
            >Gunakan <code>x-api-key</code> di header untuk mengakses endpoint di bawah ini.</span
          >
          <a
            href="/docs"
            target="_blank"
            class="text-primary hover:underline font-medium flex items-center gap-1 text-xs"
          >
            Dokumentasi lengkap <LinkIcon class="h-3 w-3" />
          </a>
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
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    :class="{
                      'bg-blue-500/10 text-blue-500': api.method === 'GET',
                      'bg-emerald-500/10 text-emerald-500': api.method === 'POST',
                      'bg-amber-500/10 text-amber-500': api.method === 'PUT',
                      'bg-destructive/10 text-destructive': api.method === 'DELETE',
                    }"
                  >
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
