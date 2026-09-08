import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { UserRole } from '@/types'

const ALL_ROLES: UserRole[] = ['super_admin', 'biz_manager', 'operator', 'executive']

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { public: true, title: '登录' },
      },
    ],
  },
  {
    path: '/tender',
    name: 'tender',
    component: () => import('@/views/TenderView.vue'),
    meta: { public: true, title: '竞争性磋商公告' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { public: true, title: '关于系统' },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '密评全景态势', roles: ALL_ROLES },
      },
      {
        path: 'assets',
        name: 'assets',
        component: () => import('@/views/AssetsView.vue'),
        meta: { title: '资产与密码基座', roles: ['super_admin', 'biz_manager', 'operator'] },
      },
      {
        path: 'assessment',
        name: 'assessment',
        component: () => import('@/views/AssessmentView.vue'),
        meta: { title: '合规自测引擎', roles: ['super_admin', 'biz_manager', 'operator'] },
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/views/TasksView.vue'),
        meta: { title: '测评协同工作台', roles: ['super_admin', 'biz_manager', 'operator'] },
      },
      {
        path: 'remediation',
        name: 'remediation',
        component: () => import('@/views/RemediationView.vue'),
        meta: { title: '风险整改追踪', roles: ['super_admin', 'biz_manager', 'operator'] },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/ReportsView.vue'),
        meta: { title: '密评报告', roles: ALL_ROLES },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: '系统设置', roles: ['super_admin'] },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const publicPaths = ['/login', '/tender', '/about']
  const isPublic = to.meta.public === true || publicPaths.includes(to.path)

  if (!token && !isPublic) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (token && to.path === '/login') {
    next('/dashboard')
    return
  }

  const rawUser = localStorage.getItem('auth_user')
  if (token && rawUser && to.meta.roles) {
    try {
      const user = JSON.parse(rawUser) as { role: string }
      const roles = to.meta.roles as string[]
      if (!roles.includes(user.role)) {
        next('/dashboard')
        return
      }
    } catch {
      next('/login')
      return
    }
  }

  next()
})

export default router
