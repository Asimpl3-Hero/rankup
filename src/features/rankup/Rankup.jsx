import './styles/index.css'
import {
  RankupCartridgeSection,
  RankupFooter,
  RankupHeader,
  RankupHero,
  RankupStatsPanel,
} from './components'
import { useRankup } from './hooks'

function Rankup() {
  const {
    countLabel,
    hasMore,
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
          <RankupHero />
          <RankupStatsPanel metrics={metrics} />
        </section>

        <RankupCartridgeSection
          cartridges={visibleCartridges}
          countLabel={countLabel}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </main>

      <RankupFooter />
    </div>
  )
}

export default Rankup
