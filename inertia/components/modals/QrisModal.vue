<script setup lang="ts">
import { watch, ref } from 'vue'
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
  qrisItem?: { id: number; name: string; description: string | null; qrisString: string } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  name: '',
  description: '',
  qrisString: '',
  qris: null as File | null,
})

const fileInputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.qrisItem,
  (newItem) => {
    if (newItem) {
      form.name = newItem.name
      form.description = newItem.description || ''
      form.qrisString = newItem.qrisString
      form.qris = null
      if (fileInputRef.value) fileInputRef.value.value = ''
    } else {
      form.reset()
      if (fileInputRef.value) fileInputRef.value.value = ''
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
      if (fileInputRef.value) fileInputRef.value.value = ''
    }
  }
)

import jsQR from 'jsqr'

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    form.qris = file

    // Parse the QR string from the image on the frontend
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)

        const imageData = context.getImageData(0, 0, img.width, img.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          form.qrisString = code.data
        } else {
          form.qrisString = ''
          alert('Gagal mendeteksi kode QR dari gambar. Pastikan gambar jelas dan berupa kode QRIS.')
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    form.qris = null
    form.qrisString = ''
  }
}

function submit() {
  // Inertia handles file uploads automatically if form data contains a File object.
  // When using method PUT, some servers might have issues with multipart/form-data.
  // Inertia automatically uses method POST with _method=PUT under the hood.
  if (props.qrisItem) {
    // We must force Inertia to use POST with _method spoofing for file uploads
    form
      .transform((data) => ({ ...data, _method: 'PUT' }))
      .post(`/qris/${props.qrisItem.id}`, {
        onSuccess: () => emit('update:open', false),
      })
  } else {
    form.post('/qris', {
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
          qrisItem ? 'Edit QRIS Statis' : 'Tambah QRIS Statis'
        }}</DialogTitle>
        <DialogDescription class="text-muted-foreground mt-2">
          {{
            qrisItem
              ? 'Ubah data QRIS di bawah ini.'
              : 'Masukkan data QRIS baru yang ingin ditambahkan.'
          }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-5 px-6 py-2" @submit.prevent="submit">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">Nama QRIS</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Misal: Toko Utama"
            :disabled="form.processing"
            required
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.name" class="text-xs text-destructive mt-1">
            {{ form.errors.name }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-sm font-medium"
            >Deskripsi <span class="text-muted-foreground font-normal">(Opsional)</span></Label
          >
          <Input
            id="description"
            v-model="form.description"
            placeholder="Misal: QRIS untuk kasir depan"
            :disabled="form.processing"
            class="transition-all focus-visible:ring-primary/50 bg-background/50"
          />
          <p v-if="form.errors.description" class="text-xs text-destructive mt-1">
            {{ form.errors.description }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="qrisFile" class="text-sm font-medium"
            >Upload File QRIS
            <span class="text-muted-foreground font-normal">{{
              qrisItem ? '(Opsional jika tidak diubah)' : ''
            }}</span></Label
          >
          <Input
            id="qrisFile"
            ref="fileInputRef"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            :disabled="form.processing"
            :required="!qrisItem"
            class="transition-all focus-visible:ring-primary/50 bg-background/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            @change="handleFileChange"
          />
          <p v-if="form.errors.qris" class="text-xs text-destructive mt-1">
            {{ form.errors.qris }}
          </p>
        </div>

        <div v-if="form.qrisString" class="space-y-2">
          <Label class="text-sm font-medium text-emerald-500"
            >✅ Payload QRIS Berhasil Diekstrak</Label
          >
          <Input
            readonly
            :model-value="form.qrisString"
            class="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs truncate"
          />
        </div>
        <div
          v-else-if="form.qris"
          class="space-y-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20"
        >
          <p class="text-xs font-medium text-destructive">
            Gagal mengekstrak QRIS dari gambar. Pilih gambar lain.
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
          <Button
            type="submit"
            :disabled="form.processing || !form.qrisString"
            class="shadow-md shadow-primary/20"
          >
            {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
