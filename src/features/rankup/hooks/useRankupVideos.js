import { useEffect, useState } from 'react'
import { CARTRIDGES } from '../constants'
import { fetchRankupVideos } from '../services'
import { withStableCartridgeIds } from '../utils'

/**
 * @returns {import('../types').RankupVideosModel}
 */
export function useRankupVideos() {
  const [videos, setVideos] = useState(() => withStableCartridgeIds(CARTRIDGES))
  const [isLoading, setIsLoading] = useState(true)
  const [hasApiError, setHasApiError] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadVideos() {
      setIsLoading(true)
      setHasApiError(false)

      try {
        const apiVideos = await fetchRankupVideos(abortController.signal)
        setVideos(withStableCartridgeIds(apiVideos.length > 0 ? apiVideos : CARTRIDGES))
      } catch {
        if (abortController.signal.aborted) {
          return
        }

        setVideos(withStableCartridgeIds(CARTRIDGES))
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

  return {
    videos,
    isLoading,
    hasApiError,
  }
}
