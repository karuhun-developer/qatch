<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, QrCode } from '@lucide/vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import QrisModal from '@/components/modals/QrisModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import UserLimits from '@/components/UserLimits.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  qrisList: {
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl: string
      lastPageUrl: string
      nextPageUrl: string | null
      previousPageUrl: string | null
    }
    data: { id: number, name: string, description: string | null, qris: string, qrisString: string, createdAt: string, updatedAt: string }[]
  }
}>()

// Modal states
const qrisModalOpen = ref(false)
const selectedQris = ref<{ id: number, name: string, description: string | null, qrisString: string } | null>(null)

const confirmModalOpen = ref(false)
const qrisToDelete = ref<number | null>(null)
const isDeleting = ref(false)

function openCreateModal() {
  selectedQris.value = null
  qrisModalOpen.value = true
}

function openEditModal(item: any) {
  selectedQris.value = {
    id: item.id,
    name: item.name,
    description: item.description,
    qrisString: item.qrisString
  }
  qrisModalOpen.value = true
}

function confirmDelete(id: number) {
  qrisToDelete.value = id
  confirmModalOpen.value = true
}

function deleteQris() {
  if (!qrisToDelete.value) return
  
  isDeleting.value = true
  router.delete(`/qris/${qrisToDelete.value}`, {
    onFinish: () => {
      isDeleting.value = false
      confirmModalOpen.value = false
      qrisToDelete.value = null
    }
  })
}

function changePage(page: number) {
  router.get('/qris', { page }, { preserveState: true })
}
</script>

<template>
  <Head title="Manajemen QRIS Statis" />
  
  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">QRIS Statis</h2>
      <p class="text-muted-foreground mt-1">Kelola data QRIS statis Anda untuk berbagai keperluan pembayaran.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
    
    <!-- Left Column: Summary & Actions -->
    <div class="flex flex-col gap-4">
      <!-- Total Qris Card -->
      <Card class="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 bg-green-500/10 w-24 h-24 rounded-full blur-2xl"></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total QRIS</CardTitle>
          <QrCode class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent class="relative z-10">
          <div class="text-3xl font-bold">{{ qrisList.meta.total }}</div>
          <p class="text-xs text-green-500 font-medium mt-1">Data QRIS tersimpan</p>
        </CardContent>
      </Card>
      
      <!-- Quick Add Card -->
      <Card 
        class="bg-card/60 backdrop-blur-xl border-muted/60 hover:border-primary/50 transition-all cursor-pointer group min-h-[180px]"
        @click="openCreateModal"
      >
        <CardContent class="p-6 flex flex-col items-center justify-center text-center h-full">
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary/20">
            <Plus class="h-6 w-6 text-primary" />
          </div>
          <h3 class="font-bold tracking-tight">Tambah QRIS</h3>
          <p class="text-sm text-muted-foreground mt-1">Buat data QRIS statis baru untuk sistem Anda</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
    <Card class="md:col-span-3 bg-card/60 backdrop-blur-xl border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle>Daftar QRIS</CardTitle>
        <CardDescription>
          Berikut adalah daftar QRIS statis yang telah Anda unggah dan simpan.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col">
        <div class="rounded-md border flex-1">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50">
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>QR Image</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in qrisList.data" :key="item.id" class="hover:bg-muted/20 transition-colors">
                <TableCell class="font-medium">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-semibold text-green-500">
                      <QrCode class="h-4 w-4" />
                    </div>
                    {{ item.name }}
                  </div>
                </TableCell>
                <TableCell class="max-w-[200px] truncate">{{ item.description || '-' }}</TableCell>
                <TableCell>
                  <a :href="`/${item.qris}`" target="_blank" class="text-primary hover:underline text-xs">
                    Lihat Gambar
                  </a>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      class="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8"
                      @click="openEditModal(item)"
                    >
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      class="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8"
                      @click="confirmDelete(item.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="qrisList.data.length === 0">
                <TableCell colspan="5" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center justify-center">
                    <QrCode class="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p>Belum ada data QRIS statis.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="mt-4 flex justify-end" v-if="qrisList.meta.lastPage > 1">
          <Pagination :total="qrisList.meta.total" :sibling-count="1" show-edges :default-page="qrisList.meta.currentPage" :items-per-page="qrisList.meta.perPage" @update:page="changePage">
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious @click="changePage(qrisList.meta.currentPage - 1)" :disabled="qrisList.meta.currentPage === 1" />

              <template v-for="(item, index) in items">
                <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button class="w-9 h-9 p-0" :variant="item.value === qrisList.meta.currentPage ? 'default' : 'outline'" @click="changePage(item.value)">
                    {{ item.value }}
                  </Button>
                </PaginationItem>
              </template>

              <PaginationNext @click="changePage(qrisList.meta.currentPage + 1)" :disabled="qrisList.meta.currentPage === qrisList.meta.lastPage" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>

  <QrisModal 
    v-model:open="qrisModalOpen" 
    :qris-item="selectedQris" 
  />

  <ConfirmModal
    v-model:open="confirmModalOpen"
    title="Hapus Data QRIS"
    description="Apakah Anda yakin ingin menghapus data QRIS statis ini? File gambar dan data yang terkait akan dihapus secara permanen."
    :loading="isDeleting"
    @confirm="deleteQris"
  />

  <div class="mt-8">
    <UserLimits />
  </div>
</template>
