import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactHowler from 'react-howler'
import './styles/index.css'
import {
  RankupCartridgeSection,
  RankupFooter,
  RankupHeader,
  RankupHero,
  RankupStatsPanel,
  VideoInfoModal,
} from './components'
import {
  RANKUP_SOUND_EVENTS,
  RANKUP_SOUND_SRC,
  RANKUP_SOUND_VOLUME,
} from './constants'
import { getNextRankupLocale, getRankupI18n, RANKUP_LOCALES } from './i18n'
import { useRankup, useRankupSound } from './hooks'

function Rankup() {
  const [locale, setLocale] = useState(RANKUP_LOCALES.ES)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const i18n = useMemo(() => getRankupI18n(locale), [locale])
  const {
    isSoundEnabled,
    playback,
    playbackRate,
    playSound,
    stopSound,
    toggleSound,
  } = useRankupSound()

  const {
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
  } = useRankup(i18n)

  const handleToggleLanguage = useCallback(() => {
    setLocale((previousLocale) => getNextRankupLocale(previousLocale))
    playSound(RANKUP_SOUND_EVENTS.TOGGLE_LANGUAGE)
  }, [playSound])

  const handleToggleSound = useCallback(() => {
    if (!isSoundEnabled) {
      toggleSound()
      playSound(RANKUP_SOUND_EVENTS.UI, true)
      return
    }

    toggleSound()
  }, [isSoundEnabled, playSound, toggleSound])

  const handleStartGame = useCallback(() => {
    playSound(RANKUP_SOUND_EVENTS.START_GAME)
  }, [playSound])

  const handleSelectVideo = useCallback((video) => {
    setSelectedVideo(video)
    playSound(RANKUP_SOUND_EVENTS.OPEN_MODAL)
  }, [playSound])

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null)
    playSound(RANKUP_SOUND_EVENTS.CLOSE_MODAL)
  }, [playSound])

  const handleLoadMoreWithSound = useCallback(() => {
    handleLoadMore()
    playSound(RANKUP_SOUND_EVENTS.LOAD_MORE)
  }, [handleLoadMore, playSound])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className="svr-page">
      <RankupHeader
        isSoundEnabled={isSoundEnabled}
        i18n={i18n}
        onToggleSound={handleToggleSound}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="svr-main">
        <section className="svr-hero-grid">
          <RankupHero
            i18n={i18n}
            featuredVideo={visibleCartridges[0]}
            onStartAction={handleStartGame}
          />
          <RankupStatsPanel metrics={metrics} />
        </section>

        <RankupCartridgeSection
          i18n={i18n}
          cartridges={visibleCartridges}
          countLabel={countLabel}
          errorMessage={errorMessage}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMoreWithSound}
          onSelectVideo={handleSelectVideo}
        />
      </main>

      <RankupFooter i18n={i18n} />

      {playback.event ? (
        <ReactHowler
          key={`rankup-sfx-${playback.id}`}
          src={RANKUP_SOUND_SRC}
          playing
          preload
          rate={playbackRate}
          volume={RANKUP_SOUND_VOLUME}
          onEnd={stopSound}
          onStop={stopSound}
          onLoadError={stopSound}
          onPlayError={stopSound}
        />
      ) : null}

      <VideoInfoModal
        isOpen={Boolean(selectedVideo)}
        i18n={i18n}
        rankingPool={rankingPool}
        video={selectedVideo}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default Rankup
