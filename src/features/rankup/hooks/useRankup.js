import { useMemo } from 'react'
import {
  buildVectorsCountLabel,
  buildMetricsFromVideos,
} from '../utils'
import { useRankupFeed } from './useRankupFeed'
import { useRankupVideos } from './useRankupVideos'

/**
 * @param {import('../types').RankupI18n} i18n
 * @returns {import('../types').RankupViewModel}
 */
export function useRankup(i18n) {
  const { hasApiError, isLoading, videos } = useRankupVideos()
  const {
    hasMore,
    rankingPool,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  } = useRankupFeed(videos)

  const errorMessage = hasApiError
    ? `${i18n.api.offlinePrefix}: ${i18n.api.unknownError}`
    : ''
  const metrics = useMemo(
    () => buildMetricsFromVideos(videos, i18n.metricPanels),
    [videos, i18n.metricPanels],
  )
  const countLabel = buildVectorsCountLabel(
    rankingPool.length,
    i18n.counters.vectorsSuffix,
  )

  return {
    countLabel,
    errorMessage,
    hasMore,
    isLoading,
    metrics,
    rankingPool,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  }
}
