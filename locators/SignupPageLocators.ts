import type { Locator, Page } from '@playwright/test'

export class SignupPageLocators {
  constructor(private readonly page: Page) {}

  get logoLink(): Locator {
    return this.page.getByRole('link', { name: 'PULSE', exact: true }).describe('PULSE logo link')
  }

  get navLinks(): Locator {
    return this.page.locator('.nav__links').getByRole('link').describe('Nav bar links')
  }

  get memberLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Member login' }).describe('Member login button')
  }

  get hero(): Locator {
    return this.page.locator('.hero').describe('Hero section')
  }

  get heroPill(): Locator {
    return this.hero.locator('.pill').describe('Hero pill')
  }

  get headline(): Locator {
    return this.page.getByRole('heading', { level: 1 }).describe('Hero headline')
  }

  get headlineOutlinedWord(): Locator {
    return this.headline.locator('.outline').describe('Outlined headline word')
  }

  get headlineAccentWord(): Locator {
    return this.headline.locator('.accent').describe('Accent headline word')
  }

  get heartbeatLine(): Locator {
    return this.hero.locator('.pulse-line').describe('Heartbeat line graphic')
  }

  heroStatValue(label: string): Locator {
    return this.hero.getByRole('listitem').filter({ hasText: label }).locator('strong').describe(`${label} stat value`)
  }

  get heroLead(): Locator {
    return this.hero.locator('.hero__lead').describe('Hero lead text')
  }

  get testimonial(): Locator {
    return this.hero.locator('.testimonial').describe('Testimonial')
  }

  get testimonialAvatars(): Locator {
    return this.testimonial.locator('.avatars span').describe('Testimonial avatars')
  }

  get testimonialRating(): Locator {
    return this.testimonial.locator('.stars').describe('Testimonial star rating')
  }

  get testimonialQuote(): Locator {
    return this.testimonial.locator('p').describe('Testimonial quote')
  }

  get classTickerTrack(): Locator {
    return this.page.locator('.marquee__track').describe('Class ticker track')
  }

  get classTickerItems(): Locator {
    return this.classTickerTrack.locator('span').describe('Class ticker items')
  }

  get formHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Claim your spot' }).describe('Signup form heading')
  }

  get formEyebrow(): Locator {
    return this.page.locator('.form__head .eyebrow').describe('Signup form eyebrow')
  }

  get formSubtitle(): Locator {
    return this.page.locator('.form__head p').describe('Signup form subtitle')
  }

  field(label: string): Locator {
    return this.page.getByLabel(label, { exact: true }).describe(`${label} field`)
  }

  get firstNameInput(): Locator {
    return this.page.getByLabel('First name', { exact: true }).describe('First name input')
  }

  get firstNameError(): Locator {
    return this.page
      .locator('.field')
      .filter({ has: this.page.getByLabel('First name', { exact: true }) })
      .getByRole('alert')
      .describe('First name error')
  }

  get lastNameInput(): Locator {
    return this.page.getByLabel('Last name', { exact: true }).describe('Last name input')
  }

  get emailInput(): Locator {
    return this.page.getByLabel('Email', { exact: true }).describe('Email input')
  }

  get phoneInput(): Locator {
    return this.page.getByLabel('Phone', { exact: true }).describe('Phone input')
  }

  get homeClubSelect(): Locator {
    return this.page.getByLabel('Home club', { exact: true }).describe('Home club select')
  }

  get homeClubSelectedOption(): Locator {
    return this.homeClubSelect.locator('option:checked').describe('Selected home club option')
  }

  get homeClubChoosableOptions(): Locator {
    return this.homeClubSelect.getByRole('option', { disabled: false }).describe('Choosable home club options')
  }

  homeClubOption(name: string): Locator {
    return this.homeClubSelect.getByRole('option', { name, exact: true }).describe(`${name} home club option`)
  }

  get planGroup(): Locator {
    return this.page.getByRole('group', { name: 'Membership' }).describe('Membership plan group')
  }

  // The radio is visually hidden (sr-only), so the visible label card is the click target
  planOption(planName: string): Locator {
    return this.planGroup
      .locator('label')
      .filter({ has: this.page.getByText(planName, { exact: true }) })
      .describe(`${planName} plan option`)
  }

  planRadio(planName: string): Locator {
    return this.planOption(planName).getByRole('radio').describe(`${planName} plan radio`)
  }

  get selectedPlanRadios(): Locator {
    return this.planGroup.getByRole('radio', { checked: true }).describe('Selected plan radios')
  }

  get goalsGroup(): Locator {
    return this.page.getByRole('group', { name: /^Your goals/ }).describe('Goals group')
  }

  get goalOptions(): Locator {
    return this.goalsGroup.locator('label').describe('Goal chips')
  }

  goalOption(goal: string): Locator {
    return this.goalOptions.filter({ hasText: goal }).describe(`${goal} goal chip`)
  }

  goalCheckbox(goal: string): Locator {
    return this.goalsGroup.getByRole('checkbox', { name: goal, exact: true }).describe(`${goal} goal checkbox`)
  }

  get selectedGoalOptions(): Locator {
    return this.goalOptions
      .filter({ has: this.page.getByRole('checkbox', { checked: true }) })
      .describe('Selected goal chips')
  }

  get levelGroup(): Locator {
    return this.page.getByRole('group', { name: 'Experience level' }).describe('Experience level group')
  }

  levelOption(level: string): Locator {
    return this.levelGroup.locator('label').filter({ hasText: level }).describe(`${level} level option`)
  }

  levelRadio(level: string): Locator {
    return this.levelGroup.getByRole('radio', { name: level, exact: true }).describe(`${level} level radio`)
  }

  get selectedLevelRadios(): Locator {
    return this.levelGroup.getByRole('radio', { checked: true }).describe('Selected level radios')
  }

  get consentCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /I agree to the Terms/ }).describe('Terms consent checkbox')
  }

  consentLink(name: string): Locator {
    return this.page.locator('.consent').getByRole('link', { name, exact: true }).describe(`${name} consent link`)
  }

  get errorMessages(): Locator {
    return this.page.locator('form').getByRole('alert').describe('Form error messages')
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Get my free pass' }).describe('Get my free pass button')
  }

  get submitButtonIcon(): Locator {
    return this.submitButton.locator('svg').describe('Get my free pass arrow icon')
  }

  get finePrint(): Locator {
    return this.page.locator('form .fine').describe('Signup form fine print')
  }

  get confirmation(): Locator {
    return this.page.getByRole('status').describe('Pass confirmation card')
  }

  get confirmationHeading(): Locator {
    return this.confirmation.getByRole('heading', { level: 2 }).describe('Pass confirmation heading')
  }

  get confirmationMessage(): Locator {
    return this.confirmation.getByText(/front desk of/).describe('Front desk message')
  }

  get passCode(): Locator {
    return this.confirmation.locator('.pass__code').describe('Pass code')
  }

  summaryValue(term: string): Locator {
    return this.confirmation
      .locator('.summary > div')
      .filter({ has: this.page.getByText(term, { exact: true }) })
      .getByRole('definition')
      .describe(`${term} summary value`)
  }

  get signUpSomeoneElseButton(): Locator {
    return this.confirmation
      .getByRole('button', { name: 'Sign up someone else' })
      .describe('Sign up someone else button')
  }
}
