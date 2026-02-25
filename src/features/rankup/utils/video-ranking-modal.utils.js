function toSafeHype(value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0
  }

  return value
}

function toSafePercent(hype) {
  return Math.min(100, Math.round(toSafeHype(hype) * 100))
}

function getTierByHypePercent(hypePercent) {
  if (hypePercent >= 80) return 'S_RANK'
  if (hypePercent >= 65) return 'A_RANK'
  if (hypePercent >= 45) return 'B_RANK'
  if (hypePercent >= 25) return 'C_RANK'
  return 'D_RANK'
}

function getTierStateClass(tier) {
  if (tier === 'S_RANK') return 'svr-rank-tier--s'
  if (tier === 'A_RANK') return 'svr-rank-tier--a'
  if (tier === 'B_RANK') return 'svr-rank-tier--b'
  if (tier === 'C_RANK') return 'svr-rank-tier--c'
  return 'svr-rank-tier--d'
}

function getRankingMessage(tier, deltaVsAverage) {
  if (tier === 'S_RANK') {
    return 'SIGNAL_DOMINANCE: This video is leading the arcade board.'
  }
  if (deltaVsAverage >= 10) {
    return 'UPTREND_DETECTED: Performance is climbing above stream average.'
  }
  if (deltaVsAverage <= -10) {
    return 'LOW_SIGNAL_ZONE: Needs stronger interaction momentum.'
  }
  return 'STABLE_LOOP: Performance is holding around feed average.'
}

/**
 * @param {import('../types').CartridgeItem} video
 * @param {import('../types').CartridgeItem[]=} rankingPool
 */
export function buildVideoRankingContext(video, rankingPool) {
  const normalizedPool =
    Array.isArray(rankingPool) && rankingPool.length > 0
      ? rankingPool
      : [video]

  const sortedByHype = [...normalizedPool].sort(
    (left, right) => toSafeHype(right.hype) - toSafeHype(left.hype),
  )
  const totalItems = sortedByHype.length
  const rankIndex = sortedByHype.findIndex(
    (item) =>
      item.title === video.title &&
      (item.author ?? '') === (video.author ?? '') &&
      (item.publishedAt ?? '') === (video.publishedAt ?? ''),
  )
  const position = rankIndex >= 0 ? rankIndex + 1 : totalItems
  const hypePercent = toSafePercent(video.hype)
  const percentile =
    totalItems <= 1
      ? 100
      : Math.max(0, Math.round(((totalItems - position) / (totalItems - 1)) * 100))

  const averageHype =
    normalizedPool.reduce((sum, item) => sum + toSafeHype(item.hype), 0) /
    Math.max(1, totalItems)
  const averageHypePercent = Math.round(averageHype * 100)
  const deltaVsAverage = Math.round((toSafeHype(video.hype) - averageHype) * 100)
  const tier = getTierByHypePercent(hypePercent)

  return {
    averageHypePercent,
    deltaVsAverage,
    hypePercent,
    message: getRankingMessage(tier, deltaVsAverage),
    percentile,
    position,
    tier,
    tierClass: getTierStateClass(tier),
    totalItems,
  }
}
