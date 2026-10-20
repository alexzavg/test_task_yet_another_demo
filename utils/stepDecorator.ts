import { test } from '@playwright/test'

type AsyncMethod<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Promise<Return>

/**
 * Method decorator that runs a page-object method inside `test.step()`, so it shows as one
 * readable step in the HTML report, trace viewer and UI mode.
 *
 *   @step()                              -> "Choose plan" (sentence-cased method name)
 *   @step('Choose the {planName} plan')  -> named argument
 *   @step('Fill zip code: {0}')          -> positional argument
 */
export function step(title?: string) {
  return function <This, Args extends unknown[], Return>(
    method: AsyncMethod<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, AsyncMethod<This, Args, Return>>,
  ): AsyncMethod<This, Args, Return> {
    const methodName = String(context.name)
    const paramNames = parameterNames(method)
    return function (this: This, ...args: Args): Promise<Return> {
      return test.step(stepTitle(title, methodName, paramNames, args), () => method.apply(this, args))
    }
  }
}

function stepTitle(title: string | undefined, methodName: string, paramNames: string[], args: unknown[]): string {
  if (!title) return sentenceCase(methodName)
  return title
    .replace(/\{(\d+)\}/g, (_match, index) => formatArg(args[Number(index)]))
    .replace(/\{([a-zA-Z_$][\w$]*)\}/g, (match, name) => {
      const index = paramNames.indexOf(name)
      return index >= 0 ? formatArg(args[index]) : match
    })
}

// Strings print raw; a Locator prints its .describe() text; plain objects fall back to JSON
function formatArg(value: unknown): string {
  if (typeof value === 'string') return value
  const text = String(value)
  if (text !== '[object Object]') return text
  return JSON.stringify(value)
}

function sentenceCase(name: string): string {
  const spaced = name.replace(/([a-z\d])([A-Z])/g, '$1 $2').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function parameterNames(method: Function): string[] {
  const match = method.toString().match(/^[^(]*\(([^)]*)\)/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((param) => param.split('=')[0].trim().replace(/^\.\.\./, ''))
    .filter(Boolean)
}
