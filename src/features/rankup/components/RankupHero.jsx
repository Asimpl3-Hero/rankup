import { Button } from './ui'
import { resolveI18nValue } from '../i18n'

function RankupHero({ i18n, featuredVideo }) {
  const title = resolveI18nValue(featuredVideo?.title, i18n.fallback.noActiveVideo)
  const author = resolveI18nValue(featuredVideo?.author, i18n.fallback.unknownChannel)
  const publishedAt = resolveI18nValue(featuredVideo?.publishedAt, i18n.fallback.noDate)
  const hypePercent = Math.round((featuredVideo?.hype ?? 0) * 100)

  return (
    <article className="svr-hero">
      <div className="svr-hero-image" />
      <div className="svr-hero-overlay" />

      <div className="svr-hero-content">
        <div>
          <div className="svr-chip">{i18n.hero.chip}</div>
          <h2>{title}</h2>
        </div>

        <div className="svr-hero-footer">
          <p>
            [{i18n.hero.sourceLabel}]: {i18n.hero.channelPrefix}_{author} | {publishedAt}
            {' '}| {i18n.hero.liveSignalLabel}_{hypePercent}%
          </p>
          <div className="svr-hero-actions">
            <Button type="button">{i18n.hero.startButton}</Button>
            <div className="svr-score-box">
              <span>{i18n.hero.hypeLabel}:</span>
              <strong>{hypePercent}%</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RankupHero
