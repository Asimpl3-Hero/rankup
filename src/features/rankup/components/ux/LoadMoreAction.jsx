import { Button } from '../ui'

function LoadMoreAction({
  buttonClassName = '',
  className = '',
  labels = {
    loading: 'LOADING...',
    noMore: 'NO_MORE',
    withMore: 'LOAD_MORE',
  },
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
        {isLoading ? labels.loading : hasMore ? labels.withMore : labels.noMore}
      </Button>
    </div>
  )
}

export default LoadMoreAction
