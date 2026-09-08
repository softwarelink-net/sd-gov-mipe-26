<script setup lang="ts">
import { computed, ref } from 'vue'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/stores/auth'
import type { RemSeverity, RemStatus } from '@/types'
import { REM_STATUS_LABELS, SEVERITY_LABELS } from '@/types'

const auth = useAuthStore()
const status = ref('')
const severity = ref('')
const tick = ref(0)

const items = computed(() => {
  tick.value
  return dbService.listRemediations({ status: status.value, severity: severity.value })
})

const canWrite = computed(
  () => auth.role === 'super_admin' || auth.role === 'biz_manager' || auth.role === 'operator',
)

function severityClass(s: RemSeverity) {
  if (s === 'Critical') return 'bg-rose-100 text-rose-800'
  if (s === 'High') return 'bg-orange-100 text-orange-800'
  if (s === 'Medium') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-600'
}

function statusClass(s: RemStatus) {
  if (s === 'passed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'retest') return 'bg-violet-100 text-violet-700'
  if (s === 'fixing') return 'bg-sec-100 text-sec-800'
  return 'bg-slate-100 text-slate-600'
}

function advance(id: number, current: RemStatus) {
  if (!canWrite.value) return
  const flow: RemStatus[] = ['pending', 'fixing', 'retest', 'passed']
  const idx = flow.indexOf(current)
  const next = flow[Math.min(idx + 1, flow.length - 1)]
  dbService.updateRemediationStatus(id, next, auth.user?.id)
  tick.value++
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">风险整改追踪</h2>
        <p class="mt-1 text-sm text-slate-500">不合格项台账：待整改 → 整改中 → 复测 → 通过</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <select v-model="severity" class="input-field w-36">
          <option value="">全部等级</option>
          <option v-for="(label, key) in SEVERITY_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
        <select v-model="status" class="input-field w-36">
          <option value="">全部状态</option>
          <option v-for="(label, key) in REM_STATUS_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
    </div>

    <div class="card-panel overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-4 py-3 font-medium">问题</th>
            <th class="px-4 py-3 font-medium">系统</th>
            <th class="px-4 py-3 font-medium">检查项</th>
            <th class="px-4 py-3 font-medium">等级</th>
            <th class="px-4 py-3 font-medium">状态</th>
            <th class="px-4 py-3 font-medium">责任人</th>
            <th class="px-4 py-3 font-medium">截止</th>
            <th class="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in items" :key="r.id" class="hover:bg-slate-50/80">
            <td class="px-4 py-3 font-medium text-slate-800">{{ r.issue_title }}</td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ r.system_name || '—' }}</td>
            <td class="px-4 py-3 font-mono text-xs">{{ r.item_code || '—' }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="severityClass(r.severity)">
                {{ SEVERITY_LABELS[r.severity] }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(r.status)">
                {{ REM_STATUS_LABELS[r.status] }}
              </span>
            </td>
            <td class="px-4 py-3">{{ r.owner_name || '—' }}</td>
            <td class="px-4 py-3 font-mono text-xs text-slate-500">{{ r.due_date || '—' }}</td>
            <td class="px-4 py-3">
              <button
                v-if="canWrite && r.status !== 'passed'"
                type="button"
                class="text-xs font-medium text-sec-700 hover:underline"
                @click="advance(r.id, r.status)"
              >
                推进
              </button>
              <span v-else class="text-xs text-slate-400">—</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="p-8 text-center text-sm text-slate-400">暂无整改项</p>
    </div>
  </div>
</template>
