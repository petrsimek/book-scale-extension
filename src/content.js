/**
 * BookScale - Main Content Script
 * Detekuje rozměry knih na podporovaných webech a vkládá vizualizační nástroj.
 */

(function() {
  'use strict';

  const DEBUG = true;

  function log(...args) {
    if (DEBUG) {
      console.log('[BookScale]', ...args);
    }
  }

  /**
   * Inicializace rozšíření
   */
  function init() {
    const hostname = window.location.hostname;
    log('Inicializace na:', hostname);

    const siteConfig = getSiteConfig(hostname);

    if (!siteConfig) {
      log('Web není v konfiguraci');
      return;
    }

    log('Konfigurace nalezena:', siteConfig.domain);

    // Počkáme na úplné načtení DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => processPage(siteConfig));
    } else {
      processPage(siteConfig);
    }
  }

  /**
   * Zpracuje stránku - najde rozměry a vloží trigger
   * @param {Object} siteConfig - Konfigurace webu
   */
  function processPage(siteConfig) {
    const selectors = siteConfig.selectors;
    log('Zpracovávám stránku, selektory:', selectors);

    // Najdeme rozměry
    const dimensions = findDimensionsOnPage(selectors);
    log('Nalezené rozměry:', dimensions);

    if (!dimensions) {
      log('Rozměry nenalezeny!');
      // Debug: vypíšeme všechny dd elementy
      const dds = document.querySelectorAll('dd');
      log('Počet dd elementů:', dds.length);
      dds.forEach((dd, i) => {
        if (dd.textContent.includes('mm')) {
          log(`dd[${i}]:`, dd.textContent.trim());
        }
      });
      return;
    }

    // Najdeme název knihy
    const title = findBookTitle(selectors.title);
    log('Název knihy:', title);

    // Použijeme element s rozměry jako kotvu (nebo fallback na selektor)
    const anchor = dimensions.element || document.querySelector(selectors.anchor);
    log('Kotevní element:', anchor);

    if (!anchor) {
      log('Kotva nenalezena!');
      return;
    }

    // Data o knize
    const bookData = {
      dimensions,
      title
    };

    log('Vkládám trigger button');

    // Vložíme trigger ikonku
    createTriggerButton(
      anchor,
      selectors.anchor_method,
      () => {
        showVisualizerModal(bookData, siteConfig.settings);
      }
    );

    log('Trigger button vložen úspěšně');
  }

  // Spuštění
  init();
})();
