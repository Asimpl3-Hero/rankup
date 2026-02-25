import { AdaptiveGrid, SectionHeader } from './ui'
import { EmptyState, LoadMoreAction } from './ux'

function RankupCartridgeSection({
  cartridges,
  countLabel,
  hasMore,
  onLoadMore,
}) {
  return (
    <section className="svr-cartridge-section">
      <SectionHeader
        className="svr-section-head"
        title="CHOOSE_YOUR_CARTRIDGE"
        meta={countLabel}
      />

      {cartridges.length > 0 ? (
        <AdaptiveGrid className="svr-cartridge-grid" minItemWidth={150} gap={4}>
          {cartridges.map((item) => (
            <article key={item.title} className="svr-card">
              <div className="svr-card-image" />
              <div className="svr-card-overlay" />
              <div className="svr-card-meta">
                <h4>{item.title}</h4>
                {(item.views || item.likes) && (
                  <div className="svr-card-stats">
                    <span>{item.views}</span>
                    <span>{item.likes}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </AdaptiveGrid>
      ) : (
        <EmptyState
          className="svr-empty-state"
          message="NO_CARTRIDGES_FOUND_FOR_THIS_QUERY"
        />
      )}

      <LoadMoreAction
        className="svr-load-more"
        buttonClassName="svr-load-more-button"
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />
    </section>
  )
}

export default RankupCartridgeSection
