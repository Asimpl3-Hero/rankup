import { useEffect, useMemo, useState } from 'react'
import { RANKUP_COPY } from '../config'
import {
  CARTRIDGES,
  INITIAL_VISIBLE_CARTRIDGES,
  LOAD_MORE_STEP,
  METRIC_PANELS,
} from '../constants'
import {
  buildVectorsCountLabel,
  buildMetricsFromVideos,
  filterCartridgesByQuery,
} from '../utils'
import { fetchRankupVideos } from '../services'

/** @returns {import('../types').RankupViewModel} */
export function useRankup() {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARTRIDGES)
  const [videos, setVideos] = useState(CARTRIDGES)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function loadVideos() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const apiVideos = await fetchRankupVideos(abortController.signal)
        setVideos(apiVideos.length > 0 ? apiVideos : CARTRIDGES)
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        setVideos(CARTRIDGES)
        setErrorMessage(
          error instanceof Error
            ? `API_OFFLINE: ${error.message}`
            : 'API_OFFLINE: Unknown error',
        )
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

  const filteredCartridges = useMemo(() => {
    return filterCartridgesByQuery(videos, searchTerm)
  }, [searchTerm, videos])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARTRIDGES)
  }, [searchTerm])

  const visibleCartridges = useMemo(
    () => filteredCartridges.slice(0, visibleCount),
    [filteredCartridges, visibleCount],
  )

  const hasMore = visibleCount < filteredCartridges.length
  const metrics = useMemo(
    () => buildMetricsFromVideos(videos, METRIC_PANELS),
    [videos],
  )
  const countLabel = buildVectorsCountLabel(
    filteredCartridges.length,
    RANKUP_COPY.vectorsFoundSuffix,
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
