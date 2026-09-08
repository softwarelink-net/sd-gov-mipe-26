<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  hint?: string
  accent?: 'sec' | 'amber' | 'rose' | 'emerald'
}>()
</script>

<template>
  <div class="card-panel relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-md">
    <div
      class="absolute inset-y-0 left-0 w-1"
      :class="{
        'bg-sec-500': !accent || accent === 'sec',
        'bg-amber-500': accent === 'amber',
        'bg-rose-500': accent === 'rose',
        'bg-emerald-500': accent === 'emerald',
      }"
    />
    <p class="text-xs font-medium text-slate-500">{{ title }}</p>
    <p class="mt-2 font-display text-2xl font-semibold text-sec-950">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-slate-400">{{ hint }}</p>
  </div>
</template>
