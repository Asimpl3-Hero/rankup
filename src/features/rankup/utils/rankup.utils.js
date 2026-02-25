import { HYPE_PERCENT_MAX, HYPE_PERCENT_SCALE } from '../constants'

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeTitle(value) {
  return value.replaceAll('_', ' ').toLowerCase().trim()
}

/**
 * @param {import('../types').CartridgeItem[]} cartridges
 * @param {string} query
 * @returns {import('../types').CartridgeItem[]}
 */
export function filterCartridgesByQuery(cartridges, query) {
  const normalizedQuery = normalizeTitle(query)
  if (!normalizedQuery) {
    return cartridges
  }

  return cartridges.filter((item) =>
    normalizeTitle(item.title).includes(normalizedQuery),
  )
}

/**
 * @param {number} count
 * @param {string} suffix
 * @returns {string}
 */
export function buildVectorsCountLabel(count, suffix) {
  return `${count}${suffix}`
}

/**
 * @param {number} value
 * @returns {number}
 */
function toSafePercent(value) {
  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return Math.min(HYPE_PERCENT_MAX, Math.round(value))
}

/**
 * @param {import('../types').CartridgeItem[]} videos
 * @param {{ avgLabel?: string, avgDetail?: string, topLabel?: string, topDetail?: string, freshnessLabel?: string, freshnessDetail?: string, diversityLabel?: string, diversityDetail?: string }=} metricPanelsCopy
 * @returns {import('../types').MetricPanel[]}
 */
export function buildMetricsFromVideos(videos, metricPanelsCopy) {
  const copy = metricPanelsCopy ?? {}
  const fallbackPanels = [
    {
      label: copy.avgLabel ?? 'MONITOR_01: AVG_HYPE',
      value: '40%',
      width: '40%',
      detail: copy.avgDetail ?? 'AVERAGE_HYPE_RATIO',
      emphasized: true,
    },
    {
      label: copy.topLabel ?? 'MONITOR_02: TOP_HYPE',
      value: '30%',
      width: '30%',
      detail: copy.topDetail ?? 'BEST_VIDEO_SIGNAL',
    },
    {
      label: copy.freshnessLabel ?? 'MONITOR_03: FRESHNESS',
      value: '20%',
      width: '20%',
      detail: copy.freshnessDetail ?? 'RECENT_PUBLICATIONS',
    },
    {
      label: copy.diversityLabel ?? 'MONITOR_04: AUTHORS',
      value: '10%',
      width: '10%',
      detail: copy.diversityDetail ?? 'CHANNEL_DIVERSITY',
    },
  ]

  if (!Array.isArray(videos) || videos.length === 0) {
    return fallbackPanels
  }

  const totalVideos = videos.length
  const totalHype = videos.reduce(
    (accumulator, video) => accumulator + (video.hype ?? 0),
    0,
  )
  const topHype = videos.reduce(
    (maxValue, video) => Math.max(maxValue, video.hype ?? 0),
    0,
  )
  const freshVideos = videos.filter((video) =>
    /(hora|horas|dia|dias|semana|semanas|mes|meses|hour|hours|day|days|week|weeks|month|months)/i.test(
      video.publishedAt ?? '',
    ),
  ).length
  const uniqueAuthors = new Set(
    videos.map((video) => video.author).filter(Boolean),
  ).size

  const avgHypePct = toSafePercent((totalHype / totalVideos) * HYPE_PERCENT_SCALE)
  const topHypePct = toSafePercent(topHype * HYPE_PERCENT_SCALE)
  const freshnessPct = toSafePercent((freshVideos / totalVideos) * HYPE_PERCENT_SCALE)
  const diversityPct = toSafePercent((uniqueAuthors / totalVideos) * HYPE_PERCENT_SCALE)

  return [
    {
      label: copy.avgLabel ?? 'MONITOR_01: AVG_HYPE',
      value: `${avgHypePct}%`,
      width: `${avgHypePct}%`,
      detail: copy.avgDetail ?? 'AVERAGE_HYPE_RATIO',
      emphasized: true,
    },
    {
      label: copy.topLabel ?? 'MONITOR_02: TOP_HYPE',
      value: `${topHypePct}%`,
      width: `${topHypePct}%`,
      detail: copy.topDetail ?? 'BEST_VIDEO_SIGNAL',
    },
    {
      label: copy.freshnessLabel ?? 'MONITOR_03: FRESHNESS',
      value: `${freshnessPct}%`,
      width: `${freshnessPct}%`,
      detail: copy.freshnessDetail ?? 'RECENT_PUBLICATIONS',
    },
    {
      label: copy.diversityLabel ?? 'MONITOR_04: AUTHORS',
      value: `${diversityPct}%`,
      width: `${diversityPct}%`,
      detail: copy.diversityDetail ?? 'CHANNEL_DIVERSITY',
    },
  ]
}

/**
 * @param {string} value
 * @returns {number}
 */
function hashString(value) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * @param {import('../types').CartridgeItem[]} cartridges
 * @returns {import('../types').CartridgeItem[]}
 */
export function withStableCartridgeIds(cartridges) {
  const ids = new Set()

  return cartridges.map((item, index) => {
    const existingId =
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim()
        : ''
    const fallbackSource = `${item.title ?? ''}|${item.author ?? ''}|${item.publishedAt ?? ''}|${item.hype ?? ''}|${index}`
    const fallbackId = `video_${hashString(fallbackSource)}`
    let normalizedId = existingId || fallbackId

    if (ids.has(normalizedId)) {
      normalizedId = `${normalizedId}_${index}`
    }

    ids.add(normalizedId)
    return {
      ...item,
      id: normalizedId,
    }
  })
}

/**
 * @param {import('../types').CartridgeItem[]} cartridges
 * @param {number} seed
 * @returns {import('../types').CartridgeItem[]}
 */
export function shuffleCartridgesBySeed(cartridges, seed) {
  return [...cartridges]
    .map((item, index) => ({
      item,
      score: hashString(`${seed}:${item.title}:${index}`),
    }))
    .sort((left, right) => left.score - right.score)
    .map((entry) => entry.item)
}

/**
 * @param {import('../types').CartridgeItem[]} cartridges
 * @returns {import('../types').CartridgeItem[]}
 */
export function placeTopHypeFirst(cartridges) {
  if (cartridges.length < 2) {
    return cartridges
  }

  const maxHype = cartridges.reduce(
    (maxValue, item) => Math.max(maxValue, item.hype ?? 0),
    0,
  )
  const topIndex = cartridges.findIndex((item) => (item.hype ?? 0) === maxHype)
  if (topIndex <= 0) {
    return cartridges
  }

  const next = [...cartridges]
  const [topItem] = next.splice(topIndex, 1)
  next.unshift(topItem)
  return next
}
