import { AdaptiveGrid, SectionHeader } from './ui'
import { EmptyState, LoadMoreAction } from './ux'
import { resolveI18nValue } from '../i18n'

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
  i18n,
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
        title={i18n.cartridgeSection.chooseCartridge}
        meta={countLabel}
      />

      {isLoading ? (
        <EmptyState
          className="svr-empty-state"
          message={i18n.cartridgeSection.loadingVideos}
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
                <h4>{resolveI18nValue(item.title, i18n.fallback.untitledVideo)}</h4>
                {(item.author || item.publishedAt || item.hype !== undefined) && (
                  <div className="svr-card-stats">
                    <span>{resolveI18nValue(item.author, i18n.fallback.unknown)}</span>
                    <span>{item.hype !== undefined ? `${Math.round(item.hype * 100)}%` : '--'}</span>
                  </div>
                )}
                {item.publishedAt ? (
                  <div className="svr-card-date">
                    {resolveI18nValue(item.publishedAt, i18n.fallback.noDate)}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </AdaptiveGrid>
      ) : (
        <EmptyState
          className="svr-empty-state"
          message={errorMessage || i18n.cartridgeSection.noCartridges}
        />
      )}

      <LoadMoreAction
        className="svr-load-more"
        buttonClassName="svr-load-more-button"
        labels={i18n.loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
      />
    </section>
  )
}

export default RankupCartridgeSection
