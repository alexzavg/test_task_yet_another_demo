import { expect } from '@playwright/test'
import { SignupPageLocators } from '../locators/SignupPageLocators.js'
import { PageActions } from './PageActions.js'

export class SignupPage extends PageActions {
  static stepNames = {
    open: 'Open the signup page',
    fillMemberDetails: 'Fill member details for {member} with home club {homeClub}',
    choosePlan: 'Choose the {planName} plan',
    submit: 'Submit the signup form',
    verifyFirstNameError: 'Verify the first name error reads: {message}',
    verifyPassConfirmed: 'Verify the pass is confirmed for {firstName}',
  }

  constructor(page) {
    super(page)
    this.locators = new SignupPageLocators(page)
  }

  async open() {
    await this.navigateTo('/')
    await this.locators.formHeading.waitFor({ state: 'visible' })
  }

  async fillMemberDetails(member, homeClub) {
    await this.locators.firstNameInput.fill(member.firstName)
    await this.locators.lastNameInput.fill(member.lastName)
    await this.locators.emailInput.fill(member.email)
    await this.locators.phoneInput.fill(member.phone)
    await this.locators.homeClubSelect.selectOption(homeClub)
  }

  async choosePlan(planName) {
    await this.locators.planOption(planName).click()
  }

  async acceptTerms() {
    await this.locators.consentCheckbox.check()
  }

  async submit() {
    await this.locators.submitButton.click()
  }

  async verifyFirstNameError(message) {
    await expect(this.locators.firstNameError).toHaveText(message)
  }

  async verifyFirstNameFocused() {
    await expect(this.locators.firstNameInput).toBeFocused()
  }

  async verifyPassConfirmed(firstName) {
    await expect(this.locators.confirmationHeading).toHaveText(`You're in, ${firstName}!`)
  }

  async capturePassCode() {
    await this.locators.passCode.waitFor({ state: 'visible' })
    return (await this.locators.passCode.textContent()).trim()
  }
}
