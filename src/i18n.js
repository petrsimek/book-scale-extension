/**
 * Internationalization helper for BookScale
 */

/**
 * Get localized message
 * @param {string} key - Message key from messages.json
 * @param {Array} substitutions - Optional substitutions for placeholders
 * @returns {string} - Localized message
 */
function i18n(key, substitutions = []) {
  try {
    const message = chrome.i18n.getMessage(key, substitutions);
    return message || key;
  } catch (e) {
    // Fallback if chrome.i18n is not available
    return key;
  }
}

/**
 * Localized format names (keyed by format id)
 */
const FORMAT_NAMES = {
  a4: () => i18n('formatA4'),
  a5: () => i18n('formatA5'),
  us_comic: () => i18n('formatUSComic'),
  us_omnibus: () => i18n('formatOmnibus'),
  tankobon: () => i18n('formatTankobon'),
  bd_album: () => i18n('formatBDAlbum')
};

/**
 * Localized category names
 */
const CATEGORY_NAMES = {
  iso: () => i18n('categoryISO'),
  us_comics: () => i18n('categoryUSComics'),
  manga: () => i18n('categoryManga'),
  bd: () => i18n('categoryBD'),
  books: () => i18n('categoryBooks')
};

/**
 * Localized thickness object names (keyed by object id)
 */
const OBJECT_NAMES = {
  matchbox: () => i18n('objectMatchbox'),
  coin: () => i18n('objectCoin')
};

/**
 * Get localized format name
 * @param {string} id - Format id
 * @param {string} fallback - Fallback name
 * @returns {string} - Localized name
 */
function getFormatName(id, fallback) {
  return FORMAT_NAMES[id] ? FORMAT_NAMES[id]() : fallback;
}

/**
 * Get localized category name
 * @param {string} id - Category id
 * @param {string} fallback - Fallback name
 * @returns {string} - Localized name
 */
function getCategoryName(id, fallback) {
  return CATEGORY_NAMES[id] ? CATEGORY_NAMES[id]() : fallback;
}

/**
 * Get localized object name
 * @param {string} id - Object id
 * @param {string} fallback - Fallback name
 * @returns {string} - Localized name
 */
function getObjectName(id, fallback) {
  return OBJECT_NAMES[id] ? OBJECT_NAMES[id]() : fallback;
}
