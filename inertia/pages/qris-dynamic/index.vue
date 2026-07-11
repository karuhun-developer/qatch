<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, useForm, router, Link } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, QrCode, Building, MapPin, Receipt, Clock, Settings, Copy, Check, Smartphone } from '@lucide/vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import QrcodeVue from 'qrcode.vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  staticQrisOptions: any[]
  transactions: {
    meta: any
    data: any[]
  }
}>()

const form = useForm({
  qrisId: '' as string | number,
  amount: 10000,
  feeType: 'none',
  feeValue: 0,
  expiredHours: 24
})

const selectedQris = computed(() => {
  return props.staticQrisOptions.find(q => q.id === form.qrisId)
})

const totalAmount = computed(() => {
  let fee = 0
  if (form.feeType === 'fixed') {
    fee = form.feeValue
  } else if (form.feeType === 'percent') {
    fee = (form.amount * form.feeValue) / 100
  }
  return form.amount + fee
})

function submit() {
  form.post('/qris-dynamic', {
    preserveScroll: true,
    onSuccess: () => {
      form.reset('amount', 'feeType', 'feeValue')
      form.feeType = 'none'
      form.feeValue = 0
    }
  })
}

function changePage(page: number) {
  router.get('/qris-dynamic', { page }, { preserveState: true })
}

// QR Code View Modal
const viewModalOpen = ref(false)
const selectedTx = ref<any>(null)
const isCopied = ref(false)

function openQrModal(tx: any) {
  selectedTx.value = tx
  viewModalOpen.value = true
}

function copyQrisString() {
  if (selectedTx.value?.qrisString) {
    navigator.clipboard.writeText(selectedTx.value.qrisString)
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 2000)
  }
}

// Status Update Modal
const statusModalOpen = ref(false)
const selectedTxForStatus = ref<any>(null)
const statusForm = useForm({
  status: 'pending',
  proof: null as File | null
})

function openStatusModal(tx: any) {
  selectedTxForStatus.value = tx
  statusForm.status = tx.status
  statusForm.proof = null
  statusModalOpen.value = true
}

function updateStatus() {
  if (!selectedTxForStatus.value) return
  
  // Create formData for file upload
  // Inertia handles it automatically if we have a file
  statusForm.post(`/qris-dynamic/${selectedTxForStatus.value.id}/status`, {
    preserveScroll: true,
    forceFormData: true,
    onSuccess: () => {
      statusModalOpen.value = false
    }
  })
}
</script>

<template>
  <Head title="Manajemen QRIS Dinamis" />
  
  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">QRIS Dinamis</h2>
      <p class="text-muted-foreground mt-1">Generate QRIS sekali pakai dengan nominal spesifik dan kode unik.</p>
    </div>
    <div class="flex items-center space-x-2">
      <Button variant="outline" as-child>
        <Link href="/qris"><QrCode class="mr-2 h-4 w-4" /> Kelola QRIS Statis</Link>
      </Button>
    </div>
  </div>

  <Alert class="mb-6 border-primary/20 bg-primary/5">
    <Smartphone class="h-5 w-5 text-primary" />
    <AlertTitle class="font-semibold text-primary">Info Penting: Aplikasi Forwarder Android</AlertTitle>
    <AlertDescription class="text-muted-foreground mt-1 leading-relaxed">
      Untuk mengaktifkan fitur verifikasi status pembayaran QRIS Dinamis secara otomatis (real-time), Anda harus menginstal 
      <a href="https://github.com/karuhun-developer/android-notification-forwarder/releases" target="_blank" class="font-medium underline underline-offset-4 text-primary hover:text-primary/80 transition-colors">Android Notification Forwarder</a> 
      di HP yang menerima notifikasi mutasi. Atur Webhook URL di HP tersebut dan arahkan ke pengaturan Webhook di aplikasi ini.
    </AlertDescription>
  </Alert>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Generator Section (Left) -->
    <div class="md:col-span-5 space-y-6">
      <Card class="bg-card/60 backdrop-blur-xl border-muted/60 relative overflow-hidden">
        <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <RefreshCw class="h-5 w-5 text-primary" />
            Generator QRIS Dinamis
          </CardTitle>
          <CardDescription>
            Pilih QRIS statis dasar dan tentukan nominal untuk membuat QRIS dinamis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-5 relative z-10">
            <!-- QRIS Selection -->
            <div class="space-y-2">
              <Label>Sumber QRIS Statis</Label>
              <Select v-model="form.qrisId">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih QRIS dasar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="qris in staticQrisOptions" :key="qris.id" :value="qris.id">
                    {{ qris.name }} ({{ qris.merchantName }})
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="form.errors.qrisId" class="text-xs text-destructive mt-1">{{ form.errors.qrisId }}</p>
            </div>

            <!-- Display Info if Selected -->
            <div v-if="selectedQris" class="bg-muted/30 p-3 rounded-lg text-sm border space-y-2 mb-4">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1"><Building class="h-3 w-3"/> Merchant</span>
                <span class="font-medium truncate max-w-[150px]">{{ selectedQris.merchantName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1"><MapPin class="h-3 w-3"/> Lokasi</span>
                <span class="font-medium">{{ selectedQris.merchantCity }} ({{ selectedQris.postalCode }})</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1"><Settings class="h-3 w-3"/> MCC</span>
                <span class="font-medium">{{ selectedQris.merchantCategoryCode }}</span>
              </div>
            </div>

            <!-- Amount -->
            <div class="space-y-2">
              <Label>Nominal Pembayaran (Rp)</Label>
              <Input 
                type="number" 
                v-model="form.amount" 
                min="1" 
                placeholder="Contoh: 50000"
              />
              <p class="text-xs text-muted-foreground">Kode unik (3 digit) akan ditambahkan otomatis ke total.</p>
              <p v-if="form.errors.amount" class="text-xs text-destructive mt-1">{{ form.errors.amount }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Fee Type -->
              <div class="space-y-2">
                <Label>Service Fee</Label>
                <Select v-model="form.feeType">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Fee</SelectItem>
                    <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                    <SelectItem value="percent">Persentase (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Fee Value -->
              <div class="space-y-2">
                <Label>Nilai Fee</Label>
                <Input 
                  type="number" 
                  v-model="form.feeValue" 
                  min="0" 
                  :disabled="form.feeType === 'none'"
                />
              </div>
            </div>

            <!-- Expiration -->
            <div class="space-y-2">
              <Label>Masa Berlaku (Jam)</Label>
              <div class="flex items-center gap-2">
                <Input type="number" v-model="form.expiredHours" min="1" max="720" class="w-24" />
                <span class="text-sm text-muted-foreground flex items-center"><Clock class="h-4 w-4 mr-1"/> Jam dari sekarang</span>
              </div>
            </div>

            <!-- Summary -->
            <div class="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center justify-between mt-4">
              <span class="font-semibold text-primary">Estimasi Total:</span>
              <span class="font-bold text-xl">Rp {{ totalAmount.toLocaleString('id-ID') }} <span class="text-xs font-normal text-muted-foreground">+ Kode Unik</span></span>
            </div>

            <Button type="submit" class="w-full" :disabled="form.processing || !form.qrisId">
              <QrCode class="h-4 w-4 mr-2" />
              {{ form.processing ? 'Memproses...' : 'Generate QRIS Dinamis' }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- History Section (Right) -->
    <div class="md:col-span-7">
      <Card class="bg-card/60 backdrop-blur-xl border-muted/60 h-full flex flex-col">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Receipt class="h-5 w-5 text-emerald-500" />
            Riwayat QRIS Dinamis
          </CardTitle>
          <CardDescription>
            Daftar transaksi QRIS dinamis yang telah Anda buat beserta statusnya.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col">
          <div class="rounded-md border flex-1">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50">
                  <TableHead>Total Tagihan</TableHead>
                  <TableHead>Rincian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead class="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="tx in transactions.data" :key="tx.id" class="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div class="font-bold text-lg leading-none mb-1">Rp {{ Number(tx.total).toLocaleString('id-ID') }}</div>
                    <div class="text-xs text-muted-foreground">{{ tx.transactionCode }}</div>
                  </TableCell>
                  <TableCell>
                    <div class="text-sm">Dasar: Rp {{ Number(tx.amount).toLocaleString('id-ID') }}</div>
                    <div class="text-xs text-muted-foreground">Fee: Rp {{ Number(tx.feeAmount).toLocaleString('id-ID') }} | Kode: +{{ tx.uniqueCode }}</div>
                  </TableCell>
                  <TableCell>
                    <div class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                      :class="{
                        'bg-yellow-500/10 text-yellow-500': tx.status === 'pending',
                        'bg-emerald-500/10 text-emerald-500': tx.status === 'paid',
                        'bg-destructive/10 text-destructive': tx.status === 'expired'
                      }">
                      {{ tx.status.toUpperCase() }}
                    </div>
                  </TableCell>
                  <TableCell class="text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button v-if="tx.proof" variant="ghost" size="sm" as="a" :href="`/${tx.proof}`" target="_blank" class="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                        Lihat Bukti
                      </Button>
                      <Button variant="outline" size="sm" @click="openStatusModal(tx)">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm" @click="openQrModal(tx)">
                        Lihat QR
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-if="transactions.data.length === 0">
                  <TableCell colspan="4" class="text-center py-12 text-muted-foreground">
                    Belum ada riwayat transaksi QRIS Dinamis.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div class="mt-4 flex justify-end" v-if="transactions.meta.lastPage > 1">
            <Pagination :total="transactions.meta.total" :sibling-count="1" show-edges :default-page="transactions.meta.currentPage" :items-per-page="transactions.meta.perPage" @update:page="changePage">
              <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                <PaginationPrevious @click="changePage(transactions.meta.currentPage - 1)" :disabled="transactions.meta.currentPage === 1" />
                <template v-for="(item, index) in items">
                  <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                    <Button class="w-9 h-9 p-0" :variant="item.value === transactions.meta.currentPage ? 'default' : 'outline'" @click="changePage(item.value)">
                      {{ item.value }}
                    </Button>
                  </PaginationItem>
                </template>
                <PaginationNext @click="changePage(transactions.meta.currentPage + 1)" :disabled="transactions.meta.currentPage === transactions.meta.lastPage" />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <Dialog v-model:open="viewModalOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Scan QRIS untuk Membayar</DialogTitle>
        <DialogDescription>
          Kode: {{ selectedTx?.transactionCode }}
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center py-6 space-y-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border">
          <QrcodeVue v-if="selectedTx" :value="selectedTx.qrisString" :size="240" level="M" />
        </div>
        
        <div class="text-center space-y-1">
          <p class="text-sm text-muted-foreground">Total Tagihan</p>
          <p class="text-3xl font-bold text-primary">Rp {{ Number(selectedTx?.total).toLocaleString('id-ID') }}</p>
          <p class="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full inline-block mt-2">
            PENTING: Bayar sesuai nominal hingga 3 digit terakhir!
          </p>
        </div>

        <div class="w-full flex gap-2">
          <Button variant="outline" class="flex-1" @click="copyQrisString">
            <Check v-if="isCopied" class="h-4 w-4 mr-2 text-green-500" />
            <Copy v-else class="h-4 w-4 mr-2" />
            {{ isCopied ? 'Tersalin!' : 'Copy String' }}
          </Button>
          <Button class="flex-1" @click="viewModalOpen = false">Tutup</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>

  <!-- Update Status Modal -->
  <Dialog v-model:open="statusModalOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update Status Transaksi</DialogTitle>
        <DialogDescription>
          Perbarui status pembayaran untuk transaksi {{ selectedTxForStatus?.transactionCode }}.
        </DialogDescription>
      </DialogHeader>
      
      <form @submit.prevent="updateStatus" class="space-y-4 py-4">
        <div class="space-y-2">
          <Label>Status Pembayaran</Label>
          <Select v-model="statusForm.status">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid (Sudah Dibayar)</SelectItem>
              <SelectItem value="expired">Expired (Kadaluarsa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="statusForm.status === 'paid'" class="space-y-2 border p-4 rounded-lg bg-muted/20">
          <Label>Bukti Pembayaran (Opsional)</Label>
          <Input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg" 
            @change="(e: any) => statusForm.proof = e.target.files[0]"
          />
          <p class="text-xs text-muted-foreground mt-1">Format: JPG, PNG. Maks 5MB.</p>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" @click="statusModalOpen = false">Batal</Button>
          <Button type="submit" :disabled="statusForm.processing">
            {{ statusForm.processing ? 'Menyimpan...' : 'Simpan Status' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
