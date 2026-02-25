import { useEffect, useMemo, useState } from 'react'
import {
  INITIAL_VISIBLE_CARTRIDGES,
  LOAD_MORE_STEP,
  SEARCH_DEBOUNCE_MS,
  SHUFFLE_SEED_MAX,
} from '../constants'
import {
  filterCartridgesByQuery,
  placeTopHypeFirst,
  shuffleCartridgesBySeed,
} from '../utils'
import { useDebouncedValue } from './useDebouncedValue'

/**
 * @param {import('../types').CartridgeItem[]} videos
 * @returns {import('../types').RankupFeedModel}
 */
export function useRankupFeed(videos) {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARTRIDGES)
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * SHUFFLE_SEED_MAX))
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)

  const shuffledVideos = useMemo(
    () => shuffleCartridgesBySeed(videos, shuffleSeed),
    [videos, shuffleSeed],
  )

  const arrangedVideos = useMemo(
    () => placeTopHypeFirst(shuffledVideos),
    [shuffledVideos],
  )

  const filteredCartridges = useMemo(() => {
    return filterCartridgesByQuery(arrangedVideos, debouncedSearchTerm)
  }, [arrangedVideos, debouncedSearchTerm])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARTRIDGES)
  }, [debouncedSearchTerm])

  const visibleCartridges = useMemo(
    () => filteredCartridges.slice(0, visibleCount),
    [filteredCartridges, visibleCount],
  )

  function handleSearchChange(event) {
    setSearchTerm(event.target.value)
  }

  function handleLoadMore() {
    setVisibleCount((previous) => previous + LOAD_MORE_STEP)
  }

  return {
    hasMore: visibleCount < filteredCartridges.length,
    rankingPool: filteredCartridges,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  }
}
