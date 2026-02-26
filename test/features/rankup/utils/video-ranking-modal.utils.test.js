import { describe, expect, it } from '@jest/globals'
import { buildVideoRankingContext } from '../../../../src/features/rankup/utils/video-ranking-modal.utils.js'

describe('video-ranking-modal.utils', () => {
  it('builds ranking context for a single video', () => {
    const video = { id: 'v1', title: 'TOP_SIGNAL', hype: 0.92 }
    const context = buildVideoRankingContext(video)

    expect(context).toMatchObject({
      averageHypePercent: 92,
      deltaVsAverage: 0,
      hypePercent: 92,
      message: 'SIGNAL_DOMINANCE',
      percentile: 100,
      position: 1,
      tier: 'S_RANK',
      tierClass: 'svr-rank-tier--s',
      totalItems: 1,
    })
  })

  it('adds selected video when not present in ranking pool', () => {
    const selected = { id: 'v3', title: 'FEATURED', hype: 0.45 }
    const pool = [
      { id: 'v1', title: 'LOW', hype: 0.2 },
      { id: 'v2', title: 'MID', hype: 0.3 },
    ]

    const context = buildVideoRankingContext(selected, pool)
    expect(context.totalItems).toBe(3)
    expect(context.position).toBe(1)
    expect(context.hypePercent).toBe(45)
    expect(context.deltaVsAverage).toBe(13)
    expect(context.message).toBe('UPTREND_DETECTED')
    expect(context.tier).toBe('B_RANK')
    expect(context.tierClass).toBe('svr-rank-tier--b')
  })

  it('matches videos without id by title, author and publishedAt', () => {
    const selected = {
      title: 'ARCADE_DEVLOG',
      author: 'retro-studio',
      publishedAt: 'Hace 2 dias',
      hype: 0.5,
    }
    const pool = [
      { title: 'ARCADE_DEVLOG', author: 'retro-studio', publishedAt: 'Hace 2 dias', hype: 0.5 },
      { title: 'ANOTHER', author: 'retro-studio', publishedAt: 'Hace 1 dia', hype: 0.4 },
    ]

    const context = buildVideoRankingContext(selected, pool)
    expect(context.totalItems).toBe(2)
    expect(context.position).toBe(1)
    expect(context.message).toBe('STABLE_LOOP')
  })

  it('returns low-signal message for low hype against average', () => {
    const selected = { id: 'low', title: 'LOW', hype: 0.1 }
    const pool = [
      { id: 'a', title: 'A', hype: 0.6 },
      { id: 'b', title: 'B', hype: 0.5 },
    ]

    const context = buildVideoRankingContext(selected, pool)
    expect(context.deltaVsAverage).toBeLessThanOrEqual(-10)
    expect(context.message).toBe('LOW_SIGNAL_ZONE')
    expect(context.tier).toBe('D_RANK')
    expect(context.tierClass).toBe('svr-rank-tier--d')
  })

  it('applies custom copy for tiers and messages', () => {
    const selected = { id: 'x', title: 'HYPE', hype: 0.91 }
    const copy = {
      messages: { dominance: 'DOMINA_TOTAL' },
      tiers: { S: 'RANGO_SUPERIOR' },
    }

    const context = buildVideoRankingContext(selected, [], copy)
    expect(context.message).toBe('DOMINA_TOTAL')
    expect(context.tier).toBe('RANGO_SUPERIOR')
  })
})
