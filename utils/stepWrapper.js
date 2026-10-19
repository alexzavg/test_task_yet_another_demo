import { test } from '@playwright/test'

/**
 * Wraps every method of a page object in `test.step()` so it appears as a readable step in the
 * Playwright HTML report, trace viewer and UI mode, instead of raw `locator.click` /
 * `expect.toHaveText` sub-calls. `PageActions` calls it from its constructor, so every page
 * object and component that extends it is covered with no per-method boilerplate.
 *
 * Step names are generated from the method name ("choosePlan" -> "Choose plan"). Override one
 * with a `static stepNames` map on the class; `{n}` and `{paramName}` interpolate arguments:
 *
 *   export class SignupPage extends PageActions {
 *     static stepNames = {
 *       open: 'Open the signup page',
 *       choosePlan: 'Choose the {planName} plan',
 *     }
 *     async choosePlan(planName) { ... }
 *   }
 *
 * Plain JS has no decorator support in Playwright's transpiler, hence the constructor-time wrap.
 */
export function wrapMethodsInSteps(instance) {
  const labels = collectStepNames(instance.constructor)
  const wrapped = new Set()
  for (let proto = Object.getPrototypeOf(instance); proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor' || wrapped.has(key)) continue
      const descriptor = Object.getOwnPropertyDescriptor(proto, key)
      if (typeof descriptor.value !== 'function') continue
      wrapped.add(key)
      instance[key] = wrap(descriptor.value, key, labels[key])
    }
  }
}

// Subclass labels win over the ones it inherits
function collectStepNames(ctor) {
  let labels = {}
  for (let c = ctor; c && c !== Function.prototype; c = Object.getPrototypeOf(c)) {
    if (Object.hasOwn(c, 'stepNames')) labels = { ...c.stepNames, ...labels }
  }
  return labels
}

function wrap(original, methodName, nameTemplate) {
  const paramNames = extractParamNames(original)
  return async function (...args) {
    if (!isInsideTest()) return original.apply(this, args)
    const stepName = resolveStepName(nameTemplate, methodName, paramNames, args)
    return await test.step(stepName, async () => original.apply(this, args))
  }
}

// `test.step()` throws outside a test (globalSetup, plain scripts), so the method runs unwrapped there.
function isInsideTest() {
  try {
    test.info()
    return true
  } catch {
    return false
  }
}

function resolveStepName(template, methodName, paramNames, args) {
  if (!template) return camelCaseToSentence(methodName)
  return template
    .replace(/\{(\d+)\}/g, (_match, idx) => formatArg(args[Number(idx)]))
    .replace(/\{([a-zA-Z_$][\w$]*)\}/g, (match, name) => {
      const idx = paramNames.indexOf(name)
      return idx >= 0 ? formatArg(args[idx]) : match
    })
}

function formatArg(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  // A Locator stringifies to "Locator@<selector>"; plain objects fall back to JSON.
  const str = String(value)
  if (str && str !== '[object Object]') return str
  try {
    return JSON.stringify(value)
  } catch {
    return str
  }
}

function camelCaseToSentence(name) {
  const spaced = name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function extractParamNames(fn) {
  const match = fn.toString().match(/^(?:async\s+)?(?:function\s*)?[^(]*\(([^)]*)\)/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((p) => p.trim().split('=')[0].trim().replace(/^\.\.\./, ''))
    .filter(Boolean)
}
