function EmptyState({ className = '', message = 'NO_DATA_AVAILABLE' }) {
  const classes = `ux-empty-state ${className}`.trim()
  return <p className={classes}>{message}</p>
}

export default EmptyState
