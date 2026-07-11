<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key, Shield, Copy, Check, RefreshCw, Plus, Eye, EyeOff } from '@lucide/vue'

const props = defineProps<{
  apiKey: string | null
  hasHmac: boolean
}>()

const hmacForm = useForm({
  hmacString: ''
})

const apiForm = useForm({})

const isCopied = ref(false)
const showApiKey = ref(false)
const showHmac = ref(false)

function copyApiKey() {
  if (props.apiKey) {
    navigator.clipboard.writeText(props.apiKey)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

function saveHmac() {
  hmacForm.post('/profile/hmac', {
    preserveScroll: true,
    onSuccess: () => {
      hmacForm.reset()
    }
  })
}

function generateApiKey() {
  apiForm.post('/profile/api-key', {
    preserveScroll: true
  })
}
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <!-- HMAC Settings Card -->
    <Card class="bg-card/60 backdrop-blur-xl border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Shield class="h-5 w-5 text-primary" />
          HMAC Configuration
        </CardTitle>
        <CardDescription>
          Simpan string/secret HMAC Anda di sini. String ini akan digunakan sistem untuk memvalidasi *signature* pada *webhook* dari provider pembayaran.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1">
        <form @submit.prevent="saveHmac" class="space-y-4">
          <div class="space-y-2">
            <Label for="hmac">HMAC String / Secret</Label>
            <div class="relative">
              <Input 
                id="hmac" 
                v-model="hmacForm.hmacString" 
                :type="showHmac ? 'text' : 'password'"
                placeholder="Masukkan HMAC string..." 
                :disabled="hmacForm.processing"
                class="bg-background/50 font-mono pr-10"
              />
              <button 
                type="button"
                @click="showHmac = !showHmac"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <EyeOff v-if="showHmac" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
            <p v-if="hmacForm.errors.hmacString" class="text-xs text-destructive mt-1">{{ hmacForm.errors.hmacString }}</p>
            <p v-if="hasHmac && !hmacForm.hmacString" class="text-xs text-green-500 mt-2 flex items-center gap-1">
              <Check class="h-3 w-3" /> HMAC key sudah terkonfigurasi. Mengisi form ini akan menimpanya.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter class="bg-muted/20 border-t border-muted/40 pt-4 mt-auto">
        <Button @click="saveHmac" :disabled="hmacForm.processing || !hmacForm.hmacString">
          {{ hmacForm.processing ? 'Menyimpan...' : 'Simpan HMAC' }}
        </Button>
      </CardFooter>
    </Card>

    <!-- API Key Settings Card -->
    <Card class="bg-card/60 backdrop-blur-xl border-muted/60 flex flex-col">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Key class="h-5 w-5 text-amber-500" />
          API Access Key
        </CardTitle>
        <CardDescription>
          Gunakan API Key ini untuk mengakses endpoint sistem. Kunci disimpan secara terenkripsi (two-way encryption) di database.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col justify-center">
        <div v-if="apiKey" class="space-y-3">
          <Label>API Key Aktif Anda</Label>
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <Input 
                readonly 
                :type="showApiKey ? 'text' : 'password'"
                :value="apiKey" 
                class="bg-muted/50 font-mono text-sm text-amber-500 border-amber-500/20 pr-10"
              />
              <button 
                type="button"
                @click="showApiKey = !showApiKey"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <EyeOff v-if="showApiKey" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
            <Button variant="outline" size="icon" @click="copyApiKey" class="shrink-0">
              <Check v-if="isCopied" class="h-4 w-4 text-green-500" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">Jaga kerahasiaan API Key Anda. Jangan pernah membagikannya ke publik.</p>
        </div>
        <div v-else class="text-center py-6 text-muted-foreground">
          <Key class="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>Anda belum memiliki API Key yang aktif.</p>
        </div>
      </CardContent>
      <CardFooter class="bg-muted/20 border-t border-muted/40 pt-4 mt-auto">
        <Button 
          variant="secondary" 
          @click="generateApiKey" 
          :disabled="apiForm.processing"
          class="w-full flex items-center justify-center gap-2"
        >
          <RefreshCw v-if="apiKey" class="h-4 w-4" :class="{ 'animate-spin': apiForm.processing }" />
          <Plus v-else class="h-4 w-4" />
          {{ apiKey ? 'Regenerate API Key' : 'Generate API Key' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
