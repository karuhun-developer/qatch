<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'
import { Button } from '@/components/ui/button'

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
    <header
      class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container flex h-14 items-center justify-between">
        <div class="flex items-center gap-1">
          <Link href="/" class="font-bold flex items-center space-x-2 mr-2">
            <img src="/QATCHLOGO-bg-removed-vector.svg" alt="Qatch" class="h-8 w-auto" />
          </Link>
          <Button as-child variant="ghost" size="sm">
            <Link href="/docs">Dokumentasi</Link>
          </Button>
          <Button as-child variant="ghost" size="sm">
            <Link href="/tutorial">Tutorial</Link>
          </Button>
          <Button
            as-child
            variant="ghost"
            size="sm"
            class="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Link href="/demo">Coba Demo</Link>
          </Button>
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
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <footer
      class="py-6 mt-auto border-t bg-muted/20 text-center text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4"
    >
      <p>
        &copy; 2026 Qatch. Built by
        <a
          href="https://karuhundeveloper.com/"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline font-medium"
          >Karuhun Developer</a
        >.
      </p>
      <div class="flex items-center gap-2 sm:gap-4">
        <a
          href="https://t.me/bayurifkialgh"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline font-medium flex items-center"
        >
          Telegram
        </a>
        <div class="text-muted-foreground/30">|</div>
        <a
          href="https://github.com/karuhun-developer/"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline font-medium flex items-center"
        >
          GitHub
        </a>
      </div>
    </footer>

    <Toaster position="top-center" rich-colors />
  </div>
</template>
