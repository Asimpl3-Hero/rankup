export const DEFAULT_CARD_VARIANT_CLASS = 'svr-card--square'
export const DEFAULT_CARD_TONE_CLASS = 'svr-card-tone--amber'

export const CARD_VARIANT_BY_PERCENTILE = Object.freeze([
  { maxPercentile: 0.12, className: 'svr-card--xl' },
  { maxPercentile: 0.35, className: 'svr-card--tall' },
  { maxPercentile: 0.7, className: 'svr-card--wide' },
])

export const CARD_TONE_BY_PERCENTILE = Object.freeze([
  { maxPercentile: 0.25, className: 'svr-card-tone--neon' },
  { maxPercentile: 0.5, className: 'svr-card-tone--matrix' },
  { maxPercentile: 0.75, className: 'svr-card-tone--acid' },
])
