import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  RANKUP_SOUND_DEFAULT_ENABLED,
  RANKUP_SOUND_EVENTS,
  RANKUP_SOUND_RATE_BY_EVENT,
  RANKUP_SOUND_STORAGE_KEY,
} from '../constants'

function getInitialSoundEnabled() {
  if (typeof window === 'undefined') {
    return RANKUP_SOUND_DEFAULT_ENABLED
  }

  const storedPreference = window.localStorage.getItem(RANKUP_SOUND_STORAGE_KEY)
  if (storedPreference === null) {
    return RANKUP_SOUND_DEFAULT_ENABLED
  }

  return storedPreference === '1'
}

export function useRankupSound() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(getInitialSoundEnabled)
  const [playback, setPlayback] = useState({ event: '', id: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(RANKUP_SOUND_STORAGE_KEY, isSoundEnabled ? '1' : '0')
  }, [isSoundEnabled])

  const playbackRate = useMemo(
    () => RANKUP_SOUND_RATE_BY_EVENT[playback.event] ?? RANKUP_SOUND_RATE_BY_EVENT[RANKUP_SOUND_EVENTS.UI],
    [playback.event],
  )

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((previousValue) => !previousValue)
  }, [])

  const playSound = useCallback((event = RANKUP_SOUND_EVENTS.UI, force = false) => {
    if (!force && !isSoundEnabled) {
      return
    }

    setPlayback((previousPlayback) => ({
      event,
      id: previousPlayback.id + 1,
    }))
  }, [isSoundEnabled])

  const stopSound = useCallback(() => {
    setPlayback((previousPlayback) => {
      if (!previousPlayback.event) {
        return previousPlayback
      }

      return {
        ...previousPlayback,
        event: '',
      }
    })
  }, [])

  return {
    isSoundEnabled,
    playback,
    playbackRate,
    playSound,
    stopSound,
    toggleSound,
  }
}
