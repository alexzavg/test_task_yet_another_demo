/**
 * Test tags for categorizing and filtering tests
 * Usage: test('Test name', { tag: [tags.SMOKE, tags.SIGNUP] }, async () => {...})
 * Filter: npx playwright test --grep @smoke
 */
export const tags = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SIGNUP: '@signup',
}
