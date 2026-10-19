import { useId, useState } from 'react'

const PLANS = [
  { id: 'basic', name: 'Basic', price: 29, perks: ['Gym floor access', 'One home club'] },
  { id: 'plus', name: 'Plus', price: 49, perks: ['All 12 clubs', 'Unlimited classes'], popular: true },
  { id: 'elite', name: 'Elite', price: 79, perks: ['Everything in Plus', '2 PT sessions / mo'] },
]

const GOALS = ['Lose weight', 'Build muscle', 'Endurance', 'Flexibility', 'Stress relief', 'Just vibes']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const CLUBS = ['Downtown', 'Riverside', 'Northgate', 'Westfield Mall', 'Harbor Point']
const CLASSES = ['HIIT', 'Spin', 'Boxing', 'Yoga', 'Pilates', 'Strength', 'Mobility', 'Rowing']

const STATS = [
  { value: '12', label: 'Clubs citywide' },
  { value: '150+', label: 'Classes / week' },
  { value: '4.9', label: 'Member rating' },
]

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  club: '',
  plan: 'plus',
  goals: [],
  level: 'Beginner',
  consent: false,
}

function validate(form) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = 'Tell us your first name'
  if (!form.lastName.trim()) errors.lastName = 'Tell us your last name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Enter a valid email'
  if (form.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number'
  if (!form.club) errors.club = 'Pick your home club'
  if (!form.consent) errors.consent = 'Please accept to continue'
  return errors
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function makePassCode() {
  return `PULSE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function Field({ label, error, children, id }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <p className="field__error" id={`${id}-error`} role={error ? 'alert' : undefined}>
        {error}
      </p>
    </div>
  )
}

function PulseLine() {
  return (
    <svg className="pulse-line" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 40 H180 L205 40 L225 8 L250 72 L272 22 L290 40 H600" />
    </svg>
  )
}

function SignupForm({ onSuccess }) {
  const uid = useId()
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const errors = validate(form)
  const showError = (name) => (touched[name] || submitted) && errors[name]

  const update = (name, value) => setForm((f) => ({ ...f, [name]: value }))
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }))

  const toggleGoal = (goal) =>
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(goal) ? f.goals.filter((g) => g !== goal) : [...f.goals, goal],
    }))

  const inputProps = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: form[name],
    onChange: (e) => update(name, e.target.value),
    onBlur: blur(name),
    'aria-invalid': Boolean(showError(name)),
    'aria-describedby': `${uid}-${name}-error`,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const [firstError] = Object.keys(errors)
    if (firstError) {
      e.currentTarget.querySelector(`[name="${firstError}"]`)?.focus()
      return
    }
    setLoading(true)
    // Simulated API call
    setTimeout(() => {
      setLoading(false)
      onSuccess({ ...form, passCode: makePassCode() })
    }, 1200)
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <header className="form__head">
        <span className="eyebrow">Free 7-day pass</span>
        <h2>Claim your spot</h2>
        <p className="muted">No commitment. Cancel anytime. Takes under a minute.</p>
      </header>

      <div className="grid-2">
        <Field label="First name" id={`${uid}-firstName`} error={showError('firstName')}>
          <input {...inputProps('firstName')} autoComplete="given-name" placeholder="Alex" />
        </Field>
        <Field label="Last name" id={`${uid}-lastName`} error={showError('lastName')}>
          <input {...inputProps('lastName')} autoComplete="family-name" placeholder="Rivera" />
        </Field>
      </div>

      <div className="grid-2">
        <Field label="Email" id={`${uid}-email`} error={showError('email')}>
          <input {...inputProps('email')} type="email" autoComplete="email" placeholder="alex@email.com" />
        </Field>
        <Field label="Phone" id={`${uid}-phone`} error={showError('phone')}>
          <input
            {...inputProps('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(555) 123-4567"
            onChange={(e) => update('phone', formatPhone(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Home club" id={`${uid}-club`} error={showError('club')}>
        <div className="select">
          <select {...inputProps('club')} className={form.club ? undefined : 'is-empty'}>
            <option value="" disabled>
              Choose a location
            </option>
            {CLUBS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </Field>

      <fieldset className="group">
        <legend>Membership</legend>
        <div className="plans">
          {PLANS.map((p) => (
            <label key={p.id} className={`plan${form.plan === p.id ? ' plan--active' : ''}`}>
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={form.plan === p.id}
                onChange={() => update('plan', p.id)}
                className="sr-only"
              />
              {p.popular && <span className="plan__badge">Popular</span>}
              <span className="plan__name">{p.name}</span>
              <span className="plan__price">
                ${p.price}
                <small>/mo</small>
              </span>
              <ul className="plan__perks">
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>
          Your goals <span className="muted">(pick any)</span>
        </legend>
        <div className="chips">
          {GOALS.map((g) => (
            <label key={g} className={`chip${form.goals.includes(g) ? ' chip--active' : ''}`}>
              <input
                type="checkbox"
                checked={form.goals.includes(g)}
                onChange={() => toggleGoal(g)}
                className="sr-only"
              />
              {g}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>Experience level</legend>
        <div className="segmented" style={{ '--index': LEVELS.indexOf(form.level) }}>
          <span className="segmented__thumb" aria-hidden="true" />
          {LEVELS.map((l) => (
            <label key={l} className={form.level === l ? 'is-active' : ''}>
              <input
                type="radio"
                name="level"
                value={l}
                checked={form.level === l}
                onChange={() => update('level', l)}
                className="sr-only"
              />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`consent${showError('consent') ? ' consent--error' : ''}`}>
        <label className="check">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
            onBlur={blur('consent')}
            aria-invalid={Boolean(showError('consent'))}
            aria-describedby={`${uid}-consent-error`}
          />
          <span className="check__box" aria-hidden="true" />
          <span>
            I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a> and to be
            contacted about my free pass.
          </span>
        </label>
        <p className="field__error" id={`${uid}-consent-error`} role={showError('consent') ? 'alert' : undefined}>
          {showError('consent')}
        </p>
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" /> Reserving your pass…
          </>
        ) : (
          <>
            Get my free pass
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>
      <p className="fine muted">Join 18,000+ members already training with Pulse.</p>
    </form>
  )
}

function Success({ data, onReset }) {
  const plan = PLANS.find((p) => p.id === data.plan)
  return (
    <div className="card success" role="status">
      <div className="success__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h2>You're in, {data.firstName}!</h2>
      <p className="muted">
        Your 7-day pass is active. Show this code at the front desk of <strong>{data.club}</strong>.
      </p>
      <div className="pass">
        <span className="pass__label">Pass code</span>
        <span className="pass__code">{data.passCode}</span>
      </div>
      <dl className="summary">
        <div>
          <dt>Plan</dt>
          <dd>
            {plan.name} · ${plan.price}/mo
          </dd>
        </div>
        <div>
          <dt>Level</dt>
          <dd>{data.level}</dd>
        </div>
        <div>
          <dt>Goals</dt>
          <dd>{data.goals.length ? data.goals.join(', ') : '—'}</dd>
        </div>
        <div>
          <dt>Confirmation sent to</dt>
          <dd>{data.email}</dd>
        </div>
      </dl>
      <button className="btn btn--ghost" type="button" onClick={onReset}>
        Sign up someone else
      </button>
    </div>
  )
}

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="page">
      <div className="bg" aria-hidden="true">
        <span className="blob blob--lime" />
        <span className="blob blob--violet" />
        <span className="grid-overlay" />
      </div>

      <nav className="nav">
        <a className="logo" href="#top">
          <span className="logo__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M5 17h6l3-7 4 13 3-6h6" />
            </svg>
          </span>
          PULSE
        </a>
        <div className="nav__links">
          <a href="#classes">Classes</a>
          <a href="#clubs">Clubs</a>
          <a href="#pricing">Pricing</a>
        </div>
        <a className="nav__cta" href="#login">
          Member login
        </a>
      </nav>

      <main className="main" id="top">
        <section className="hero">
          <span className="pill">
            <span className="pill__dot" /> Now open 24/7 in 12 locations
          </span>
          <h1>
            Stronger
            <br />
            <span className="outline">starts</span> <span className="accent">today.</span>
          </h1>
          <PulseLine />
          <p className="hero__lead">
            Premium equipment, coach-led classes and recovery zones — built for people who want results without
            the intimidation. Try everything free for a week.
          </p>

          <ul className="stats">
            {STATS.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="testimonial">
            <div className="avatars" aria-hidden="true">
              <span style={{ '--h': 80 }}>JM</span>
              <span style={{ '--h': 260 }}>SK</span>
              <span style={{ '--h': 20 }}>DL</span>
            </div>
            <p>
              <span className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </span>
              “Best gym I've joined. The coaches actually know your name.”
            </p>
          </div>
        </section>

        <section className="form-wrap" aria-live="polite">
          {result ? <Success data={result} onReset={() => setResult(null)} /> : <SignupForm onSuccess={setResult} />}
        </section>
      </main>

      <div className="marquee" id="classes" aria-hidden="true">
        <div className="marquee__track">
          {[...CLASSES, ...CLASSES].map((c, i) => (
            <span key={i}>
              {c}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
