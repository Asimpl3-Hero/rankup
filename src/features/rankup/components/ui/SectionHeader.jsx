function SectionHeader({
  className = '',
  meta,
  metaClassName = '',
  title,
  titleClassName = '',
}) {
  const classes = `ui-section-header ${className}`.trim()

  return (
    <div className={classes}>
      <h3 className={titleClassName}>{title}</h3>
      {meta ? <span className={metaClassName}>{meta}</span> : null}
    </div>
  )
}

export default SectionHeader
