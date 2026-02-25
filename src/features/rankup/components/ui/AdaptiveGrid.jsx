function AdaptiveGrid({
  children,
  className = '',
  gap = '1rem',
  minItemWidth = '220px',
  style = {},
}) {
  const classes = `ui-adaptive-grid ${className}`.trim()
  const mergedStyle = {
    '--ui-grid-gap': typeof gap === 'number' ? `${gap}px` : gap,
    '--ui-grid-min': typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth,
    ...style,
  }

  return (
    <div className={classes} style={mergedStyle}>
      {children}
    </div>
  )
}

export default AdaptiveGrid
