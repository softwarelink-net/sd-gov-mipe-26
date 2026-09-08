<script setup lang="ts">
defineProps<{ rows?: number }>()
</script>

<template>
  <div class="animate-pulse space-y-4">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-24 rounded-lg bg-slate-200/80" />
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <div v-for="i in (rows || 2)" :key="`r-${i}`" class="h-64 rounded-lg bg-slate-200/80" />
    </div>
  </div>
</template>
