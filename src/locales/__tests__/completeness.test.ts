import { describe, expect, it } from 'vitest'

import en from '../en/translation'
import es from '../es/translation'
import pl from '../pl/translation'

type JsonObject = Record<string, unknown>

function getKeyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || value === undefined) return [prefix]

  if (Array.isArray(value)) {
    // Not expected for translations, but keep stable semantics if introduced.
    return value.flatMap((item, index) => getKeyPaths(item, prefix ? `${prefix}.${index}` : String(index)))
  }

  if (typeof value === 'object') {
    const obj = value as JsonObject
    const entries = Object.entries(obj)

    if (entries.length === 0) return [prefix]

    return entries.flatMap(([key, child]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key
      return getKeyPaths(child, nextPrefix)
    })
  }

  return [prefix]
}

function diffKeys(base: Set<string>, other: Set<string>) {
  const missing: string[] = []
  const extra: string[] = []

  for (const key of base) {
    if (!other.has(key)) missing.push(key)
  }

  for (const key of other) {
    if (!base.has(key)) extra.push(key)
  }

  missing.sort()
  extra.sort()

  return { missing, extra }
}

describe('translations completeness', () => {
  it('pl and es match en keys exactly', () => {
    const enKeys = new Set(getKeyPaths(en))

    const plKeys = new Set(getKeyPaths(pl))
    const esKeys = new Set(getKeyPaths(es))

    const plDiff = diffKeys(enKeys, plKeys)
    const esDiff = diffKeys(enKeys, esKeys)

    const problems: string[] = []

    if (plDiff.missing.length || plDiff.extra.length) {
      problems.push(
        [
          '[pl]',
          plDiff.missing.length ? `missing (${plDiff.missing.length}): ${plDiff.missing.join(', ')}` : null,
          plDiff.extra.length ? `extra (${plDiff.extra.length}): ${plDiff.extra.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join(' '),
      )
    }

    if (esDiff.missing.length || esDiff.extra.length) {
      problems.push(
        [
          '[es]',
          esDiff.missing.length ? `missing (${esDiff.missing.length}): ${esDiff.missing.join(', ')}` : null,
          esDiff.extra.length ? `extra (${esDiff.extra.length}): ${esDiff.extra.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join(' '),
      )
    }

    expect(problems.join('\n')).toBe('')
  })
})
