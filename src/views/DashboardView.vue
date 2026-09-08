<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import EChart from '@/components/EChart.vue'
import StatCard from '@/components/StatCard.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { dbService } from '@/db/service'
import type { AuditLog, CheckCategory, DashboardStats, RemStatus } from '@/types'
import { CATEGORY_LABELS, REM_STATUS_LABELS } from '@/types'

const loading = ref(true)
const stats = ref<DashboardStats | null>(null)
const logs = ref<AuditLog[]>([])

onMounted(() => {
  stats.value = dbService.getStats()
  logs.value = dbService.listAuditLogs(8)
  loading.value = false
})

const scoreOption = computed<EChartsOption>(() => {
  const score = stats.value?.complianceScore ?? 0
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        progress: { show: true, width: 14, itemStyle: { color: '#06b6d4' } },
        axisLine: { lineStyle: { width: 14, color: [[1, '#e2e8f0']] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#0f172a',
          fontSize: 36,
          fontFamily: 'Noto Serif SC',
          offsetCenter: [0, '10%'],
        },
        title: { offsetCenter: [0, '55%'], color: '#64748b', fontSize: 13 },
        data: [{ value: score, name: '密评合规分' }],
      },
    ],
  }
})

const categoryOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  radar: {
    indicator: (stats.value?.byCategory || []).map((i) => ({
      name: CATEGORY_LABELS[i.name as CheckCategory] || i.name,
      max: 100,
    })),
    radius: '62%',
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: (stats.value?.byCategory || []).map((i) => i.value),
          name: '合规率',
          areaStyle: { color: 'rgba(6,182,212,0.2)' },
          lineStyle: { color: '#0891b2' },
          itemStyle: { color: '#06b6d4' },
        },
      ],
    },
  ],
}))

const trendOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['完成率%', '待整改项'], bottom: 0 },
  grid: { left: 40, right: 40, top: 24, bottom: 40 },
  xAxis: {
    type: 'category',
    data: (stats.value?.trend || []).map((t) => t.day),
    axisLabel: { color: '#64748b' },
  },
  yAxis: [
    { type: 'value', name: '%', splitLine: { lineStyle: { color: '#e2e8f0' } } },
    { type: 'value', name: '项', splitLine: { show: false } },
  ],
  series: [
    {
      name: '完成率%',
      type: 'line',
      smooth: true,
      data: (stats.value?.trend || []).map((t) => t.rate),
      itemStyle: { color: '#06b6d4' },
      areaStyle: { color: 'rgba(6,182,212,0.08)' },
    },
    {
      name: '待整改项',
      type: 'bar',
      yAxisIndex: 1,
      data: (stats.value?.trend || []).map((t) => t.issues),
      itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
    },
  ],
}))

const statusOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 80, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: '#e2e8f0' } } },
  yAxis: {
    type: 'category',
    data: (stats.value?.byRemStatus || []).map(
      (i) => REM_STATUS_LABELS[i.name as RemStatus] || i.name,
    ),
  },
  series: [
    {
      type: 'bar',
      barWidth: 18,
      data: (stats.value?.byRemStatus || []).map((i) => i.value),
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#0891b2' },
            { offset: 1, color: '#22d3ee' },
          ],
        },
      },
    },
  ],
}))
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-xl text-sec-950">密评全景态势</h2>
        <p class="mt-1 text-sm text-slate-500">全省住建系统商用密码应用安全性评估完成率与风险分布</p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-full border border-sec-200 bg-sec-50 px-3 py-1 text-xs font-medium text-sec-800"
      >
        <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        实时监测中 · 本地 sql.js
      </div>
    </div>

    <LoadingSkeleton v-if="loading" />

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="纳管系统" :value="stats?.assetCount ?? 0" hint="含密码产品台账" accent="sec" />
        <StatCard
          title="高风险系统"
          :value="stats?.highRiskCount ?? 0"
          hint="需优先密评"
          accent="amber"
        />
        <StatCard
          title="未闭环整改"
          :value="stats?.openRemediations ?? 0"
          :hint="`其中严重 ${stats?.criticalIssues ?? 0}`"
          accent="rose"
        />
        <StatCard
          title="进行中任务"
          :value="stats?.taskOpen ?? 0"
          hint="自评 / 密评 / 复测"
          accent="emerald"
        />
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <div class="card-panel p-4">
          <h3 class="text-sm font-semibold text-slate-800">密评合规得分</h3>
          <EChart :option="scoreOption" height="260px" />
        </div>
        <div class="card-panel p-4 lg:col-span-2">
          <h3 class="text-sm font-semibold text-slate-800">完成率 / 待整改趋势</h3>
          <EChart :option="trendOption" height="260px" />
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="card-panel p-4">
          <h3 class="text-sm font-semibold text-slate-800">测评项合规雷达（物理/网络/设备/应用/数据）</h3>
          <EChart :option="categoryOption" height="280px" />
        </div>
        <div class="card-panel p-4">
          <h3 class="text-sm font-semibold text-slate-800">整改流程状态</h3>
          <EChart :option="statusOption" height="280px" />
        </div>
      </div>

      <div class="card-panel mt-4 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-800">最近审计动态</h3>
        <ul class="divide-y divide-slate-100">
          <li v-for="log in logs" :key="log.id" class="flex items-start justify-between gap-4 py-2.5 text-sm">
            <div>
              <p class="font-medium text-slate-800">{{ log.action }}</p>
              <p class="mt-0.5 text-xs text-slate-500">{{ log.details }}</p>
            </div>
            <div class="shrink-0 text-right text-xs text-slate-400">
              <p>{{ log.username || 'system' }}</p>
              <p class="font-mono">{{ log.created_at }}</p>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
