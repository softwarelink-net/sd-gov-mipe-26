<script setup lang="ts">
import { computed, ref } from 'vue'
import { dbService } from '@/db/service'
import {
  ASSET_TYPE_LABELS,
  COMPLIANCE_STATUS_LABELS,
  RISK_LABELS,
  type AssetType,
} from '@/types'

const keyword = ref('')
const risk = ref('')

const assets = computed(() =>
  dbService.listAssets({ keyword: keyword.value.trim(), risk: risk.value }),
)

function riskClass(level: string) {
  if (level === 'high') return 'bg-rose-100 text-rose-700'
  if (level === 'medium') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

function parseCrypto(raw: string | null): Record<string, string> {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">资产与密码基座</h2>
        <p class="mt-1 text-sm text-slate-500">被测评系统清单、密码产品台账与密钥相关合规状态</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索系统 / 编号 / 部门"
          class="input-field w-64"
        />
        <select v-model="risk" class="input-field w-36">
          <option value="">全部风险</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
    </div>

    <div class="card-panel overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-4 py-3 font-medium">系统名称</th>
            <th class="px-4 py-3 font-medium">编号</th>
            <th class="px-4 py-3 font-medium">类型</th>
            <th class="px-4 py-3 font-medium">责任部门</th>
            <th class="px-4 py-3 font-medium">密码产品</th>
            <th class="px-4 py-3 font-medium">合规状态</th>
            <th class="px-4 py-3 font-medium">风险</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="a in assets" :key="a.id" class="hover:bg-slate-50/80">
            <td class="px-4 py-3 font-medium text-slate-800">{{ a.system_name }}</td>
            <td class="px-4 py-3 font-mono text-xs text-slate-600">{{ a.system_id }}</td>
            <td class="px-4 py-3">{{ ASSET_TYPE_LABELS[a.asset_type as AssetType] || a.asset_type }}</td>
            <td class="px-4 py-3">{{ a.dept_owner }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(val, key) in parseCrypto(a.crypto_products)"
                  :key="key"
                  class="rounded bg-sec-50 px-1.5 py-0.5 text-[11px] text-sec-800"
                  :title="String(key)"
                >
                  {{ val }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-xs">
              {{ COMPLIANCE_STATUS_LABELS[a.compliance_status] || a.compliance_status }}
            </td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="riskClass(a.risk_level)">
                {{ RISK_LABELS[a.risk_level] || a.risk_level }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!assets.length" class="p-8 text-center text-sm text-slate-400">暂无匹配资产</p>
    </div>
  </div>
</template>
