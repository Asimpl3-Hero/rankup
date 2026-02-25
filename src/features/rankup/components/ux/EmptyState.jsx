function EmptyState({ className = '', message = 'SIN_DATOS_DISPONIBLES' }) {
  const classes = `ux-empty-state ${className}`.trim()
  return <p className={classes}>{message}</p>
}

export default EmptyState
