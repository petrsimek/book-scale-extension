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
      preferred_groups: ['iso', 'us_comics', 'manga', 'bd'],
      // Jednotka rozměrů: 'mm' | 'cm' | 'in' (palce)
      // Pokud web neuvádí jednotku, specifikuj ji zde
      unit: 'mm'
    }
  },
  {
    domain: 'obchod.crew.cz',
    selectors: {
      // Kontejner - pouze p element v info sekci
      dimensions_container: '#detail_info > p',
      // Regex: Šířka × Výška mm (bez tloušťky)
      dimensions_regex: /(\d+)\s*[×xX]\s*(\d+)\s*mm/i,
      // Název produktu
      title: 'h1',
      // Kotva - použije se element kde byly rozměry nalezeny
      anchor: '#detail_info > p',
      // Vloží ikonu přímo za text s rozměry
      anchor_method: 'after_text'
    },
    settings: {
      preferred_groups: ['iso', 'us_comics', 'manga', 'bd'],
      unit: 'mm'
    }
  },
  {
    domain: 'comicspoint.cz',
    selectors: {
      // Kontejner - buňky tabulky s parametry
      dimensions_container: '.detail-parameters-wrapper td, .p-param-block td',
      // Regex: Šířka x Výška mm
      dimensions_regex: /(\d+)\s*[×xX]\s*(\d+)\s*mm/i,
      // Název produktu
      title: 'h1',
      // Kotva - buňka s rozměry
      anchor: '.detail-parameters-wrapper td',
      anchor_method: 'append'
    },
    settings: {
      preferred_groups: ['iso', 'us_comics', 'manga', 'bd'],
      unit: 'mm'
    }
  },
  {
    domain: 'comicscentrum.cz',
    selectors: {
      // Kontejner - odstavec s podrobnostmi
      dimensions_container: '#podrobnosti + p, #vmMainPage p',
      // Regex: šířka: XXX mm ... výška: XXX mm ... šířka hřbetu: XXX mm
      dimensions_regex: /šířka:\s*(\d+)\s*mm[\s\S]*?výška:\s*(\d+)\s*mm(?:[\s\S]*?(?:šířka\s*hřbetu|hřbet):\s*(\d+)\s*mm)?/i,
      // Název produktu
      title: 'h1',
      // Kotva - element s rozměry
      anchor: '#podrobnosti + p',
      anchor_method: 'after_text'
    },
    settings: {
      preferred_groups: ['iso', 'us_comics', 'manga', 'bd'],
      unit: 'mm'
    }
  }
];

/**
 * Převodní tabulka jednotek na milimetry
 */
const UNIT_TO_MM = {
  mm: 1,
  cm: 10,
  in: 25.4
};

/**
 * Najde konfiguraci pro aktuální doménu
 * @param {string} hostname - Hostname aktuální stránky
 * @returns {Object|null} - Konfigurace webu nebo null
 */
function getSiteConfig(hostname) {
  return SITES_CONFIG.find(config => hostname.includes(config.domain)) || null;
}
