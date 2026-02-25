export const RANKUP_CONFIG = Object.freeze({
  initialVisibleCartridges: 14,
  loadMoreStep: 8,
  searchDebounceMs: 180,
  apiBaseUrl: import.meta.env.VITE_RANKUP_API_URL?.trim() ?? '',
  videosEndpoint: '/api/videos',
})
