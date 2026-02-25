import { useState } from 'react'
import './styles/index.css'
import {
  RankupCartridgeSection,
  RankupFooter,
  RankupHeader,
  RankupHero,
  RankupStatsPanel,
  VideoInfoModal,
} from './components'
import { useRankup } from './hooks'

function Rankup() {
  const [selectedVideo, setSelectedVideo] = useState(null)

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
  } = useRankup()

  return (
    <div className="svr-page">
      <RankupHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <main className="svr-main">
        <section className="svr-hero-grid">
          <RankupHero featuredVideo={visibleCartridges[0]} />
          <RankupStatsPanel metrics={metrics} />
        </section>

        <RankupCartridgeSection
          cartridges={visibleCartridges}
          countLabel={countLabel}
          errorMessage={errorMessage}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          onSelectVideo={setSelectedVideo}
        />
      </main>

      <RankupFooter />

      <VideoInfoModal
        isOpen={Boolean(selectedVideo)}
        rankingPool={visibleCartridges}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}

export default Rankup
