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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  open: boolean
  user?: { id: number, fullName: string, email: string, roleId: number } | null
  roles: { id: number, name: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  roleId: '' as string,
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.fullName = newUser.fullName || ''
    form.email = newUser.email || ''
    form.password = ''
    form.roleId = newUser.roleId.toString()
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
  if (props.user) {
    form.put(`/users/${props.user.id}`, {
      onSuccess: () => emit('update:open', false)
    })
  } else {
    form.post('/users', {
      onSuccess: () => emit('update:open', false)
    })
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px] p-0 overflow-hidden border-muted/60 bg-background/95 backdrop-blur-xl">
      <DialogHeader class="p-6 pb-2">
        <DialogTitle class="text-xl font-semibold">{{ user ? 'Edit User' : 'Tambah User' }}</DialogTitle>
        <DialogDescription class="text-muted-foreground mt-2">
          {{ user ? 'Ubah data user di bawah ini. Kosongkan password jika tidak ingin mengubahnya.' : 'Masukkan data user baru yang ingin ditambahkan.' }}
        </DialogDescription>
      </DialogHeader>
      
      <form @submit.prevent="submit" class="space-y-5 px-6 py-2">
        <div class="space-y-2">
          <Label for="fullName" class="text-sm font-medium">Nama Lengkap</Label>
          <Input 
            id="fullName" 
            v-model="form.fullName" 
            placeholder="Misal: John Doe" 
            :disabled="form.processing"
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.fullName" class="text-xs text-destructive mt-1">{{ form.errors.fullName }}</p>
        </div>
        
        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium">Email</Label>
          <Input 
            id="email" 
            type="email"
            v-model="form.email" 
            placeholder="Misal: john@example.com" 
            :disabled="form.processing"
            required 
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.email" class="text-xs text-destructive mt-1">{{ form.errors.email }}</p>
        </div>

        <div class="space-y-2">
          <Label for="password" class="text-sm font-medium">Password <span class="text-muted-foreground font-normal">{{ user ? '(Opsional)' : '' }}</span></Label>
          <Input 
            id="password" 
            type="password"
            v-model="form.password" 
            placeholder="Minimal 8 karakter" 
            :disabled="form.processing"
            :required="!user"
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.password" class="text-xs text-destructive mt-1">{{ form.errors.password }}</p>
        </div>

        <div class="space-y-2">
          <Label for="role" class="text-sm font-medium">Role</Label>
          <Select 
            v-model="form.roleId" 
            :disabled="form.processing" 
            required
          >
            <SelectTrigger id="role" class="transition-all focus-visible:ring-primary/50 bg-background/50">
              <SelectValue placeholder="Pilih Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="role in roles" :key="role.id" :value="role.id.toString()">
                <span class="capitalize">{{ role.name }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="form.errors.roleId" class="text-xs text-destructive mt-1">{{ form.errors.roleId }}</p>
        </div>
        
        <DialogFooter class="px-6 py-4 bg-muted/20 border-t border-muted/40 mt-6 -mx-6 sm:justify-end gap-2">
          <Button type="button" variant="outline" @click="$emit('update:open', false)" :disabled="form.processing" class="bg-background">
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
