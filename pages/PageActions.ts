import type { Page, Response } from '@playwright/test'
import { step } from '../utils/stepDecorator'

// Shared low-level actions every page object inherits. Paths resolve against `use.baseURL`.
export class PageActions {
  constructor(protected readonly page: Page) {}

  @step('Navigate to path: {path}')
  async navigateTo(path: string): Promise<Response | null> {
    return this.page.goto(path)
  }
}
