<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-[calc(100vh-2.5rem)] bg-slate-50 px-4 py-10">
    <div class="card-panel mx-auto max-w-2xl p-8">
      <h1 class="font-display text-2xl text-sec-950">关于系统</h1>
      <p class="mt-3 text-sm leading-relaxed text-slate-600">
        本站点为山东省住建厅 2026 年度系统密评项目的数字化演示交付物，采用 Vue 3 + Vite + Pinia + sql.js
        纯前端架构，数据持久化于浏览器本地，无需后端即可完整演示密码基座、合规自测、测评协同与整改追踪流程。
      </p>
      <dl class="mt-6 space-y-3 text-sm">
        <div class="flex justify-between gap-4 border-b border-slate-100 py-2">
          <dt class="text-slate-500">上线域名</dt>
          <dd class="font-mono text-sec-700">https://sd-gov-mipe-26.softwarelink.net/</dd>
        </div>
        <div class="flex justify-between gap-4 border-b border-slate-100 py-2">
          <dt class="text-slate-500">项目仓库</dt>
          <dd class="font-mono text-xs text-sec-700">softwarelink-net/sd-gov-mipe-26</dd>
        </div>
        <div class="flex justify-between gap-4 border-b border-slate-100 py-2">
          <dt class="text-slate-500">项目编号</dt>
          <dd class="font-mono text-slate-700">SDGP370000000202602007474</dd>
        </div>
        <div class="flex justify-between gap-4 py-2">
          <dt class="text-slate-500">表前缀</dt>
          <dd class="font-mono text-slate-700">sd_mipe_</dd>
        </div>
      </dl>
      <div class="mt-8 flex gap-3">
        <RouterLink to="/login" class="btn-primary">登录</RouterLink>
        <RouterLink to="/tender" class="btn-secondary">磋商公告</RouterLink>
      </div>
    </div>
  </div>
</template>
