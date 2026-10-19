import { SignupPage } from '../pages/SignupPage.js'
import { DataGenerator } from './dataGenerator.js'

export class PageManager {
  constructor(page) {
    this.page = page
  }

  get signupPage() {
    return new SignupPage(this.page)
  }

  get dataGenerator() {
    return new DataGenerator()
  }
}
