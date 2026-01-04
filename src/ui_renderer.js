/**
 * UI Renderer pro BookScale
 * Používá Shadow DOM pro izolaci od CSS webu
 */

/**
 * CSS styly pro Shadow DOM
 */
const VISUALIZER_CSS = `
/* CSS Reset pro Shadow DOM */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Spouštěcí ikonka */
.bdv-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  cursor: pointer;
  background: #4A90D9;
  border-radius: 4px;
  border: none;
  vertical-align: middle;
  transition: background-color 0.2s, transform 0.2s;
}

.bdv-trigger:hover {
  background: #357ABD;
  transform: scale(1.1);
}

.bdv-trigger svg {
  width: 16px;
  height: 16px;
  fill: white;
}

/* Overlay pozadí */
.bdv-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hlavní modal */
.bdv-modal {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 480px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  z-index: 99999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #333;
}

/* Header modalu */
.bdv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.bdv-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}

.bdv-header-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bdv-save-btn {
  padding: 6px 12px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.bdv-save-btn:hover {
  background: #45a049;
}

.bdv-save-btn.saved {
  background: #9e9e9e;
  cursor: default;
}

.bdv-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.bdv-close:hover {
  background: #e0e0e0;
}

.bdv-saved-book-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bdv-delete-saved {
  color: #e53935;
  cursor: pointer;
  margin-left: 8px;
  font-weight: bold;
}

.bdv-delete-saved:hover {
  color: #c62828;
}

.bdv-clear-all {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px dashed #e53935;
  background: transparent;
  color: #e53935;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  transition: all 0.2s;
}

.bdv-clear-all:hover {
  background: #ffebee;
}

.bdv-close svg {
  width: 20px;
  height: 20px;
  fill: #666;
}

/* Obsah modalu */
.bdv-content {
  padding: 20px;
}

/* Sekce */
.bdv-section {
  margin-bottom: 24px;
}

.bdv-section:last-child {
  margin-bottom: 0;
}

.bdv-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Select dropdown */
.bdv-select-wrapper {
  margin-bottom: 16px;
}

.bdv-select-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.bdv-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.bdv-select:hover {
  border-color: #4A90D9;
}

.bdv-select:focus {
  outline: none;
  border-color: #4A90D9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.2);
}

/* 2D Vizualizace kontejner */
.bdv-2d-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 400px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Vizualizační wrapper - centruje oba obdélníky */
.bdv-viz-wrapper {
  position: relative;
}

/* Kniha (Target) */
.bdv-book-rect {
  position: absolute;
  border: 2px solid #e53935;
  background: repeating-linear-gradient(
    45deg,
    rgba(229, 57, 53, 0.1),
    rgba(229, 57, 53, 0.1) 10px,
    rgba(229, 57, 53, 0.2) 10px,
    rgba(229, 57, 53, 0.2) 20px
  );
  transform: translate(-50%, -50%);
  overflow: visible;
}

.bdv-rect-label {
  position: absolute;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bdv-book-rect .bdv-rect-label {
  top: 4px;
  left: 4px;
  color: #c62828;
  background: rgba(255, 255, 255, 0.9);
}

.bdv-ref-rect .bdv-rect-label {
  bottom: 4px;
  right: 4px;
  color: rgba(80, 130, 180, 0.8);
  background: rgba(255, 255, 255, 0.85);
}

/* Reference (Standard) - světlejší, méně výrazná */
.bdv-ref-rect {
  position: absolute;
  border: 2px dashed rgba(100, 160, 220, 0.6);
  background: rgba(240, 248, 255, 0.5);
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  overflow: visible;
}

/* Rozměry popisky */
.bdv-dimensions-info {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.bdv-dim-item {
  text-align: center;
}

.bdv-dim-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.bdv-dim-value {
  font-size: 16px;
  font-weight: 600;
}

.bdv-dim-value.book {
  color: #e53935;
}

.bdv-dim-value.ref {
  color: #1976D2;
}

/* Tloušťka sekce */
.bdv-thickness-container {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.bdv-spine {
  height: 60px;
  background: linear-gradient(90deg, #8B4513, #A0522D, #8B4513);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  min-width: 20px;
}

.bdv-objects-row {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.bdv-object-icon {
  height: 40px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
}

.bdv-object-icon.partial {
  opacity: 0.5;
}

.bdv-thickness-info {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
}

.bdv-thickness-value {
  font-weight: 600;
  color: #333;
}

/* Responsivita */
@media (max-width: 500px) {
  .bdv-modal {
    width: 95vw;
    margin: 10px;
  }

  .bdv-2d-container {
    max-height: 300px;
  }
}
`;

/**
 * SVG ikona pravítka
 */
const RULER_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Kniha -->
  <rect x="2" y="3" width="13" height="18" rx="1" fill="white"/>
  <rect x="4" y="5" width="9" height="14" fill="rgba(255,255,255,0.3)"/>
  <line x1="5" y1="8" x2="12" y2="8" stroke="white" stroke-width="0.8" opacity="0.5"/>
  <line x1="5" y1="11" x2="12" y2="11" stroke="white" stroke-width="0.8" opacity="0.5"/>
  <line x1="5" y1="14" x2="12" y2="14" stroke="white" stroke-width="0.8" opacity="0.5"/>
  <!-- Pravítko -->
  <rect x="17" y="3" width="5" height="18" rx="0.5" fill="white"/>
  <line x1="17" y1="5" x2="20" y2="5" stroke="rgba(74,144,217,1)" stroke-width="1"/>
  <line x1="17" y1="8" x2="19" y2="8" stroke="rgba(74,144,217,1)" stroke-width="1"/>
  <line x1="17" y1="11" x2="20" y2="11" stroke="rgba(74,144,217,1)" stroke-width="1"/>
  <line x1="17" y1="14" x2="19" y2="14" stroke="rgba(74,144,217,1)" stroke-width="1"/>
  <line x1="17" y1="17" x2="20" y2="17" stroke="rgba(74,144,217,1)" stroke-width="1"/>
</svg>
`;

/**
 * SVG ikona zavření
 */
const CLOSE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>
`;

/**
 * Vloží element za text obsahující rozměry (před <br>)
 * Používá se pro stránky kde jsou rozměry v textu s dalšími informacemi
 * @param {HTMLElement} container - Kontejner s textem
 * @param {HTMLElement} button - Button k vložení
 */
function insertAfterDimensionText(container, button) {
  // Regex pro nalezení rozměrů
  const dimensionRegex = /\d+\s*[×xX]\s*\d+\s*mm/i;

  // Procházíme childNodes a hledáme element nebo text s rozměry
  const childNodes = Array.from(container.childNodes);

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];

    // Hledáme textový uzel s rozměry
    if (node.nodeType === Node.TEXT_NODE && dimensionRegex.test(node.textContent)) {
      // Našli jsme text s rozměry - vložíme button za něj
      const nextNode = childNodes[i + 1];
      if (nextNode) {
        container.insertBefore(button, nextNode);
      } else {
        container.appendChild(button);
      }
      return;
    }

    // Hledáme element (např. STRONG) obsahující rozměry
    if (node.nodeType === Node.ELEMENT_NODE && dimensionRegex.test(node.textContent)) {
      // Našli jsme element s rozměry - vložíme button za něj (před BR)
      const nextNode = childNodes[i + 1];
      if (nextNode) {
        container.insertBefore(button, nextNode);
      } else {
        container.appendChild(button);
      }
      return;
    }
  }

  // Fallback - pokud nenajdeme, přidáme na konec
  container.appendChild(button);
}

/**
 * Vytvoří Shadow Host pro trigger ikonku
 * @param {HTMLElement} anchorElement - Element, ke kterému připojit trigger
 * @param {string} method - Metoda připojení ('append', 'prepend', 'after', 'after_text')
 * @param {Function} onClick - Callback při kliknutí
 * @returns {HTMLElement} - Shadow host element
 */
function createTriggerButton(anchorElement, method, onClick) {
  // Vytvoříme button přímo bez Shadow DOM pro lepší kompatibilitu
  const button = document.createElement('button');
  button.className = 'bdv-trigger-btn';
  button.innerHTML = RULER_ICON;
  button.title = i18n('triggerTitle');

  // Inline styly s !important pro přepsání Bootstrap
  button.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 28px !important;
    height: 28px !important;
    margin-left: 10px !important;
    cursor: pointer !important;
    background: #4A90D9 !important;
    border-radius: 6px !important;
    border: none !important;
    vertical-align: middle !important;
    padding: 4px !important;
    transition: background-color 0.2s, transform 0.2s !important;
  `;

  // SVG styling
  const svg = button.querySelector('svg');
  if (svg) {
    svg.style.cssText = 'width: 18px !important; height: 18px !important; fill: white !important;';
  }

  button.addEventListener('mouseenter', () => {
    button.style.background = '#357ABD';
    button.style.transform = 'scale(1.1)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = '#4A90D9';
    button.style.transform = 'scale(1)';
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });

  // Připojení k DOM
  switch (method) {
    case 'prepend':
      anchorElement.prepend(button);
      break;
    case 'after':
      anchorElement.after(button);
      break;
    case 'after_text':
      // Speciální metoda: vloží ikonu přímo za text s rozměry (před <br>)
      insertAfterDimensionText(anchorElement, button);
      break;
    case 'append':
    default:
      anchorElement.appendChild(button);
      break;
  }

  console.log('[BookScale] Button vytvořen:', button);
  console.log('[BookScale] Button parentElement:', button.parentElement);

  const styles = window.getComputedStyle(button);
  console.log('[BookScale] Button styles:', {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    width: styles.width,
    height: styles.height,
    position: styles.position
  });

  const rect = button.getBoundingClientRect();
  console.log('[BookScale] Button position:', {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  });

  return button;
}

/**
 * Vytvoří a zobrazí modální okno s vizualizací
 * @param {Object} bookData - Data o knize (dimensions, title)
 * @param {Object} siteSettings - Nastavení webu
 */
function showVisualizerModal(bookData, siteSettings) {
  // Vytvoření Shadow Host pro modal
  const shadowHost = document.createElement('div');
  shadowHost.className = 'bdv-modal-host';
  const shadow = shadowHost.attachShadow({ mode: 'closed' });

  // Styly
  const style = document.createElement('style');
  style.textContent = VISUALIZER_CSS;
  shadow.appendChild(style);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'bdv-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  shadow.appendChild(overlay);

  // Modal
  const modal = document.createElement('div');
  modal.className = 'bdv-modal';
  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  overlay.appendChild(modal);

  // Header
  const header = document.createElement('div');
  header.className = 'bdv-header';

  // Zjistit, zda je kniha již uložena
  const alreadySaved = isBookSaved(
    window.location.href,
    bookData.title,
    bookData.dimensions.width,
    bookData.dimensions.height
  );

  header.innerHTML = `
    <span class="bdv-title">${i18n('modalTitle', [bookData.title])}</span>
    <div class="bdv-header-buttons">
      <button class="bdv-save-btn ${alreadySaved ? 'saved' : ''}">${alreadySaved ? i18n('bookAlreadySaved') : i18n('saveBook')}</button>
      <button class="bdv-close">${CLOSE_ICON}</button>
    </div>
  `;
  modal.appendChild(header);

  header.querySelector('.bdv-close').addEventListener('click', closeModal);

  // Uložení knihy
  const saveBtn = header.querySelector('.bdv-save-btn');
  if (!alreadySaved) {
    saveBtn.addEventListener('click', () => {
      const success = saveBook({
        title: bookData.title,
        width: bookData.dimensions.width,
        height: bookData.dimensions.height,
        thickness: bookData.dimensions.thickness,
        url: window.location.href
      });

      if (success) {
        saveBtn.textContent = i18n('bookSaved');
        saveBtn.classList.add('saved');
        // Aktualizovat selecty s formáty a tloušťkou
        if (typeof refreshFormatSelect === 'function') {
          refreshFormatSelect();
        }
        if (typeof refreshThicknessSelect === 'function') {
          refreshThicknessSelect();
        }
      }
    });
  }

  // Content
  const content = document.createElement('div');
  content.className = 'bdv-content';
  modal.appendChild(content);

  // Všechny formáty pro select
  const allFormats = REFERENCE_FORMATS;

  // Nejbližší formát (preferuje nastavené kategorie, ale prohledá všechny)
  const defaultFormat = findClosestFormat(
    bookData.dimensions.width,
    bookData.dimensions.height,
    allFormats,
    siteSettings.preferred_groups
  );

  // State
  let currentFormat = defaultFormat;
  let currentThicknessObject = THICKNESS_OBJECTS[0];

  // 2D Sekce
  const section2D = createSection(i18n('sectionDimensions'), create2DVisualization);
  content.appendChild(section2D);

  // Tloušťka sekce (pokud je dostupná)
  if (bookData.dimensions.thickness) {
    const thicknessSection = createSection(i18n('sectionThickness'), createThicknessVisualization);
    content.appendChild(thicknessSection);
  }

  // Připojení k body
  document.body.appendChild(shadowHost);

  // Keyboard handler
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', keyHandler);

  function closeModal() {
    document.removeEventListener('keydown', keyHandler);
    shadowHost.remove();
  }

  function createSection(title, contentCreator) {
    const section = document.createElement('div');
    section.className = 'bdv-section';

    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'bdv-section-title';
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    contentCreator(section);
    return section;
  }

  function create2DVisualization(container) {
    // Select pro formát
    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'bdv-select-wrapper';

    const select = document.createElement('select');
    select.className = 'bdv-select';

    // Funkce pro naplnění selectu
    function populateSelect() {
      select.innerHTML = '';

      // Seskupení podle kategorií
      const categories = {};
      allFormats.forEach(format => {
        if (!categories[format.category]) {
          categories[format.category] = [];
        }
        categories[format.category].push(format);
      });

      Object.entries(categories).forEach(([category, formats]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = getCategoryName(category, FORMAT_CATEGORIES[category] || category);

        formats.forEach(format => {
          const option = document.createElement('option');
          option.value = format.id;
          option.textContent = `${format.name} (${format.width} × ${format.height} mm)`;
          if (format.id === currentFormat.id) {
            option.selected = true;
          }
          optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
      });

      // Přidání uložených knih
      const savedBooks = getSavedBooks();
      if (savedBooks.length > 0) {
        const savedOptgroup = document.createElement('optgroup');
        savedOptgroup.label = i18n('savedBooks');

        savedBooks.forEach(book => {
          const option = document.createElement('option');
          option.value = `saved_${book.id}`;
          const shortTitle = book.title.length > 20 ? book.title.substring(0, 17) + '...' : book.title;
          option.textContent = `${shortTitle} (${book.width} × ${book.height} mm)`;
          if (currentFormat.id === `saved_${book.id}`) {
            option.selected = true;
          }
          savedOptgroup.appendChild(option);
        });

        select.appendChild(savedOptgroup);
      }
    }

    populateSelect();

    // Reference na refresh funkci pro volání po uložení
    window.refreshFormatSelect = populateSelect;

    select.addEventListener('change', () => {
      const value = select.value;

      if (value.startsWith('saved_')) {
        // Výběr uložené knihy
        const bookId = value.replace('saved_', '');
        const savedBooks = getSavedBooks();
        const savedBook = savedBooks.find(b => b.id === bookId);
        if (savedBook) {
          currentFormat = {
            id: `saved_${savedBook.id}`,
            name: savedBook.title,
            width: savedBook.width,
            height: savedBook.height,
            category: 'saved'
          };
        }
      } else {
        currentFormat = allFormats.find(f => f.id === value);
      }
      updateVisualization();
    });

    const label = document.createElement('label');
    label.className = 'bdv-select-label';
    label.textContent = i18n('compareWith');
    selectWrapper.appendChild(label);
    selectWrapper.appendChild(select);

    // Tlačítko pro smazání všech uložených
    const savedBooks = getSavedBooks();
    if (savedBooks.length > 0) {
      const clearAllBtn = document.createElement('button');
      clearAllBtn.className = 'bdv-clear-all';
      clearAllBtn.textContent = i18n('deleteAllSaved');
      clearAllBtn.addEventListener('click', () => {
        if (deleteAllBooks()) {
          populateSelect();
          // Reset na výchozí formát pokud byl vybrán uložený
          if (currentFormat.id && currentFormat.id.startsWith('saved_')) {
            currentFormat = defaultFormat;
            updateVisualization();
          }
        }
      });
      selectWrapper.appendChild(clearAllBtn);
    }

    container.appendChild(selectWrapper);

    // Vizualizační kontejner
    const vizContainer = document.createElement('div');
    vizContainer.className = 'bdv-2d-container';
    container.appendChild(vizContainer);

    const vizWrapper = document.createElement('div');
    vizWrapper.className = 'bdv-viz-wrapper';
    vizContainer.appendChild(vizWrapper);

    // Obdélníky
    const bookRect = document.createElement('div');
    bookRect.className = 'bdv-book-rect';
    const bookLabel = document.createElement('span');
    bookLabel.className = 'bdv-rect-label';
    bookLabel.textContent = bookData.title;
    bookRect.appendChild(bookLabel);
    vizWrapper.appendChild(bookRect);

    const refRect = document.createElement('div');
    refRect.className = 'bdv-ref-rect';
    const refLabel = document.createElement('span');
    refLabel.className = 'bdv-rect-label';
    refRect.appendChild(refLabel);
    vizWrapper.appendChild(refRect);

    // Info o rozměrech
    const dimInfo = document.createElement('div');
    dimInfo.className = 'bdv-dimensions-info';
    container.appendChild(dimInfo);

    function updateVisualization() {
      // Dynamická velikost kontejneru
      const containerRect = vizContainer.getBoundingClientRect();
      const containerSize = Math.min(containerRect.width, containerRect.height) || 400;
      const scale = calculateScale(
        bookData.dimensions.width,
        bookData.dimensions.height,
        currentFormat.width,
        currentFormat.height,
        containerSize
      );

      // Aktualizace obdélníků
      bookRect.style.width = `${bookData.dimensions.width * scale}px`;
      bookRect.style.height = `${bookData.dimensions.height * scale}px`;

      refRect.style.width = `${currentFormat.width * scale}px`;
      refRect.style.height = `${currentFormat.height * scale}px`;

      // Aktualizace labelu reference v obdélníku
      refLabel.textContent = currentFormat.name;

      // Dynamická velikost fontu - relativně k rozměrům obdélníku
      const bookRectWidth = bookData.dimensions.width * scale;
      const bookRectHeight = bookData.dimensions.height * scale;
      const refRectWidth = currentFormat.width * scale;
      const refRectHeight = currentFormat.height * scale;

      // Velikost fontu - využij šířku, ale max polovina výšky
      // Font size přibližně 1/6 šířky, omezeno polovinou výšky
      const bookFontSize = Math.min(bookRectWidth / 6, bookRectHeight / 4, 24);
      const refFontSize = Math.min(refRectWidth / 6, refRectHeight / 4, 24);

      bookLabel.style.fontSize = `${Math.max(10, bookFontSize)}px`;
      bookLabel.style.maxWidth = `${bookRectWidth - 12}px`;
      bookLabel.style.maxHeight = `${bookRectHeight / 2}px`;

      refLabel.style.fontSize = `${Math.max(10, refFontSize)}px`;
      refLabel.style.maxWidth = `${refRectWidth - 12}px`;
      refLabel.style.maxHeight = `${refRectHeight / 2}px`;

      // Aktualizace info
      // Zkrácený název knihy (max 25 znaků)
      const shortTitle = bookData.title.length > 25
        ? bookData.title.substring(0, 22) + '...'
        : bookData.title;

      dimInfo.innerHTML = `
        <div class="bdv-dim-item">
          <div class="bdv-dim-label" title="${bookData.title}">${shortTitle}</div>
          <div class="bdv-dim-value book">${bookData.dimensions.width} × ${bookData.dimensions.height} mm</div>
        </div>
        <div class="bdv-dim-item">
          <div class="bdv-dim-label">${getFormatName(currentFormat.id, currentFormat.name)}</div>
          <div class="bdv-dim-value ref">${currentFormat.width} × ${currentFormat.height} mm</div>
        </div>
      `;
    }

    updateVisualization();
  }

  function createThicknessVisualization(container) {
    // Select pro objekt
    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'bdv-select-wrapper';

    const select = document.createElement('select');
    select.className = 'bdv-select';

    // Funkce pro naplnění selectu
    function populateThicknessSelect() {
      select.innerHTML = '';

      // Standardní objekty
      const standardOptgroup = document.createElement('optgroup');
      standardOptgroup.label = i18n('categoryBooks') || 'Objects';

      THICKNESS_OBJECTS.forEach(obj => {
        const option = document.createElement('option');
        option.value = obj.id;
        const localizedName = getObjectName(obj.id, obj.name);
        option.textContent = `${localizedName} (${obj.size_mm} mm)`;
        if (obj.id === currentThicknessObject.id) {
          option.selected = true;
        }
        standardOptgroup.appendChild(option);
      });

      select.appendChild(standardOptgroup);

      // Přidání uložených knih s tloušťkou
      const savedBooks = getSavedBooks().filter(b => b.thickness && b.thickness > 0);
      if (savedBooks.length > 0) {
        const savedOptgroup = document.createElement('optgroup');
        savedOptgroup.label = i18n('savedBooks');

        savedBooks.forEach(book => {
          const option = document.createElement('option');
          option.value = `saved_${book.id}`;
          const shortTitle = book.title.length > 20 ? book.title.substring(0, 17) + '...' : book.title;
          option.textContent = `${shortTitle} (${book.thickness} mm)`;
          if (currentThicknessObject.id === `saved_${book.id}`) {
            option.selected = true;
          }
          savedOptgroup.appendChild(option);
        });

        select.appendChild(savedOptgroup);
      }
    }

    populateThicknessSelect();

    // Reference na refresh funkci
    window.refreshThicknessSelect = populateThicknessSelect;

    select.addEventListener('change', () => {
      const value = select.value;

      if (value.startsWith('saved_')) {
        // Výběr uložené knihy
        const bookId = value.replace('saved_', '');
        const savedBooks = getSavedBooks();
        const savedBook = savedBooks.find(b => b.id === bookId);
        if (savedBook && savedBook.thickness) {
          currentThicknessObject = {
            id: `saved_${savedBook.id}`,
            name: savedBook.title,
            size_mm: savedBook.thickness,
            color: '#9C27B0', // Fialová pro uložené knihy
            icon_type: 'shape'
          };
        }
      } else {
        currentThicknessObject = THICKNESS_OBJECTS.find(o => o.id === value);
      }
      updateThicknessVisualization();
    });

    const label = document.createElement('label');
    label.className = 'bdv-select-label';
    label.textContent = i18n('compareWith');
    selectWrapper.appendChild(label);
    selectWrapper.appendChild(select);
    container.appendChild(selectWrapper);

    // Vizualizační kontejner
    const thicknessContainer = document.createElement('div');
    thicknessContainer.className = 'bdv-thickness-container';
    container.appendChild(thicknessContainer);

    // Hřbet knihy
    const spine = document.createElement('div');
    spine.className = 'bdv-spine';
    thicknessContainer.appendChild(spine);

    // Objekty
    const objectsRow = document.createElement('div');
    objectsRow.className = 'bdv-objects-row';
    thicknessContainer.appendChild(objectsRow);

    // Info
    const thicknessInfo = document.createElement('div');
    thicknessInfo.className = 'bdv-thickness-info';
    container.appendChild(thicknessInfo);

    function updateThicknessVisualization() {
      const thickness = bookData.dimensions.thickness;
      const ratio = calculateThicknessRatio(thickness, currentThicknessObject.size_mm);

      // Hřbet - použijeme mm jednotky pro přibližné měřítko 1:1
      spine.style.width = `${thickness}mm`;
      spine.textContent = `${thickness} mm`;

      // Objekty
      objectsRow.innerHTML = '';

      const maxObjects = Math.min(ratio.displayCount, 20); // Limit pro zobrazení

      const wholeObjects = ratio.wholeCount;
      const hasPartial = ratio.remainder > 0.01; // Malá tolerance

      // Vykreslíme celé objekty
      for (let i = 0; i < wholeObjects; i++) {
        const objIcon = document.createElement('div');
        objIcon.className = 'bdv-object-icon';
        objIcon.style.width = `${currentThicknessObject.size_mm}mm`;
        objIcon.style.backgroundColor = currentThicknessObject.color;
        objectsRow.appendChild(objIcon);
      }

      // Pokud je částečný zbytek, vykreslíme poslední objekt s vizuálním rozdělením
      if (hasPartial) {
        const objIcon = document.createElement('div');
        objIcon.className = 'bdv-object-icon bdv-object-partial';
        objIcon.style.width = `${currentThicknessObject.size_mm}mm`;

        // Procento plné části
        const filledPercent = ratio.remainder * 100;

        // Gradient: plná barva do filledPercent, pak čárkovaný pattern
        const solidColor = currentThicknessObject.color;
        const stripeColor1 = currentThicknessObject.color + '40'; // 25% opacity
        const stripeColor2 = currentThicknessObject.color + '20'; // 12% opacity

        objIcon.style.background = `
          linear-gradient(to right,
            ${solidColor} 0%,
            ${solidColor} ${filledPercent}%,
            transparent ${filledPercent}%
          ),
          repeating-linear-gradient(
            -45deg,
            ${stripeColor1},
            ${stripeColor1} 2px,
            ${stripeColor2} 2px,
            ${stripeColor2} 4px
          )
        `;

        // Čára označující hranici
        objIcon.style.position = 'relative';

        // Vytvoříme hranici pomocí pseudo-elementu (nebo box-shadow)
        objIcon.style.boxShadow = `inset calc(${filledPercent}% - 1px) 0 0 0 rgba(0,0,0,0.3)`;

        objectsRow.appendChild(objIcon);
      }

      // Info text
      const objectName = getObjectName(currentThicknessObject.id, currentThicknessObject.name).toLowerCase();
      const infoText = i18n('thicknessInfo', [thickness.toString(), ratio.ratio.toFixed(1), objectName]);
      // Fallback pokud i18n nevrátí správný formát
      if (infoText === 'thicknessInfo' || !infoText.includes(thickness.toString())) {
        thicknessInfo.innerHTML = `
          ${i18n('labelBook')} <span class="bdv-thickness-value">${thickness} mm</span> ≈
          <span class="bdv-thickness-value">${ratio.ratio.toFixed(1)}×</span> ${objectName}
        `;
      } else {
        thicknessInfo.textContent = infoText;
      }
    }

    updateThicknessVisualization();
  }
}
