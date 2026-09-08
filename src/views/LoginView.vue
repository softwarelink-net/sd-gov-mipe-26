<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('admin')
const password = ref('admin2026')
const showPwd = ref(false)

const demos = [
  { role: '超管', user: 'admin', pass: 'admin2026' },
  { role: '业务主管', user: 'manager', pass: 'manager2026' },
  { role: '基层经办', user: 'operator', pass: 'operator2026' },
  { role: '决策层', user: 'executive', pass: 'executive2026' },
]

async function onSubmit() {
  const ok = await auth.login(username.value.trim(), password.value)
  if (ok) {
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  }
}

function fillDemo(user: string, pass: string) {
  username.value = user
  password.value = pass
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <p class="font-display text-2xl text-white sm:text-3xl">山东省住建厅</p>
      <p class="mt-1 font-display text-xl text-sec-400">系统密评管理平台</p>
      <p class="mt-3 text-sm text-slate-400">2026 年度 · 商用密码安全性评估演示</p>
    </div>

    <form
      class="rounded-xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8"
      @submit.prevent="onSubmit"
    >
      <h2 class="text-lg font-semibold text-sec-950">身份认证</h2>
      <p class="mt-1 text-xs text-slate-500">演示账号登录，数据存储于浏览器本地 SQLite (sql.js)</p>

      <label class="mt-6 block text-sm font-medium text-slate-700">
        用户名
        <input v-model="username" type="text" class="input-field mt-1.5" autocomplete="username" required />
      </label>

      <label class="mt-4 block text-sm font-medium text-slate-700">
        密码
        <div class="relative mt-1.5">
          <input
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            class="input-field pr-16"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-sec-600"
            @click="showPwd = !showPwd"
          >
            {{ showPwd ? '隐藏' : '显示' }}
          </button>
        </div>
      </label>

      <p v-if="auth.error" class="mt-3 text-sm text-red-600">{{ auth.error }}</p>

      <button type="submit" class="btn-primary mt-6 w-full" :disabled="auth.loading">
        {{ auth.loading ? '登录中…' : '进入系统' }}
      </button>

      <div class="mt-6">
        <p class="mb-2 text-xs font-medium text-slate-500">快速填充演示账号</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="d in demos"
            :key="d.user"
            type="button"
            class="rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-left text-xs hover:border-sec-400 hover:bg-sec-50"
            @click="fillDemo(d.user, d.pass)"
          >
            <span class="font-medium text-sec-800">{{ d.role }}</span>
            <span class="mt-0.5 block font-mono text-slate-500">{{ d.user }}</span>
          </button>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-slate-500">
        <RouterLink to="/tender" class="text-sec-700 hover:underline">查看竞争性磋商公告</RouterLink>
      </p>
    </form>
  </div>
</template>
