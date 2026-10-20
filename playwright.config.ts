import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

// `test_env` comes from the npm scripts (cross-env) and selects `.env.<test_env>`; without it, `.env.local`
const testEnv = process.env.test_env ?? 'local'
dotenv.config({ path: `.env.${testEnv}`, override: true, quiet: true })

const BASE_URL = process.env.BASE_URL
if (!BASE_URL) throw new Error(`BASE_URL is not set: add it to .env.${testEnv}`)

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    // smart-reporter resolves paths from testDir, hence the '../'
    ['playwright-smart-reporter', {
      outputFile: '../smart-report/index.html',
      historyFile: '../smart-report/test-history.json',
    }],
  ],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
  },
})
