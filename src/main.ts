import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initDatabase } from './db/service'
import './styles/main.css'

async function bootstrap() {
  await initDatabase()
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap app:', err)
  document.body.innerHTML = `
    <div style="font-family:sans-serif;padding:40px;text-align:center;color:#0f172a">
      <h1>系统初始化失败</h1>
      <p>无法加载本地数据库引擎，请刷新页面重试。</p>
      <pre style="text-align:left;max-width:640px;margin:20px auto;background:#f1f5f9;padding:16px;border-radius:8px;overflow:auto">${String(err)}</pre>
    </div>
  `
})
