import { test, step } from '../../utils/fixtures'
import { tags } from '../../utils/tags'
import {
  defaultFormState,
  goals,
  homeClubs,
  levels,
  noGoalsSummary,
  passCodePattern,
  plans,
  summaryTerms,
} from '../../data/signup.data'

test.describe('Confirmation Card - Free Pass', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.signupPage.open()
  })

  test(
    'A signup without any goal shows a dash as the goals summary value',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let passCode: string

      annotations['email'] = member.email
      annotations['pass code'] = () => passCode

      await step('Fill in the member details with Harbor Point as the home club', async () => {
        await pageManager.signupPage.fillMemberDetails(member, homeClubs.harborPoint)
      })

      await step('Choose the Elite plan and the Advanced experience level', async () => {
        await pageManager.signupPage.choosePlan(plans.elite)
        await pageManager.signupPage.chooseLevel(levels.advanced)
      })

      await step('Accept the terms without selecting any goal', async () => {
        await pageManager.signupPage.acceptTerms()
      })

      await step('Submit the form', async () => {
        await pageManager.signupPage.submit()
      })

      await step('Verify the confirmation card is shown and the goals summary value is a dash', async () => {
        await pageManager.signupPage.verifyConfirmationShownFor(member.firstName)
        await pageManager.signupPage.verifySummaryValue(summaryTerms.goals, noGoalsSummary)
        passCode = await pageManager.signupPage.capturePassCode()
      })
    },
  )

  test(
    'Two signups in a row receive different pass codes',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let firstPassCode: string
      let secondPassCode: string

      annotations['email'] = member.email
      annotations['pass code'] = () => firstPassCode
      annotations['second pass code'] = () => secondPassCode

      await step('Fill in the member details with Downtown as the home club and accept the terms', async () => {
        await pageManager.signupPage.fillMemberDetails(member, homeClubs.downtown)
        await pageManager.signupPage.acceptTerms()
      })

      await step('Submit the form', async () => {
        await pageManager.signupPage.submit()
      })

      await step('Verify the first pass code matches the pass code format and note it', async () => {
        await pageManager.signupPage.verifyPassCodeMatches(passCodePattern)
        firstPassCode = await pageManager.signupPage.capturePassCode()
      })

      await step('Click Sign up someone else', async () => {
        await pageManager.signupPage.signUpSomeoneElse()
      })

      await step('Fill in the same member details and accept the terms', async () => {
        await pageManager.signupPage.fillMemberDetails(member, homeClubs.downtown)
        await pageManager.signupPage.acceptTerms()
      })

      await step('Submit the form again', async () => {
        await pageManager.signupPage.submit()
      })

      await step('Verify the second pass code matches the format and differs from the first', async () => {
        await pageManager.signupPage.verifyPassCodeMatches(passCodePattern)
        await pageManager.signupPage.verifyPassCodeDiffersFrom(firstPassCode)
        secondPassCode = await pageManager.signupPage.capturePassCode()
      })
    },
  )

  test(
    'Sign up someone else returns the empty default signup form card',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let passCode: string

      annotations['email'] = member.email
      annotations['pass code'] = () => passCode

      await step('Fill in the member details with Riverside as the home club', async () => {
        await pageManager.signupPage.fillMemberDetails(member, homeClubs.riverside)
      })

      await step('Choose the Elite plan, the Advanced level and the Build muscle and Stress relief goals', async () => {
        await pageManager.signupPage.choosePlan(plans.elite)
        await pageManager.signupPage.chooseLevel(levels.advanced)
        await pageManager.signupPage.toggleGoal(goals.buildMuscle)
        await pageManager.signupPage.toggleGoal(goals.stressRelief)
      })

      await step('Accept the terms and submit the form', async () => {
        await pageManager.signupPage.acceptTerms()
        await pageManager.signupPage.submit()
      })

      await step('Verify the confirmation card is shown for the member', async () => {
        await pageManager.signupPage.verifyConfirmationShownFor(member.firstName)
        passCode = await pageManager.signupPage.capturePassCode()
      })

      await step('Click Sign up someone else', async () => {
        await pageManager.signupPage.signUpSomeoneElse()
      })

      await step('Verify the signup form card is shown again in its empty default state', async () => {
        await pageManager.signupPage.verifySignupFormShown()
        await pageManager.signupPage.verifyDefaultFormState(defaultFormState)
      })
    },
  )
})
