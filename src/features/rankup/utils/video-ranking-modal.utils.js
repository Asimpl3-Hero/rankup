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
  if (hypePercent >= 80) return 'S'
  if (hypePercent >= 65) return 'A'
  if (hypePercent >= 45) return 'B'
  if (hypePercent >= 25) return 'C'
  return 'D'
}

function getTierStateClass(tier) {
  if (tier === 'S') return 'svr-rank-tier--s'
  if (tier === 'A') return 'svr-rank-tier--a'
  if (tier === 'B') return 'svr-rank-tier--b'
  if (tier === 'C') return 'svr-rank-tier--c'
  return 'svr-rank-tier--d'
}

function getRankingMessage(tier, deltaVsAverage, rankingCopy) {
  if (tier === 'S') {
    return rankingCopy?.messages?.dominance ?? 'SIGNAL_DOMINANCE'
  }
  if (deltaVsAverage >= 10) {
    return rankingCopy?.messages?.uptrend ?? 'UPTREND_DETECTED'
  }
  if (deltaVsAverage <= -10) {
    return rankingCopy?.messages?.lowSignal ?? 'LOW_SIGNAL_ZONE'
  }
  return rankingCopy?.messages?.stable ?? 'STABLE_LOOP'
}

/**
 * @param {import('../types').CartridgeItem} video
 * @param {import('../types').CartridgeItem[]=} rankingPool
 * @param {{ tiers?: Record<string, string>, messages?: Record<string, string> }=} rankingCopy
 */
export function buildVideoRankingContext(video, rankingPool, rankingCopy) {
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
    message: getRankingMessage(tier, deltaVsAverage, rankingCopy),
    percentile,
    position,
    tier: rankingCopy?.tiers?.[tier] ?? `${tier}_RANK`,
    tierClass: getTierStateClass(tier),
    totalItems,
  }
}
