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
    <DialogContent
      class="sm:max-w-[425px] p-0 overflow-hidden border-muted/60 bg-background/95 backdrop-blur-xl"
    >
      <DialogHeader class="p-6 pb-2">
        <DialogTitle class="text-xl font-semibold">{{ title }}</DialogTitle>
        <DialogDescription class="text-muted-foreground mt-2">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter
        class="px-6 py-4 bg-muted/20 border-t border-muted/40 mt-4 sm:justify-end gap-2"
      >
        <Button
          type="button"
          variant="outline"
          :disabled="loading"
          class="bg-background"
          @click="$emit('update:open', false)"
        >
          {{ cancelText || 'Batal' }}
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="loading"
          class="shadow-md shadow-destructive/20"
          @click="$emit('confirm')"
        >
          {{ loading ? 'Memproses...' : confirmText || 'Hapus' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
