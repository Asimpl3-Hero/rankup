import { RANKUP_CONFIG } from '../config'

/**
 * @typedef {Object} RankupApiVideoItem
 * @property {string} [thumbnail]
 * @property {string} [title]
 * @property {string} [author]
 * @property {string} [publishedAt]
 * @property {number} [hype]
 */

/**
 * @param {string} baseUrl
 * @param {string} endpoint
 * @returns {string}
 */
function buildEndpointUrl(baseUrl, endpoint) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  return normalizedBaseUrl ? `${normalizedBaseUrl}${normalizedEndpoint}` : normalizedEndpoint
}

/**
 * @param {RankupApiVideoItem} item
 * @returns {import('../types').CartridgeItem}
 */
function mapApiVideoToCartridge(item) {
  const parsedHype =
    typeof item.hype === 'number' && Number.isFinite(item.hype) && item.hype >= 0
      ? item.hype
      : 0
  const normalizedThumbnail = item.thumbnail?.trim() || undefined

  return {
    thumbnail: normalizedThumbnail,
    title: item.title?.trim() || 'UNTITLED_VIDEO',
    author: item.author?.trim() || 'UNKNOWN_CHANNEL',
    publishedAt: item.publishedAt?.trim() || 'SIN_FECHA',
    hype: parsedHype,
  }
}

/**
 * @param {AbortSignal=} signal
 * @returns {Promise<import('../types').CartridgeItem[]>}
 */
export async function fetchRankupVideos(signal) {
  const url = buildEndpointUrl(
    RANKUP_CONFIG.apiBaseUrl,
    RANKUP_CONFIG.videosEndpoint,
  )

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const payload = await response.json()
  if (!Array.isArray(payload)) {
    throw new Error('Videos payload is not an array')
  }

  return payload.map((item) => mapApiVideoToCartridge(item))
}
