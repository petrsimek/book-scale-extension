/**
 * Konfigurace webů pro parsování rozměrů knih
 */
const SITES_CONFIG = [
  {
    domain: 'comicsdb.cz',
    selectors: {
      // Kontejner, kde hledat rozměry - dd elementy v definition listech
      dimensions_container: 'dd, td, .info-value, .book-info',
      // Regex: Group 1=Šířka, Group 2=Výška, Group 3=Tloušťka (volitelné)
      dimensions_regex: /(\d+)\s*[xX×]\s*(\d+)(?:\s*[xX×]\s*(\d+))?\s*mm/i,
      // Kde hledat název knihy
      title: 'h5, h1, .comic-title, .book-title',
      // Kotva: Element, ke kterému připojíme spouštěcí ikonku (dd s rozměry)
      anchor: '#info > dl > dd:nth-child(10), dd',
      anchor_method: 'append' // 'append' | 'prepend' | 'after'
    },
    settings: {
      // Které skupiny formátů nabízet
      preferred_groups: ['iso', 'us_comics', 'manga', 'bd']
    }
  }
];

/**
 * Najde konfiguraci pro aktuální doménu
 * @param {string} hostname - Hostname aktuální stránky
 * @returns {Object|null} - Konfigurace webu nebo null
 */
function getSiteConfig(hostname) {
  return SITES_CONFIG.find(config => hostname.includes(config.domain)) || null;
}
