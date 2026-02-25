import { useEffect, useState } from 'react'
import { Button } from '../ui'
import { buildVideoRankingContext } from '../../utils'
import { resolveI18nValue } from '../../i18n'
import {
  MODAL_REC_TIME,
  MODAL_SOURCE_ID_PAD_LENGTH,
  MODAL_TIME_PAD_LENGTH,
} from '../../constants'

function VideoInfoModal({ i18n, isOpen, onClose, rankingPool, video }) {
  const [isPreviewBroken, setIsPreviewBroken] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  useEffect(() => {
    setIsPreviewBroken(false)
  }, [isOpen, video?.thumbnail])

  if (!isOpen || !video) {
    return null
  }

  const ranking = buildVideoRankingContext(video, rankingPool, i18n.ranking)
  const hasPreviewImage =
    typeof video.thumbnail === 'string' &&
    video.thumbnail.trim().length > 0 &&
    !isPreviewBroken
  const sourceId = `${i18n.modal.sourceIdPrefix}_${String(ranking.position).padStart(MODAL_SOURCE_ID_PAD_LENGTH, '0')}`
  const title = resolveI18nValue(video.title, i18n.fallback.untitledVideo)
  const author = resolveI18nValue(video.author, i18n.fallback.unknownChannel)
  const publishedAt = resolveI18nValue(video.publishedAt, i18n.fallback.noDate)
  const recMinutes = String(
    (ranking.position * MODAL_REC_TIME.minutesWeight + ranking.hypePercent) % MODAL_REC_TIME.minutesMod,
  ).padStart(MODAL_TIME_PAD_LENGTH, '0')
  const recSeconds = String(
    (ranking.hypePercent * MODAL_REC_TIME.secondsWeight + ranking.totalItems) % MODAL_REC_TIME.secondsMod,
  ).padStart(MODAL_TIME_PAD_LENGTH, '0')
  const recFrames = String(
    (ranking.percentile + ranking.position) % MODAL_REC_TIME.framesMod,
  ).padStart(MODAL_TIME_PAD_LENGTH, '0')
  const recStamp = `${MODAL_REC_TIME.basePrefix}:${recMinutes}:${recSeconds}:${recFrames}`

  return (
    <div className="svr-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="svr-modal"
        role="dialog"
        aria-modal="true"
        aria-label={i18n.modal.ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="svr-modal-header">
          <div className="svr-modal-chip">{i18n.modal.packetLabel}</div>
          <Button
            type="button"
            className="svr-modal-close"
            aria-label={i18n.modal.closeLabel}
            onClick={onClose}
          >
            X
          </Button>
        </header>

        <div className="svr-modal-body">
          <div className="svr-modal-layout">
            <aside className="svr-modal-preview">
              <div className="svr-modal-preview-frame">
                {hasPreviewImage ? (
                  <img
                    className="svr-modal-preview-image"
                    src={video.thumbnail}
                    alt={`${i18n.modal.ariaLabel}: ${title || i18n.fallback.videoWord}`}
                    loading="lazy"
                    onError={() => setIsPreviewBroken(true)}
                  />
                ) : (
                  <div className="svr-modal-preview-placeholder" aria-hidden="true" />
                )}

                <div className="svr-modal-preview-play" aria-hidden="true">
                  <span />
                </div>

                <div className="svr-modal-preview-rec">REC [{recStamp}]</div>
              </div>

              <div className="svr-modal-preview-meta">
                <span>{i18n.modal.sourceLabel}: {sourceId}</span>
                <span>{i18n.modal.liveConnectionLabel}</span>
              </div>
            </aside>

            <div className="svr-modal-data">
              <div className="svr-modal-title-wrap">
                <h3>{title}</h3>
                <span className={`svr-rank-tier ${ranking.tierClass}`}>{ranking.tier}</span>
              </div>

              <div className="svr-modal-grid">
                <article className="svr-modal-cell">
                  <span>{i18n.modal.channelLabel}</span>
                  <strong>{author}</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>{i18n.modal.publishedLabel}</span>
                  <strong>{publishedAt}</strong>
                </article>
                <article className="svr-modal-cell svr-modal-cell-highlight">
                  <span>{i18n.modal.hypeSignalLabel}</span>
                  <strong>{ranking.hypePercent}%</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>{i18n.modal.positionLabel}</span>
                  <strong>
                    #{ranking.position}/{ranking.totalItems}
                  </strong>
                </article>
                <article className="svr-modal-cell">
                  <span>{i18n.modal.percentileLabel}</span>
                  <strong>{ranking.percentile}%</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>{i18n.modal.vsAverageLabel}</span>
                  <strong>
                    {ranking.deltaVsAverage >= 0 ? '+' : ''}
                    {ranking.deltaVsAverage}%
                  </strong>
                </article>
              </div>

              <div className="svr-rank-meter-wrap">
                <div className="svr-rank-meter-label">
                  <span>{i18n.modal.rankingEnergyLabel}</span>
                  <span>
                    {ranking.hypePercent}% {i18n.modal.currentShortLabel}
                    {' | '}
                    {ranking.averageHypePercent}% {i18n.modal.averageShortLabel}
                  </span>
                </div>
                <div className="svr-rank-meter">
                  <div className="svr-rank-meter-value" style={{ width: `${ranking.hypePercent}%` }} />
                  <div className="svr-rank-meter-average" style={{ left: `${ranking.averageHypePercent}%` }} />
                </div>
              </div>

              <p className="svr-modal-text">
                [{i18n.modal.logicLabel}]: {ranking.message}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VideoInfoModal
