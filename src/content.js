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
   * Počká na element (pro SPA stránky)
   * @param {string} selector - CSS selektor
   * @param {number} maxAttempts - Maximální počet pokusů
   * @param {number} interval - Interval mezi pokusy v ms
   * @returns {Promise<Element|null>}
   */
  function waitForElement(selector, maxAttempts = 20, interval = 250) {
    return new Promise((resolve) => {
      let attempts = 0;
      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, interval);
        } else {
          resolve(null);
        }
      };
      check();
    });
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
      document.addEventListener('DOMContentLoaded', () => tryProcessPage(siteConfig));
    } else {
      tryProcessPage(siteConfig);
    }
  }

  /**
   * Pokusí se zpracovat stránku, případně počká na SPA obsah
   */
  async function tryProcessPage(siteConfig) {
    const selectors = siteConfig.selectors;

    // Nejdřív zkusíme hned
    let container = document.querySelector(selectors.dimensions_container);

    // Pokud element neexistuje, počkáme (SPA)
    if (!container) {
      log('Element nenalezen, čekám na SPA obsah...');
      container = await waitForElement(selectors.dimensions_container);
    }

    if (container) {
      processPage(siteConfig);
    } else {
      log('Element nenalezen, nastavuji MutationObserver...');
      // Sledujeme DOM změny (pro stránky s taby)
      observeDOMChanges(siteConfig);
    }
  }

  /**
   * Sleduje DOM změny a zpracuje stránku když se objeví požadovaný element
   */
  function observeDOMChanges(siteConfig) {
    const selectors = siteConfig.selectors;
    let processed = false;

    // Sledujeme kliknutí na stránce
    document.addEventListener('click', () => {
      if (processed) return;

      // Krátké zpoždění aby se DOM stihl aktualizovat
      setTimeout(() => {
        const container = document.querySelector(selectors.dimensions_container);
        if (container) {
          const text = container.textContent || '';
          log('Po kliku - container text length:', text.length);

          if (/výška|šířka|rozměr|\d+\s*mm|\d+\s*cm/i.test(text)) {
            log('Element s rozměry nalezen po kliku');
            processed = true;
            processPage(siteConfig);
          }
        }
      }, 300);
    });

    log('Click listener nastaven');
  }

  /**
   * Zpracuje stránku - najde rozměry a vloží trigger
   * @param {Object} siteConfig - Konfigurace webu
   */
  function processPage(siteConfig) {
    const selectors = siteConfig.selectors;
    log('Zpracovávám stránku, selektory:', selectors);

    // Najdeme rozměry
    const dimensions = findDimensionsOnPage(selectors, siteConfig.settings);
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
    let anchor = null;

    // Pokud máme anchor_text_match, hledáme element obsahující daný text (má prioritu)
    if (selectors.anchor_text_match) {
      const candidates = document.querySelectorAll(selectors.anchor);
      for (const el of candidates) {
        if (selectors.anchor_text_match.test(el.textContent)) {
          anchor = el;
          break;
        }
      }
    }

    // Fallback na dimensions.element nebo první nalezený anchor
    if (!anchor) {
      anchor = dimensions.element || document.querySelector(selectors.anchor);
    }

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
