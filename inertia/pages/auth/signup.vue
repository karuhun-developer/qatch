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
