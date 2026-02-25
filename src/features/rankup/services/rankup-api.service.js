import { RANKUP_CONFIG } from '../config'
import { RANKUP_PLACEHOLDER_TOKENS } from '../i18n'

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
    title: item.title?.trim() || RANKUP_PLACEHOLDER_TOKENS.UNTITLED_VIDEO,
    author: item.author?.trim() || RANKUP_PLACEHOLDER_TOKENS.UNKNOWN_CHANNEL,
    publishedAt: item.publishedAt?.trim() || RANKUP_PLACEHOLDER_TOKENS.NO_DATE,
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
    throw new Error(`Solicitud fallida con estado ${response.status}`)
  }

  const payload = await response.json()
  if (!Array.isArray(payload)) {
    throw new Error('La respuesta de videos no es un arreglo')
  }

  return payload.map((item) => mapApiVideoToCartridge(item))
}
