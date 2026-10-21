import { defineConfig } from '@playwright/test'
import { smartReporter } from './playwright.config'

// `npx playwright merge-reports --config merge.config.ts <blob dir>` merges the CI shards' blob reports
// into one smart report. The blob dir must sit inside smart-report/: the merge extracts attachments to
// <blob dir>/resources, and the report links videos relative to itself, so they publish with it.
export default defineConfig({
  testDir: './tests',
  reporter: [smartReporter],
})
