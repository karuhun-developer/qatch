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
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import { Toaster } from '@/components/ui/sonner'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { LayoutDashboard, User, LogOut, Shield, Users, Menu, QrCode, RefreshCw } from '@lucide/vue'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const page = usePage<Data.SharedProps>()
const logoutModalOpen = ref(false)
const mobileMenuOpen = ref(false)

function handleLogout() {
  router.post('/logout', {}, {
    onFinish: () => {
      logoutModalOpen.value = false
    }
  })
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
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="hidden w-64 flex-col md:flex border-r bg-muted/40">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" class="flex items-center gap-2 font-semibold">
          <span class="">QRIS Dinamis</span>
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
            href="/qris"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            :class="{ 'bg-muted text-primary': $page.url.startsWith('/qris') && !$page.url.startsWith('/qris-dynamic') }"
          >
            <QrCode class="h-4 w-4" />
            QRIS Statis
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
        </nav>
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
            <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" class="flex items-center gap-2 font-semibold" @click="mobileMenuOpen = false">
                <span class="">QRIS Dinamis</span>
              </Link>
            </div>
            <nav class="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 gap-2 flex-1">
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
                href="/qris"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                :class="{ 'bg-muted text-primary': $page.url.startsWith('/qris') && !$page.url.startsWith('/qris-dynamic') }"
                @click="mobileMenuOpen = false"
              >
                <QrCode class="h-4 w-4" />
                QRIS Statis
              </Link>
              <Link
                href="/qris-dynamic"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                :class="{ 'bg-muted text-primary': $page.url.startsWith('/qris-dynamic') }"
                @click="mobileMenuOpen = false"
              >
                <RefreshCw class="h-4 w-4" />
                QRIS Dinamis
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
            </nav>
          </SheetContent>
        </Sheet>
        
        <div class="w-full flex-1"></div>
        <DarkModeToggle />
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
