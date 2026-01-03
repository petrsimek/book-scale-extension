/**
 * Databáze referenčních formátů pro 2D porovnání
 */
const REFERENCE_FORMATS = [
  // ISO formáty
  {
    id: 'a3',
    name: 'A3',
    width: 297,
    height: 420,
    category: 'iso',
    description: 'Velký formát, art booky'
  },
  {
    id: 'a4',
    name: 'A4',
    width: 210,
    height: 297,
    category: 'iso',
    description: 'Standardní kancelářský formát'
  },
  {
    id: 'a5',
    name: 'A5',
    width: 148,
    height: 210,
    category: 'iso',
    description: 'Poloviční A4, běžný pro knihy'
  },
  {
    id: 'a6',
    name: 'A6',
    width: 105,
    height: 148,
    category: 'iso',
    description: 'Kapesní formát'
  },
  {
    id: 'b5',
    name: 'B5',
    width: 176,
    height: 250,
    category: 'iso',
    description: 'Běžný knižní formát'
  },
  // US Comics
  {
    id: 'us_comic',
    name: 'US Comic',
    width: 168,
    height: 260,
    category: 'us_comics',
    description: 'Moderní americký komiks'
  },
  {
    id: 'us_omnibus',
    name: 'Omnibus',
    width: 195,
    height: 285,
    category: 'us_comics',
    description: 'Americký omnibus formát'
  },
  {
    id: 'us_trade',
    name: 'Trade Paperback',
    width: 170,
    height: 260,
    category: 'us_comics',
    description: 'US Trade Paperback'
  },
  {
    id: 'us_digest',
    name: 'Digest',
    width: 140,
    height: 216,
    category: 'us_comics',
    description: 'Menší US formát'
  },
  // Manga
  {
    id: 'tankobon',
    name: 'Tankobon',
    width: 115,
    height: 177,
    category: 'manga',
    description: 'Standardní japonská manga'
  },
  {
    id: 'bunkobon',
    name: 'Bunkobon',
    width: 105,
    height: 148,
    category: 'manga',
    description: 'Malý manga formát'
  },
  {
    id: 'kanzenban',
    name: 'Kanzenban',
    width: 148,
    height: 210,
    category: 'manga',
    description: 'Větší manga, sběratelská edice'
  },
  // Evropské BD
  {
    id: 'bd_album',
    name: 'BD Album',
    width: 225,
    height: 295,
    category: 'bd',
    description: 'Evropský BD album formát'
  },
  {
    id: 'bd_pocket',
    name: 'BD Pocket',
    width: 140,
    height: 190,
    category: 'bd',
    description: 'Kapesní evropský komiks'
  },
  // Knihy obecně
  {
    id: 'pocket',
    name: 'Paperback',
    width: 110,
    height: 178,
    category: 'books',
    description: 'Standardní paperback'
  },
  {
    id: 'hardcover',
    name: 'Hardcover',
    width: 156,
    height: 234,
    category: 'books',
    description: 'Běžná vázaná kniha'
  }
];

/**
 * Databáze referenčních objektů pro porovnání tloušťky
 */
const THICKNESS_OBJECTS = [
  {
    id: 'matchbox',
    name: 'Matchbox',
    size_mm: 15,
    color: '#8B4513',
    icon_type: 'shape'
  },
  {
    id: 'coin',
    name: 'Czech 10 CZK coin',
    size_mm: 2.5,
    color: '#FFD700',
    icon_type: 'shape'
  }
];

/**
 * Kategorie formátů pro filtrování
 */
const FORMAT_CATEGORIES = {
  iso: 'ISO Formats',
  us_comics: 'US Comics',
  manga: 'Manga',
  bd: 'BD/European',
  books: 'Books'
};
