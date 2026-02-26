import { useMemo, useState } from 'react'
import { Button } from './ui'
import { resolveI18nValue, resolvePublishedAtValue } from '../i18n'
import { HERO_FALLBACK_VIDEO_SRC, HYPE_PERCENT_SCALE } from '../constants'

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?.*)?$/i

function toMediaSource(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function resolvePrimaryHeroMedia(featuredVideo) {
  const directVideoSource = toMediaSource(
    featuredVideo?.videoUrl ?? featuredVideo?.video ?? featuredVideo?.mediaUrl,
  )
  if (directVideoSource) {
    return {
      source: directVideoSource,
      type: 'video',
    }
  }

  const thumbnailSource = toMediaSource(featuredVideo?.thumbnail)
  if (!thumbnailSource) {
    return null
  }

  return {
    source: thumbnailSource,
    type: VIDEO_EXTENSION_PATTERN.test(thumbnailSource) ? 'video' : 'image',
  }
}

function RankupHero({ i18n, featuredVideo, onStartAction }) {
  const title = resolveI18nValue(featuredVideo?.title, i18n.fallback.noActiveVideo)
  const author = resolveI18nValue(featuredVideo?.author, i18n.fallback.unknownChannel)
  const publishedAt = resolvePublishedAtValue(featuredVideo?.publishedAt, i18n, i18n.fallback.noDate)
  const hypePercent = Math.round((featuredVideo?.hype ?? 0) * HYPE_PERCENT_SCALE)
  const [failedPrimarySource, setFailedPrimarySource] = useState('')
  const [failedFallbackSource, setFailedFallbackSource] = useState('')

  const primaryMedia = useMemo(
    () => resolvePrimaryHeroMedia(featuredVideo),
    [featuredVideo],
  )
  const hasPrimaryMediaError = Boolean(primaryMedia?.source) && failedPrimarySource === primaryMedia?.source
  const hasFallbackVideoError = failedFallbackSource === HERO_FALLBACK_VIDEO_SRC

  const displayedMedia = useMemo(() => {
    if (primaryMedia && !hasPrimaryMediaError) {
      return {
        ...primaryMedia,
        isFallback: false,
      }
    }

    if (hasFallbackVideoError) {
      return null
    }

    return {
      source: HERO_FALLBACK_VIDEO_SRC,
      type: 'video',
      isFallback: true,
    }
  }, [hasFallbackVideoError, hasPrimaryMediaError, primaryMedia])

  function handleMediaError() {
    if (!displayedMedia) {
      return
    }

    if (displayedMedia.isFallback) {
      setFailedFallbackSource(displayedMedia.source)
      return
    }

    setFailedPrimarySource(displayedMedia.source)
  }

  return (
    <article className="svr-hero">
      <div className="svr-hero-image">
        {displayedMedia?.type === 'video' ? (
          <video
            className="svr-hero-media"
            src={displayedMedia.source}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={handleMediaError}
          />
        ) : displayedMedia?.type === 'image' ? (
          <img
            className="svr-hero-media"
            src={displayedMedia.source}
            alt={title}
            loading="eager"
            onError={handleMediaError}
          />
        ) : null}
      </div>
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
            <Button type="button" onClick={onStartAction}>{i18n.hero.startButton}</Button>
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
