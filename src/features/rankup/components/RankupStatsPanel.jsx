function RankupStatsPanel({ metrics }) {
  return (
    <aside className="svr-stats">
      {metrics.map((panel) => (
        <section
          key={panel.label}
          className={`svr-panel ${panel.emphasized ? 'svr-panel-highlight' : ''}`}
        >
          <div className="svr-panel-label">{panel.label}</div>
          <div className="svr-panel-value">{panel.value}</div>
          <div className="svr-meter">
            <div style={{ width: panel.width }} />
          </div>
          <div className="svr-panel-detail">{panel.detail}</div>
        </section>
      ))}
    </aside>
  )
}

export default RankupStatsPanel
