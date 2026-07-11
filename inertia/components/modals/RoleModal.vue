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
  role?: { id: number, name: string } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  name: '',
})

watch(() => props.role, (newRole) => {
  if (newRole) {
    form.name = newRole.name
  } else {
    form.reset()
  }
}, { immediate: true })

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.reset()
    form.clearErrors()
  }
})

function submit() {
  if (props.role) {
    form.put(`/roles/${props.role.id}`, {
      onSuccess: () => emit('update:open', false)
    })
  } else {
    form.post('/roles', {
      onSuccess: () => emit('update:open', false)
    })
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ role ? 'Edit Role' : 'Tambah Role' }}</DialogTitle>
        <DialogDescription>
          {{ role ? 'Ubah nama role di bawah ini.' : 'Masukkan nama role baru yang ingin ditambahkan.' }}
        </DialogDescription>
      </DialogHeader>
      
      <form @submit.prevent="submit" class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="name">Nama Role</Label>
          <Input 
            id="name" 
            v-model="form.name" 
            placeholder="Misal: admin" 
            :disabled="form.processing"
            required 
          />
          <p v-if="form.errors.name" class="text-sm text-destructive">{{ form.errors.name }}</p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('update:open', false)" :disabled="form.processing">
            Batal
          </Button>
          <Button type="submit" :disabled="form.processing">
            {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
