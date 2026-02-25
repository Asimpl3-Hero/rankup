import { useEffect, useState } from 'react'
import { Button } from '../ui'
import { buildVideoRankingContext } from '../../utils'

function VideoInfoModal({ isOpen, onClose, rankingPool, video }) {
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

  const ranking = buildVideoRankingContext(video, rankingPool)
  const hasPreviewImage =
    typeof video.thumbnail === 'string' &&
    video.thumbnail.trim().length > 0 &&
    !isPreviewBroken
  const sourceId = `YT_FEED_${String(ranking.position).padStart(2, '0')}`
  const recMinutes = String((ranking.position * 3 + ranking.hypePercent) % 60).padStart(2, '0')
  const recSeconds = String((ranking.hypePercent * 2 + ranking.totalItems) % 60).padStart(2, '0')
  const recFrames = String((ranking.percentile + ranking.position) % 30).padStart(2, '0')
  const recStamp = `00:${recMinutes}:${recSeconds}:${recFrames}`

  return (
    <div className="svr-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="svr-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Video details"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="svr-modal-header">
          <div className="svr-modal-chip">VIDEO_DATA_PACKET</div>
          <Button
            type="button"
            className="svr-modal-close"
            aria-label="Close modal"
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
                    alt={`Preview of ${video.title ?? 'video'}`}
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
                <span>SOURCE: {sourceId}</span>
                <span>LIVE CONNECTION</span>
              </div>
            </aside>

            <div className="svr-modal-data">
              <div className="svr-modal-title-wrap">
                <h3>{video.title ?? 'UNTITLED_VIDEO'}</h3>
                <span className={`svr-rank-tier ${ranking.tierClass}`}>{ranking.tier}</span>
              </div>

              <div className="svr-modal-grid">
                <article className="svr-modal-cell">
                  <span>CHANNEL</span>
                  <strong>{video.author ?? 'UNKNOWN_CHANNEL'}</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>PUBLISHED</span>
                  <strong>{video.publishedAt ?? 'NO_DATE'}</strong>
                </article>
                <article className="svr-modal-cell svr-modal-cell-highlight">
                  <span>HYPE_SIGNAL</span>
                  <strong>{ranking.hypePercent}%</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>RANK_POS</span>
                  <strong>
                    #{ranking.position}/{ranking.totalItems}
                  </strong>
                </article>
                <article className="svr-modal-cell">
                  <span>PERCENTILE</span>
                  <strong>{ranking.percentile}%</strong>
                </article>
                <article className="svr-modal-cell">
                  <span>VS_AVERAGE</span>
                  <strong>
                    {ranking.deltaVsAverage >= 0 ? '+' : ''}
                    {ranking.deltaVsAverage}%
                  </strong>
                </article>
              </div>

              <div className="svr-rank-meter-wrap">
                <div className="svr-rank-meter-label">
                  <span>RANKING_ENERGY</span>
                  <span>{ranking.averageHypePercent}% AVG</span>
                </div>
                <div className="svr-rank-meter">
                  <div style={{ width: `${ranking.hypePercent}%` }} />
                </div>
              </div>

              <p className="svr-modal-text">
                [RANK_LOGIC]: {ranking.message}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VideoInfoModal
