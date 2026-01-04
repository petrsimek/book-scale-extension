/**
 * Pomocné funkce pro BookScale
 */

/**
 * Převede hodnotu na milimetry podle jednotky
 * @param {number} value - Hodnota k převodu
 * @param {string} unit - Jednotka ('mm' | 'cm' | 'in')
 * @returns {number} - Hodnota v milimetrech
 */
function convertToMm(value, unit) {
  const multiplier = UNIT_TO_MM[unit] || 1;
  return Math.round(value * multiplier);
}

/**
 * Parsuje rozměry z textu pomocí regex
 * @param {string} text - Text obsahující rozměry
 * @param {RegExp} regex - Regex pro extrakci rozměrů
 * @param {string} unit - Jednotka rozměrů ('mm' | 'cm' | 'in')
 * @returns {Object|null} - Objekt s width, height, thickness v mm nebo null
 */
function parseDimensions(text, regex, unit = 'mm') {
  const match = text.match(regex);
  if (!match) return null;

  // Nahradíme desetinnou čárku tečkou pro parseFloat
  const rawWidth = parseFloat(match[1].replace(',', '.'));
  const rawHeight = parseFloat(match[2].replace(',', '.'));
  const rawThickness = match[3] ? parseFloat(match[3].replace(',', '.')) : null;

  // Převod na milimetry
  const width = convertToMm(rawWidth, unit);
  const height = convertToMm(rawHeight, unit);
  const thickness = rawThickness ? convertToMm(rawThickness, unit) : null;

  // Validace - rozměry musí být větší než 50mm
  if (width < 50 || height < 50) return null;

  return { width, height, thickness };
}

/**
 * Najde rozměry na stránce pomocí selektorů
 * @param {Object} selectors - Selektory z konfigurace webu
 * @param {Object} settings - Nastavení z konfigurace webu
 * @returns {Object|null} - Objekt s rozměry a elementem nebo null
 */
function findDimensionsOnPage(selectors, settings = {}) {
  const containers = document.querySelectorAll(selectors.dimensions_container);
  const unit = settings.unit || 'mm';

  for (const container of containers) {
    const text = container.textContent || '';
    const dimensions = parseDimensions(text, selectors.dimensions_regex, unit);
    if (dimensions) {
      // Vrátíme i element, kde byly rozměry nalezeny
      dimensions.element = container;
      return dimensions;
    }
  }

  return null;
}

/**
 * Najde název knihy na stránce
 * @param {string} selector - CSS selektor pro název
 * @returns {string} - Název knihy nebo výchozí text
 */
function findBookTitle(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    return i18n('thisBook');
  }

  // Projdeme childNodes a vezmeme text jen před prvním <br>
  let title = '';
  for (const node of element.childNodes) {
    // Pokud narazíme na BR, končíme
    if (node.nodeName === 'BR') {
      break;
    }
    // Přidáme textový obsah (textové uzly nebo elementy)
    if (node.nodeType === Node.TEXT_NODE) {
      title += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      title += node.textContent;
    }
  }

  title = title.trim();
  return title || element.textContent.trim() || i18n('thisBook');
}

/**
 * Smart Default algoritmus - najde nejbližší referenční formát
 * @param {number} bookWidth - Šířka knihy v mm
 * @param {number} bookHeight - Výška knihy v mm
 * @param {Array} formats - Pole referenčních formátů
 * @param {Array} allowedCategories - Povolené kategorie formátů
 * @returns {Object} - Nejbližší referenční formát
 */
function findClosestFormat(bookWidth, bookHeight, formats, allowedCategories) {
  let closestFormat = formats[0];
  let minDelta = Infinity;

  for (const format of formats) {
    // Filtrování podle povolených kategorií
    if (allowedCategories && !allowedCategories.includes(format.category)) {
      continue;
    }

    const delta = Math.abs(bookWidth - format.width) + Math.abs(bookHeight - format.height);

    if (delta < minDelta) {
      minDelta = delta;
      closestFormat = format;
    }
  }

  return closestFormat;
}

/**
 * Vypočítá poměr tloušťky knihy k referenčnímu objektu
 * @param {number} bookThickness - Tloušťka knihy v mm
 * @param {number} objectSize - Velikost objektu v mm
 * @returns {Object} - Objekt s počtem celých a zbytkem
 */
function calculateThicknessRatio(bookThickness, objectSize) {
  const ratio = bookThickness / objectSize;
  const wholeCount = Math.floor(ratio);
  const remainder = ratio - wholeCount;

  return {
    ratio,
    wholeCount,
    remainder,
    displayCount: Math.ceil(ratio)
  };
}

/**
 * Vypočítá měřítko pro vizualizaci
 * @param {number} bookWidth - Šířka knihy v mm
 * @param {number} bookHeight - Výška knihy v mm
 * @param {number} refWidth - Šířka reference v mm
 * @param {number} refHeight - Výška reference v mm
 * @param {number} maxContainerSize - Maximální velikost kontejneru v px
 * @returns {number} - Měřítko (px per mm)
 */
function calculateScale(bookWidth, bookHeight, refWidth, refHeight, maxContainerSize) {
  const maxWidth = Math.max(bookWidth, refWidth);
  const maxHeight = Math.max(bookHeight, refHeight);
  const maxDimension = Math.max(maxWidth, maxHeight);

  // Necháme trochu padding
  return (maxContainerSize - 40) / maxDimension;
}

/**
 * Filtruje formáty podle povolených kategorií
 * @param {Array} formats - Všechny formáty
 * @param {Array} allowedCategories - Povolené kategorie
 * @returns {Array} - Filtrované formáty
 */
function filterFormatsByCategory(formats, allowedCategories) {
  if (!allowedCategories || allowedCategories.length === 0) {
    return formats;
  }
  return formats.filter(f => allowedCategories.includes(f.category));
}
