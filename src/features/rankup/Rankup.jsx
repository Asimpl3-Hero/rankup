import { useEffect, useMemo, useState } from 'react'
import './styles/index.css'
import {
  RankupCartridgeSection,
  RankupFooter,
  RankupHeader,
  RankupHero,
  RankupStatsPanel,
  VideoInfoModal,
} from './components'
import { getNextRankupLocale, getRankupI18n, RANKUP_LOCALES } from './i18n'
import { useRankup } from './hooks'

function Rankup() {
  const [locale, setLocale] = useState(RANKUP_LOCALES.ES)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const i18n = useMemo(() => getRankupI18n(locale), [locale])

  const {
    countLabel,
    errorMessage,
    hasMore,
    isLoading,
    metrics,
    searchTerm,
    visibleCartridges,
    handleLoadMore,
    handleSearchChange,
  } = useRankup(i18n)

  function handleToggleLanguage() {
    setLocale((previousLocale) => getNextRankupLocale(previousLocale))
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className="svr-page">
      <RankupHeader
        i18n={i18n}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="svr-main">
        <section className="svr-hero-grid">
          <RankupHero i18n={i18n} featuredVideo={visibleCartridges[0]} />
          <RankupStatsPanel metrics={metrics} />
        </section>

        <RankupCartridgeSection
          i18n={i18n}
          cartridges={visibleCartridges}
          countLabel={countLabel}
          errorMessage={errorMessage}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          onSelectVideo={setSelectedVideo}
        />
      </main>

      <RankupFooter i18n={i18n} />

      <VideoInfoModal
        isOpen={Boolean(selectedVideo)}
        i18n={i18n}
        rankingPool={visibleCartridges}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}

export default Rankup
