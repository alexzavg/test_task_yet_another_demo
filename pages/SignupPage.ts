import { expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import type { FormState, Headline, Placeholders, Stat, Testimonial } from '../data/signup.data'
import { SignupPageLocators } from '../locators/SignupPageLocators'
import type { Member } from '../utils/dataGenerator'
import { step } from '../utils/stepDecorator'
import { PageActions } from './PageActions'

const TRANSPARENT = 'rgba(0, 0, 0, 0)'
const MAX_TAB_PRESSES = 40

// Words of the element's text grouped by the rendered line they sit on, top to bottom
const renderedLines = (element: Element): string[] => {
  const lines = new Map<number, string[]>()
  const range = document.createRange()
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    for (const word of (node.textContent ?? '').matchAll(/\S+/g)) {
      const start = word.index ?? 0
      range.setStart(node, start)
      range.setEnd(node, start + word[0].length)
      const top = Math.round(range.getBoundingClientRect().top)
      lines.set(top, [...(lines.get(top) ?? []), word[0]])
    }
  }
  return [...lines.entries()].sort(([a], [b]) => a - b).map(([, words]) => words.join(' '))
}

// A drawn outline or a zero-offset spread ring counts as a focus indicator. Visually hidden inputs
// (sr-only radios and checkboxes, the transparent consent checkbox) show it on their visible box instead.
const focusIndicatorVisible = (): boolean => {
  const focused = document.activeElement
  if (!focused) return false
  const box = focused.getBoundingClientRect()
  const hidden = box.width <= 1 || box.height <= 1 || getComputedStyle(focused).opacity === '0'
  const indicators = hidden ? [focused.nextElementSibling, focused.closest('label')] : [focused]
  return indicators.some((element) => {
    if (!element) return false
    const style = getComputedStyle(element)
    const outlined = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
    return outlined || /0px 0px 0px [1-9]/.test(style.boxShadow)
  })
}

const tabUntilFocused = async (page: Page, target: Locator): Promise<void> => {
  for (let presses = 0; presses < MAX_TAB_PRESSES; presses++) {
    if (await target.evaluate((element) => element === document.activeElement)) break
    await page.keyboard.press('Tab')
  }
  await expect(target).toBeFocused()
}

export class SignupPage extends PageActions {
  readonly locators: SignupPageLocators

  constructor(page: Page) {
    super(page)
    this.locators = new SignupPageLocators(page)
  }

  @step('Open the signup page')
  async open(): Promise<void> {
    await this.navigateTo('/')
    await this.locators.formHeading.waitFor({ state: 'visible' })
  }

  @step('Scroll the page down by {pixels}px')
  async scrollDownBy(pixels: number): Promise<void> {
    await this.page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), pixels)
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(pixels)
  }

  @step('Click the PULSE logo')
  async clickLogo(): Promise<void> {
    await this.locators.logoLink.click()
  }

  @step('Verify the PULSE logo is in view')
  async verifyLogoInViewport(): Promise<void> {
    await expect(this.locators.logoLink).toBeInViewport()
  }

  @step('Verify the page is scrolled to the top')
  async verifyScrolledToTop(): Promise<void> {
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0)
  }

  @step('Verify the tab title is {title}')
  async verifyPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title)
  }

  @step('Verify the nav bar shows the logo, {links} and Member login')
  async verifyNavBar(links: string[]): Promise<void> {
    await this.locators.logoLink.waitFor({ state: 'visible' })
    await expect(this.locators.navLinks).toHaveText(links)
    await this.locators.memberLoginLink.waitFor({ state: 'visible' })
    const logoBox = await this.locators.logoLink.boundingBox()
    const linksBox = await this.locators.navLinks.first().boundingBox()
    expect(logoBox!.x + logoBox!.width).toBeLessThan(linksBox!.x)
  }

  @step('Verify the hero pill reads: {text}')
  async verifyHeroPill(text: string): Promise<void> {
    await expect(this.locators.heroPill).toHaveText(text)
  }

  @step('Verify the headline is laid out on the lines {lines}')
  async verifyHeadlineLines(lines: string[]): Promise<void> {
    await expect.poll(() => this.locators.headline.evaluate(renderedLines)).toEqual(lines)
  }

  @step('Verify the headline styling: solid, outlined and accent words')
  async verifyHeadlineStyle(headline: Headline, accentColor: string): Promise<void> {
    await expect(this.locators.headline).not.toHaveCSS('color', TRANSPARENT)
    await expect(this.locators.headline).toHaveCSS('-webkit-text-stroke-width', '0px')
    await expect(this.locators.headlineOutlinedWord).toHaveText(headline.outlinedWord)
    await expect(this.locators.headlineOutlinedWord).toHaveCSS('color', TRANSPARENT)
    await expect(this.locators.headlineOutlinedWord).not.toHaveCSS('-webkit-text-stroke-width', '0px')
    await expect(this.locators.headlineAccentWord).toHaveText(headline.accentWord)
    await expect(this.locators.headlineAccentWord).toHaveCSS('color', accentColor)
  }

  @step('Verify the heartbeat line graphic is shown')
  async verifyHeartbeatLine(): Promise<void> {
    await this.locators.heartbeatLine.waitFor({ state: 'visible' })
  }

  @step('Verify the hero stats')
  async verifyHeroStats(stats: Stat[]): Promise<void> {
    for (const { label, value } of stats) {
      await expect(this.locators.heroStatValue(label)).toHaveText(value)
    }
  }

  @step('Verify the hero lead text')
  async verifyHeroLead(text: string): Promise<void> {
    await expect(this.locators.heroLead).toHaveText(text)
  }

  @step('Verify the testimonial')
  async verifyTestimonial(testimonial: Testimonial): Promise<void> {
    await expect(this.locators.testimonialAvatars).toHaveText(testimonial.avatars)
    await expect(this.locators.testimonialRating).toHaveAttribute('aria-label', testimonial.rating)
    await expect(this.locators.testimonialRating).toHaveText(testimonial.stars)
    await expect(this.locators.testimonialQuote).toContainText(testimonial.quote)
  }

  @step('Verify the class ticker scrolls and lists {classes}')
  async verifyClassTicker(classes: string[], separator: string): Promise<void> {
    await expect(this.locators.classTickerItems).toContainText(classes.map((name) => `${name}${separator}`))
    await expect(this.locators.classTickerItems).toContainText(
      classes.map((name) => name.toUpperCase()),
      { useInnerText: true },
    )
    const readTransform = () => this.locators.classTickerTrack.evaluate((element) => getComputedStyle(element).transform)
    const start = await readTransform()
    await expect.poll(readTransform).not.toBe(start)
  }

  @step('Verify the form header shows {eyebrow}')
  async verifyFormHeader(eyebrow: string, subtitle: string): Promise<void> {
    await expect(this.locators.formEyebrow).toHaveText(eyebrow, { useInnerText: true })
    await this.locators.formHeading.waitFor({ state: 'visible' })
    await expect(this.locators.formSubtitle).toHaveText(subtitle)
  }

  @step('Verify the Get my free pass button and its fine print')
  async verifyCallToAction(finePrint: string): Promise<void> {
    await this.locators.submitButton.waitFor({ state: 'visible' })
    await this.locators.submitButtonIcon.waitFor({ state: 'visible' })
    await expect(this.locators.finePrint).toHaveText(finePrint)
  }

  @step('Verify the consent label and its links')
  async verifyConsentLabel(label: string, links: string[]): Promise<void> {
    await expect(this.locators.consentCheckbox).toHaveAccessibleName(label)
    for (const name of links) {
      await this.locators.consentLink(name).waitFor({ state: 'visible' })
    }
  }

  @step('Fill member details for {member} with home club {homeClub}')
  async fillMemberDetails(member: Member, homeClub: string): Promise<void> {
    await this.locators.firstNameInput.fill(member.firstName)
    await this.locators.lastNameInput.fill(member.lastName)
    await this.locators.emailInput.fill(member.email)
    await this.locators.phoneInput.fill(member.phone)
    await this.locators.homeClubSelect.selectOption(homeClub)
  }

  @step('Select the {club} home club')
  async selectHomeClub(club: string): Promise<void> {
    await this.locators.homeClubSelect.selectOption(club)
  }

  @step('Verify the home club select shows {text}')
  async verifyHomeClubShows(text: string): Promise<void> {
    await expect(this.locators.homeClubSelectedOption).toHaveText(text)
  }

  @step('Verify the choosable home clubs are {clubs}')
  async verifyHomeClubOptions(clubs: string[]): Promise<void> {
    await expect(this.locators.homeClubChoosableOptions).toHaveText(clubs)
  }

  @step('Verify the {name} home club option is disabled')
  async verifyHomeClubOptionDisabled(name: string): Promise<void> {
    await expect(this.locators.homeClubOption(name)).toBeDisabled()
  }

  @step('Choose the {planName} plan')
  async choosePlan(planName: string): Promise<void> {
    await this.locators.planOption(planName).click()
  }

  @step('Verify {planName} is the only selected plan')
  async verifyOnlySelectedPlan(planName: string): Promise<void> {
    await expect(this.locators.selectedPlanRadios).toHaveCount(1)
    await expect(this.locators.planRadio(planName)).toBeChecked()
  }

  @step('Click the {goal} goal chip')
  async toggleGoal(goal: string): Promise<void> {
    await this.locators.goalOption(goal).click()
  }

  @step('Verify the {label} group lists {goalNames}')
  async verifyGoalsGroup(label: string, goalNames: string[]): Promise<void> {
    await expect(this.locators.goalsGroup).toHaveAccessibleName(label)
    await expect(this.locators.goalOptions).toHaveText(goalNames)
  }

  @step('Verify the selected goals are {goalNames}')
  async verifySelectedGoals(goalNames: string[]): Promise<void> {
    await expect(this.locators.selectedGoalOptions).toHaveText(goalNames)
  }

  @step('Verify no goal chip is selected')
  async verifyNoGoalSelected(): Promise<void> {
    await expect(this.locators.selectedGoalOptions).toHaveCount(0)
  }

  @step('Choose the {level} experience level')
  async chooseLevel(level: string): Promise<void> {
    await this.locators.levelOption(level).click()
  }

  @step('Verify {level} is the only selected experience level')
  async verifyOnlySelectedLevel(level: string): Promise<void> {
    await expect(this.locators.selectedLevelRadios).toHaveCount(1)
    await expect(this.locators.levelRadio(level)).toBeChecked()
  }

  @step('Type {digits} into the phone field')
  async typePhone(digits: string): Promise<void> {
    await this.locators.phoneInput.click()
    await this.locators.phoneInput.pressSequentially(digits)
  }

  @step('Verify the phone field shows {value}')
  async verifyPhoneValue(value: string): Promise<void> {
    await expect(this.locators.phoneInput).toHaveValue(value)
  }

  @step('Verify the text fields are empty and show their placeholders')
  async verifyEmptyFieldsShowPlaceholders(placeholders: Placeholders): Promise<void> {
    const fields: [Locator, string][] = [
      [this.locators.firstNameInput, placeholders.firstName],
      [this.locators.lastNameInput, placeholders.lastName],
      [this.locators.emailInput, placeholders.email],
      [this.locators.phoneInput, placeholders.phone],
    ]
    for (const [field, placeholder] of fields) {
      await expect(field).toHaveValue('')
      await expect(field).toHaveAttribute('placeholder', placeholder)
    }
  }

  @step()
  async acceptTerms(): Promise<void> {
    await this.locators.consentCheckbox.check()
  }

  @step('Verify the consent checkbox is unchecked')
  async verifyConsentUnchecked(): Promise<void> {
    await expect(this.locators.consentCheckbox).not.toBeChecked()
  }

  @step('Verify no error message is shown')
  async verifyNoErrorShown(): Promise<void> {
    await expect(this.locators.errorMessages).toHaveCount(0)
  }

  @step('Verify the signup form is in its default state')
  async verifyDefaultFormState(state: FormState): Promise<void> {
    await this.verifyEmptyFieldsShowPlaceholders(state.placeholders)
    await this.verifyHomeClubShows(state.homeClub)
    await this.verifyOnlySelectedPlan(state.plan)
    await this.verifyNoGoalSelected()
    await this.verifyOnlySelectedLevel(state.level)
    await this.verifyConsentUnchecked()
    await this.verifyNoErrorShown()
  }

  @step('Verify the signup form card is shown in place of the confirmation card')
  async verifySignupFormShown(): Promise<void> {
    await this.locators.formHeading.waitFor({ state: 'visible' })
    await expect(this.locators.confirmation).toBeHidden()
  }

  @step('Verify the signup form card is no longer shown')
  async verifySignupFormHidden(): Promise<void> {
    await expect(this.locators.formHeading).toBeHidden()
  }

  @step('Submit the signup form')
  async submit(): Promise<void> {
    await this.locators.submitButton.click()
  }

  @step('Tab to the {label} field')
  async tabToField(label: string): Promise<void> {
    await tabUntilFocused(this.page, this.locators.field(label))
  }

  @step('Tab to the selected plan card')
  async tabToSelectedPlan(): Promise<void> {
    await tabUntilFocused(this.page, this.locators.selectedPlanRadios)
  }

  @step('Tab to the {goal} goal chip')
  async tabToGoal(goal: string): Promise<void> {
    await tabUntilFocused(this.page, this.locators.goalCheckbox(goal))
  }

  @step('Tab to the selected experience level')
  async tabToSelectedLevel(): Promise<void> {
    await tabUntilFocused(this.page, this.locators.selectedLevelRadios)
  }

  @step('Tab to the consent checkbox')
  async tabToConsent(): Promise<void> {
    await tabUntilFocused(this.page, this.locators.consentCheckbox)
  }

  @step('Tab to the {name} link')
  async tabToConsentLink(name: string): Promise<void> {
    await tabUntilFocused(this.page, this.locators.consentLink(name))
  }

  @step('Tab to the Get my free pass button')
  async tabToSubmit(): Promise<void> {
    await tabUntilFocused(this.page, this.locators.submitButton)
  }

  @step('Type {text}')
  async typeWithKeyboard(text: string): Promise<void> {
    await this.page.keyboard.type(text)
  }

  @step('Press {key}')
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key)
  }

  @step('Verify the {label} field has keyboard focus')
  async verifyFieldFocused(label: string): Promise<void> {
    await expect(this.locators.field(label)).toBeFocused()
  }

  @step('Verify the focused control shows a visible focus indicator')
  async verifyFocusIndicatorVisible(): Promise<void> {
    await expect.poll(() => this.page.evaluate(focusIndicatorVisible)).toBe(true)
  }

  @step('Verify the first name error reads: {message}')
  async verifyFirstNameError(message: string): Promise<void> {
    await expect(this.locators.firstNameError).toHaveText(message)
  }

  @step()
  async verifyFirstNameFocused(): Promise<void> {
    await expect(this.locators.firstNameInput).toBeFocused()
  }

  @step('Verify the pass is confirmed for {firstName}')
  async verifyPassConfirmed(firstName: string): Promise<void> {
    await expect(this.locators.confirmationHeading).toHaveText(`You're in, ${firstName}!`)
  }

  @step('Verify the confirmation card is shown for {firstName}')
  async verifyConfirmationShownFor(firstName: string): Promise<void> {
    await expect(this.locators.confirmationHeading).toContainText(firstName)
  }

  @step('Verify the front desk message names {club}')
  async verifyFrontDeskMessage(club: string): Promise<void> {
    await expect(this.locators.confirmationMessage).toHaveText(
      `Your 7-day pass is active. Show this code at the front desk of ${club}.`,
    )
  }

  @step('Verify the {term} summary value is {value}')
  async verifySummaryValue(term: string, value: string): Promise<void> {
    await expect(this.locators.summaryValue(term)).toHaveText(value)
  }

  @step()
  async capturePassCode(): Promise<string> {
    await this.locators.passCode.waitFor({ state: 'visible' })
    return ((await this.locators.passCode.textContent()) ?? '').trim()
  }

  @step('Verify the pass code matches {pattern}')
  async verifyPassCodeMatches(pattern: RegExp): Promise<void> {
    await expect(this.locators.passCode).toHaveText(pattern)
  }

  @step('Verify the pass code differs from {code}')
  async verifyPassCodeDiffersFrom(code: string): Promise<void> {
    await expect(this.locators.passCode).not.toHaveText(code)
  }

  @step('Click Sign up someone else')
  async signUpSomeoneElse(): Promise<void> {
    await this.locators.signUpSomeoneElseButton.click()
  }
}
