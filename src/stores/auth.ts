import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { dbService } from '@/db/service'
import type { User, UserRole } from '@/types'
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const role = computed<UserRole | null>(() => user.value?.role ?? null)
  const roleLabel = computed(() => (role.value ? ROLE_LABELS[role.value] : ''))
  const permissions = computed(() => (role.value ? ROLE_PERMISSIONS[role.value] : []))

  function hydrate() {
    const raw = localStorage.getItem(USER_KEY)
    if (raw && token.value) {
      try {
        user.value = JSON.parse(raw) as User
      } catch {
        logout()
      }
    }
  }

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const result = await dbService.login(username, password)
      if (!result) {
        error.value = '用户名或密码错误'
        return false
      }
      user.value = result
      token.value = `tok_${result.id}_${Date.now()}`
      localStorage.setItem(TOKEN_KEY, token.value)
      localStorage.setItem(USER_KEY, JSON.stringify(result))
      return true
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function hasPermission(key: string) {
    return permissions.value.some(
      (p) => p === key || p.startsWith(`${key}:`) || key.startsWith(`${p}:`),
    )
  }

  hydrate()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    role,
    roleLabel,
    permissions,
    login,
    logout,
    hasPermission,
    hydrate,
  }
})
