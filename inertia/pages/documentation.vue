<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import DefaultLayout from '@/layouts/default.vue'
import { ChevronRight, Menu, X } from '@lucide/vue'
import { ref } from 'vue'
import 'highlight.js/styles/monokai-sublime.css'

defineOptions({ layout: DefaultLayout })

const props = defineProps<{
  content: string
  nav: { slug: string; title: string }[]
  currentSlug: string
  currentTitle: string
}>()

const sidebarOpen = ref(false)
</script>

<template>
  <Head>
    <title>{{ currentTitle }} — Dokumentasi Qatch | API QRIS Dinamis</title>
    <meta name="description" content="Dokumentasi lengkap Qatch: panduan instalasi, API QRIS dinamis & statis, autentikasi API Key, konfigurasi Webhook, dan setup Android Notification Forwarder." />
    <meta name="keywords" content="dokumentasi QRIS, API QRIS dinamis, QRIS API endpoint, webhook QRIS, Android forwarder QRIS, Qatch dokumentasi, QRIS statis ke dinamis" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Karuhun Developer" />
    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" :content="currentTitle + ' — Dokumentasi Qatch'" />
    <meta property="og:description" content="Pelajari cara menggunakan API Qatch untuk generate QRIS dinamis, konfigurasi webhook, dan integrasi Android Notification Forwarder." />
    <meta property="og:url" :content="String($page.props.appUrl) + '/docs'" />
    <meta property="og:image" :content="String($page.props.appUrl) + '/QATCHLOGO.jpeg'" />
    <meta property="og:site_name" content="Qatch" />
    <meta property="og:locale" content="id_ID" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" :content="currentTitle + ' — Dokumentasi Qatch'" />
    <meta name="twitter:description" content="Panduan lengkap API QRIS dinamis, webhook, dan instalasi Qatch." />
    <meta name="twitter:image" :content="String($page.props.appUrl) + '/QATCHLOGO.jpeg'" />
    <link rel="canonical" :href="String($page.props.appUrl) + '/docs/' + currentSlug" />
    <link rel="icon" type="image/x-icon" href="/QATCHLOGO.ico" />
  </Head>

  <div class="max-w-screen-xl mx-auto flex relative">
    <!-- Sidebar overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-14 bottom-0 z-40 w-60 border-r border-border/50 bg-background overflow-y-auto transition-transform duration-200',
        'lg:sticky lg:translate-x-0 lg:shrink-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <nav class="px-3 py-6 space-y-0.5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-2">
          Panduan
        </p>
        <Link
          v-for="item in nav"
          :key="item.slug"
          :href="`/docs/${item.slug}`"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full',
            currentSlug === item.slug
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          ]"
          @click="sidebarOpen = false"
        >
          <ChevronRight
            :class="[
              'h-3 w-3 shrink-0 transition-transform',
              currentSlug === item.slug ? 'text-primary' : 'opacity-0',
            ]"
          />
          {{ item.title }}
        </Link>
      </nav>
    </aside>

    <!-- Mobile sidebar toggle (floating) -->
    <button
      class="fixed bottom-6 left-4 z-50 lg:hidden flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20"
      @click="sidebarOpen = !sidebarOpen"
    >
      <Menu v-if="!sidebarOpen" class="h-4 w-4" />
      <X v-else class="h-4 w-4" />
      Menu
    </button>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 px-6 lg:px-12 py-10">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" class="hover:text-foreground transition-colors">Beranda</Link>
        <ChevronRight class="h-3.5 w-3.5" />
        <Link href="/docs/introduction" class="hover:text-foreground transition-colors"
          >Dokumentasi</Link
        >
        <ChevronRight class="h-3.5 w-3.5" />
        <span class="text-foreground font-medium">{{ currentTitle }}</span>
      </div>

      <!-- Rendered markdown -->
      <article
        class="prose prose-neutral max-w-3xl prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:mb-2 prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-2 prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2 prose-p:text-muted-foreground prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-strong:font-semibold prose-table:text-sm prose-thead:border-border prose-th:text-foreground prose-th:font-semibold prose-td:text-muted-foreground prose-tr:border-border prose-img:rounded-xl prose-img:border prose-img:border-border/60 prose-li:text-muted-foreground prose-li:marker:text-primary"
        v-html="content"
      />

      <!-- Prev / Next navigation -->
      <div class="mt-12 pt-6 border-t border-border/50 flex justify-between gap-4">
        <template v-for="(item, i) in nav" :key="item.slug">
          <template v-if="item.slug === currentSlug">
            <Link
              v-if="i > 0"
              :href="`/docs/${nav[i - 1].slug}`"
              class="group flex flex-col gap-1 text-sm"
            >
              <span class="text-xs text-muted-foreground">← Sebelumnya</span>
              <span class="text-primary font-medium group-hover:underline">{{
                nav[i - 1].title
              }}</span>
            </Link>
            <div v-else />
            <Link
              v-if="i < nav.length - 1"
              :href="`/docs/${nav[i + 1].slug}`"
              class="group flex flex-col gap-1 text-sm text-right"
            >
              <span class="text-xs text-muted-foreground">Selanjutnya →</span>
              <span class="text-primary font-medium group-hover:underline">{{
                nav[i + 1].title
              }}</span>
            </Link>
            <div v-else />
          </template>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* hljs code block (dark mode by default via monokai) */
:deep(.hljs) {
  display: block;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-x: auto;
  color: #f8f8f2 !important;
}

/* Inline code styling (outside pre) */
:deep(:not(pre) > code) {
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: hsl(var(--foreground));
}
:deep(:not(pre) > code::before),
:deep(:not(pre) > code::after) {
  content: none;
}
</style>
