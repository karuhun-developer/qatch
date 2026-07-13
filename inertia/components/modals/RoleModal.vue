<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  open: boolean
  role?: { id: number; name: string } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  name: '',
})

watch(
  () => props.role,
  (newRole) => {
    if (newRole) {
      form.name = newRole.name
    } else {
      form.reset()
    }
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      form.reset()
      form.clearErrors()
    }
  }
)

function submit() {
  if (props.role) {
    form.put(`/roles/${props.role.id}`, {
      onSuccess: () => emit('update:open', false),
    })
  } else {
    form.post('/roles', {
      onSuccess: () => emit('update:open', false),
    })
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="sm:max-w-[425px] p-0 overflow-hidden border-muted/60 bg-background/95 backdrop-blur-xl"
    >
      <DialogHeader class="p-6 pb-2">
        <DialogTitle class="text-xl font-semibold">{{
          role ? 'Edit Role' : 'Tambah Role'
        }}</DialogTitle>
        <DialogDescription class="text-muted-foreground mt-2">
          {{
            role
              ? 'Ubah nama role di bawah ini.'
              : 'Masukkan nama role baru yang ingin ditambahkan.'
          }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-5 px-6 py-2" @submit.prevent="submit">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Nama Role</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Misal: admin"
            :disabled="form.processing"
            required
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.name" class="text-xs text-destructive mt-1">
            {{ form.errors.name }}
          </p>
        </div>

        <DialogFooter
          class="px-6 py-4 bg-muted/20 border-t border-muted/40 mt-6 -mx-6 sm:justify-end gap-2"
        >
          <Button
            type="button"
            variant="outline"
            :disabled="form.processing"
            class="bg-background"
            @click="$emit('update:open', false)"
          >
            Batal
          </Button>
          <Button type="submit" :disabled="form.processing" class="shadow-md shadow-primary/20">
            {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
