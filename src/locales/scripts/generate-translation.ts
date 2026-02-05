import fs from 'node:fs'
import path from 'node:path'

import en from '../en/translation'
import es from '../es/translation'
import pl from '../pl/translation'

type Primitive = string | number | boolean | null
type TranslationValue = Primitive | TranslationObject | TranslationArray
type TranslationArray = readonly TranslationValue[]
type TranslationObject = { [key: string]: TranslationValue }

type Language = 'en' | 'pl' | 'es'

const languageToTranslation: Record<Language, TranslationObject> = {
  en,
  pl,
  es,
}

function parseArgs(argv: string[]) {
  const args = new Set(argv)

  const langsArg = argv.find((a) => a.startsWith('--langs='))
  const langs = langsArg
    ? (langsArg.replace('--langs=', '').split(',').map((s) => s.trim()).filter(Boolean) as Language[])
    : (['pl', 'es'] as Language[])

  const fillArg = argv.find((a) => a.startsWith('--fill='))
  const fill: 'en' | 'empty' = fillArg?.replace('--fill=', '') === 'empty' ? 'empty' : 'en'

  const write = args.has('--write')

  return { langs, fill, write }
}

function isObject(value: unknown): value is TranslationObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isArray(value: unknown): value is TranslationArray {
  return Array.isArray(value)
}

function syncKeys(base: TranslationValue, current: TranslationValue | undefined, fill: 'en' | 'empty'): TranslationValue {
  if (isArray(base)) {
    const currentArr = isArray(current) ? current : undefined
    return base.map((item, index) => syncKeys(item, currentArr?.[index], fill))
  }

  if (isObject(base)) {
    const currentObj = isObject(current) ? current : undefined
    const out: TranslationObject = {}

    for (const key of Object.keys(base)) {
      out[key] = syncKeys(base[key], currentObj?.[key], fill)
    }

    return out
  }

  if (typeof current === typeof base) {
    return current as Primitive
  }

  if (fill === 'empty') {
    return ''
  }

  return base
}

function escapeString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/'/g, "\\'")
}

function toTs(value: TranslationValue, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel)
  const nextIndent = '  '.repeat(indentLevel + 1)

  if (typeof value === 'string') return `'${escapeString(value)}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'

    const items = value.map((item) => `${nextIndent}${toTs(item, indentLevel + 1)},`)
    return `\n${indent}[\n${items.join('\n')}\n${indent}]`
  }

  const entries = Object.entries(value)
  if (entries.length === 0) return '{}'

  const lines = entries.map(([key, child]) => {
    const keyLiteral = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `'${escapeString(key)}'`
    return `${nextIndent}${keyLiteral}: ${toTs(child, indentLevel + 1)},`
  })

  return `\n${indent}{\n${lines.join('\n')}\n${indent}}`
}

function writeTranslationFile(language: Language, translation: TranslationObject) {
  const filePath = path.resolve(process.cwd(), 'src', 'locales', language, 'translation.ts')
  const contents = `const translation = ${toTs(translation)} as const\n\nexport default translation\n`
  fs.writeFileSync(filePath, contents, 'utf8')
}

function main() {
  const { langs, fill, write } = parseArgs(process.argv.slice(2))

  for (const lng of langs) {
    if (lng === 'en') continue

    const current = languageToTranslation[lng]
    const synced = syncKeys(en, current, fill) as TranslationObject

    if (write) {
      writeTranslationFile(lng, synced)
      // eslint-disable-next-line no-console
      console.log(`[i18n] Wrote synced translations for ${lng}`)
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n[i18n] Preview for ${lng} (run with --write to update file):\n`)
      // eslint-disable-next-line no-console
      console.log(`const translation = ${toTs(synced)} as const\n\nexport default translation\n`)
    }
  }
}

main()
