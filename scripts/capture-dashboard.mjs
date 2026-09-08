#!/usr/bin/env node
/**
 * Capture dashboard screenshot for README after local preview is up.
 * Usage: node scripts/capture-dashboard.mjs [baseUrl]
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const out = join(root, 'docs/assets/dashboard-preview.png')
const base = process.argv[2] || 'http://127.0.0.1:4173'

mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

try {
  await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.evaluate(() => {
    localStorage.removeItem('sd_gov_mipe_26_sqlite_v1')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  })
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('input[autocomplete="username"]', { timeout: 60000 })
  await page.waitForFunction(() => !document.body.innerText.includes('系统初始化失败'), {
    timeout: 30000,
  })
  await page.fill('input[autocomplete="username"]', 'admin')
  await page.fill('input[autocomplete="current-password"]', 'admin2026')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard**', { timeout: 60000 })
  await page.waitForSelector('text=密评全景态势', { timeout: 30000 })
  await page.waitForSelector('canvas', { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(3500)
  await page.screenshot({ path: out, fullPage: false })
  console.log(`Saved ${out} (${page.url()})`)
} finally {
  await browser.close()
}
