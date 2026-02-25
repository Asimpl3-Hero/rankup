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
  filterCartridgesByQuery,
} from '../utils'

/** @returns {import('../types').RankupViewModel} */
export function useRankup() {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARTRIDGES)

  const filteredCartridges = useMemo(() => {
    return filterCartridgesByQuery(CARTRIDGES, searchTerm)
  }, [searchTerm])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARTRIDGES)
  }, [searchTerm])

  const visibleCartridges = useMemo(
    () => filteredCartridges.slice(0, visibleCount),
    [filteredCartridges, visibleCount],
  )

  const hasMore = visibleCount < filteredCartridges.length
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
    hasMore,
    metrics: METRIC_PANELS,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  }
}
