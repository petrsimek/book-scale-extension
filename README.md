# book-scale-extension / KnihoMetr

Browser extension for visualizing and comparing book dimensions with standard formats.

## Features

- Parse book dimensions from e-shop pages (width × height × thickness)
- Visual 2D comparison with reference formats (A4, A5, US Comic, Manga, BD Album, etc.)
- Spine thickness comparison with real-world objects (matchbox, coin)
- Save books for later comparison
- Multilingual support (English, Czech)

## Developer Installation

### Google Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right corner)
3. Click **Load unpacked**
4. Select the `book-scale-extension` folder (the one containing `manifest.json`)
5. The extension icon should appear in your toolbar

To reload after changes:
- Click the refresh icon on the extension card in `chrome://extensions/`

### Mozilla Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select the `manifest.firefox.json` file from the `book-scale-extension` folder
4. The extension icon should appear in your toolbar

Note: Temporary add-ons in Firefox are removed when the browser closes. For persistent installation during development, use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).

To reload after changes:
- Click **Reload** next to the extension in `about:debugging`

## Usage

1. Navigate to a supported site (currently [comicsdb.cz](https://comicsdb.cz))
2. Open a book/comic detail page
3. Look for the blue ruler icon next to the dimensions
4. Click the icon to open the visualization modal

## Project Structure

```
book-scale-extension/
├── manifest.json           # Chrome manifest (Manifest V3)
├── manifest.firefox.json   # Firefox manifest (Manifest V3)
├── _locales/
│   ├── en/messages.json    # English translations
│   └── cs/messages.json    # Czech translations
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── i18n.js             # Internationalization helper
│   ├── storage.js          # localStorage for saved books
│   ├── config/
│   │   ├── constants.js    # Reference formats & thickness objects
│   │   └── sites.js        # Site-specific selectors
│   ├── utils.js            # Helper functions
│   ├── ui_renderer.js      # Modal UI rendering
│   └── content.js          # Main content script
└── README.md
```

## Adding Support for New Sites

Edit `src/config/sites.js` and add a new entry to the `SITE_CONFIGS` object:

```javascript
'example.com': {
  dimensions_container: 'selector-for-dimensions-element',
  dimensions_regex: /(\d+)\s*[xX×]\s*(\d+)(?:\s*[xX×]\s*(\d+))?\s*mm/i,
  title: 'selector-for-book-title',
  anchor: 'selector-for-button-placement',
  anchor_method: 'append', // 'append', 'prepend', or 'after'
  preferred_groups: ['iso', 'books']
}
```

## License

MIT
