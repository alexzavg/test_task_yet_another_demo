import { test as base } from '@playwright/test'
import { PageManager } from './pageManager'

// Name of the attachment mirroring the annotations into the trace
const attachmentName = 'test deliverables'

type Fixtures = {
  pageManager: PageManager
  annotations: Record<string, unknown>
}

export const test = base.extend<Fixtures>({
  pageManager: async ({ page }, use) => {
    await use(new PageManager(page))
  },

  // Collects this run's test deliverables (generated emails, pass codes), declared in one block
  // at the top of the test. A value the test only obtains later is registered as a thunk and
  // resolved here, on teardown. Teardown runs on pass and on failure, so a failed test still
  // reports everything it got as far as.
  annotations: async ({}, use, testInfo) => {
    const collected: Record<string, unknown> = {}
    await use(collected)
    const lines: string[] = []
    for (const [type, value] of Object.entries(collected)) {
      let resolved: unknown
      try {
        resolved = typeof value === 'function' ? value() : value
      } catch {
        continue // the test failed before this value came into scope
      }
      if (resolved === undefined || resolved === null || resolved === '') continue
      const description = String(resolved)
      testInfo.annotations.push({ type, description })
      lines.push(`${type}: ${description}`)
    }
    // The trace viewer reads annotations off the test case, not the result, so runtime ones never
    // reach its Annotations tab. Attachments do reach the trace, so the same values ship there too.
    if (lines.length) await testInfo.attach(attachmentName, { body: lines.join('\n'), contentType: 'text/plain' })
  },
})

// Spec-level step: a readable block in the report, trace and UI mode
export const step = <T>(name: string, body: () => Promise<T>): Promise<T> => test.step(name, body)
