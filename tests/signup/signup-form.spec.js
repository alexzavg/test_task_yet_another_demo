import { test, step } from '../../utils/fixtures.js'
import { tags } from '../../utils/tags.js'
import { homeClubs, plans } from '../../data/signup.data.js'

test.describe('Signup Form - Free Pass', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.signupPage.open()
  })

  test(
    'A complete signup reserves a free pass and shows its pass code',
    { tag: [tags.SMOKE, tags.SIGNUP] },
    async ({ pageManager, annotations }) => {
      const member = pageManager.dataGenerator.generateMember()
      let passCode

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
})
