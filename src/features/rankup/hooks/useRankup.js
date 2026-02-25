import { useEffect, useMemo, useState } from 'react'
import {
  CARTRIDGES,
  INITIAL_VISIBLE_CARTRIDGES,
  LOAD_MORE_STEP,
} from '../constants'
import {
  buildVectorsCountLabel,
  buildMetricsFromVideos,
  filterCartridgesByQuery,
  placeTopHypeFirst,
  shuffleCartridgesBySeed,
} from '../utils'
import { fetchRankupVideos } from '../services'

/**
 * @param {{ api: { offlinePrefix: string, unknownError: string }, counters: { vectorsSuffix: string }, metricPanels: { avgLabel: string, avgDetail: string, topLabel: string, topDetail: string, freshnessLabel: string, freshnessDetail: string, diversityLabel: string, diversityDetail: string } }} i18n
 * @returns {import('../types').RankupViewModel}
 */
export function useRankup(i18n) {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARTRIDGES)
  const [videos, setVideos] = useState(CARTRIDGES)
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 1_000_000))
  const [isLoading, setIsLoading] = useState(true)
  const [hasApiError, setHasApiError] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadVideos() {
      setIsLoading(true)
      setHasApiError(false)

      try {
        const apiVideos = await fetchRankupVideos(abortController.signal)
        setVideos(apiVideos.length > 0 ? apiVideos : CARTRIDGES)
      } catch {
        if (abortController.signal.aborted) {
          return
        }

        setVideos(CARTRIDGES)
        setHasApiError(true)
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadVideos()

    return () => {
      abortController.abort()
    }
  }, [])

  const shuffledVideos = useMemo(
    () => shuffleCartridgesBySeed(videos, shuffleSeed),
    [videos, shuffleSeed],
  )

  const arrangedVideos = useMemo(
    () => placeTopHypeFirst(shuffledVideos),
    [shuffledVideos],
  )

  const filteredCartridges = useMemo(() => {
    return filterCartridgesByQuery(arrangedVideos, searchTerm)
  }, [arrangedVideos, searchTerm])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARTRIDGES)
  }, [searchTerm])

  const visibleCartridges = useMemo(
    () => filteredCartridges.slice(0, visibleCount),
    [filteredCartridges, visibleCount],
  )

  const hasMore = visibleCount < filteredCartridges.length
  const errorMessage = hasApiError
    ? `${i18n.api.offlinePrefix}: ${i18n.api.unknownError}`
    : ''
  const metrics = useMemo(
    () => buildMetricsFromVideos(videos, i18n.metricPanels),
    [videos, i18n.metricPanels],
  )
  const countLabel = buildVectorsCountLabel(
    filteredCartridges.length,
    i18n.counters.vectorsSuffix,
  )

  function handleSearchChange(event) {
    setSearchTerm(event.target.value)
  }

  function handleLoadMore() {
    setVisibleCount((previous) => previous + LOAD_MORE_STEP)
  }

  return {
    countLabel,
    errorMessage,
    hasMore,
    isLoading,
    metrics,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  }
}
