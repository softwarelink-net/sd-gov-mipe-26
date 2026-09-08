<script setup lang="ts">
import { computed, ref } from 'vue'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/stores/auth'
import type { TaskStatus, TaskType } from '@/types'
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS } from '@/types'

const auth = useAuthStore()
const status = ref('')
const tick = ref(0)

const tasks = computed(() => {
  tick.value
  return dbService.listTasks({ status: status.value })
})

const canWrite = computed(
  () => auth.role === 'super_admin' || auth.role === 'biz_manager' || auth.role === 'operator',
)

function statusClass(s: TaskStatus) {
  if (s === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'review') return 'bg-violet-100 text-violet-700'
  if (s === 'in_progress') return 'bg-sec-100 text-sec-800'
  return 'bg-slate-100 text-slate-600'
}

function advance(id: number, current: TaskStatus, progress: number) {
  if (!canWrite.value) return
  const flow: TaskStatus[] = ['open', 'in_progress', 'review', 'completed']
  const idx = flow.indexOf(current)
  const next = flow[Math.min(idx + 1, flow.length - 1)]
  const nextProgress = next === 'completed' ? 100 : Math.min(progress + 20, 95)
  dbService.updateTaskStatus(id, next, nextProgress, auth.user?.id)
  tick.value++
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">测评协同工作台</h2>
        <p class="mt-1 text-sm text-slate-500">第三方机构与承建方协同：计划、记录、整改复测</p>
      </div>
      <select v-model="status" class="input-field w-40">
        <option value="">全部状态</option>
        <option v-for="(label, key) in TASK_STATUS_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div v-for="t in tasks" :key="t.id" class="card-panel p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-mono text-[11px] text-sec-600">{{ t.task_code }}</p>
            <h3 class="mt-1 font-medium text-slate-900">{{ t.title }}</h3>
            <p class="mt-1 text-xs text-slate-500">
              {{ TASK_TYPE_LABELS[t.task_type as TaskType] || t.task_type }}
            </p>
          </div>
          <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(t.status)">
            {{ TASK_STATUS_LABELS[t.status] }}
          </span>
        </div>
        <dl class="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>
            <dt>目标系统</dt>
            <dd class="mt-0.5 text-slate-700">{{ t.system_name || '—' }}</dd>
          </div>
          <div>
            <dt>截止日期</dt>
            <dd class="mt-0.5 font-mono text-slate-700">{{ t.deadline || '—' }}</dd>
          </div>
          <div>
            <dt>自评/测评分</dt>
            <dd class="mt-0.5 text-slate-700">{{ t.score ?? '—' }}</dd>
          </div>
          <div>
            <dt>反馈</dt>
            <dd class="mt-0.5 line-clamp-2 text-slate-700">{{ t.feedback || '—' }}</dd>
          </div>
        </dl>
        <div class="mt-4">
          <div class="mb-1 flex justify-between text-xs text-slate-500">
            <span>进度</span>
            <span class="font-mono">{{ t.progress }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full bg-sec-500 transition-all" :style="{ width: `${t.progress}%` }" />
          </div>
        </div>
        <button
          v-if="canWrite && t.status !== 'completed'"
          type="button"
          class="btn-secondary mt-4 w-full text-xs"
          @click="advance(t.id, t.status, t.progress)"
        >
          推进任务状态
        </button>
      </div>
    </div>
    <p v-if="!tasks.length" class="card-panel mt-4 p-8 text-center text-sm text-slate-400">暂无测评任务</p>
  </div>
</template>
