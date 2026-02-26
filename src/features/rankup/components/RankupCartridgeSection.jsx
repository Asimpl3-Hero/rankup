import { useState } from 'react'
import { SectionHeader } from './ui'
import { EmptyState, LoadMoreAction } from './ux'
import { resolveI18nValue, resolvePublishedAtValue } from '../i18n'
import {
  CARD_TONE_BY_PERCENTILE,
  CARD_VARIANT_BY_PERCENTILE,
  DEFAULT_CARD_TONE_CLASS,
  DEFAULT_CARD_VARIANT_CLASS,
  GRID_FALLBACK_VIDEO_SOURCES,
  HYPE_PERCENT_SCALE,
} from '../constants'

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?.*)?$/i

function toSafeHype(value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0
  }

  return value
}

function toMediaSource(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function resolveCardPrimaryMedia(item) {
  const directVideoSource = toMediaSource(item?.videoUrl ?? item?.video ?? item?.mediaUrl)
  if (directVideoSource) {
    return {
      source: directVideoSource,
      type: 'video',
    }
  }

  const thumbnailSource = toMediaSource(item?.thumbnail)
  if (!thumbnailSource) {
    return null
  }

  return {
    source: thumbnailSource,
    type: VIDEO_EXTENSION_PATTERN.test(thumbnailSource) ? 'video' : 'image',
  }
}

function hashString(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function shouldAutoPlayVideo(cardKey, mediaSource) {
  const signature = `${cardKey}|${mediaSource}`
  const threshold = 65
  return hashString(signature) % 100 < threshold
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
    return `${DEFAULT_CARD_VARIANT_CLASS} ${DEFAULT_CARD_TONE_CLASS}`
  }

  const rank = rankMap.get(index) ?? index
  const percentile = rank / total
  const variantRule = CARD_VARIANT_BY_PERCENTILE.find(
    (rule) => percentile <= rule.maxPercentile,
  )
  const toneRule = CARD_TONE_BY_PERCENTILE.find(
    (rule) => percentile <= rule.maxPercentile,
  )
  const hypeTier = variantRule?.className ?? DEFAULT_CARD_VARIANT_CLASS
  const toneTier = toneRule?.className ?? DEFAULT_CARD_TONE_CLASS

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
  const [failedPrimarySourceByKey, setFailedPrimarySourceByKey] = useState({})
  const [failedFallbackSourceByKey, setFailedFallbackSourceByKey] = useState({})
  const [loadedMediaSourceByKey, setLoadedMediaSourceByKey] = useState({})

  function getFallbackVideoForKey(cardKey) {
    if (GRID_FALLBACK_VIDEO_SOURCES.length === 0) {
      return ''
    }

    const randomLikeIndex = hashString(cardKey) % GRID_FALLBACK_VIDEO_SOURCES.length
    return GRID_FALLBACK_VIDEO_SOURCES[randomLikeIndex] ?? GRID_FALLBACK_VIDEO_SOURCES[0] ?? ''
  }

  function registerMediaError(cardKey, media) {
    if (!media?.source) {
      return
    }

    if (media.isFallback) {
      setFailedFallbackSourceByKey((previousMap) => {
        if (previousMap[cardKey] === media.source) {
          return previousMap
        }

        return {
          ...previousMap,
          [cardKey]: media.source,
        }
      })
      return
    }

    setFailedPrimarySourceByKey((previousMap) => {
      if (previousMap[cardKey] === media.source) {
        return previousMap
      }

      return {
        ...previousMap,
        [cardKey]: media.source,
      }
    })
  }

  function registerMediaLoaded(cardKey, media) {
    if (!media?.source) {
      return
    }

    setLoadedMediaSourceByKey((previousMap) => {
      if (previousMap[cardKey] === media.source) {
        return previousMap
      }

      return {
        ...previousMap,
        [cardKey]: media.source,
      }
    })
  }

  function registerVideoReadyFromNode(cardKey, media, node) {
    if (!node || node.readyState < 2) {
      return
    }

    registerMediaLoaded(cardKey, media)
  }

  function registerImageReadyFromNode(cardKey, media, node) {
    if (!node || !node.complete) {
      return
    }

    registerMediaLoaded(cardKey, media)
  }

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
        <div className="svr-cartridge-grid">
          {cartridges.map((item, index) => {
            const cardKey = item.id ?? `${item.title}-${index}`
            const title = resolveI18nValue(item.title, i18n.fallback.untitledVideo)
            const primaryMedia = resolveCardPrimaryMedia(item)
            const fallbackVideoSource = getFallbackVideoForKey(cardKey)
            const hasPrimarySourceFailed = failedPrimarySourceByKey[cardKey] === primaryMedia?.source
            const hasFallbackSourceFailed = failedFallbackSourceByKey[cardKey] === fallbackVideoSource
            const displayedMedia = primaryMedia?.source && !hasPrimarySourceFailed
              ? { ...primaryMedia, isFallback: false }
              : fallbackVideoSource && !hasFallbackSourceFailed
                ? { source: fallbackVideoSource, type: 'video', isFallback: true }
                : null
            const isMediaLoaded = displayedMedia?.source
              ? loadedMediaSourceByKey[cardKey] === displayedMedia.source
              : true
            const isAutoPlayEnabled = displayedMedia?.type === 'video'
              ? shouldAutoPlayVideo(cardKey, displayedMedia.source)
              : false

            return (
              <article
                key={cardKey}
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
                <div className="svr-card-image">
                  {!isMediaLoaded ? (
                    <div
                      className="svr-card-skeleton"
                      aria-hidden="true"
                    />
                  ) : null}
                  {displayedMedia?.type === 'video' ? (
                    <video
                      className={`svr-card-media ${isMediaLoaded ? 'is-loaded' : ''}`}
                      src={displayedMedia.source}
                      autoPlay={isAutoPlayEnabled}
                      loop={isAutoPlayEnabled}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      ref={(node) => registerVideoReadyFromNode(cardKey, displayedMedia, node)}
                      onLoadedMetadata={() => registerMediaLoaded(cardKey, displayedMedia)}
                      onCanPlay={() => registerMediaLoaded(cardKey, displayedMedia)}
                      onLoadedData={() => registerMediaLoaded(cardKey, displayedMedia)}
                      onError={() => registerMediaError(cardKey, displayedMedia)}
                    />
                  ) : displayedMedia?.type === 'image' ? (
                    <img
                      className={`svr-card-media ${isMediaLoaded ? 'is-loaded' : ''}`}
                      src={displayedMedia.source}
                      alt={title}
                      loading="lazy"
                      ref={(node) => registerImageReadyFromNode(cardKey, displayedMedia, node)}
                      onLoad={() => registerMediaLoaded(cardKey, displayedMedia)}
                      onError={() => registerMediaError(cardKey, displayedMedia)}
                    />
                  ) : null}
                </div>
                <div className="svr-card-overlay" />
                <div className="svr-card-meta">
                  <h4>{title}</h4>
                  {(item.author || item.publishedAt || item.hype !== undefined) && (
                    <div className="svr-card-stats">
                      <span>{resolveI18nValue(item.author, i18n.fallback.unknown)}</span>
                      <span>{item.hype !== undefined ? `${Math.round(item.hype * HYPE_PERCENT_SCALE)}%` : '--'}</span>
                    </div>
                  )}
                  {item.publishedAt ? (
                    <div className="svr-card-date">
                      {resolvePublishedAtValue(item.publishedAt, i18n, i18n.fallback.noDate)}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
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
