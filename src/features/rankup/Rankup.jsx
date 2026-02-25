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
        />
      </main>

      <RankupFooter />
    </div>
  )
}

export default Rankup
