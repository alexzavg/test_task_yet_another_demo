export class SignupPageLocators {
  constructor(page) {
    this.page = page
  }

  get formHeading() {
    return this.page.getByRole('heading', { name: 'Claim your spot' }).describe('Signup form heading')
  }

  get firstNameInput() {
    return this.page.getByLabel('First name', { exact: true }).describe('First name input')
  }

  get firstNameError() {
    return this.page
      .locator('.field')
      .filter({ has: this.page.getByLabel('First name', { exact: true }) })
      .getByRole('alert')
      .describe('First name error')
  }

  get lastNameInput() {
    return this.page.getByLabel('Last name', { exact: true }).describe('Last name input')
  }

  get emailInput() {
    return this.page.getByLabel('Email', { exact: true }).describe('Email input')
  }

  get phoneInput() {
    return this.page.getByLabel('Phone', { exact: true }).describe('Phone input')
  }

  get homeClubSelect() {
    return this.page.getByLabel('Home club', { exact: true }).describe('Home club select')
  }

  // The radio is visually hidden (sr-only), so the visible label card is the click target
  planOption(planName) {
    return this.page
      .getByRole('group', { name: 'Membership' })
      .locator('label')
      .filter({ hasText: planName })
      .describe(`${planName} plan option`)
  }

  get consentCheckbox() {
    return this.page.getByRole('checkbox', { name: /I agree to the Terms/ }).describe('Terms consent checkbox')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Get my free pass' }).describe('Get my free pass button')
  }

  get confirmation() {
    return this.page.getByRole('status').describe('Pass confirmation card')
  }

  get confirmationHeading() {
    return this.confirmation.getByRole('heading', { level: 2 }).describe('Pass confirmation heading')
  }

  get passCode() {
    return this.confirmation.locator('.pass__code').describe('Pass code')
  }
}
