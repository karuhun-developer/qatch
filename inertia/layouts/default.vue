<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'
import { Button } from '@/components/ui/button'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const page = usePage<Data.SharedProps>()

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center justify-between">
        <div class="flex items-center gap-4">
          <Link href="/" class="font-bold flex items-center space-x-2">
            <span class="inline-block text-xl">QRIS Dinamis</span>
          </Link>
        </div>
        <div class="flex items-center gap-4">
          <nav class="flex items-center space-x-2">
            <template v-if="page.props.user">
              <Button as-child variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Form route="session.destroy">
                <Button type="submit" variant="destructive">Logout</Button>
              </Form>
            </template>
            <template v-else>
              <Button as-child variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button as-child>
                <Link href="/register">Sign Up</Link>
              </Button>
            </template>
            <DarkModeToggle />
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <Toaster position="top-center" rich-colors />
  </div>
</template>
