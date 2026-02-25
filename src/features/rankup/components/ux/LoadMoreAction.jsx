import { Button } from '../ui'

function LoadMoreAction({
  buttonClassName = '',
  className = '',
  hasMore,
  isLoading = false,
  onLoadMore,
}) {
  const classes = `ux-load-more-action ${className}`.trim()

  return (
    <div className={classes}>
      <Button
        className={buttonClassName}
        type="button"
        onClick={onLoadMore}
        disabled={!hasMore || isLoading}
      >
        {isLoading ? 'LOADING_LEVELS...' : hasMore ? 'LOAD_MORE_LEVELS' : 'NO_MORE_LEVELS'}
      </Button>
    </div>
  )
}

export default LoadMoreAction
