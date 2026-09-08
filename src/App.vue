<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
</script>

<template>
  <GlobalStickyBanner />
  <div class="pt-10 min-h-full">
    <RouterView />
  </div>
</template>
