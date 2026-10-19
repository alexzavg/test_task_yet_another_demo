import { wrapMethodsInSteps } from '../utils/stepWrapper.js'

// Shared low-level actions every page object inherits. Paths resolve against `use.baseURL`.
export class PageActions {
  static stepNames = {
    navigateTo: 'Navigate to path: {path}',
  }

  constructor(page) {
    this.page = page
    wrapMethodsInSteps(this)
  }

  async navigateTo(path) {
    return this.page.goto(path)
  }
}
