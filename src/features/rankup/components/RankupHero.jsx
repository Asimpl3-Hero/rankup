import { Button } from './ui'

function RankupHero({ featuredVideo }) {
  const title = featuredVideo?.title ?? 'NO_ACTIVE_VIDEO'
  const author = featuredVideo?.author ?? 'UNKNOWN_CHANNEL'
  const publishedAt = featuredVideo?.publishedAt ?? 'SIN_FECHA'
  const hypePercent = Math.round((featuredVideo?.hype ?? 0) * 100)

  return (
    <article className="svr-hero">
      <div className="svr-hero-image" />
      <div className="svr-hero-overlay" />

      <div className="svr-hero-content">
        <div>
          <div className="svr-chip">GAME_OF_THE_DAY</div>
          <h2>{title}</h2>
        </div>

        <div className="svr-hero-footer">
          <p>
            [SOURCE_STREAM]: CHANNEL_{author} | {publishedAt}
            {' '}| LIVE_HYPE_SIGNAL_{hypePercent}%
          </p>
          <div className="svr-hero-actions">
            <Button type="button">START_GAME</Button>
            <div className="svr-score-box">
              <span>HYPE:</span>
              <strong>{hypePercent}%</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RankupHero
