import { test, expect } from '@playwright/test'

test('template: always fails', async () => {
  expect(true).toBe(false)
})
