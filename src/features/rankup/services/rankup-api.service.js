import { RANKUP_CONFIG } from '../config'
import { RANKUP_PLACEHOLDER_TOKENS } from '../i18n'
import { HYPE_PERCENT_MAX, HYPE_UNIT_MAX } from '../constants'

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
 * @param {import('../types').RankupApiVideoItem} item
 * @returns {import('../types').CartridgeItem}
 */
function mapApiVideoToCartridge(item) {
  const parsedHype = toNormalizedHype(item.hype)
  const normalizedId = item.id?.trim() || undefined
  const normalizedThumbnail = item.thumbnail?.trim() || undefined
  const normalizedVideoUrl = item.videoUrl?.trim() || item.video?.trim() || item.mediaUrl?.trim() || undefined

  return {
    id: normalizedId,
    thumbnail: normalizedThumbnail,
    videoUrl: normalizedVideoUrl,
    title: item.title?.trim() || RANKUP_PLACEHOLDER_TOKENS.UNTITLED_VIDEO,
    author: item.author?.trim() || RANKUP_PLACEHOLDER_TOKENS.UNKNOWN_CHANNEL,
    publishedAt: item.publishedAt?.trim() || RANKUP_PLACEHOLDER_TOKENS.NO_DATE,
    hype: parsedHype,
  }
}

/**
 * @param {number=} value
 * @returns {number}
 */
function toNormalizedHype(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0
  }

  if (value <= HYPE_UNIT_MAX) {
    return value
  }

  if (value <= HYPE_PERCENT_MAX) {
    return value / HYPE_PERCENT_MAX
  }

  return HYPE_UNIT_MAX
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
