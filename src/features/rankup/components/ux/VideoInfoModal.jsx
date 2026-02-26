import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../ui'
import { buildVideoRankingContext } from '../../utils'
import { resolveI18nValue, resolvePublishedAtValue } from '../../i18n'
import {
  MODAL_REC_TIME,
  MODAL_SOURCE_ID_PAD_LENGTH,
  MODAL_TIME_PAD_LENGTH,
} from '../../constants'

function toMeterScale(percent) {
  if (!Number.isFinite(percent)) {
    return '0'
  }

  return String(Math.max(0, Math.min(1, percent / 100)))
}

function toPercentOffset(percent) {
  if (!Number.isFinite(percent)) {
    return '0%'
  }

  return `${Math.max(0, Math.min(100, percent))}%`
}

function toEngagementValue(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return '--'
  }

  return new Intl.NumberFormat().format(Math.round(value))
}

function getFocusableElements(container) {
  if (!container) {
    return []
  }

  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  return Array.from(container.querySelectorAll(selector)).filter(
    (element) => element instanceof HTMLElement && !element.hasAttribute('aria-hidden'),
  )
}

function VideoInfoModal({ i18n, isOpen, onClose, rankingPool, video }) {
  const [brokenPreviewThumbnail, setBrokenPreviewThumbnail] = useState('')
  const modalRef = useRef(null)
  const previousFocusedElementRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const computedBodyPaddingRight =
      Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${computedBodyPaddingRight + scrollbarWidth}px`
    }

    document.body.style.overflow = 'hidden'

    const modalNode = modalRef.current
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusableElements = getFocusableElements(modalNode)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      modalNode?.focus()
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const currentFocusableElements = getFocusableElements(modalNode)
      if (currentFocusableElements.length === 0) {
        event.preventDefault()
        modalNode?.focus()
        return
      }

      const firstFocusable = currentFocusableElements[0]
      const lastFocusable = currentFocusableElements[currentFocusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
        return
      }

      if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      previousFocusedElementRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen || !video) {
    return null
  }

  const ranking = buildVideoRankingContext(video, rankingPool, i18n.ranking)
  const hasPreviewImage =
    typeof video.thumbnail === 'string' &&
    video.thumbnail.trim().length > 0 &&
    brokenPreviewThumbnail !== video.thumbnail
  const sourceId = `${i18n.modal.sourceIdPrefix}_${String(ranking.position).padStart(MODAL_SOURCE_ID_PAD_LENGTH, '0')}`
  const title = resolveI18nValue(video.title, i18n.fallback.untitledVideo)
  const author = resolveI18nValue(video.author, i18n.fallback.unknownChannel)
  const publishedAt = resolvePublishedAtValue(video.publishedAt, i18n, i18n.fallback.noDate)
  const likesCount = toEngagementValue(video.likes)
  const commentsCount = toEngagementValue(video.comments)
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

  const modalContent = (
    <div className="svr-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="svr-modal"
        role="dialog"
        aria-modal="true"
        aria-label={i18n.modal.ariaLabel}
        tabIndex={-1}
        ref={modalRef}
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
                    onError={() => setBrokenPreviewThumbnail(video.thumbnail)}
                  />
                ) : (
                  <div className="svr-modal-preview-placeholder" aria-hidden="true" />
                )}

                <div className="svr-modal-preview-play" aria-hidden="true">
                  <span />
                </div>

                <div className="svr-modal-preview-rec">{i18n.modal.recordingLabel} [{recStamp}]</div>
              </div>

              <div className="svr-modal-preview-meta">
                <span>{i18n.modal.sourceLabel}: {sourceId}</span>
                <span>{i18n.modal.liveConnectionLabel}</span>
              </div>

              <div className="svr-modal-preview-engagement">
                <article className="svr-modal-preview-engagement-cell">
                  <span>{i18n.modal.likesLabel}</span>
                  <strong>{likesCount}</strong>
                </article>
                <article className="svr-modal-preview-engagement-cell">
                  <span>{i18n.modal.commentsLabel}</span>
                  <strong>{commentsCount}</strong>
                </article>
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
                <div
                  className="svr-rank-meter"
                  style={{
                    '--svr-rank-meter-scale': toMeterScale(ranking.hypePercent),
                    '--svr-rank-average-position': toPercentOffset(ranking.averageHypePercent),
                  }}
                >
                  <div className="svr-rank-meter-value" />
                  <div className="svr-rank-meter-average" />
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

  if (typeof document === 'undefined') {
    return modalContent
  }

  return createPortal(modalContent, document.body)
}

export default VideoInfoModal
