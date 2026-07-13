<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/sonner'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import {
  LayoutDashboard,
  User,
  LogOut,
  Shield,
  Users,
  Menu,
  QrCode,
  RefreshCw,
  Webhook,
  Package,
  PlayCircle,
  MessageCircle,
  BookOpen,
} from '@lucide/vue'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const page = usePage<Data.SharedProps>()
const logoutModalOpen = ref(false)
const mobileMenuOpen = ref(false)

function handleLogout() {
  router.post(
    '/logout',
    {},
    {
      onFinish: () => {
        logoutModalOpen.value = false
      },
    }
  )
}

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
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row relative">
    <!-- Sidebar -->
    <aside
      class="hidden w-64 flex-col md:flex border-r bg-muted/40 sticky top-0 h-screen overflow-y-auto"
    >
      <div class="flex h-14 shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" class="flex items-center gap-2 font-semibold">
          <img :src="'/QATCHLOGO-bg-removed-vector.svg'" alt="Qatch" class="h-20 w-30" />
        </Link>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 gap-2">
          <Link
            href="/dashboard"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url === '/dashboard' }"
          >
            <LayoutDashboard class="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/qris-dynamic"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/qris-dynamic') }"
          >
            <RefreshCw class="h-4 w-4" />
            QRIS Dinamis
          </Link>
          <Link
            href="/qris"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{
              'bg-muted text-primary':
                $page.url.startsWith('/qris') && !$page.url.startsWith('/qris-dynamic'),
            }"
          >
            <QrCode class="h-4 w-4" />
            QRIS Statis
          </Link>
          <Link
            href="/webhook-settings"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/webhook-settings') }"
          >
            <Webhook class="h-4 w-4" />
            Webhook & API
          </Link>
          <Link
            href="/active-plan"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/active-plan') }"
          >
            <Package class="h-4 w-4" />
            Plan Aktif
          </Link>
          <a
            href="/docs"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/docs') }"
          >
            <BookOpen class="h-4 w-4" />
            Dokumentasi
          </a>
          <a
            href="/tutorial"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/tutorial') }"
          >
            <PlayCircle class="h-4 w-4" />
            Tutorial
          </a>
          <Link
            href="/profile"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/profile') }"
          >
            <User class="h-4 w-4" />
            Profile
          </Link>
          <Link
            v-if="page.props.user?.roleId === 1"
            href="/users"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/users') }"
          >
            <Users class="h-4 w-4" />
            Users
          </Link>
          <Link
            v-if="page.props.user?.roleId === 1"
            href="/roles"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/roles') }"
          >
            <Shield class="h-4 w-4" />
            Roles
          </Link>
          <Link
            v-if="page.props.user?.roleId === 1"
            href="/plans"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/plans') }"
          >
            <Package class="h-4 w-4" />
            Plans
          </Link>
        </nav>
      </div>
      <div class="p-4 mt-auto flex flex-col gap-1">
        <a
          href="https://t.me/bayurifkialgh"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted"
        >
          <MessageCircle class="h-4 w-4" />
          Telegram
        </a>
        <a
          href="https://github.com/karuhun-developer/"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          GitHub
        </a>
      </div>
    </aside>

    <div class="flex flex-col flex-1">
      <!-- Header -->
      <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <!-- Mobile Sidebar Toggle -->
        <Sheet v-model:open="mobileMenuOpen">
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col w-[280px] p-0 border-r-0">
            <SheetTitle class="sr-only">Navigasi Menu</SheetTitle>
            <SheetDescription class="sr-only"
              >Menu navigasi untuk berpindah halaman di dashboard Qatch.</SheetDescription
            >
            <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link
                href="/"
                class="flex items-center gap-2 font-semibold"
                @click="mobileMenuOpen = false"
              >
                <img :src="'/QATCHLOGO-bg-removed-vector.svg'" alt="Qatch" class="h-30 w-20" />
              </Link>
            </div>
            <div class="flex-1 overflow-y-auto">
              <nav class="grid items-start px-2 text-sm font-medium mt-4 gap-2">
                <Link
                  href="/dashboard"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url === '/dashboard' }"
                  @click="mobileMenuOpen = false"
                >
                  <LayoutDashboard class="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/qris-dynamic"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/qris-dynamic') }"
                  @click="mobileMenuOpen = false"
                >
                  <RefreshCw class="h-4 w-4" />
                  Qatch
                </Link>
                <Link
                  href="/qris"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{
                    'bg-muted text-primary':
                      $page.url.startsWith('/qris') && !$page.url.startsWith('/qris-dynamic'),
                  }"
                  @click="mobileMenuOpen = false"
                >
                  <QrCode class="h-4 w-4" />
                  QRIS Statis
                </Link>
                <Link
                  href="/webhook-settings"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/webhook-settings') }"
                  @click="mobileMenuOpen = false"
                >
                  <Webhook class="h-4 w-4" />
                  Webhook & API
                </Link>
                <Link
                  href="/active-plan"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/active-plan') }"
                  @click="mobileMenuOpen = false"
                >
                  <Package class="h-4 w-4" />
                  Plan Aktif
                </Link>
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/docs') }"
                  @click="mobileMenuOpen = false"
                >
                  <BookOpen class="h-4 w-4" />
                  Dokumentasi
                </a>
                <a
                  href="/tutorial"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/tutorial') }"
                  @click="mobileMenuOpen = false"
                >
                  <PlayCircle class="h-4 w-4" />
                  Tutorial
                </a>
                <Link
                  href="/profile"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/profile') }"
                  @click="mobileMenuOpen = false"
                >
                  <User class="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  v-if="page.props.user?.roleId === 1"
                  href="/users"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/users') }"
                  @click="mobileMenuOpen = false"
                >
                  <Users class="h-4 w-4" />
                  Users
                </Link>
                <Link
                  v-if="page.props.user?.roleId === 1"
                  href="/roles"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/roles') }"
                  @click="mobileMenuOpen = false"
                >
                  <Shield class="h-4 w-4" />
                  Roles
                </Link>
                <Link
                  v-if="page.props.user?.roleId === 1"
                  href="/plans"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  :class="{ 'bg-muted text-primary': $page.url.startsWith('/plans') }"
                  @click="mobileMenuOpen = false"
                >
                  <Package class="h-4 w-4" />
                  Plans
                </Link>
              </nav>
            </div>
            <div class="p-4 mt-auto border-t flex flex-col gap-1">
              <a
                href="https://t.me/bayurifkialgh"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                @click="mobileMenuOpen = false"
              >
                <MessageCircle class="h-4 w-4" />
                Telegram
              </a>
              <a
                href="https://github.com/karuhun-developer/"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                @click="mobileMenuOpen = false"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                GitHub
              </a>
            </div>
          </SheetContent>
        </Sheet>

        <div class="w-full flex-1"></div>
        <DropdownMenu v-if="page.props.user">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
              <Avatar class="h-8 w-8">
                <AvatarFallback>{{ page.props.user.initials }}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuLabel class="font-normal flex">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">{{ page.props.user.fullName }}</p>
                <p class="text-xs leading-none text-muted-foreground">
                  {{ page.props.user.email }}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <Link href="/profile" class="w-full cursor-pointer flex items-center">
                <User class="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="w-full text-left flex items-center cursor-pointer text-destructive"
              @click="logoutModalOpen = true"
            >
              <LogOut class="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col p-4 lg:p-6">
        <slot />
      </main>

      <footer
        class="py-4 mt-auto border-t bg-muted/20 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2 px-4"
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
    </div>

    <ConfirmModal
      v-model:open="logoutModalOpen"
      title="Konfirmasi Logout"
      description="Apakah Anda yakin ingin keluar dari aplikasi?"
      confirm-text="Logout"
      @confirm="handleLogout"
    />

    <Toaster position="top-center" rich-colors />
  </div>
</template>
