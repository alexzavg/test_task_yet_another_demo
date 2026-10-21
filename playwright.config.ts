import { defineConfig, devices } from '@playwright/test'
import type { ReporterDescription } from '@playwright/test'
import dotenv from 'dotenv'

// `test_env` comes from the npm scripts (cross-env) and selects `.env.<test_env>`; without it, `.env.local`
const testEnv = process.env.test_env ?? 'local'
dotenv.config({ path: `.env.${testEnv}`, override: true, quiet: true })

const BASE_URL = process.env.BASE_URL
if (!BASE_URL) throw new Error(`BASE_URL is not set: add it to .env.${testEnv}`)

const isCI = !!process.env.CI

// smart-reporter resolves paths from testDir, hence the '../'. merge.config.ts reuses it for the merged CI report
export const smartReporter: ReporterDescription = [
  'playwright-smart-reporter',
  {
    outputFile: '../smart-report/index.html',
    historyFile: '../smart-report/test-history.json',
  },
]

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: isCI,
  workers: isCI ? 4 : 1,
  retries: isCI ? 2 : 0,
  // Each CI shard writes a blob report; the report job merges them into one smart report
  reporter: isCI ? [['list'], ['blob']] : [['list'], smartReporter],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // CI serves the production build (`npm run build` runs first) on the BASE_URL port
  webServer: {
    command: isCI ? `npm run preview -- --port ${new URL(BASE_URL).port} --strictPort` : 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
  },
})
