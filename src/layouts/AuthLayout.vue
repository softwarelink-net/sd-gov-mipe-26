<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="relative flex min-h-[calc(100vh-2.5rem)] items-center justify-center overflow-hidden bg-sec-950 px-4 py-10"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-70"
      style="
        background:
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(6, 182, 212, 0.22), transparent 55%),
          radial-gradient(ellipse 60% 40% at 80% 70%, rgba(34, 211, 238, 0.12), transparent 50%),
          radial-gradient(ellipse 40% 30% at 50% 90%, rgba(14, 116, 144, 0.18), transparent 45%);
      "
    />
    <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="white" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <div class="relative z-10 w-full max-w-md">
      <RouterView />
    </div>
  </div>
</template>
