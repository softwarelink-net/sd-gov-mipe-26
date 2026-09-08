<script setup lang="ts">
import { computed, ref } from 'vue'
import { dbService } from '@/db/service'
import { CATEGORY_LABELS, type CheckCategory } from '@/types'

const category = ref('')

const items = computed(() => dbService.listCheckItems({ category: category.value }))

const summary = computed(() => {
  const list = items.value
  const total = list.reduce((s, i) => s + (i.score || 0), 0)
  const actual = list.reduce((s, i) => s + (i.actual_score || 0), 0)
  return total ? Math.round((actual / total) * 100) : 0
})

function statusClass(s: string) {
  if (s === 'pass') return 'bg-emerald-100 text-emerald-700'
  if (s === 'fail') return 'bg-rose-100 text-rose-700'
  if (s === 'partial') return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-600'
}

function statusLabel(s: string) {
  if (s === 'pass') return '符合'
  if (s === 'fail') return '不符合'
  if (s === 'partial') return '部分符合'
  return '待评'
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">合规自测引擎</h2>
        <p class="mt-1 text-sm text-slate-500">GB/T 39786 商用密码应用安全性评估检查表 · 当前得分 {{ summary }}</p>
      </div>
      <select v-model="category" class="input-field w-44">
        <option value="">全部分类</option>
        <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <div class="space-y-3">
      <div v-for="item in items" :key="item.id" class="card-panel p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-mono text-[11px] text-sec-600">{{ item.item_code }}</p>
            <h3 class="mt-1 font-medium text-slate-900">{{ item.description }}</h3>
            <p class="mt-1 text-xs text-slate-500">
              {{ CATEGORY_LABELS[item.category as CheckCategory] || item.category }} · 权重 {{ item.weight }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm text-slate-700">{{ item.actual_score }}/{{ item.score }}</span>
            <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(item.status)">
              {{ statusLabel(item.status) }}
            </span>
          </div>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ item.requirement_text }}</p>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full bg-sec-500"
            :style="{ width: `${item.score ? (item.actual_score / item.score) * 100 : 0}%` }"
          />
        </div>
      </div>
    </div>
    <p v-if="!items.length" class="card-panel mt-4 p-8 text-center text-sm text-slate-400">暂无检查项</p>
  </div>
</template>
