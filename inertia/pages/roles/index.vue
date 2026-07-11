<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from '@lucide/vue'
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

  <div class="flex items-center justify-between space-y-2 mb-6">
    <h2 class="text-3xl font-bold tracking-tight">Role Management</h2>
    <Button @click="openCreateModal">
      <Plus class="mr-2 h-4 w-4" />
      Tambah Role
    </Button>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Daftar Role</CardTitle>
      <CardDescription>
        Kelola role pengguna sistem. Role superadmin dan user tidak dapat dihapus.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Role</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="role in roles.data" :key="role.id">
            <TableCell class="font-medium capitalize">{{ role.name }}</TableCell>
            <TableCell>{{ new Date(role.createdAt).toLocaleDateString('id-ID') }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button
                  v-if="role.id !== 1 && role.id !== 2"
                  variant="outline"
                  size="icon"
                  @click="openEditModal(role)"
                >
                  <Edit class="h-4 w-4" />
                </Button>
                <Button
                  v-if="role.id !== 1 && role.id !== 2"
                  variant="destructive"
                  size="icon"
                  @click="confirmDelete(role.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="roles.data.length === 0">
            <TableCell colspan="3" class="text-center py-6 text-muted-foreground">
              Belum ada role.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="mt-4 flex justify-center" v-if="roles.meta.lastPage > 1">
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

  <RoleModal v-model:open="roleModalOpen" :role="selectedRole" />

  <ConfirmModal
    v-model:open="confirmModalOpen"
    title="Hapus Role"
    description="Apakah Anda yakin ingin menghapus role ini? Data yang sudah dihapus tidak dapat dikembalikan."
    :loading="isDeleting"
    @confirm="deleteRole"
  />
</template>
