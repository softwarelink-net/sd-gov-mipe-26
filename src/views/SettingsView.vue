<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/stores/auth'
import type { AuditLog, SystemConfig, User } from '@/types'
import { ROLE_LABELS } from '@/types'
import type { UserRole } from '@/types'

const auth = useAuthStore()
const users = ref<User[]>([])
const configs = ref<SystemConfig[]>([])
const logs = ref<AuditLog[]>([])
const msg = ref('')

function reload() {
  users.value = dbService.listUsers()
  configs.value = dbService.listConfigs()
  logs.value = dbService.listAuditLogs(15)
}

onMounted(reload)

function saveConfig(key: string, value: string) {
  dbService.setConfig(key, value)
  dbService.addAuditLog(auth.user?.id ?? null, 'CONFIG_UPDATE', `更新配置 ${key}=${value}`)
  msg.value = `已保存 ${key}`
  reload()
}

async function resetDb() {
  if (!confirm('确认重置本地数据库？当前演示数据将被重新初始化。')) return
  dbService.resetDatabase()
  await dbService.login('admin', 'admin2026')
  location.reload()
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="font-display text-xl text-sec-950">系统设置</h2>
      <p class="mt-1 text-sm text-slate-500">RBAC 用户、功能开关与审计日志（仅超管）</p>
    </div>

    <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>

    <div class="card-panel p-4">
      <h3 class="text-sm font-semibold text-slate-800">系统参数</h3>
      <div class="mt-4 space-y-3">
        <div v-for="c in configs" :key="c.key" class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="sm:w-56">
            <p class="font-mono text-xs text-sec-700">{{ c.key }}</p>
            <p class="text-xs text-slate-400">{{ c.description }}</p>
          </div>
          <input
            :value="c.value ?? ''"
            class="input-field flex-1"
            @change="saveConfig(c.key, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <div class="card-panel overflow-x-auto p-4">
      <h3 class="mb-3 text-sm font-semibold text-slate-800">用户列表</h3>
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th class="py-2 pr-4">用户名</th>
            <th class="py-2 pr-4">姓名</th>
            <th class="py-2 pr-4">部门</th>
            <th class="py-2 pr-4">角色</th>
            <th class="py-2">最近登录</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="u in users" :key="u.id">
            <td class="py-2 pr-4 font-mono text-xs">{{ u.username }}</td>
            <td class="py-2 pr-4">{{ u.full_name }}</td>
            <td class="py-2 pr-4 text-xs text-slate-600">{{ u.department || '—' }}</td>
            <td class="py-2 pr-4">{{ ROLE_LABELS[u.role as UserRole] }}</td>
            <td class="py-2 font-mono text-xs text-slate-500">{{ u.last_login || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-panel p-4">
      <h3 class="mb-3 text-sm font-semibold text-slate-800">审计日志</h3>
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="log in logs" :key="log.id" class="flex justify-between gap-4 py-2">
          <div>
            <p class="font-medium text-slate-800">{{ log.action }}</p>
            <p class="text-xs text-slate-500">{{ log.details }}</p>
          </div>
          <p class="shrink-0 font-mono text-xs text-slate-400">{{ log.created_at }}</p>
        </li>
      </ul>
    </div>

    <div class="card-panel border-rose-200 p-4">
      <h3 class="text-sm font-semibold text-rose-700">危险操作</h3>
      <p class="mt-1 text-xs text-slate-500">清除本地 localStorage 中的 SQLite 快照并重新灌入种子数据。</p>
      <button type="button" class="btn-secondary mt-3 border-rose-300 text-rose-700" @click="resetDb">
        重置本地数据库
      </button>
    </div>
  </div>
</template>
