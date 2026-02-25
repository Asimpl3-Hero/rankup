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
 * @property {string=} views
 * @property {string=} likes
 */

/**
 * @typedef {Object} RankupViewModel
 * @property {string} countLabel
 * @property {boolean} hasMore
 * @property {MetricPanel[]} metrics
 * @property {string} searchTerm
 * @property {CartridgeItem[]} visibleCartridges
 * @property {() => void} handleLoadMore
 * @property {(event: import('react').ChangeEvent<HTMLInputElement>) => void} handleSearchChange
 */

export const RankupTypes = Object.freeze({})
