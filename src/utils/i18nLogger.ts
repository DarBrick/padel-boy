import type { ThirdPartyModule, i18n } from 'i18next'

const warned = new Set<string>()

function warnOnce(message: string, key: string) {
  if (warned.has(key)) return
  warned.add(key)
  // eslint-disable-next-line no-console
  console.warn(message)
}

export const missingKeyLogger: ThirdPartyModule = {
  type: '3rdParty',
  init(instance: i18n) {
    instance.on('missingKey', (lngs, namespace, key) => {
      const languages = Array.isArray(lngs) ? lngs : [lngs]

      for (const language of languages) {
        if (!language || language === 'en') continue
        const warnKey = `${language}:${namespace}:${key}`
        warnOnce(
          `[i18n] Missing translation: ${namespace}:${key} (language: ${language}). Falling back to 'en'.`,
          warnKey,
        )
      }
    })
  },
}
