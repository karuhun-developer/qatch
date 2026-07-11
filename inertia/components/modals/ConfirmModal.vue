<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="mt-4">
        <Button 
          type="button" 
          variant="outline" 
          @click="$emit('update:open', false)"
          :disabled="loading"
        >
          {{ cancelText || 'Batal' }}
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          @click="$emit('confirm')"
          :disabled="loading"
        >
          {{ loading ? 'Memproses...' : (confirmText || 'Hapus') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
