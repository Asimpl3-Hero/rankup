/**
 * @typedef {Object} MetricPanel
 * @property {string} label
 * @property {string} value
 * @property {string} width
 * @property {string} detail
 * @property {boolean=} emphasized
 */

/**
 * @typedef {Object} CartridgeItem
 * @property {string} title
 * @property {string=} author
 * @property {string=} publishedAt
 * @property {number=} hype
*/

/**
 * @typedef {Object} RankupViewModel
 * @property {string} countLabel
 * @property {string=} errorMessage
 * @property {boolean} hasMore
 * @property {boolean} isLoading
 * @property {MetricPanel[]} metrics
 * @property {string} searchTerm
 * @property {CartridgeItem[]} visibleCartridges
 * @property {() => void} handleLoadMore
 * @property {(event: import('react').ChangeEvent<HTMLInputElement>) => void} handleSearchChange
 */

export const RankupTypes = Object.freeze({})
