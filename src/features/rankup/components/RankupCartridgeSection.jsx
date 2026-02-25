import { AdaptiveGrid, SectionHeader } from './ui'
import { EmptyState, LoadMoreAction } from './ux'

function toSafeHype(value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0
  }

  return value
}

function buildRankMap(cartridges) {
  const rankedIndexes = [...cartridges.keys()].sort(
    (leftIndex, rightIndex) =>
      toSafeHype(cartridges[rightIndex]?.hype) - toSafeHype(cartridges[leftIndex]?.hype),
  )

  const rankMap = new Map()
  rankedIndexes.forEach((index, rank) => {
    rankMap.set(index, rank)
  })

  return rankMap
}

function getCardVariantClass(index, total, rankMap) {
  if (total <= 0) {
    return 'svr-card--square svr-card-tone--amber'
  }

  const rank = rankMap.get(index) ?? index
  const percentile = rank / total
  const hypeTier =
    percentile <= 0.12
      ? 'svr-card--xl'
      : percentile <= 0.35
        ? 'svr-card--tall'
        : percentile <= 0.7
          ? 'svr-card--wide'
          : 'svr-card--square'

  const toneTier =
    percentile <= 0.25
      ? 'svr-card-tone--neon'
      : percentile <= 0.5
        ? 'svr-card-tone--matrix'
        : percentile <= 0.75
          ? 'svr-card-tone--acid'
          : 'svr-card-tone--amber'

  return `${hypeTier} ${toneTier}`
}

function RankupCartridgeSection({
  cartridges,
  countLabel,
  errorMessage,
  hasMore,
  isLoading,
  onLoadMore,
  onSelectVideo,
}) {
  const rankMap = buildRankMap(cartridges)

  return (
    <section className="svr-cartridge-section">
      <SectionHeader
        className="svr-section-head"
        title="CHOOSE_YOUR_CARTRIDGE"
        meta={countLabel}
      />

      {isLoading ? (
        <EmptyState
          className="svr-empty-state"
          message="LOADING_VIDEOS_FROM_API..."
        />
      ) : cartridges.length > 0 ? (
        <AdaptiveGrid className="svr-cartridge-grid" minItemWidth={150} gap={4}>
          {cartridges.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`svr-card ${getCardVariantClass(index, cartridges.length, rankMap)}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectVideo?.(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectVideo?.(item)
                }
              }}
            >
              <div className="svr-card-image" />
              <div className="svr-card-overlay" />
              <div className="svr-card-meta">
                <h4>{item.title}</h4>
                {(item.author || item.publishedAt || item.hype !== undefined) && (
                  <div className="svr-card-stats">
                    <span>{item.author ?? 'UNKNOWN'}</span>
                    <span>{item.hype !== undefined ? `${Math.round(item.hype * 100)}%` : '--'}</span>
                  </div>
                )}
                {item.publishedAt ? <div className="svr-card-date">{item.publishedAt}</div> : null}
              </div>
            </article>
          ))}
        </AdaptiveGrid>
      ) : (
        <EmptyState
          className="svr-empty-state"
          message={errorMessage || 'NO_CARTRIDGES_FOUND_FOR_THIS_QUERY'}
        />
      )}

      <LoadMoreAction
        className="svr-load-more"
        buttonClassName="svr-load-more-button"
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
      />
    </section>
  )
}

export default RankupCartridgeSection
