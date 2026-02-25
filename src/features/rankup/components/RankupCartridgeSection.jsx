import { AdaptiveGrid, SectionHeader } from './ui'
import { EmptyState, LoadMoreAction } from './ux'

function RankupCartridgeSection({
  cartridges,
  countLabel,
  errorMessage,
  hasMore,
  isLoading,
  onLoadMore,
}) {
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
          {cartridges.map((item) => (
            <article key={item.title} className="svr-card">
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
