import { describe, expect, it } from '@jest/globals'
import {
  getNextRankupLocale,
  getRankupI18n,
  RANKUP_LOCALES,
  resolveI18nValue,
  resolvePublishedAtValue,
} from '../../../../src/features/rankup/i18n/rankup.i18n.js'
import { RANKUP_I18N_EN } from '../../../../src/features/rankup/i18n/rankup.i18n.en.js'
import { RANKUP_I18N_ES } from '../../../../src/features/rankup/i18n/rankup.i18n.es.js'

describe('rankup.i18n', () => {
  it('returns locale dictionaries and falls back to ES', () => {
    expect(getRankupI18n(RANKUP_LOCALES.EN)).toBe(RANKUP_I18N_EN)
    expect(getRankupI18n('fr')).toBe(RANKUP_I18N_ES)
  })

  it('toggles locale correctly', () => {
    expect(getNextRankupLocale(RANKUP_LOCALES.ES)).toBe(RANKUP_LOCALES.EN)
    expect(getNextRankupLocale(RANKUP_LOCALES.EN)).toBe(RANKUP_LOCALES.ES)
  })

  describe('resolveI18nValue', () => {
    it('returns fallback for empty values', () => {
      expect(resolveI18nValue(undefined, 'FALLBACK')).toBe('FALLBACK')
      expect(resolveI18nValue('   ', 'FALLBACK')).toBe('FALLBACK')
    })

    it('returns fallback for placeholder tokens', () => {
      expect(resolveI18nValue('NO_DATE', 'FALLBACK_DATE')).toBe('FALLBACK_DATE')
      expect(resolveI18nValue('UNKNOWN_CHANNEL', 'FALLBACK_CHANNEL')).toBe('FALLBACK_CHANNEL')
    })

    it('returns normalized value for real text', () => {
      expect(resolveI18nValue('  Canal Retro  ', 'X')).toBe('Canal Retro')
    })
  })

  describe('resolvePublishedAtValue', () => {
    it('returns fallback for empty value', () => {
      expect(resolvePublishedAtValue(undefined, RANKUP_I18N_EN, 'NO_DATE')).toBe('NO_DATE')
    })

    it('maps relative time using dictionary and normalized key', () => {
      const localized = resolvePublishedAtValue('  Hace   2 dias  ', RANKUP_I18N_EN, 'NO_DATE')
      expect(localized).toBe('2 days ago')
    })

    it('falls back when value is placeholder token', () => {
      expect(resolvePublishedAtValue('UNKNOWN', RANKUP_I18N_ES, 'DESCONOCIDO')).toBe('DESCONOCIDO')
    })

    it('returns original text when no mapping exists', () => {
      expect(resolvePublishedAtValue('Hace 1 hora exacta', RANKUP_I18N_EN, 'NO_DATE')).toBe('Hace 1 hora exacta')
    })
  })
})
