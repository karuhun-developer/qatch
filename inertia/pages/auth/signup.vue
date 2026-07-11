<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from '@lucide/vue'

defineOptions({ layout: DefaultLayout })

const form = useForm({
  fullName: '',
  email: '',
  password: '',
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
        <CardDescription>
          Masukkan data diri Anda untuk membuat akun baru.
        </CardDescription>
      </CardHeader>
      <form @submit.prevent="submit">
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="fullName">Nama Lengkap</Label>
            <Input 
              id="fullName" 
              type="text" 
              v-model="form.fullName" 
              placeholder="John Doe" 
              required 
              :class="{ 'border-destructive': form.errors.fullName }"
            />
            <p v-if="form.errors.fullName" class="text-sm text-destructive">{{ form.errors.fullName }}</p>
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              v-model="form.email" 
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
              type="password" 
              v-model="form.password" 
              required 
              :class="{ 'border-destructive': form.errors.password }"
            />
            <p v-if="form.errors.password" class="text-sm text-destructive">{{ form.errors.password }}</p>
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
