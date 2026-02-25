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

  return Math.min(100, Math.round(value))
}

/**
 * @param {import('../types').CartridgeItem[]} videos
 * @param {import('../types').MetricPanel[]} fallback
 * @returns {import('../types').MetricPanel[]}
 */
export function buildMetricsFromVideos(videos, fallback) {
  if (!Array.isArray(videos) || videos.length === 0) {
    return fallback
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
    /(hora|día|dias|dia)/i.test(video.publishedAt ?? ''),
  ).length
  const uniqueAuthors = new Set(
    videos.map((video) => video.author).filter(Boolean),
  ).size

  const avgHypePct = toSafePercent((totalHype / totalVideos) * 100)
  const topHypePct = toSafePercent(topHype * 100)
  const freshnessPct = toSafePercent((freshVideos / totalVideos) * 100)
  const diversityPct = toSafePercent((uniqueAuthors / totalVideos) * 100)

  return [
    {
      label: 'MONITOR_01: AVG_HYPE',
      value: `${avgHypePct}%`,
      width: `${avgHypePct}%`,
      detail: 'AVERAGE_HYPE_RATIO',
      emphasized: true,
    },
    {
      label: 'MONITOR_02: TOP_HYPE',
      value: `${topHypePct}%`,
      width: `${topHypePct}%`,
      detail: 'BEST_VIDEO_SIGNAL',
    },
    {
      label: 'MONITOR_03: FRESHNESS',
      value: `${freshnessPct}%`,
      width: `${freshnessPct}%`,
      detail: 'RECENT_PUBLICATIONS',
    },
    {
      label: 'MONITOR_04: AUTHORS',
      value: `${diversityPct}%`,
      width: `${diversityPct}%`,
      detail: 'CHANNEL_DIVERSITY',
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
