<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dbService } from '@/db/service'
import type { DashboardStats } from '@/types'

const stats = ref<DashboardStats | null>(null)
const generatedAt = ref('')

onMounted(() => {
  stats.value = dbService.getStats()
  generatedAt.value = new Date().toLocaleString('zh-CN')
})

const summary = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { label: '纳管系统规模', value: `${s.assetCount} 套` },
    { label: '高风险系统', value: `${s.highRiskCount} 个` },
    { label: '未闭环整改', value: `${s.openRemediations} 项` },
    { label: '严重未闭环', value: `${s.criticalIssues} 项` },
    { label: '密评合规得分', value: `${s.complianceScore} 分` },
    { label: '进行中任务', value: `${s.taskOpen} 个` },
  ]
})

const conclusions = [
  '建设工程审批系统与公积金核心业务系统风险偏高，建议优先完成密钥管理与数据加密整改。',
  'GB/T 39786 检查项中“密钥管理”“数据保密性”得分偏低，需纳入本季度整改清单。',
  '测评协同工作台已覆盖自评、第三方密评与整改复测三类任务，建议按截止日滚动销号。',
]
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">密评报告</h2>
        <p class="mt-1 text-sm text-slate-500">面向决策层的商用密码合规与风险摘要</p>
      </div>
      <p class="font-mono text-xs text-slate-400">生成时间 {{ generatedAt }}</p>
    </div>

    <div class="card-panel p-6">
      <h3 class="font-display text-lg text-sec-950">2026 年度 Q3 密评合规简报</h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-600">
        本报告基于浏览器端本地 SQLite 演示数据自动汇总，覆盖密码基座、合规自测、测评协同与整改追踪进度，
        供山东省住房和城乡建设厅信息系统商用密码应用安全性评估工作决策参考。
      </p>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in summary" :key="item.label" class="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
          <p class="text-xs text-slate-500">{{ item.label }}</p>
          <p class="mt-1 font-display text-xl text-sec-950">{{ item.value }}</p>
        </div>
      </div>

      <h4 class="mt-8 text-sm font-semibold text-slate-800">研判结论</h4>
      <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
        <li v-for="(c, i) in conclusions" :key="i">{{ c }}</li>
      </ol>

      <div class="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
        声明：本页面为公开标讯推演之技术演示，不代表真实测评结论，不含国家秘密与未公开敏感信息。
      </div>
    </div>
  </div>
</template>
