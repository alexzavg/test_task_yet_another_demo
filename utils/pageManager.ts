import type { Page } from '@playwright/test'
import { SignupPage } from '../pages/SignupPage'
import { DataGenerator } from './dataGenerator'

export class PageManager {
  constructor(private readonly page: Page) {}

  get signupPage(): SignupPage {
    return new SignupPage(this.page)
  }

  get dataGenerator(): DataGenerator {
    return new DataGenerator()
  }
}
