<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  QrCode,
  RefreshCw,
  Check,
  Copy,
  UploadCloud,
  Building,
  MapPin,
  Settings,
} from '@lucide/vue'
import QrcodeVue from 'qrcode.vue'
import jsQR from 'jsqr'
// eslint-disable-next-line @adonisjs/no-backend-import-in-frontend
import { parseQRIS } from '../../app/services/qris/parser.js'
// eslint-disable-next-line @adonisjs/no-backend-import-in-frontend
import { convertQRIS } from '../../app/services/qris/converter.js'

defineOptions({ layout: DefaultLayout })

const qrisString = ref('')
const parsedData = ref<any>(null)
const parseError = ref('')

const form = ref({
  amount: 10000,
  feeType: 'none',
  feeValue: 0,
})

const isGenerating = ref(false)
const resultQrisString = ref('')
const resultBase64 = ref('')

// Handle Upload Image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]

    // Parse the QR string from the image on the frontend
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)

        const imageData = context.getImageData(0, 0, img.width, img.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          qrisString.value = code.data
          parseError.value = ''
          parseQris(code.data)
        } else {
          qrisString.value = ''
          parsedData.value = null
          parseError.value = 'Gagal mendeteksi kode QR. Pastikan gambar jelas.'
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function parseQris(rawQris: string) {
  try {
    const parsed = parseQRIS(rawQris)
    parsedData.value = parsed
  } catch (error: any) {
    parseError.value = error.message || 'Gagal memparsing QRIS'
    parsedData.value = null
  }
}

const totalAmount = computed(() => {
  let fee = 0
  if (form.value.feeType === 'fixed') {
    fee = form.value.feeValue
  } else if (form.value.feeType === 'percent') {
    fee = (form.value.amount * form.value.feeValue) / 100
  }
  return form.value.amount + fee
})

function generate() {
  if (!qrisString.value) return
  isGenerating.value = true
  resultQrisString.value = ''
  resultBase64.value = ''

  try {
    const convertOpts: any = { amount: form.value.amount }
    if (form.value.feeType !== 'none' && form.value.feeValue > 0) {
      convertOpts.fee = {
        type: form.value.feeType === 'percent' ? 'percentage' : 'fixed',
        value: form.value.feeValue
      }
    }

    const newQrisString = convertQRIS(qrisString.value, convertOpts)

    resultQrisString.value = newQrisString

    // Generate Base64 from canvas
    setTimeout(() => {
      const canvas = document.querySelector('.result-qr canvas') as HTMLCanvasElement
      if (canvas) {
        resultBase64.value = canvas.toDataURL('image/png')
      }
    }, 100)
  } catch (error: any) {
    alert(error.message || 'Gagal generate QRIS')
  } finally {
    isGenerating.value = false
  }
}

const isCopiedStr = ref(false)
const isCopiedB64 = ref(false)

function copyString() {
  navigator.clipboard.writeText(resultQrisString.value)
  isCopiedStr.value = true
  setTimeout(() => {
    isCopiedStr.value = false
  }, 2000)
}

function copyBase64() {
  navigator.clipboard.writeText(resultBase64.value)
  isCopiedB64.value = true
  setTimeout(() => {
    isCopiedB64.value = false
  }, 2000)
}
</script>

<template>
  <Head title="Demo QRIS Generator" />

  <div class="relative min-h-screen bg-background pt-24 pb-12 overflow-hidden">
    <!-- Background Decor -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    ></div>
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -z-10"
    ></div>

    <div class="container mx-auto max-w-5xl px-4 relative z-10">
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm"
        >
          <QrCode class="mr-2 h-4 w-4" />
          <span>Live Demo Interaktif</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          Ubah QRIS Statis Jadi Dinamis
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Coba langsung teknologi generator QRIS kami tanpa perlu mendaftar. Semua diproses instan
          tanpa menyimpan data Anda ke database.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Step 1 & 2: Upload & Form -->
        <div class="space-y-6">
          <Card
            class="bg-card/80 backdrop-blur-md border-muted/50 hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-xl">
                <span
                  class="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-sm"
                  >1</span
                >
                Upload QRIS Statis
              </CardTitle>
              <CardDescription>Pilih gambar kode QR dari galeri Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                class="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:bg-muted/10 transition-colors relative"
              >
                <Input
                  ref="fileInputRef"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  @change="handleFileChange"
                />
                <UploadCloud class="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p class="font-medium">Klik atau drop gambar ke sini</p>
                <p class="text-xs text-muted-foreground mt-1">Format: JPG, PNG (Maks 5MB)</p>
              </div>

              <div
                v-if="parseError"
                class="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium"
              >
                {{ parseError }}
              </div>

              <div
                v-if="parsedData"
                class="mt-4 bg-muted/30 p-4 rounded-lg border text-sm space-y-3"
              >
                <div class="flex items-center text-emerald-500 font-semibold mb-2">
                  <Check class="h-4 w-4 mr-1" /> QRIS Valid Terdeteksi
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="text-muted-foreground flex items-center"
                    ><Building class="h-3.5 w-3.5 mr-2" /> Merchant</span
                  >
                  <span class="font-bold">{{ parsedData.merchantName }}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="text-muted-foreground flex items-center"
                    ><MapPin class="h-3.5 w-3.5 mr-2" /> Lokasi</span
                  >
                  <span class="font-medium">{{ parsedData.merchantCity }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground flex items-center"
                    ><Settings class="h-3.5 w-3.5 mr-2" /> Kategori (MCC)</span
                  >
                  <span class="font-medium">{{ parsedData.merchantCategoryCode }}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            class="bg-card/80 backdrop-blur-md border-muted/50 hover:border-primary/50 transition-colors"
            :class="{ 'opacity-50 pointer-events-none': !parsedData }"
          >
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-xl">
                <span
                  class="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-sm"
                  >2</span
                >
                Tentukan Nominal
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label>Nominal Pembayaran (Rp)</Label>
                <Input
                  v-model="form.amount"
                  type="number"
                  min="1"
                  placeholder="Contoh: 10000"
                  class="text-lg font-bold"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Tipe Fee</Label>
                  <Select v-model="form.feeType">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa Fee</SelectItem>
                      <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                      <SelectItem value="percent">Persentase (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label>Nilai Fee</Label>
                  <Input
                    v-model="form.feeValue"
                    type="number"
                    min="0"
                    :disabled="form.feeType === 'none'"
                  />
                </div>
              </div>

              <div
                class="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center justify-between mt-4"
              >
                <span class="font-medium text-primary">Estimasi Total:</span>
                <span class="font-bold text-xl">Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
              </div>

              <Button
                class="w-full h-12 text-md mt-4 shadow-lg shadow-primary/20"
                :disabled="isGenerating"
                @click="generate"
              >
                <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
                {{ isGenerating ? 'Memproses...' : 'Generate QRIS Dinamis' }}
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Step 3: Result -->
        <div class="h-full">
          <Card
            class="bg-card/80 backdrop-blur-md border-muted/50 h-full flex flex-col relative overflow-hidden"
            :class="{ 'border-emerald-500/50 shadow-lg shadow-emerald-500/10': resultQrisString }"
          >
            <div
              v-if="resultQrisString"
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"
            ></div>

            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-xl">
                <span
                  class="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-sm"
                  >3</span
                >
                Hasil Output
              </CardTitle>
              <CardDescription>QRIS dinamis siap digunakan.</CardDescription>
            </CardHeader>
            <CardContent class="flex-1 flex flex-col relative z-10">
              <div
                v-if="!resultQrisString"
                class="flex-1 flex flex-col items-center justify-center text-muted-foreground/50 space-y-4 py-12"
              >
                <QrCode class="h-24 w-24 opacity-50" />
                <p>Output akan muncul di sini</p>
              </div>

              <div v-else class="space-y-6 flex-1">
                <!-- Image -->
                <div
                  class="flex flex-col items-center justify-center bg-white p-6 rounded-xl border mx-auto w-fit result-qr shadow-sm"
                >
                  <QrcodeVue :value="resultQrisString" :size="240" level="M" />
                </div>

                <!-- Base64 -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label class="font-semibold text-primary">Data URI (Base64)</Label>
                    <Button variant="ghost" size="sm" class="h-7 text-xs" @click="copyBase64">
                      <Check v-if="isCopiedB64" class="h-3 w-3 mr-1 text-emerald-500" />
                      <Copy v-else class="h-3 w-3 mr-1" />
                      {{ isCopiedB64 ? 'Tersalin' : 'Copy' }}
                    </Button>
                  </div>
                  <Input
                    readonly
                    :model-value="resultBase64"
                    class="bg-muted/50 font-mono text-[10px]"
                  />
                </div>

                <!-- String -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label class="font-semibold text-primary">QRIS String (Raw)</Label>
                    <Button variant="ghost" size="sm" class="h-7 text-xs" @click="copyString">
                      <Check v-if="isCopiedStr" class="h-3 w-3 mr-1 text-emerald-500" />
                      <Copy v-else class="h-3 w-3 mr-1" />
                      {{ isCopiedStr ? 'Tersalin' : 'Copy' }}
                    </Button>
                  </div>
                  <textarea
                    readonly
                    :value="resultQrisString"
                    class="flex w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
