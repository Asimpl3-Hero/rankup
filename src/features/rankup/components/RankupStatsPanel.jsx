function toMeterScale(width) {
  if (typeof width === 'number') {
    if (!Number.isFinite(width)) {
      return '0'
    }
    return String(Math.max(0, Math.min(1, width > 1 ? width / 100 : width)))
  }

  if (typeof width === 'string') {
    const parsed = Number.parseFloat(width)
    if (Number.isFinite(parsed)) {
      return String(Math.max(0, Math.min(1, parsed / 100)))
    }
  }

  return '0'
}

function RankupStatsPanel({ metrics }) {
  return (
    <aside className="svr-stats">
      {metrics.map((panel, index) => (
        <section
          key={panel.label}
          className={`svr-panel ${panel.emphasized ? 'svr-panel-highlight' : ''}`}
          style={{ '--svr-panel-index': index }}
        >
          <div className="svr-panel-head">
            <div className="svr-panel-label">{panel.label}</div>
            <div className="svr-panel-value">{panel.value}</div>
          </div>
          <div className="svr-meter">
            <div style={{ '--svr-meter-scale': toMeterScale(panel.width) }} />
          </div>
          <div className="svr-panel-detail">{panel.detail}</div>
        </section>
      ))}
    </aside>
  )
}

export default RankupStatsPanel
