<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from '@lucide/vue'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineOptions({ layout: DefaultLayout })

const props = defineProps<{
  plans: { id: number; name: string; price: number }[]
  plan: number | null | undefined
}>()

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  planId: props.plan ? props.plan.toString() : '',
})

function submit() {
  form.post('/register')
}
</script>

<template>
  <Head title="Sign Up" />

  <div class="flex flex-1 items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold">Buat Akun</CardTitle>
        <CardDescription> Masukkan data diri Anda untuk membuat akun baru. </CardDescription>
      </CardHeader>
      <form @submit.prevent="submit">
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <Button as-child variant="outline">
              <a href="/auth/github/redirect">
                <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
            </Button>
            <Button as-child variant="outline">
              <a href="/auth/google/redirect">
                <svg class="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Google
              </a>
            </Button>
          </div>
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">Atau daftar dengan email</span>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              v-model="form.fullName"
              type="text"
              placeholder="John Doe"
              required
              :class="{ 'border-destructive': form.errors.fullName }"
            />
            <p v-if="form.errors.fullName" class="text-sm text-destructive">
              {{ form.errors.fullName }}
            </p>
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="m@example.com"
              required
              :class="{ 'border-destructive': form.errors.email }"
            />
            <p v-if="form.errors.email" class="text-sm text-destructive">{{ form.errors.email }}</p>
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              :class="{ 'border-destructive': form.errors.password }"
            />
            <p v-if="form.errors.password" class="text-sm text-destructive">
              {{ form.errors.password }}
            </p>
          </div>
          <div class="space-y-2">
            <Label for="passwordConfirmation">Konfirmasi Password</Label>
            <Input
              id="passwordConfirmation"
              v-model="form.passwordConfirmation"
              type="password"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="planId">Pilih Paket</Label>
            <Select v-model="form.planId" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih paket langganan Anda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="plan in plans" :key="plan.id" :value="plan.id.toString()">
                  {{ plan.name }} -
                  {{
                    plan.price === 0
                      ? 'Gratis'
                      : `Rp ${(plan.price / 1000).toLocaleString('id-ID')}rb/bulan`
                  }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="form.errors.planId" class="text-sm text-destructive">
              {{ form.errors.planId }}
            </p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4">
          <Button type="submit" class="w-full" :disabled="form.processing">
            <Loader2 v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
            Sign Up
          </Button>
          <div class="text-center text-sm text-muted-foreground">
            Sudah punya akun?
            <Link href="/login" class="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
