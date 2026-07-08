import type { ProductCategory } from "./decoder/types";

export interface Brand {
  slug: string;
  name: string;
  /** Parent manufacturing group — used for grouping + decode explanation. */
  group: string;
  /** Dedicated decoder id from the engine, if any. */
  decoderId?: string;
  category: ProductCategory;
  /** Estimated unopened shelf life from manufacture, in months. */
  shelfLifeMonths: number;
  /** Period-after-opening in months (the jar symbol), for guidance. */
  paoMonths: number;
  popular?: boolean;
  /**
   * Staged out of the public picker/search until we have a *verified* decode
   * format for it (real code→date samples). Its page still resolves by URL so
   * existing links don't 404. Un-hide by removing the slug from HIDDEN_SLUGS
   * once a tested decoder covers it.
   */
  hidden?: boolean;
  /**
   * Brand prints the manufacture/expiry date on the pack in plain text (common
   * for Korean, Japanese and French-pharmacy lines) instead of — or as well as
   * — a coded batch number. Their page shows a "read the printed date" note.
   */
  printsDate?: boolean;
  blurb: string;
}

/** Compact source table -> expanded Brand[]. */
type Row = [
  name: string,
  group: string,
  decoderId: string | undefined,
  category: ProductCategory,
  shelfLifeMonths: number,
  paoMonths: number,
  popular?: boolean,
];

const ROWS: Row[] = [
  // ---- Estée Lauder Companies (dedicated decoder) ----
  ["Estée Lauder", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12, true],
  ["Clinique", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["MAC Cosmetics", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Bobbi Brown", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Aveda", "Estée Lauder Companies", "estee-lauder", "haircare", 36, 12],
  ["La Mer", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Jo Malone London", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Tom Ford Beauty", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Origins", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Smashbox", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Too Faced", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Dr.Jart+", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Lab Series", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Le Labo", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Kilian Paris", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Frédéric Malle", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Bumble and bumble", "Estée Lauder Companies", "estee-lauder", "haircare", 36, 12],

  // ---- Coty (4-digit YDDD code) ----
  // Umbrella entry — pick "Coty" if a sub-brand isn't listed.
  ["Coty", "Coty", "coty", "perfume", 60, 36],
  // Consumer Beauty — colour cosmetics
  ["Rimmel London", "Coty", "coty", "makeup", 36, 24],
  ["Bourjois", "Coty", "coty", "makeup", 36, 24],
  ["Sally Hansen", "Coty", "coty", "makeup", 36, 24],
  ["Max Factor", "Coty", "coty", "makeup", 36, 24],
  ["CoverGirl", "Coty", "coty", "makeup", 36, 24],
  ["Manhattan", "Coty", "coty", "makeup", 36, 24],
  ["Miss Sporty", "Coty", "coty", "makeup", 36, 24],
  ["Kylie Cosmetics", "Coty", "coty", "makeup", 36, 24],
  ["Kylie Skin", "Coty", "coty", "skincare", 36, 12],
  ["Younique", "Coty", "coty", "makeup", 36, 24],
  ["Lancaster", "Coty", "coty", "skincare", 36, 12],
  // Consumer Beauty — mass fragrance
  ["adidas", "Coty", "coty", "perfume", 60, 36],
  ["David Beckham", "Coty", "coty", "perfume", 60, 36],
  ["Bruno Banani", "Coty", "coty", "perfume", 60, 36],
  ["Jovan", "Coty", "coty", "perfume", 60, 36],
  ["Mexx", "Coty", "coty", "perfume", 60, 36],
  ["Nautica", "Coty", "coty", "perfume", 60, 36],
  ["Enrique Iglesias", "Coty", "coty", "perfume", 60, 36],
  ["Beyoncé", "Coty", "coty", "perfume", 60, 36],
  ["Katy Perry", "Coty", "coty", "perfume", 60, 36],
  // Luxury / prestige fragrance licences
  ["Calvin Klein", "Coty", "coty", "perfume", 60, 36],
  ["Hugo Boss", "Coty", "coty", "perfume", 60, 36],
  ["Gucci Beauty", "Coty", "coty", "perfume", 60, 36],
  ["Burberry Beauty", "Coty", "coty", "perfume", 60, 36],
  ["Marc Jacobs Fragrances", "Coty", "coty", "perfume", 60, 36],
  ["Chloé", "Coty", "coty", "perfume", 60, 36],
  ["Davidoff", "Coty", "coty", "perfume", 60, 36],
  ["Tiffany & Co.", "Coty", "coty", "perfume", 60, 36],
  ["Vera Wang", "Coty", "coty", "perfume", 60, 36],
  ["Roberto Cavalli", "Coty", "coty", "perfume", 60, 36],
  ["Jil Sander", "Coty", "coty", "perfume", 60, 36],
  ["Joop!", "Coty", "coty", "perfume", 60, 36],
  ["Lacoste", "Coty", "coty", "perfume", 60, 36],
  ["Escada", "Coty", "coty", "perfume", 60, 36],
  ["Chopard", "Coty", "coty", "perfume", 60, 36],
  ["Cerruti", "Coty", "coty", "perfume", 60, 36],
  ["Nikos", "Coty", "coty", "perfume", 60, 36],
  ["Bottega Veneta", "Coty", "coty", "perfume", 60, 36],
  ["SJP", "Coty", "coty", "perfume", 60, 36],

  // ---- L'Oréal Group (shared 6-char year-letter code) ----
  // Umbrella entry — the note says: if a sub-brand fails, pick "L'Oréal".
  ["L'Oréal", "L'Oréal Group", "loreal", "makeup", 36, 12, true],
  // Consumer Products
  ["L'Oréal Paris", "L'Oréal Group", "loreal", "makeup", 30, 12, true],
  ["Maybelline", "L'Oréal Group", "loreal", "makeup", 30, 12, true],
  ["Garnier", "L'Oréal Group", "loreal", "skincare", 30, 12],
  ["NYX Professional Makeup", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Essie", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Mixa", "L'Oréal Group", "loreal", "skincare", 30, 12],
  ["3CE", "L'Oréal Group", "loreal", "makeup", 36, 24],
  // Dermatological Beauty
  ["La Roche-Posay", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["CeraVe", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Vichy", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["SkinCeuticals", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Skinbetter Science", "L'Oréal Group", "loreal", "skincare", 36, 12],
  // Luxe
  ["Lancôme", "L'Oréal Group", "loreal", "skincare", 36, 12, true],
  ["Kiehl's", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["YSL Beauty", "L'Oréal Group", "loreal", "makeup", 36, 24, true],
  ["Giorgio Armani Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Prada Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Valentino Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Biotherm", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Urban Decay", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Mugler", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Azzaro", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Viktor & Rolf", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Ralph Lauren Fragrances", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Cacharel", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Diesel", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Helena Rubinstein", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["IT Cosmetics", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Shu Uemura", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Aesop", "L'Oréal Group", "loreal", "skincare", 36, 12],
  // Professional Products
  ["L'Oréal Professionnel", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Kérastase", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Redken", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Matrix", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Pureology", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Mizani", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Color Wow", "L'Oréal Group", "loreal", "haircare", 36, 12],

  // ---- LVMH (Dior + sister houses share a production-date code) ----
  ["Dior", "LVMH", "dior", "perfume", 60, 36, true],
  ["Guerlain", "LVMH", "dior", "perfume", 60, 36],
  ["Givenchy Beauty", "LVMH", "dior", "makeup", 36, 24],
  ["Kenzo Parfums", "LVMH", "dior", "perfume", 60, 36],
  ["Loewe Perfumes", "LVMH", "dior", "perfume", 60, 36],
  ["Acqua di Parma", "LVMH", "dior", "perfume", 60, 36],
  ["Maison Francis Kurkdjian", "LVMH", "dior", "perfume", 60, 36],
  ["Fresh", "LVMH", "dior", "skincare", 36, 12],
  ["Benefit Cosmetics", "LVMH", "dior", "makeup", 36, 24],
  ["Make Up For Ever", "LVMH", "dior", "makeup", 36, 24],
  ["Fenty Beauty", "LVMH", "dior", "makeup", 36, 24],
  ["Fenty Skin", "LVMH", "dior", "skincare", 36, 12],

  // ---- Independent / other groups ----
  ["Chanel", "Chanel", "chanel", "perfume", 60, 36, true],
  ["Chanel Beauty", "Chanel", "chanel", "makeup", 36, 24],
  // Fragrance houses on verified decoders
  ["Michael Kors", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Tommy Hilfiger", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Maison Margiela", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Creed", "Creed", "creed", "perfume", 60, 36, true],
  // Puig — fragrances print the production date in the code (year digit +
  // Julian day), read by the generic embedded-date decoder.
  ["Zara", "Puig", "embedded", "perfume", 48, 36],
  ["Jean Paul Gaultier", "Puig", "embedded", "perfume", 60, 36, true],
  ["Paco Rabanne", "Puig", "embedded", "perfume", 60, 36, true],
  ["Rabanne", "Puig", "embedded", "perfume", 60, 36],
  ["Carolina Herrera", "Puig", "embedded", "perfume", 60, 36, true],
  ["Nina Ricci", "Puig", "embedded", "perfume", 60, 36],
  // Inter Parfums — first letter = year (J=2019 … R=2026), last 3 digits =
  // day of year. Verified: 08J38J169 = 18 Jun 2019, 03M16M091 = 1 Apr 2022.
  ["Montblanc", "Inter Parfums", "interparfums", "perfume", 60, 36, true],
  ["Jimmy Choo", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Coach", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Boucheron", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Van Cleef & Arpels", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Karl Lagerfeld", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Kate Spade", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Salvatore Ferragamo", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Moncler", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["GUESS", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Abercrombie & Fitch", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Dunhill", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Nivea", "Beiersdorf", "beiersdorf", "skincare", 30, 12, true],
  ["Eucerin", "Beiersdorf", "beiersdorf", "skincare", 36, 12],
  ["The Ordinary", "Deciem", undefined, "skincare", 24, 12, true],
  ["NIOD", "Deciem", undefined, "skincare", 24, 12],
  ["NARS", "Shiseido", undefined, "makeup", 36, 24],
  ["Shiseido", "Shiseido", undefined, "skincare", 36, 12],
  ["SK-II", "P&G", undefined, "skincare", 36, 12],
  ["Charlotte Tilbury", "Charlotte Tilbury", undefined, "makeup", 36, 24],
  ["Drunk Elephant", "Shiseido", undefined, "skincare", 24, 12],
  ["Paula's Choice", "Unilever", undefined, "skincare", 24, 12],
  ["Clarins", "Clarins", undefined, "skincare", 36, 12],
  ["Sephora Collection", "Sephora", undefined, "makeup", 30, 12],

  // ---- Mass-market brands (no verified decoder yet — all staged in HIDDEN_SLUGS) ----
  ["Dove", "Unilever", undefined, "skincare", 30, 12],
  ["Vaseline", "Unilever", undefined, "skincare", 36, 12],
  ["Axe", "Unilever", undefined, "generic", 36, 12],
  ["Rexona", "Unilever", undefined, "generic", 36, 12],
  ["Sunsilk", "Unilever", undefined, "haircare", 36, 12],
  ["TRESemmé", "Unilever", undefined, "haircare", 36, 12],
  ["Simple", "Unilever", undefined, "skincare", 30, 12],
  ["Pond's", "Unilever", undefined, "skincare", 30, 12],
  ["St. Ives", "Unilever", undefined, "skincare", 30, 12],
  ["Dermalogica", "Unilever", undefined, "skincare", 30, 12],
  ["Murad", "Unilever", undefined, "skincare", 24, 12],
  ["Hourglass", "Unilever", undefined, "makeup", 36, 24],
  ["Living Proof", "Unilever", undefined, "haircare", 36, 12],
  ["Tatcha", "Unilever", undefined, "skincare", 24, 12],
  ["REN Clean Skincare", "Unilever", undefined, "skincare", 24, 12],
  ["Nexxus", "Unilever", undefined, "haircare", 36, 12],
  ["Olay", "P&G", undefined, "skincare", 36, 12],
  ["Pantene", "P&G", undefined, "haircare", 36, 12],
  ["Head & Shoulders", "P&G", undefined, "haircare", 36, 12],
  ["Herbal Essences", "P&G", undefined, "haircare", 36, 12],
  ["Old Spice", "P&G", undefined, "generic", 36, 12],
  ["Secret", "P&G", undefined, "generic", 36, 12],
  ["Native", "P&G", undefined, "generic", 36, 12],
  ["Aussie", "P&G", undefined, "haircare", 36, 12],
  ["First Aid Beauty", "P&G", undefined, "skincare", 24, 12],
  ["Ouai", "P&G", undefined, "haircare", 36, 12],
  ["La Prairie", "Beiersdorf", undefined, "skincare", 36, 12],
  ["Coppertone", "Beiersdorf", undefined, "suncare", 30, 12],
  ["Aquaphor", "Beiersdorf", undefined, "skincare", 36, 12],
  ["Chantecaille", "Beiersdorf", undefined, "skincare", 30, 12],
  ["Labello", "Beiersdorf", "beiersdorf", "skincare", 36, 12],
  ["Neutrogena", "Kenvue", undefined, "skincare", 36, 12],
  ["Aveeno", "Kenvue", undefined, "skincare", 36, 12],
  ["Clean & Clear", "Kenvue", undefined, "skincare", 36, 12],
  ["RoC", "Kenvue", undefined, "skincare", 30, 12],
  ["Le Petit Marseillais", "Kenvue", undefined, "generic", 36, 12],
  ["OGX", "Kenvue", undefined, "haircare", 36, 12],
  ["Maui Moisture", "Kenvue", undefined, "haircare", 36, 12],
  ["Palmolive", "Colgate-Palmolive", undefined, "generic", 36, 12],
  ["Sanex", "Colgate-Palmolive", undefined, "generic", 36, 12],
  ["EltaMD", "Colgate-Palmolive", undefined, "suncare", 30, 12],
  ["PCA Skin", "Colgate-Palmolive", undefined, "skincare", 30, 12],
  ["Filorga", "Colgate-Palmolive", undefined, "skincare", 30, 12],
  ["Schwarzkopf", "Henkel", undefined, "haircare", 36, 12],
  ["Syoss", "Henkel", undefined, "haircare", 36, 12],
  ["got2b", "Henkel", undefined, "haircare", 36, 12],
  ["Diadermine", "Henkel", undefined, "skincare", 30, 12],
  ["Fa", "Henkel", undefined, "generic", 36, 12],
  ["Laneige", "Amorepacific", undefined, "skincare", 30, 12],
  ["Innisfree", "Amorepacific", undefined, "skincare", 30, 12],
  ["Sulwhasoo", "Amorepacific", undefined, "skincare", 30, 12],
  ["Etude", "Amorepacific", undefined, "makeup", 30, 12],
  ["Mamonde", "Amorepacific", undefined, "skincare", 30, 12],
  ["Hera", "Amorepacific", undefined, "makeup", 30, 12],
  ["Iope", "Amorepacific", undefined, "skincare", 30, 12],
  ["Primera", "Amorepacific", undefined, "skincare", 30, 12],
  ["Espoir", "Amorepacific", undefined, "makeup", 30, 12],
  ["Illiyoon", "Amorepacific", undefined, "skincare", 30, 12],
  ["The Face Shop", "LG H&H", undefined, "skincare", 30, 12],
  ["Belif", "LG H&H", undefined, "skincare", 30, 12],
  ["CNP Laboratory", "LG H&H", undefined, "skincare", 30, 12],
  ["Su:m37", "LG H&H", undefined, "skincare", 30, 12],
  ["O HUI", "LG H&H", undefined, "skincare", 30, 12],
  ["The History of Whoo", "LG H&H", undefined, "skincare", 30, 12],
  ["Physiogel", "LG H&H", undefined, "skincare", 30, 12],
  ["VDL", "LG H&H", undefined, "makeup", 30, 12],
  ["Bioré", "Kao", undefined, "skincare", 36, 12],
  ["Sensai", "Kao", undefined, "skincare", 30, 12],
  ["Kanebo", "Kao", undefined, "skincare", 30, 12],
  ["Curél", "Kao", undefined, "skincare", 30, 12],
  ["Jergens", "Kao", undefined, "skincare", 36, 12],
  ["John Frieda", "Kao", undefined, "haircare", 36, 12],
  ["Molton Brown", "Kao", undefined, "generic", 36, 12],
  ["Guhl", "Kao", undefined, "haircare", 36, 12],
  ["Clé de Peau Beauté", "Shiseido", undefined, "skincare", 36, 12],
  ["Anessa", "Shiseido", undefined, "suncare", 30, 12],
  ["Elixir", "Shiseido", undefined, "skincare", 30, 12],
  ["bareMinerals", "Shiseido", undefined, "makeup", 36, 24],
  ["Laura Mercier", "Shiseido", undefined, "makeup", 36, 24],
  ["Ipsa", "Shiseido", undefined, "skincare", 30, 12],
  ["Sekkisei", "Kosé", undefined, "skincare", 30, 12],
  ["Cosme Decorte", "Kosé", undefined, "skincare", 30, 12],
  ["Jill Stuart", "Kosé", undefined, "makeup", 36, 24],
  ["Tarte", "Kosé", undefined, "makeup", 36, 24],
  ["Awake", "Kosé", undefined, "skincare", 30, 12],
  ["Visée", "Kosé", undefined, "makeup", 36, 24],
  ["Hada Labo", "Rohto", undefined, "skincare", 30, 12],
  ["Melano CC", "Rohto", undefined, "skincare", 30, 12],
  ["OXY", "Rohto", undefined, "skincare", 36, 12],
  ["Sunplay", "Rohto", undefined, "suncare", 30, 12],
  ["Gatsby", "Mandom", undefined, "haircare", 36, 12],
  ["Bifesta", "Mandom", undefined, "skincare", 30, 12],
  ["Lucido", "Mandom", undefined, "generic", 36, 12],
  ["POLA", "Pola Orbis", undefined, "skincare", 36, 12],
  ["Orbis", "Pola Orbis", undefined, "skincare", 30, 12],
  ["Jurlique", "Pola Orbis", undefined, "skincare", 30, 12],
  ["THREE", "Pola Orbis", undefined, "makeup", 30, 12],
  ["Yves Rocher", "Groupe Rocher", undefined, "skincare", 30, 12],
  ["Sabon", "Groupe Rocher", undefined, "generic", 36, 12],
  ["Arbonne", "Groupe Rocher", undefined, "skincare", 30, 12],
  ["Flormar", "Groupe Rocher", undefined, "makeup", 36, 24],
  ["Natura", "Natura & Co", undefined, "generic", 30, 12],
  ["Avon", "Natura & Co", undefined, "makeup", 36, 24],
  ["The Body Shop", "Natura & Co", undefined, "skincare", 30, 12],
  ["Revlon", "Revlon", undefined, "makeup", 36, 24],
  ["Almay", "Revlon", undefined, "makeup", 36, 24],
  ["Elizabeth Arden", "Revlon", undefined, "skincare", 36, 12],
  ["American Crew", "Revlon", undefined, "haircare", 36, 12],
  ["CND", "Revlon", undefined, "makeup", 36, 24],
  ["e.l.f. Cosmetics", "e.l.f. Beauty", undefined, "makeup", 36, 24],
  ["Naturium", "e.l.f. Beauty", undefined, "skincare", 24, 12],
  ["Well People", "e.l.f. Beauty", undefined, "makeup", 36, 24],
  ["Keys Soulcare", "e.l.f. Beauty", undefined, "skincare", 24, 12],
  ["Wella Professionals", "Wella Company", undefined, "haircare", 36, 12],
  ["Nioxin", "Wella Company", undefined, "haircare", 36, 12],
  ["Sebastian Professional", "Wella Company", undefined, "haircare", 36, 12],
  ["OPI", "Wella Company", undefined, "makeup", 36, 24],
  ["Clairol", "Wella Company", undefined, "haircare", 36, 12],
  ["Byredo", "Puig", undefined, "perfume", 60, 36],
  ["Penhaligon's", "Puig", undefined, "perfume", 60, 36],
  ["L'Artisan Parfumeur", "Puig", undefined, "perfume", 60, 36],
  ["Dries Van Noten", "Puig", undefined, "perfume", 60, 36],
  ["Avène", "Pierre Fabre", undefined, "skincare", 30, 12],
  ["Klorane", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["Ducray", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["A-Derma", "Pierre Fabre", undefined, "skincare", 30, 12],
  ["René Furterer", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["Bioderma", "NAOS", "naos", "skincare", 30, 12],
  ["Institut Esthederm", "NAOS", undefined, "skincare", 30, 12],
  ["Cetaphil", "Galderma", undefined, "skincare", 36, 12],
  ["Alastin", "Galderma", undefined, "skincare", 24, 12],
  ["Uriage", "Uriage", undefined, "skincare", 30, 12],
  ["Embryolisse", "Embryolisse", undefined, "skincare", 30, 12],
  ["Weleda", "Weleda", undefined, "skincare", 30, 12],
  ["Dr. Hauschka", "Wala", undefined, "skincare", 30, 12],
  ["Burt's Bees", "Burt's Bees", undefined, "skincare", 36, 12],
  ["FANCL", "FANCL", undefined, "skincare", 24, 12],
  ["DHC", "DHC", undefined, "skincare", 30, 12],
  ["Albion", "Albion", undefined, "skincare", 30, 12],
  ["Canmake", "Canmake", undefined, "makeup", 36, 24],
  ["Cezanne", "Cezanne", undefined, "makeup", 36, 24],
  ["Kiss Me", "Isehan", undefined, "makeup", 36, 24],
  ["Glossier", "Glossier", undefined, "makeup", 24, 12],
  ["The Inkey List", "The Inkey List", undefined, "skincare", 24, 12],
  ["Kosas", "Kosas", undefined, "makeup", 30, 12],
  ["ILIA", "ILIA", undefined, "makeup", 30, 12],
  ["Merit", "Merit", undefined, "makeup", 30, 12],
  ["Rare Beauty", "Rare Beauty", undefined, "makeup", 30, 12],
  ["Tower 28", "Tower 28", undefined, "makeup", 30, 12],
  ["Summer Fridays", "Summer Fridays", undefined, "skincare", 24, 12],
  ["Glow Recipe", "Glow Recipe", undefined, "skincare", 24, 12],
  ["Farmacy", "Farmacy", undefined, "skincare", 24, 12],
  ["Sunday Riley", "Sunday Riley", undefined, "skincare", 24, 12],
  ["Milk Makeup", "Milk Makeup", undefined, "makeup", 30, 12],
  ["Westman Atelier", "Westman Atelier", undefined, "makeup", 30, 12],
  ["Augustinus Bader", "Augustinus Bader", undefined, "skincare", 24, 12],
  ["Medik8", "Medik8", undefined, "skincare", 24, 12],
  ["Obagi", "Obagi", undefined, "skincare", 30, 12],
  ["COSRX", "COSRX", undefined, "skincare", 30, 12],
  ["Beauty of Joseon", "Beauty of Joseon", undefined, "skincare", 30, 12],
  ["Anua", "Anua", undefined, "skincare", 30, 12],
  ["Some By Mi", "Some By Mi", undefined, "skincare", 30, 12],
  ["Torriden", "Torriden", undefined, "skincare", 30, 12],
  ["Round Lab", "Round Lab", undefined, "skincare", 30, 12],
  ["Isntree", "Isntree", undefined, "skincare", 30, 12],
  ["Purito", "Purito", undefined, "skincare", 30, 12],
  ["Klairs", "Wishcompany", undefined, "skincare", 30, 12],
  ["Mixsoon", "Mixsoon", undefined, "skincare", 30, 12],
  ["Medicube", "Medicube", undefined, "skincare", 30, 12],
  ["Numbuzin", "Numbuzin", undefined, "skincare", 30, 12],
  ["SKIN1004", "SKIN1004", undefined, "skincare", 30, 12],
  ["Axis-Y", "Axis-Y", undefined, "skincare", 30, 12],
  ["Pyunkang Yul", "Pyunkang Yul", undefined, "skincare", 30, 12],
  ["Missha", "Able C&C", undefined, "skincare", 30, 12],
  ["Tony Moly", "Tony Moly", undefined, "skincare", 30, 12],
  ["Nature Republic", "Nature Republic", undefined, "skincare", 30, 12],
  ["Holika Holika", "Holika Holika", undefined, "makeup", 36, 24],
  ["Banila Co", "Banila Co", undefined, "makeup", 36, 24],
  ["rom&nd", "rom&nd", undefined, "makeup", 36, 24],
  ["Clio", "Clio", undefined, "makeup", 36, 24],
  ["Peripera", "Clio", undefined, "makeup", 36, 24],
  ["Abib", "Abib", undefined, "skincare", 30, 12],
  ["Goodal", "Goodal", undefined, "skincare", 30, 12],
  ["VT Cosmetics", "VT Cosmetics", undefined, "skincare", 30, 12],
  ["Skinfood", "Skinfood", undefined, "skincare", 30, 12],
  ["d'Alba", "d'Alba", undefined, "skincare", 30, 12],
  ["Dr. Ceuracle", "Dr. Ceuracle", undefined, "skincare", 30, 12],
  ["Ma:nyo", "Ma:nyo", undefined, "skincare", 30, 12],
];

const categoryBlurb: Record<ProductCategory, string> = {
  skincare: "skincare",
  makeup: "makeup",
  perfume: "fragrance",
  haircare: "haircare",
  suncare: "sun care",
  generic: "beauty",
};

function toSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics: é -> e
    .toLowerCase()
    .replace(/['".]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Fold a string to a punctuation/diacritic-free search key so "loreal"
 * matches "L'Oréal" and "lancome" matches "Lancôme".
 */
function normalizeSearch(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Brands staged out of the public list until we verify a real decode format
 * (see [[Brand.hidden]]). These currently rely on an unverified fallback that
 * would produce wrong dates, or use a proprietary cipher we haven't reversed
 * yet — so we hide them rather than mislead. Remove a slug here the moment a
 * tested decoder covers it.
 */
const HIDDEN_SLUGS = new Set<string>([
  // Coty makeup/skin — the 4-digit YDDD fragrance format does NOT apply here.
  "rimmel-london",
  "bourjois",
  "sally-hansen",
  "max-factor",
  "covergirl",
  "manhattan",
  "miss-sporty",
  "kylie-cosmetics",
  "kylie-skin",
  "younique",
  "lancaster",
  // No verified decoder yet (undefined → unreliable fallback).
  "the-ordinary",
  "niod",
  "nars",
  "shiseido",
  "sk-ii",
  "charlotte-tilbury",
  "drunk-elephant",
  "paulas-choice",
  "clarins",
  "sephora-collection",
  // Mass-market / Asian brands staged in — page resolves for SEO, hidden from
  // the picker until a tested decoder covers each one.
  "dove",
  "vaseline",
  "axe",
  "rexona",
  "sunsilk",
  "tresemme",
  "simple",
  "ponds",
  "st-ives",
  "dermalogica",
  "murad",
  "hourglass",
  "living-proof",
  "tatcha",
  "ren-clean-skincare",
  "nexxus",
  "olay",
  "pantene",
  "head-shoulders",
  "herbal-essences",
  "old-spice",
  "secret",
  "native",
  "aussie",
  "first-aid-beauty",
  "ouai",
  "la-prairie",
  "coppertone",
  "aquaphor",
  "chantecaille",
  "neutrogena",
  "aveeno",
  "clean-clear",
  "roc",
  "le-petit-marseillais",
  "ogx",
  "maui-moisture",
  "palmolive",
  "sanex",
  "eltamd",
  "pca-skin",
  "filorga",
  "schwarzkopf",
  "syoss",
  "got2b",
  "diadermine",
  "fa",
  "laneige",
  "innisfree",
  "sulwhasoo",
  "etude",
  "mamonde",
  "hera",
  "iope",
  "primera",
  "espoir",
  "illiyoon",
  "the-face-shop",
  "belif",
  "cnp-laboratory",
  "su-m37",
  "o-hui",
  "the-history-of-whoo",
  "physiogel",
  "vdl",
  "biore",
  "sensai",
  "kanebo",
  "curel",
  "jergens",
  "john-frieda",
  "molton-brown",
  "guhl",
  "cle-de-peau-beaute",
  "anessa",
  "elixir",
  "bareminerals",
  "laura-mercier",
  "ipsa",
  "sekkisei",
  "cosme-decorte",
  "jill-stuart",
  "tarte",
  "awake",
  "visee",
  "hada-labo",
  "melano-cc",
  "oxy",
  "sunplay",
  "gatsby",
  "bifesta",
  "lucido",
  "pola",
  "orbis",
  "jurlique",
  "three",
  "yves-rocher",
  "sabon",
  "arbonne",
  "flormar",
  "natura",
  "avon",
  "the-body-shop",
  "revlon",
  "almay",
  "elizabeth-arden",
  "american-crew",
  "cnd",
  "elf-cosmetics",
  "naturium",
  "well-people",
  "keys-soulcare",
  "wella-professionals",
  "nioxin",
  "sebastian-professional",
  "opi",
  "clairol",
  "byredo",
  "penhaligons",
  "lartisan-parfumeur",
  "dries-van-noten",
  "avene",
  "klorane",
  "ducray",
  "a-derma",
  "rene-furterer",
  "institut-esthederm",
  "cetaphil",
  "alastin",
  "uriage",
  "embryolisse",
  "weleda",
  "dr-hauschka",
  "burts-bees",
  "fancl",
  "dhc",
  "albion",
  "canmake",
  "cezanne",
  "kiss-me",
  "glossier",
  "the-inkey-list",
  "kosas",
  "ilia",
  "merit",
  "rare-beauty",
  "tower-28",
  "summer-fridays",
  "glow-recipe",
  "farmacy",
  "sunday-riley",
  "milk-makeup",
  "westman-atelier",
  "augustinus-bader",
  "medik8",
  "obagi",
  "cosrx",
  "beauty-of-joseon",
  "anua",
  "some-by-mi",
  "torriden",
  "round-lab",
  "isntree",
  "purito",
  "klairs",
  "mixsoon",
  "medicube",
  "numbuzin",
  "skin1004",
  "axis-y",
  "pyunkang-yul",
  "missha",
  "tony-moly",
  "nature-republic",
  "holika-holika",
  "banila-co",
  "rom-nd",
  "clio",
  "peripera",
  "abib",
  "goodal",
  "vt-cosmetics",
  "skinfood",
  "dalba",
  "dr-ceuracle",
  "ma-nyo",
]);

/**
 * Brands that print the manufacture/expiry date on the pack in plain text
 * (Korean, Japanese and French-pharmacy lines). Their page shows a "read the
 * printed date" note pointing at the brands-that-print-the-date guide instead
 * of relying on a coded decode. Bioderma is deliberately absent — it both
 * prints the date and has a verified code decoder.
 */
const PRINTS_DATE_SLUGS = new Set<string>([
  // Korean skincare / makeup
  "laneige", "innisfree", "sulwhasoo", "etude", "mamonde", "hera", "iope",
  "primera", "espoir", "illiyoon", "cosrx", "beauty-of-joseon", "anua",
  "some-by-mi", "torriden", "round-lab", "isntree", "purito", "klairs",
  "mixsoon", "medicube", "numbuzin", "skin1004", "axis-y", "pyunkang-yul",
  "missha", "tony-moly", "nature-republic", "holika-holika", "banila-co",
  "rom-nd", "clio", "peripera", "abib", "goodal", "vt-cosmetics", "skinfood",
  "dalba", "dr-ceuracle", "ma-nyo", "the-face-shop", "belif", "cnp-laboratory",
  // Japanese
  "hada-labo", "melano-cc", "fancl", "dhc", "curel", "bifesta",
  // French pharmacy / natural
  "avene", "klorane", "ducray", "a-derma", "rene-furterer", "weleda",
  "uriage", "embryolisse", "institut-esthederm", "dr-hauschka",
]);

/** Every brand, including hidden ones — used for URL resolution. */
export const ALL_BRANDS: Brand[] = ROWS.map(
  ([name, group, decoderId, category, shelfLifeMonths, paoMonths, popular]) => {
    const slug = toSlug(name);
    return {
      slug,
      name,
      group,
      decoderId,
      category,
      shelfLifeMonths,
      paoMonths,
      popular,
      hidden: HIDDEN_SLUGS.has(slug),
      printsDate: PRINTS_DATE_SLUGS.has(slug),
      blurb: `Decode ${name} batch codes to find the manufacture date, age and expiration date of your ${categoryBlurb[category]} products. Free, instant and private.`,
    };
  },
);

/** Public, verified-decode brands shown in the picker, search and listings. */
export const BRANDS: Brand[] = ALL_BRANDS.filter((b) => !b.hidden);

export const POPULAR_BRANDS = BRANDS.filter((b) => b.popular);

const bySlug = new Map(ALL_BRANDS.map((b) => [b.slug, b]));
export function getBrand(slug: string): Brand | undefined {
  return bySlug.get(slug);
}

/** Group a list of brands by their parent group, largest group first. */
export function groupBrands(
  list: Brand[],
): { group: string; brands: Brand[] }[] {
  const map = new Map<string, Brand[]>();
  for (const b of list) {
    const arr = map.get(b.group);
    if (arr) arr.push(b);
    else map.set(b.group, [b]);
  }
  return [...map.entries()]
    .map(([group, brands]) => ({
      group,
      brands: brands.sort((a, z) => a.name.localeCompare(z.name)),
    }))
    .sort(
      (a, z) =>
        z.brands.length - a.brands.length || a.group.localeCompare(z.group),
    );
}

export function searchBrands(query: string, limit = 8): Brand[] {
  const q = normalizeSearch(query);
  if (!q) return POPULAR_BRANDS.slice(0, limit);
  const starts: Brand[] = [];
  const contains: Brand[] = [];
  for (const b of BRANDS) {
    const n = normalizeSearch(b.name);
    if (n.startsWith(q)) starts.push(b);
    else if (n.includes(q) || normalizeSearch(b.group).includes(q))
      contains.push(b);
  }
  return [...starts, ...contains].slice(0, limit);
}
