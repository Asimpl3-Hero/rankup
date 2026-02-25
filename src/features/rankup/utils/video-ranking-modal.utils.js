import {
  HYPE_PERCENT_MAX,
  HYPE_PERCENT_SCALE,
  RANKING_SIGNAL_THRESHOLDS,
  RANKING_TIER_BY_HYPE_PERCENT,
} from '../constants'

function toSafeHype(value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0
  }

  return value
}

function toSafePercent(hype) {
  return Math.min(HYPE_PERCENT_MAX, Math.round(toSafeHype(hype) * HYPE_PERCENT_SCALE))
}

function getTierByHypePercent(hypePercent) {
  const matchedTier = RANKING_TIER_BY_HYPE_PERCENT.find(
    (rule) => hypePercent >= rule.minHypePercent,
  )

  if (matchedTier) {
    return matchedTier.tier
  }

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
  if (deltaVsAverage >= RANKING_SIGNAL_THRESHOLDS.uptrendDelta) {
    return rankingCopy?.messages?.uptrend ?? 'UPTREND_DETECTED'
  }
  if (deltaVsAverage <= RANKING_SIGNAL_THRESHOLDS.lowSignalDelta) {
    return rankingCopy?.messages?.lowSignal ?? 'LOW_SIGNAL_ZONE'
  }
  return rankingCopy?.messages?.stable ?? 'STABLE_LOOP'
}

/**
 * @param {import('../types').CartridgeItem} left
 * @param {import('../types').CartridgeItem} right
 * @returns {boolean}
 */
function isSameVideo(left, right) {
  if (left.id && right.id) {
    return left.id === right.id
  }

  return (
    left.title === right.title &&
    (left.author ?? '') === (right.author ?? '') &&
    (left.publishedAt ?? '') === (right.publishedAt ?? '')
  )
}

/**
 * @param {import('../types').CartridgeItem} video
 * @param {import('../types').CartridgeItem[]=} rankingPool
 * @param {import('../types').RankupRankingCopy=} rankingCopy
 */
export function buildVideoRankingContext(video, rankingPool, rankingCopy) {
  const basePool =
    Array.isArray(rankingPool) && rankingPool.length > 0
      ? rankingPool
      : [video]
  const hasSelectedVideo = basePool.some((item) => isSameVideo(item, video))
  const normalizedPool = hasSelectedVideo
    ? basePool
    : [...basePool, video]

  const sortedByHype = [...normalizedPool].sort(
    (left, right) => toSafeHype(right.hype) - toSafeHype(left.hype),
  )
  const totalItems = sortedByHype.length
  const rankIndex = sortedByHype.findIndex(
    (item) => isSameVideo(item, video),
  )
  const position = rankIndex >= 0 ? rankIndex + 1 : 1
  const hypePercent = toSafePercent(video.hype)
  const percentile =
    totalItems <= 1
      ? HYPE_PERCENT_MAX
      : Math.max(0, Math.round(((totalItems - position) / (totalItems - 1)) * HYPE_PERCENT_SCALE))

  const averageHype =
    normalizedPool.reduce((sum, item) => sum + toSafeHype(item.hype), 0) /
    Math.max(1, totalItems)
  const averageHypePercent = Math.round(averageHype * HYPE_PERCENT_SCALE)
  const deltaVsAverage = Math.round((toSafeHype(video.hype) - averageHype) * HYPE_PERCENT_SCALE)
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
