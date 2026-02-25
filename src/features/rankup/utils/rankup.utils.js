/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeTitle(value) {
  return value.replaceAll('_', ' ').toLowerCase().trim()
}

/**
 * @param {import('../types').CartridgeItem[]} cartridges
 * @param {string} query
 * @returns {import('../types').CartridgeItem[]}
 */
export function filterCartridgesByQuery(cartridges, query) {
  const normalizedQuery = normalizeTitle(query)
  if (!normalizedQuery) {
    return cartridges
  }

  return cartridges.filter((item) =>
    normalizeTitle(item.title).includes(normalizedQuery),
  )
}

/**
 * @param {number} count
 * @param {string} suffix
 * @returns {string}
 */
export function buildVectorsCountLabel(count, suffix) {
  return `${count}${suffix}`
}
