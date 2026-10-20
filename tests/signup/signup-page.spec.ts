import { test, step } from '../../utils/fixtures'
import { tags } from '../../utils/tags'
import { accentColor, consentLinks, pageContent, shortScrollDistance } from '../../data/signup.data'

test.describe('Signup Page - Content and Navigation', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.signupPage.open()
  })

  test(
    'The desktop page shows the tab title, nav bar, hero, testimonial, form header, call to action, consent label and class ticker',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Verify the browser tab title', async () => {
        await pageManager.signupPage.verifyPageTitle(pageContent.title)
      })

      await step('Verify the nav bar shows the PULSE logo, the nav links and Member login', async () => {
        await pageManager.signupPage.verifyNavBar(pageContent.navLinks)
      })

      await step('Verify the hero pill', async () => {
        await pageManager.signupPage.verifyHeroPill(pageContent.pill)
      })

      await step('Verify the headline styling and the heartbeat line graphic', async () => {
        await pageManager.signupPage.verifyHeadlineStyle(pageContent.headline, accentColor)
        await pageManager.signupPage.verifyHeartbeatLine()
      })

      await step('Verify the hero stats', async () => {
        await pageManager.signupPage.verifyHeroStats(pageContent.stats)
      })

      await step('Verify the hero lead text', async () => {
        await pageManager.signupPage.verifyHeroLead(pageContent.lead)
      })

      await step('Verify the testimonial avatars, rating and quote', async () => {
        await pageManager.signupPage.verifyTestimonial(pageContent.testimonial)
      })

      await step('Verify the class ticker scrolls and lists every class', async () => {
        await pageManager.signupPage.verifyClassTicker(pageContent.classes, pageContent.tickerSeparator)
      })

      await step('Verify the signup form card header', async () => {
        await pageManager.signupPage.verifyFormHeader(pageContent.eyebrow, pageContent.subtitle)
      })

      await step('Verify the Get my free pass button and its fine print', async () => {
        await pageManager.signupPage.verifyCallToAction(pageContent.finePrint)
      })

      await step('Verify the consent label and its Terms and Privacy Policy links', async () => {
        await pageManager.signupPage.verifyConsentLabel(pageContent.consentLabel, Object.values(consentLinks))
      })

      await step('Verify the headline is shown on three lines', async () => {
        await pageManager.signupPage.verifyHeadlineLines(pageContent.headline.lines)
      })
    },
  )

  test(
    'Clicking the PULSE logo takes the user back to the top of the page',
    { tag: [tags.REGRESSION, tags.SIGNUP] },
    async ({ pageManager }) => {
      await step('Scroll down a short way with the logo still in view', async () => {
        await pageManager.signupPage.scrollDownBy(shortScrollDistance)
        await pageManager.signupPage.verifyLogoInViewport()
      })

      await step('Click the PULSE logo in the nav bar', async () => {
        await pageManager.signupPage.clickLogo()
      })

      await step('Verify the page is scrolled back to the top', async () => {
        await pageManager.signupPage.verifyScrolledToTop()
      })
    },
  )
})
