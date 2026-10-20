import { test, step } from '../../utils/fixtures'
import { tags } from '../../utils/tags'
import {
  homeClubs,
  homeClubPlaceholder,
  plans,
  planSummaries,
  goals,
  goalsGroupLabel,
  levels,
  fieldLabels,
  defaultFormState,
  phoneNumber,
  summaryTerms,
  consentLinks,
} from '../../data/signup.data'

test.describe('Signup Form - Free Pass', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.signupPage.open()
  })

  test(
    'A complete signup reserves a free pass and shows its pass code',
    { tag: [tags.SMOKE, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let passCode: string

      annotations['email'] = member.email
      annotations['pass code'] = () => passCode

      await step('Fill in the member details', async () => {
        await pageManager.signupPage.fillMemberDetails(member, homeClubs.downtown)
      })

      await step('Choose a plan and accept the terms', async () => {
        await pageManager.signupPage.choosePlan(plans.elite)
        await pageManager.signupPage.acceptTerms()
      })

      await step('Submit the form', async () => {
        await pageManager.signupPage.submit()
      })

      await step('Verify the confirmation greets the member and shows a pass code', async () => {
        await pageManager.signupPage.verifyPassConfirmed(member.firstName)
        passCode = await pageManager.signupPage.capturePassCode()
      })
    },
  )

  test(
    'Submitting an empty form flags the first name and focuses it',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Submit the empty form', async () => {
        await pageManager.signupPage.submit()
      })

      await step('Verify the first name error is shown and the field is focused', async () => {
        await pageManager.signupPage.verifyFirstNameError('Tell us your first name')
        await pageManager.signupPage.verifyFirstNameFocused()
      })
    },
  )

  test(
    'The signup form loads in its default state',
    { tag: [tags.SMOKE, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Verify every field, choice and the consent checkbox show their defaults with no errors', async () => {
        await pageManager.signupPage.verifyDefaultFormState(defaultFormState)
      })
    },
  )

  test(
    'The home club select lists the five clubs in order and the placeholder cannot be chosen',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Select Downtown as the home club', async () => {
        await pageManager.signupPage.selectHomeClub(homeClubs.downtown)
      })

      await step('Verify the five clubs can be chosen, in order', async () => {
        await pageManager.signupPage.verifyHomeClubOptions(Object.values(homeClubs))
      })

      await step('Verify Choose a location cannot be selected and Downtown stays selected', async () => {
        await pageManager.signupPage.verifyHomeClubOptionDisabled(homeClubPlaceholder)
        await pageManager.signupPage.verifyHomeClubShows(homeClubs.downtown)
      })
    },
  )

  test(
    'Clicking a selected goal chip deselects it',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Select the Endurance goal chip', async () => {
        await pageManager.signupPage.toggleGoal(goals.endurance)
        await pageManager.signupPage.verifySelectedGoals([goals.endurance])
      })

      await step('Click the Endurance goal chip again', async () => {
        await pageManager.signupPage.toggleGoal(goals.endurance)
      })

      await step('Verify no goal chip is selected', async () => {
        await pageManager.signupPage.verifyNoGoalSelected()
      })
    },
  )

  test(
    'Goal chips appear in the stated order and several can be selected at once',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Click the Lose weight, Flexibility and Just vibes goal chips', async () => {
        await pageManager.signupPage.toggleGoal(goals.loseWeight)
        await pageManager.signupPage.toggleGoal(goals.flexibility)
        await pageManager.signupPage.toggleGoal(goals.justVibes)
      })

      await step('Verify the goals group is labelled and lists the six chips in order', async () => {
        await pageManager.signupPage.verifyGoalsGroup(goalsGroupLabel, Object.values(goals))
      })

      await step('Verify only the three clicked goal chips are selected', async () => {
        await pageManager.signupPage.verifySelectedGoals([goals.loseWeight, goals.flexibility, goals.justVibes])
      })
    },
  )

  test(
    'Picking the Advanced experience level highlights only that level',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Verify Beginner is the only selected experience level', async () => {
        await pageManager.signupPage.verifyOnlySelectedLevel(levels.beginner)
      })

      await step('Choose the Advanced experience level', async () => {
        await pageManager.signupPage.chooseLevel(levels.advanced)
      })

      await step('Verify Advanced is the only selected experience level', async () => {
        await pageManager.signupPage.verifyOnlySelectedLevel(levels.advanced)
      })
    },
  )

  test(
    'The phone number is auto-formatted while typing',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Type ten digits into the Phone field', async () => {
        await pageManager.signupPage.typePhone(phoneNumber.typed)
      })

      await step('Verify the Phone field shows the formatted number', async () => {
        await pageManager.signupPage.verifyPhoneValue(phoneNumber.formatted)
      })
    },
  )

  test(
    'The whole form can be completed and submitted with the keyboard alone',
    { tag: [tags.SMOKE, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let passCode: string

      annotations['email'] = member.email
      annotations['pass code'] = () => passCode

      await step('Tab to each text field and type the member details', async () => {
        await pageManager.signupPage.tabToField(fieldLabels.firstName)
        await pageManager.signupPage.typeWithKeyboard(member.firstName)
        await pageManager.signupPage.tabToField(fieldLabels.lastName)
        await pageManager.signupPage.typeWithKeyboard(member.lastName)
        await pageManager.signupPage.tabToField(fieldLabels.email)
        await pageManager.signupPage.typeWithKeyboard(member.email)
        await pageManager.signupPage.tabToField(fieldLabels.phone)
        await pageManager.signupPage.typeWithKeyboard(member.phone)
      })

      await step('Tab to the home club select and type Downtown to select it', async () => {
        await pageManager.signupPage.tabToField(fieldLabels.homeClub)
        await pageManager.signupPage.typeWithKeyboard(homeClubs.downtown)
      })

      await step('Tab to the plan cards and move from Plus to Elite with the Right arrow key', async () => {
        await pageManager.signupPage.tabToSelectedPlan()
        await pageManager.signupPage.pressKey('ArrowRight')
      })

      await step('Tab to the Build muscle goal chip and select it with Space', async () => {
        await pageManager.signupPage.tabToGoal(goals.buildMuscle)
        await pageManager.signupPage.pressKey('Space')
      })

      await step('Tab to the experience level and move from Beginner to Intermediate with the Right arrow key', async () => {
        await pageManager.signupPage.tabToSelectedLevel()
        await pageManager.signupPage.pressKey('ArrowRight')
      })

      await step('Tab to the consent checkbox and check it with Space', async () => {
        await pageManager.signupPage.tabToConsent()
        await pageManager.signupPage.pressKey('Space')
      })

      await step('Tab to the Get my free pass button and press Enter', async () => {
        await pageManager.signupPage.tabToSubmit()
        await pageManager.signupPage.pressKey('Enter')
      })

      await step('Verify the confirmation card replaces the form and names the home club', async () => {
        await pageManager.signupPage.verifyConfirmationShownFor(member.firstName)
        await pageManager.signupPage.verifySignupFormHidden()
        await pageManager.signupPage.verifyFrontDeskMessage(homeClubs.downtown)
      })

      await step('Verify the summary shows the chosen plan, level, goal and email', async () => {
        await pageManager.signupPage.verifySummaryValue(summaryTerms.plan, planSummaries.elite)
        await pageManager.signupPage.verifySummaryValue(summaryTerms.level, levels.intermediate)
        await pageManager.signupPage.verifySummaryValue(summaryTerms.goals, goals.buildMuscle)
        await pageManager.signupPage.verifySummaryValue(summaryTerms.email, member.email)
        passCode = await pageManager.signupPage.capturePassCode()
      })
    },
  )

  test(
    'Tab reaches every form control with a visible focus indicator',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Tab through the text fields and the home club select, each showing a focus indicator', async () => {
        for (const label of Object.values(fieldLabels)) {
          await pageManager.signupPage.tabToField(label)
          await pageManager.signupPage.verifyFocusIndicatorVisible()
        }
      })

      await step('Tab to the selected plan card and verify its focus indicator', async () => {
        await pageManager.signupPage.tabToSelectedPlan()
        await pageManager.signupPage.verifyFocusIndicatorVisible()
      })

      await step('Tab through the six goal chips, each showing a focus indicator', async () => {
        for (const goal of Object.values(goals)) {
          await pageManager.signupPage.tabToGoal(goal)
          await pageManager.signupPage.verifyFocusIndicatorVisible()
        }
      })

      await step('Tab to the experience level segmented control and verify its focus indicator', async () => {
        await pageManager.signupPage.tabToSelectedLevel()
        await pageManager.signupPage.verifyFocusIndicatorVisible()
      })

      await step('Tab through the consent checkbox, its links and the submit button, each showing a focus indicator', async () => {
        await pageManager.signupPage.tabToConsent()
        await pageManager.signupPage.verifyFocusIndicatorVisible()
        for (const name of Object.values(consentLinks)) {
          await pageManager.signupPage.tabToConsentLink(name)
          await pageManager.signupPage.verifyFocusIndicatorVisible()
        }
        await pageManager.signupPage.tabToSubmit()
        await pageManager.signupPage.verifyFocusIndicatorVisible()
      })
    },
  )

  test(
    'Shift+Tab moves keyboard focus backwards',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      const member = pageManager.dataGenerator.generateMember()

      await step('Tab to the name and email fields and type the member details', async () => {
        await pageManager.signupPage.tabToField(fieldLabels.firstName)
        await pageManager.signupPage.typeWithKeyboard(member.firstName)
        await pageManager.signupPage.tabToField(fieldLabels.lastName)
        await pageManager.signupPage.typeWithKeyboard(member.lastName)
        await pageManager.signupPage.tabToField(fieldLabels.email)
        await pageManager.signupPage.typeWithKeyboard(member.email)
      })

      await step('Press Shift+Tab', async () => {
        await pageManager.signupPage.pressKey('Shift+Tab')
      })

      await step('Verify focus is back in the Last name field with a visible focus indicator', async () => {
        await pageManager.signupPage.verifyFieldFocused(fieldLabels.lastName)
        await pageManager.signupPage.verifyFocusIndicatorVisible()
      })
    },
  )
})
