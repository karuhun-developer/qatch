<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Package } from '@lucide/vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import PlanModal from '@/components/modals/PlanModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  plans: { id: number; name: string; price: number; description: string | null; maxQris: number | null; maxTransactionPerMonth: number | null; isFeatured: boolean; features: string[] | null; createdAt: string; updatedAt: string }[]
}>()

// Modal states
const planModalOpen = ref(false)
const selectedPlan = ref<any>(null)

const confirmModalOpen = ref(false)
const planToDelete = ref<number | null>(null)
const isDeleting = ref(false)

function openCreateModal() {
  selectedPlan.value = null
  planModalOpen.value = true
}

function openEditModal(plan: any) {
  selectedPlan.value = plan
  planModalOpen.value = true
}

function confirmDelete(id: number) {
  planToDelete.value = id
  confirmModalOpen.value = true
}

function deletePlan() {
  if (!planToDelete.value) return

  isDeleting.value = true
  router.delete(`/plans/${planToDelete.value}`, {
    onFinish: () => {
      isDeleting.value = false
      confirmModalOpen.value = false
      planToDelete.value = null
    },
  })
}
</script>

<template>
  <Head title="Plans Management" />

  <div class="flex items-center justify-between space-y-2 mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Plans Management</h2>
      <p class="text-muted-foreground mt-1">Manage subscription plans and features.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 items-start">
    <div class="flex flex-col gap-4">
      <Card class="bg-card/60 backdrop-blur-xl border-muted/60">
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <Package class="h-5 w-5 text-primary" />
              Plans List
            </CardTitle>
            <CardDescription>All available plans in the system.</CardDescription>
          </div>
          <Button @click="openCreateModal">
            <Plus class="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div class="rounded-md border overflow-hidden">
            <Table>
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Limits</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="plan in plans" :key="plan.id">
                  <TableCell class="font-medium">
                    {{ plan.name }}
                    <span v-if="plan.isFeatured" class="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Featured
                    </span>
                  </TableCell>
                  <TableCell>
                    Rp {{ plan.price.toLocaleString('id-ID') }}
                  </TableCell>
                  <TableCell class="text-muted-foreground">
                    {{ plan.description || '-' }}
                  </TableCell>
                  <TableCell class="text-xs text-muted-foreground whitespace-nowrap">
                    <div>QRIS: {{ plan.maxQris === null ? 'Unlimited' : plan.maxQris }}</div>
                    <div>Trx/mo: {{ plan.maxTransactionPerMonth === null ? 'Unlimited' : plan.maxTransactionPerMonth }}</div>
                  </TableCell>
                  <TableCell>
                    <ul class="list-disc list-inside text-xs text-muted-foreground">
                      <li v-for="(feature, i) in (plan.features || [])" :key="i">{{ feature }}</li>
                    </ul>
                  </TableCell>
                  <TableCell class="text-right space-x-2">
                    <Button variant="ghost" size="icon" @click="openEditModal(plan)">
                      <Edit class="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" @click="confirmDelete(plan.id)">
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow v-if="plans.length === 0">
                  <TableCell colspan="5" class="text-center h-24 text-muted-foreground">
                    No plans found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <PlanModal
    v-model:open="planModalOpen"
    :plan="selectedPlan"
  />

  <ConfirmModal
    v-model:open="confirmModalOpen"
    title="Delete Plan"
    description="Are you sure you want to delete this plan? This action cannot be undone."
    confirm-text="Delete"
    variant="destructive"
    :loading="isDeleting"
    @confirm="deletePlan"
  />
</template>
