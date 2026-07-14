<script setup lang="ts">
import { watch, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Menu } from '@lucide/vue'

const page = usePage<Data.SharedProps>()
const mobileOpen = ref(false)

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
        <!-- Logo + Desktop nav links -->
        <div class="flex items-center gap-1">
          <Link href="/" class="flex items-center gap-2 font-semibold mr-2">
            <img :src="'/QATCHLOGO-bg-removed-vector.svg'" alt="Qatch" class="h-20 w-30" />
          </Link>
          <!-- Desktop only -->
          <div class="hidden md:flex items-center gap-1">
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
        </div>

        <!-- Right side: auth + hamburger -->
        <div class="flex items-center gap-2">
          <!-- Auth buttons — always visible -->
          <nav class="flex items-center gap-2">
            <template v-if="page.props.user">
              <Button as-child variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Form route="session.destroy">
                <Button type="submit" variant="destructive" size="sm">Logout</Button>
              </Form>
            </template>
            <template v-else>
              <Button as-child variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button as-child size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </template>
          </nav>

          <!-- Hamburger — mobile only, opens nav links sidebar -->
          <div class="flex md:hidden">
            <Sheet v-model:open="mobileOpen">
              <SheetTrigger as-child>
                <Button variant="ghost" size="icon">
                  <Menu class="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="flex flex-col w-[280px] p-0 border-r-0">
                <SheetTitle class="sr-only">Menu</SheetTitle>
                <SheetDescription class="sr-only">Menu navigasi</SheetDescription>
                <div class="flex h-14 items-center border-b px-4">
                  <Link href="/" class="flex items-center gap-2 font-semibold" @click="mobileOpen = false">
                    <img :src="'/QATCHLOGO-bg-removed-vector.svg'" alt="Qatch" class="h-20 w-30" />
                  </Link>
                </div>
                <div class="flex-1 overflow-y-auto">
                  <nav class="flex flex-col gap-1 p-4">
                    <Button as-child variant="ghost" class="justify-start" @click="mobileOpen = false">
                      <Link href="/">Home</Link>
                    </Button>
                    <Button as-child variant="ghost" class="justify-start" @click="mobileOpen = false">
                      <Link href="/docs">Dokumentasi</Link>
                    </Button>
                    <Button as-child variant="ghost" class="justify-start" @click="mobileOpen = false">
                      <Link href="/tutorial">Tutorial</Link>
                    </Button>
                    <Button
                      as-child
                      variant="ghost"
                      class="justify-start text-primary hover:text-primary hover:bg-primary/10"
                      @click="mobileOpen = false"
                    >
                      <Link href="/demo">Coba Demo</Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
