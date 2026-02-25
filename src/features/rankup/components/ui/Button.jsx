function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const classes = `ui-button ui-button--${variant} ${className}`.trim()

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
