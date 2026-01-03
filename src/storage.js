/**
 * Storage helper pro BookScale
 * Ukládání knih pro porovnání do localStorage
 */

const STORAGE_KEY = 'bookscale_saved_books';
const MAX_SAVED_BOOKS = 10;

/**
 * Načte uložené knihy z localStorage
 * @returns {Array} - Pole uložených knih
 */
function getSavedBooks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('[BookScale] Error loading saved books:', e);
    return [];
  }
}

/**
 * Uloží knihu pro porovnání
 * @param {Object} book - Objekt knihy {title, width, height, thickness, url}
 * @returns {boolean} - True pokud bylo uložení úspěšné
 */
function saveBook(book) {
  try {
    const books = getSavedBooks();

    // Kontrola duplikátů (podle URL nebo názvu + rozměrů)
    const isDuplicate = books.some(b =>
      b.url === book.url ||
      (b.title === book.title && b.width === book.width && b.height === book.height)
    );

    if (isDuplicate) {
      return false;
    }

    // Přidání nové knihy na začátek
    const newBook = {
      id: Date.now().toString(),
      title: book.title,
      width: book.width,
      height: book.height,
      thickness: book.thickness || null,
      url: book.url || window.location.href,
      savedAt: new Date().toISOString()
    };

    books.unshift(newBook);

    // Omezení na MAX_SAVED_BOOKS
    if (books.length > MAX_SAVED_BOOKS) {
      books.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch (e) {
    console.error('[BookScale] Error saving book:', e);
    return false;
  }
}

/**
 * Smaže uloženou knihu
 * @param {string} bookId - ID knihy ke smazání
 * @returns {boolean} - True pokud bylo smazání úspěšné
 */
function deleteBook(bookId) {
  try {
    const books = getSavedBooks();
    const filtered = books.filter(b => b.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('[BookScale] Error deleting book:', e);
    return false;
  }
}

/**
 * Smaže všechny uložené knihy
 * @returns {boolean} - True pokud bylo smazání úspěšné
 */
function deleteAllBooks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('[BookScale] Error deleting all books:', e);
    return false;
  }
}

/**
 * Kontrola, zda je kniha již uložena
 * @param {string} url - URL knihy
 * @param {string} title - Název knihy
 * @param {number} width - Šířka
 * @param {number} height - Výška
 * @returns {boolean} - True pokud je kniha uložena
 */
function isBookSaved(url, title, width, height) {
  const books = getSavedBooks();
  return books.some(b =>
    b.url === url ||
    (b.title === title && b.width === width && b.height === height)
  );
}
