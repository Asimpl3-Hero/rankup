/**
 * @typedef {Object} MetricPanel
 * @property {string} label
 * @property {string} value
 * @property {string} width
 * @property {string} detail
 * @property {boolean=} emphasized
 */

/**
 * @typedef {Object} RankupApiVideoItem
 * @property {string} [id]
 * @property {string} [thumbnail]
 * @property {string} [title]
 * @property {string} [author]
 * @property {string} [publishedAt]
 * @property {number} [hype]
 */

/**
 * @typedef {Object} CartridgeItem
 * @property {string=} id
 * @property {string} title
 * @property {string=} thumbnail
 * @property {string=} author
 * @property {string=} publishedAt
 * @property {number=} hype
*/

/**
 * @typedef {Object} RankupMetricPanelsCopy
 * @property {string} avgLabel
 * @property {string} avgDetail
 * @property {string} topLabel
 * @property {string} topDetail
 * @property {string} freshnessLabel
 * @property {string} freshnessDetail
 * @property {string} diversityLabel
 * @property {string} diversityDetail
 */

/**
 * @typedef {Object} RankupI18n
 * @property {{ offlinePrefix: string, unknownError: string }} api
 * @property {{ vectorsSuffix: string }} counters
 * @property {RankupMetricPanelsCopy} metricPanels
 */

/**
 * @typedef {Object} RankupFeedModel
 * @property {boolean} hasMore
 * @property {CartridgeItem[]} rankingPool
 * @property {string} searchTerm
 * @property {CartridgeItem[]} visibleCartridges
 * @property {() => void} handleLoadMore
 * @property {(event: import('react').ChangeEvent<HTMLInputElement>) => void} handleSearchChange
 */

/**
 * @typedef {Object} RankupVideosModel
 * @property {CartridgeItem[]} videos
 * @property {boolean} isLoading
 * @property {boolean} hasApiError
 */

/**
 * @typedef {Object} RankupRankingCopy
 * @property {{ A: string, B: string, C: string, D: string, S: string }} [tiers]
 * @property {{ dominance?: string, lowSignal?: string, stable?: string, uptrend?: string }} [messages]
 */

/**
 * @typedef {Object} RankupViewModel
 * @property {string} countLabel
 * @property {string=} errorMessage
 * @property {boolean} hasMore
 * @property {boolean} isLoading
 * @property {MetricPanel[]} metrics
 * @property {CartridgeItem[]} rankingPool
 * @property {string} searchTerm
 * @property {CartridgeItem[]} visibleCartridges
 * @property {() => void} handleLoadMore
 * @property {(event: import('react').ChangeEvent<HTMLInputElement>) => void} handleSearchChange
 */

export {}
