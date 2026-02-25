export const RANKUP_CONFIG = Object.freeze({
  initialVisibleCartridges: 8,
  loadMoreStep: 4,
  apiBaseUrl: import.meta.env.VITE_RANKUP_API_URL?.trim() ?? '',
  videosEndpoint: '/api/videos',
})

export const RANKUP_COPY = Object.freeze({
  vectorsFoundSuffix: '_VECTORS_FOUND',
})
