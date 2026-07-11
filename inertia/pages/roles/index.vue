<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Shield } from '@lucide/vue'
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

import RoleModal from '@/components/modals/RoleModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  roles: {
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
    data: { id: number; name: string; createdAt: string; updatedAt: string }[]
  }
}>()

// Modal states
const roleModalOpen = ref(false)
const selectedRole = ref<{ id: number; name: string } | null>(null)

const confirmModalOpen = ref(false)
const roleToDelete = ref<number | null>(null)
const isDeleting = ref(false)

function openCreateModal() {
  selectedRole.value = null
  roleModalOpen.value = true
}

function openEditModal(role: { id: number; name: string }) {
  selectedRole.value = role
  roleModalOpen.value = true
}

function confirmDelete(id: number) {
  roleToDelete.value = id
  confirmModalOpen.value = true
}

function deleteRole() {
  if (!roleToDelete.value) return

  isDeleting.value = true
  router.delete(`/roles/${roleToDelete.value}`, {
    onFinish: () => {
      isDeleting.value = false
      confirmModalOpen.value = false
      roleToDelete.value = null
    },
  })
}

function changePage(page: number) {
  router.get('/roles', { page }, { preserveState: true })
}
</script>

<template>
  <Head title="Role Management" />

  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Role Management</h2>
      <p class="text-muted-foreground mt-1">Kelola jenis role dan hak akses dalam sistem.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
    
    <!-- Left Column: Summary & Actions -->
    <div class="flex flex-col gap-4">
      <!-- Total Roles Card -->
      <Card class="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full blur-2xl"></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
          <Shield class="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent class="relative z-10">
          <div class="text-3xl font-bold">{{ roles.meta.total }}</div>
          <p class="text-xs text-purple-500 font-medium mt-1">Grup hak akses aktif</p>
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
          <h3 class="font-bold tracking-tight">Tambah Role</h3>
          <p class="text-sm text-muted-foreground mt-1">Buat grup izin dan role akses baru</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
    <Card class="md:col-span-3 bg-card/60 backdrop-blur-xl border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle>Daftar Role</CardTitle>
        <CardDescription>
          Role sistem utama (Superadmin dan User biasa) tidak dapat dihapus atau diedit.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col">
        <div class="rounded-md border flex-1">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50">
                <TableHead>Nama Role</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="role in roles.data" :key="role.id" class="hover:bg-muted/20 transition-colors">
                <TableCell class="font-medium">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold"
                         :class="role.id === 1 ? 'bg-purple-500/10 text-purple-500' : 'bg-primary/10 text-primary'">
                      <Shield class="h-4 w-4" />
                    </div>
                    <span class="capitalize">{{ role.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ new Date(role.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      v-if="role.id !== 1 && role.id !== 2"
                      variant="ghost"
                      size="icon"
                      class="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8"
                      @click="openEditModal(role)"
                    >
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button
                      v-if="role.id !== 1 && role.id !== 2"
                      variant="ghost"
                      size="icon"
                      class="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8"
                      @click="confirmDelete(role.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                    <span v-if="role.id === 1 || role.id === 2" class="text-xs text-muted-foreground italic px-2 py-1">Sistem</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="roles.data.length === 0">
                <TableCell colspan="3" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center justify-center">
                    <Shield class="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p>Belum ada role tambahan.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="mt-4 flex justify-end" v-if="roles.meta.lastPage > 1">
          <Pagination
            :total="roles.meta.total"
            :sibling-count="1"
            show-edges
            :default-page="roles.meta.currentPage"
            :items-per-page="roles.meta.perPage"
            @update:page="changePage"
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious
                @click="changePage(roles.meta.currentPage - 1)"
                :disabled="roles.meta.currentPage === 1"
              />

              <template v-for="(item, index) in items">
                <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button
                    class="w-9 h-9 p-0"
                    :variant="item.value === roles.meta.currentPage ? 'default' : 'outline'"
                    @click="changePage(item.value)"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationItem>
              </template>

              <PaginationNext
                @click="changePage(roles.meta.currentPage + 1)"
                :disabled="roles.meta.currentPage === roles.meta.lastPage"
              />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>

  <RoleModal v-model:open="roleModalOpen" :role="selectedRole" />

  <ConfirmModal
    v-model:open="confirmModalOpen"
    title="Hapus Role"
    description="Apakah Anda yakin ingin menghapus role ini? Data yang sudah dihapus tidak dapat dikembalikan."
    :loading="isDeleting"
    @confirm="deleteRole"
  />
</template>
