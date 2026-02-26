import { describe, expect, it } from '@jest/globals'
import {
  buildMetricsFromVideos,
  buildVectorsCountLabel,
  filterCartridgesByQuery,
  normalizeTitle,
  placeTopHypeFirst,
  shuffleCartridgesBySeed,
  withStableCartridgeIds,
} from '../../../../src/features/rankup/utils/rankup.utils.js'

describe('rankup.utils', () => {
  describe('normalizeTitle', () => {
    it('normalizes underscores, casing and spaces', () => {
      expect(normalizeTitle('  TUTORIAL_RETRO_80S  ')).toBe('tutorial retro 80s')
    })
  })

  describe('filterCartridgesByQuery', () => {
    const cartridges = [
      { title: 'TUTORIAL_REACT' },
      { title: 'ARCADE_SPEEDRUN' },
      { title: 'retro_devlog' },
    ]

    it('returns same reference when query is empty', () => {
      expect(filterCartridgesByQuery(cartridges, '   ')).toBe(cartridges)
    })

    it('filters by normalized query', () => {
      const filtered = filterCartridgesByQuery(cartridges, 'retro')
      expect(filtered).toHaveLength(1)
      expect(filtered.map((item) => item.title)).toEqual([
        'retro_devlog',
      ])
    })
  })

  it('builds vectors count label', () => {
    expect(buildVectorsCountLabel(14, ' CARTUCHOS')).toBe('14 CARTUCHOS')
  })

  describe('buildMetricsFromVideos', () => {
    it('returns fallback panels when list is empty', () => {
      const metrics = buildMetricsFromVideos([], { avgLabel: 'AVG_CUSTOM' })
      expect(metrics).toHaveLength(4)
      expect(metrics[0]).toMatchObject({
        label: 'AVG_CUSTOM',
        value: '40%',
        width: '40%',
      })
    })

    it('builds metrics from real videos', () => {
      const videos = [
        { title: 'A', author: 'alpha', publishedAt: 'Hace 1 dia', hype: 0.9 },
        { title: 'B', author: 'beta', publishedAt: 'Ayer', hype: 0.5 },
        { title: 'C', author: 'alpha', publishedAt: '2 days ago', hype: 0.1 },
      ]

      const metrics = buildMetricsFromVideos(videos)

      expect(metrics[0]).toMatchObject({ value: '50%', width: '50%' })
      expect(metrics[1]).toMatchObject({ value: '90%', width: '90%' })
      expect(metrics[2]).toMatchObject({ value: '67%', width: '67%' })
      expect(metrics[3]).toMatchObject({ value: '67%', width: '67%' })
    })

    it('clamps values above 100%', () => {
      const metrics = buildMetricsFromVideos([
        { title: 'A', author: 'x', publishedAt: 'Hace 1 mes', hype: 2.8 },
      ])

      expect(metrics[0].value).toBe('100%')
      expect(metrics[1].value).toBe('100%')
    })
  })

  describe('withStableCartridgeIds', () => {
    it('generates deterministic fallback ids and keeps uniqueness', () => {
      const source = [
        { title: 'A', author: 'x', publishedAt: 'Hace 1 dia', hype: 0.2 },
        { id: 'same-id', title: 'B', author: 'y', publishedAt: 'Hace 2 dias', hype: 0.3 },
        { id: 'same-id', title: 'C', author: 'z', publishedAt: 'Hace 3 dias', hype: 0.4 },
      ]

      const first = withStableCartridgeIds(source)
      const second = withStableCartridgeIds(source)

      expect(first[0].id).toMatch(/^video_\d+$/)
      expect(first[0].id).toBe(second[0].id)
      expect(first[1].id).toBe('same-id')
      expect(first[2].id).toBe('same-id_2')
    })
  })

  describe('shuffleCartridgesBySeed', () => {
    it('is deterministic for same seed and does not mutate input', () => {
      const cartridges = [
        { title: 'A' },
        { title: 'B' },
        { title: 'C' },
        { title: 'D' },
      ]

      const shuffledA = shuffleCartridgesBySeed(cartridges, 42)
      const shuffledB = shuffleCartridgesBySeed(cartridges, 42)

      expect(shuffledA).toEqual(shuffledB)
      expect(cartridges.map((item) => item.title)).toEqual(['A', 'B', 'C', 'D'])
      expect(shuffledA).toHaveLength(4)
    })
  })

  describe('placeTopHypeFirst', () => {
    it('returns same reference for arrays with less than 2 items', () => {
      const list = [{ title: 'only', hype: 0.4 }]
      expect(placeTopHypeFirst(list)).toBe(list)
    })

    it('returns same reference when top item is already first', () => {
      const list = [
        { title: 'A', hype: 0.9 },
        { title: 'B', hype: 0.4 },
      ]
      expect(placeTopHypeFirst(list)).toBe(list)
    })

    it('moves highest hype item to the first position', () => {
      const list = [
        { title: 'A', hype: 0.1 },
        { title: 'B', hype: 0.95 },
        { title: 'C', hype: 0.5 },
      ]
      const arranged = placeTopHypeFirst(list)
      expect(arranged.map((item) => item.title)).toEqual(['B', 'A', 'C'])
    })
  })
})
