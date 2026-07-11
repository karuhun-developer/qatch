<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Users } from '@lucide/vue'
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

import UserModal from '@/components/modals/UserModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  users: {
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
    data: { id: number, fullName: string | null, email: string, roleId: number, role: { id: number, name: string }, createdAt: string, updatedAt: string }[]
  }
  roles: { id: number, name: string }[]
}>()

// Modal states
const userModalOpen = ref(false)
const selectedUser = ref<{ id: number, fullName: string, email: string, roleId: number } | null>(null)

const confirmModalOpen = ref(false)
const userToDelete = ref<number | null>(null)
const isDeleting = ref(false)

function openCreateModal() {
  selectedUser.value = null
  userModalOpen.value = true
}

function openEditModal(user: any) {
  selectedUser.value = {
    id: user.id,
    fullName: user.fullName || '',
    email: user.email,
    roleId: user.roleId
  }
  userModalOpen.value = true
}

function confirmDelete(id: number) {
  userToDelete.value = id
  confirmModalOpen.value = true
}

function deleteUser() {
  if (!userToDelete.value) return
  
  isDeleting.value = true
  router.delete(`/users/${userToDelete.value}`, {
    onFinish: () => {
      isDeleting.value = false
      confirmModalOpen.value = false
      userToDelete.value = null
    }
  })
}

function changePage(page: number) {
  router.get('/users', { page }, { preserveState: true })
}
</script>

<template>
  <Head title="User Management" />
  
  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">User Management</h2>
      <p class="text-muted-foreground mt-1">Kelola pengguna, hak akses, dan detail akun.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
    
    <!-- Left Column: Summary & Actions -->
    <div class="flex flex-col gap-4">
      <!-- Total User Card -->
      <Card class="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full blur-2xl"></div>
        <CardHeader class="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          <Users class="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent class="relative z-10">
          <div class="text-3xl font-bold">{{ users.meta.total }}</div>
          <p class="text-xs text-blue-500 font-medium mt-1">Pengguna aktif terdaftar</p>
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
          <h3 class="font-bold tracking-tight">Tambah User</h3>
          <p class="text-sm text-muted-foreground mt-1">Buat akun baru untuk anggota tim Anda</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Table Card -->
    <Card class="md:col-span-3 bg-card/60 backdrop-blur-xl border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle>Daftar User</CardTitle>
        <CardDescription>
          Akun dengan role superadmin utama (ID: 1) tidak dapat dihapus.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col">
        <div class="rounded-md border flex-1">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50">
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in users.data" :key="user.id" class="hover:bg-muted/20 transition-colors">
                <TableCell class="font-medium">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {{ user.fullName ? user.fullName.substring(0,2).toUpperCase() : user.email.substring(0,2).toUpperCase() }}
                    </div>
                    {{ user.fullName || '-' }}
                  </div>
                </TableCell>
                <TableCell>{{ user.email }}</TableCell>
                <TableCell>
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize" 
                        :class="user.roleId === 1 ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'">
                    {{ user.role?.name || '-' }}
                  </span>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      class="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8"
                      @click="openEditModal(user)"
                    >
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button 
                      v-if="user.id !== 1" 
                      variant="ghost" 
                      size="icon"
                      class="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8"
                      @click="confirmDelete(user.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="users.data.length === 0">
                <TableCell colspan="5" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center justify-center">
                    <Users class="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p>Belum ada user.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="mt-4 flex justify-end" v-if="users.meta.lastPage > 1">
          <Pagination :total="users.meta.total" :sibling-count="1" show-edges :default-page="users.meta.currentPage" :items-per-page="users.meta.perPage" @update:page="changePage">
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious @click="changePage(users.meta.currentPage - 1)" :disabled="users.meta.currentPage === 1" />

              <template v-for="(item, index) in items">
                <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button class="w-9 h-9 p-0" :variant="item.value === users.meta.currentPage ? 'default' : 'outline'" @click="changePage(item.value)">
                    {{ item.value }}
                  </Button>
                </PaginationItem>
              </template>

              <PaginationNext @click="changePage(users.meta.currentPage + 1)" :disabled="users.meta.currentPage === users.meta.lastPage" />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>

  <UserModal 
    v-model:open="userModalOpen" 
    :user="selectedUser" 
    :roles="roles"
  />

  <ConfirmModal
    v-model:open="confirmModalOpen"
    title="Hapus User"
    description="Apakah Anda yakin ingin menghapus user ini? Data yang sudah dihapus tidak dapat dikembalikan."
    :loading="isDeleting"
    @confirm="deleteUser"
  />
</template>
