import { RANKUP_I18N_EN } from './rankup.i18n.en'
import { RANKUP_I18N_ES } from './rankup.i18n.es'

export const RANKUP_LOCALES = Object.freeze({
  EN: 'en',
  ES: 'es',
})

export const RANKUP_PLACEHOLDER_TOKENS = Object.freeze({
  NO_DATE: 'NO_DATE',
  UNKNOWN: 'UNKNOWN',
  UNKNOWN_CHANNEL: 'UNKNOWN_CHANNEL',
  UNTITLED_VIDEO: 'UNTITLED_VIDEO',
})

export const RANKUP_I18N = Object.freeze({
  [RANKUP_LOCALES.EN]: RANKUP_I18N_EN,
  [RANKUP_LOCALES.ES]: RANKUP_I18N_ES,
})

export function getRankupI18n(locale) {
  return RANKUP_I18N[locale] ?? RANKUP_I18N[RANKUP_LOCALES.ES]
}

export function getNextRankupLocale(locale) {
  return locale === RANKUP_LOCALES.ES ? RANKUP_LOCALES.EN : RANKUP_LOCALES.ES
}

/**
 * @param {string=} value
 * @param {string} fallbackText
 * @returns {string}
 */
export function resolveI18nValue(value, fallbackText) {
  const normalized = value?.trim()
  if (!normalized) {
    return fallbackText
  }

  const placeholderSet = new Set([
    RANKUP_PLACEHOLDER_TOKENS.NO_DATE,
    RANKUP_PLACEHOLDER_TOKENS.UNKNOWN,
    RANKUP_PLACEHOLDER_TOKENS.UNKNOWN_CHANNEL,
    RANKUP_PLACEHOLDER_TOKENS.UNTITLED_VIDEO,
  ])

  return placeholderSet.has(normalized) ? fallbackText : normalized
}

function normalizeRelativeTimeKey(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * @param {string=} value
 * @param {import('../types').RankupI18n=} i18n
 * @param {string} fallbackText
 * @returns {string}
 */
export function resolvePublishedAtValue(value, i18n, fallbackText) {
  const normalized = value?.trim()
  if (!normalized) {
    return fallbackText
  }

  const localized =
    i18n?.relativeTime?.[normalizeRelativeTimeKey(normalized)]

  if (typeof localized === 'string' && localized.trim()) {
    return localized
  }

  return resolveI18nValue(normalized, fallbackText)
}
