export const HYPE_UNIT_MAX = 1
export const HYPE_PERCENT_MAX = 100
export const HYPE_PERCENT_SCALE = 100

export const RANKING_TIER_BY_HYPE_PERCENT = Object.freeze([
  { minHypePercent: 80, tier: 'S' },
  { minHypePercent: 65, tier: 'A' },
  { minHypePercent: 45, tier: 'B' },
  { minHypePercent: 25, tier: 'C' },
])

export const RANKING_SIGNAL_THRESHOLDS = Object.freeze({
  lowSignalDelta: -10,
  uptrendDelta: 10,
})
