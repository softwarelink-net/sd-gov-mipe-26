<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  ChartBarIcon,
  ServerStackIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
  ShieldExclamationIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const navItems = computed(() => {
  const all: { to: string; label: string; icon: unknown; roles: UserRole[] }[] = [
    {
      to: '/dashboard',
      label: '密评态势',
      icon: ChartBarIcon,
      roles: ['super_admin', 'biz_manager', 'operator', 'executive'],
    },
    {
      to: '/assets',
      label: '密码基座',
      icon: ServerStackIcon,
      roles: ['super_admin', 'biz_manager', 'operator'],
    },
    {
      to: '/assessment',
      label: '合规自测',
      icon: ClipboardDocumentCheckIcon,
      roles: ['super_admin', 'biz_manager', 'operator'],
    },
    {
      to: '/tasks',
      label: '测评协同',
      icon: QueueListIcon,
      roles: ['super_admin', 'biz_manager', 'operator'],
    },
    {
      to: '/remediation',
      label: '整改追踪',
      icon: ShieldExclamationIcon,
      roles: ['super_admin', 'biz_manager', 'operator'],
    },
    {
      to: '/reports',
      label: '密评报告',
      icon: DocumentChartBarIcon,
      roles: ['super_admin', 'biz_manager', 'operator', 'executive'],
    },
    {
      to: '/settings',
      label: '系统设置',
      icon: Cog6ToothIcon,
      roles: ['super_admin'],
    },
  ]
  const role = auth.role
  if (!role) return []
  return all.filter((i) => i.roles.includes(role))
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-[calc(100vh-2.5rem)] bg-slate-100">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-sec-950/50 lg:hidden"
      @click="mobileOpen = false"
    />

    <aside
      class="fixed left-0 top-10 z-50 flex h-[calc(100vh-2.5rem)] w-64 flex-col border-r border-slate-800 bg-sec-950 text-slate-200 transition-transform lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="border-b border-slate-800 px-5 py-5">
        <p class="font-display text-lg leading-snug text-white">住建厅密评管理平台</p>
        <p class="mt-1 font-mono text-[10px] tracking-wider text-sec-400">SDGP370000000202602007474</p>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition"
          :class="
            route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'bg-sec-700 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          "
          @click="mobileOpen = false"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0 opacity-80" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="border-t border-slate-800 p-4 text-xs text-slate-400">
        <RouterLink to="/tender" class="transition hover:text-sec-300">查看磋商公告</RouterLink>
      </div>
    </aside>

    <div class="lg:pl-64">
      <header
        class="sticky top-10 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            <Bars3Icon v-if="!mobileOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-sm font-semibold text-slate-900 sm:text-base">{{ route.meta.title }}</h1>
            <p class="hidden text-xs text-slate-500 sm:block">商用密码 · 合规自评 · 整改闭环</p>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button type="button" class="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title="通知">
            <BellIcon class="h-5 w-5" />
            <span class="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <div class="hidden text-right sm:block">
            <p class="text-sm font-medium text-slate-800">{{ auth.user?.full_name || auth.user?.username }}</p>
            <p class="text-[11px] text-slate-500">{{ auth.roleLabel }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            @click="logout"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
            退出
          </button>
        </div>
      </header>

      <main class="p-4 sm:p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
