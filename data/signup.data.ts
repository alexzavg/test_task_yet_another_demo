export type Placeholders = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type FormState = {
  placeholders: Placeholders
  homeClub: string
  plan: string
  level: string
}

export type Headline = {
  lines: string[]
  outlinedWord: string
  accentWord: string
}

export type Stat = {
  value: string
  label: string
}

export type Testimonial = {
  avatars: string[]
  rating: string
  stars: string
  quote: string
}

export const homeClubs = {
  downtown: 'Downtown',
  riverside: 'Riverside',
  northgate: 'Northgate',
  westfieldMall: 'Westfield Mall',
  harborPoint: 'Harbor Point',
}

export const homeClubPlaceholder = 'Choose a location'

export const plans = {
  basic: 'Basic',
  plus: 'Plus',
  elite: 'Elite',
}

export const planSummaries = {
  plus: 'Plus · $49/mo',
  elite: 'Elite · $79/mo',
}

export const goals = {
  loseWeight: 'Lose weight',
  buildMuscle: 'Build muscle',
  endurance: 'Endurance',
  flexibility: 'Flexibility',
  stressRelief: 'Stress relief',
  justVibes: 'Just vibes',
}

export const goalsGroupLabel = 'Your goals (pick any)'

export const noGoalsSummary = '—'

export const levels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const fieldLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  homeClub: 'Home club',
}

export const placeholders: Placeholders = {
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex@email.com',
  phone: '(555) 123-4567',
}

export const defaultFormState: FormState = {
  placeholders,
  homeClub: homeClubPlaceholder,
  plan: plans.plus,
  level: levels.beginner,
}

export const phoneNumber = {
  typed: '5551234567',
  formatted: '(555) 123-4567',
}

export const passCodePattern = /^PULSE-[A-Z0-9]{4}$/

export const summaryTerms = {
  plan: 'Plan',
  level: 'Level',
  goals: 'Goals',
  email: 'Confirmation sent to',
}

export const consentLinks = {
  terms: 'Terms',
  privacyPolicy: 'Privacy Policy',
}

export const accentColor = 'rgb(200, 255, 61)'

export const shortScrollDistance = 30

export const pageContent = {
  title: 'Pulse Fitness — Join the Club',
  navLinks: ['Classes', 'Clubs', 'Pricing'],
  pill: 'Now open 24/7 in 12 locations',
  headline: {
    lines: ['Stronger', 'starts', 'today.'],
    outlinedWord: 'starts',
    accentWord: 'today.',
  } satisfies Headline,
  stats: [
    { value: '12', label: 'Clubs citywide' },
    { value: '150+', label: 'Classes / week' },
    { value: '4.9', label: 'Member rating' },
  ] satisfies Stat[],
  lead: 'Premium equipment, coach-led classes and recovery zones — built for people who want results without the intimidation. Try everything free for a week.',
  testimonial: {
    avatars: ['JM', 'SK', 'DL'],
    rating: '5 out of 5 stars',
    stars: '★★★★★',
    quote: "Best gym I've joined. The coaches actually know your name.",
  } satisfies Testimonial,
  classes: ['HIIT', 'Spin', 'Boxing', 'Yoga', 'Pilates', 'Strength', 'Mobility', 'Rowing'],
  tickerSeparator: '✦',
  eyebrow: 'FREE 7-DAY PASS',
  subtitle: 'No commitment. Cancel anytime. Takes under a minute.',
  finePrint: 'Join 18,000+ members already training with Pulse.',
  consentLabel: 'I agree to the Terms and Privacy Policy and to be contacted about my free pass.',
}
