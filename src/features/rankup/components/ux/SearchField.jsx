function SearchField({ className = '', ...props }) {
  const classes = `ux-search-field ${className}`.trim()

  return <input type="text" className={classes} {...props} />
}

export default SearchField
