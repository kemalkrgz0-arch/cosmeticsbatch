import type { ProductCategory } from "./decoder/types";
import { BRAND_DETAILS } from "./brand-detail";

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
  /**
   * Real product photos showing where the batch code is on this brand's
   * packaging. Shown in the "where to find the code" section. Dimensions are
   * intrinsic px (reserve space to avoid layout shift).
   */
  codeImages?: { src: string; width: number; height: number }[];
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
  ["Younique", "Younique", undefined, "makeup", 36, 24],
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
  ["L'Oréal Paris", "L'Oréal Group", "loreal", "makeup", 36, 12, true],
  ["Maybelline", "L'Oréal Group", "loreal", "makeup", 36, 12, true],
  ["Garnier", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["NYX Professional Makeup", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Essie", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Mixa", "L'Oréal Group", "loreal", "skincare", 36, 12],
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
  ["Color Wow", "Color Wow", undefined, "haircare", 36, 12],

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
  ["Nivea", "Beiersdorf", "beiersdorf", "skincare", 36, 12, true],
  ["Eucerin", "Beiersdorf", "beiersdorf", "skincare", 36, 12],
  ["The Ordinary", "Deciem", "deciem", "skincare", 36, 12, true],
  ["NIOD", "Deciem", "deciem", "skincare", 36, 12],
  ["NARS", "Shiseido", "shiseido", "makeup", 36, 24],
  ["Shiseido", "Shiseido", "shiseido", "skincare", 36, 12],
  ["SK-II", "P&G", undefined, "skincare", 36, 12],
  ["Charlotte Tilbury", "Charlotte Tilbury", undefined, "makeup", 36, 24],
  ["Drunk Elephant", "Shiseido", undefined, "skincare", 36, 12],
  ["Paula's Choice", "Unilever", undefined, "skincare", 36, 12],
  ["Clarins", "Clarins", undefined, "skincare", 36, 12],
  ["Sephora Collection", "Sephora", undefined, "makeup", 36, 12],

  // ---- Mass-market brands (no verified decoder yet — all staged in HIDDEN_SLUGS) ----
  ["Dove", "Unilever", "unilever", "skincare", 36, 12],
  ["Vaseline", "Unilever", "unilever", "skincare", 36, 12],
  ["Axe", "Unilever", "unilever", "generic", 36, 12],
  ["Rexona", "Unilever", "unilever", "generic", 36, 12],
  ["Sunsilk", "Unilever", "unilever", "haircare", 36, 12],
  ["TRESemmé", "Unilever", "unilever", "haircare", 36, 12],
  ["Simple", "Unilever", "unilever", "skincare", 36, 12],
  ["Pond's", "Unilever", "unilever", "skincare", 36, 12],
  ["St. Ives", "Unilever", "unilever", "skincare", 36, 12],
  ["Dermalogica", "Unilever", undefined, "skincare", 36, 12],
  ["Murad", "Unilever", undefined, "skincare", 36, 12],
  ["Hourglass", "Unilever", undefined, "makeup", 36, 24],
  ["Living Proof", "Unilever", undefined, "haircare", 36, 12],
  ["Tatcha", "Unilever", undefined, "skincare", 36, 12],
  ["REN Clean Skincare", "Unilever", undefined, "skincare", 36, 12],
  ["Nexxus", "Unilever", "unilever", "haircare", 36, 12],
  ["Olay", "P&G", "pg", "skincare", 36, 12],
  ["Pantene", "P&G", "pg", "haircare", 36, 12],
  ["Head & Shoulders", "P&G", "pg", "haircare", 36, 12],
  ["Herbal Essences", "P&G", "pg", "haircare", 36, 12],
  ["Old Spice", "P&G", "pg", "generic", 36, 12],
  ["Secret", "P&G", "pg", "generic", 36, 12],
  ["Native", "P&G", "pg", "generic", 36, 12],
  ["Aussie", "P&G", "pg", "haircare", 36, 12],
  ["First Aid Beauty", "P&G", undefined, "skincare", 36, 12],
  ["Ouai", "P&G", undefined, "haircare", 36, 12],
  ["La Prairie", "Beiersdorf", undefined, "skincare", 36, 12],
  ["Coppertone", "Beiersdorf", undefined, "suncare", 36, 12],
  ["Aquaphor", "Beiersdorf", undefined, "skincare", 36, 12],
  ["Chantecaille", "Beiersdorf", undefined, "skincare", 36, 12],
  ["Labello", "Beiersdorf", "beiersdorf", "skincare", 36, 12],
  ["Neutrogena", "Kenvue", "kenvue", "skincare", 36, 12],
  ["Aveeno", "Kenvue", "kenvue", "skincare", 36, 12],
  ["Clean & Clear", "Kenvue", undefined, "skincare", 36, 12],
  ["RoC", "RoC Skincare", "kenvue", "skincare", 36, 12],
  ["Le Petit Marseillais", "Kenvue", undefined, "generic", 36, 12],
  ["OGX", "Kenvue", undefined, "haircare", 36, 12],
  ["Maui Moisture", "Kenvue", undefined, "haircare", 36, 12],
  ["Palmolive", "Colgate-Palmolive", undefined, "generic", 36, 12],
  ["Sanex", "Colgate-Palmolive", undefined, "generic", 36, 12],
  ["EltaMD", "Colgate-Palmolive", undefined, "suncare", 36, 12],
  ["PCA Skin", "Colgate-Palmolive", undefined, "skincare", 36, 12],
  ["Filorga", "Colgate-Palmolive", undefined, "skincare", 36, 12],
  ["Schwarzkopf", "Henkel", undefined, "haircare", 36, 12],
  ["Syoss", "Henkel", undefined, "haircare", 36, 12],
  ["got2b", "Henkel", undefined, "haircare", 36, 12],
  ["Diadermine", "Henkel", undefined, "skincare", 36, 12],
  ["Fa", "Henkel", undefined, "generic", 36, 12],
  ["Laneige", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Innisfree", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Sulwhasoo", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Etude", "Amorepacific", "kbeauty", "makeup", 36, 12],
  ["Mamonde", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Hera", "Amorepacific", "kbeauty", "makeup", 36, 12],
  ["Iope", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Primera", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["Espoir", "Amorepacific", "kbeauty", "makeup", 36, 12],
  ["Illiyoon", "Amorepacific", "kbeauty", "skincare", 36, 12],
  ["The Face Shop", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["Belif", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["CNP Laboratory", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["Su:m37", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["O HUI", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["The History of Whoo", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["Physiogel", "LG H&H", "kbeauty", "skincare", 36, 12],
  ["VDL", "LG H&H", "kbeauty", "makeup", 36, 12],
  ["Bioré", "Kao", undefined, "skincare", 36, 12],
  ["Sensai", "Kao", undefined, "skincare", 36, 12],
  ["Kanebo", "Kao", undefined, "skincare", 36, 12],
  ["Curél", "Kao", undefined, "skincare", 36, 12],
  ["Jergens", "Kao", undefined, "skincare", 36, 12],
  ["John Frieda", "Kao", undefined, "haircare", 36, 12],
  ["Molton Brown", "Kao", undefined, "generic", 36, 12],
  ["Guhl", "Kao", undefined, "haircare", 36, 12],
  ["Clé de Peau Beauté", "Shiseido", "shiseido", "skincare", 36, 12],
  ["Anessa", "Shiseido", "shiseido", "suncare", 36, 12],
  ["Elixir", "Shiseido", "shiseido", "skincare", 36, 12],
  ["bareMinerals", "AS Beauty", undefined, "makeup", 36, 24],
  ["Laura Mercier", "AS Beauty", undefined, "makeup", 36, 24],
  ["Ipsa", "Shiseido", "shiseido", "skincare", 36, 12],
  ["Sekkisei", "Kosé", undefined, "skincare", 36, 12],
  ["Cosme Decorte", "Kosé", undefined, "skincare", 36, 12],
  ["Jill Stuart", "Kosé", undefined, "makeup", 36, 24],
  ["Tarte", "Kosé", undefined, "makeup", 36, 24],
  ["Awake", "Kosé", undefined, "skincare", 36, 12],
  ["Visée", "Kosé", undefined, "makeup", 36, 24],
  ["Hada Labo", "Rohto", "rohto", "skincare", 36, 12],
  ["Melano CC", "Rohto", "rohto", "skincare", 36, 12],
  ["OXY", "Rohto", "rohto", "skincare", 36, 12],
  ["Sunplay", "Rohto", "rohto", "suncare", 36, 12],
  ["Gatsby", "Mandom", undefined, "haircare", 36, 12],
  ["Bifesta", "Mandom", undefined, "skincare", 36, 12],
  ["Lucido", "Mandom", undefined, "generic", 36, 12],
  ["POLA", "Pola Orbis", undefined, "skincare", 36, 12],
  ["Orbis", "Pola Orbis", undefined, "skincare", 36, 12],
  ["Jurlique", "Pola Orbis", undefined, "skincare", 36, 12],
  ["THREE", "Pola Orbis", undefined, "makeup", 36, 12],
  ["Yves Rocher", "Groupe Rocher", undefined, "skincare", 36, 12],
  ["Sabon", "Groupe Rocher", undefined, "generic", 36, 12],
  ["Arbonne", "Groupe Rocher", undefined, "skincare", 36, 12],
  ["Flormar", "Groupe Rocher", undefined, "makeup", 36, 24],
  ["Natura", "Natura & Co", undefined, "generic", 36, 12],
  ["Avon", "Natura & Co", undefined, "makeup", 36, 24],
  ["The Body Shop", "The Body Shop", undefined, "skincare", 36, 12],
  ["Revlon", "Revlon", undefined, "makeup", 36, 24],
  ["Almay", "Revlon", undefined, "makeup", 36, 24],
  ["Elizabeth Arden", "Revlon", undefined, "skincare", 36, 12],
  ["American Crew", "Revlon", undefined, "haircare", 36, 12],
  ["CND", "Revlon", undefined, "makeup", 36, 24],
  ["e.l.f. Cosmetics", "e.l.f. Beauty", undefined, "makeup", 36, 24],
  ["Naturium", "e.l.f. Beauty", undefined, "skincare", 36, 12],
  ["Well People", "e.l.f. Beauty", undefined, "makeup", 36, 24],
  ["Keys Soulcare", "e.l.f. Beauty", undefined, "skincare", 36, 12],
  ["Wella Professionals", "Wella Company", undefined, "haircare", 36, 12],
  ["Nioxin", "Wella Company", undefined, "haircare", 36, 12],
  ["Sebastian Professional", "Wella Company", undefined, "haircare", 36, 12],
  ["OPI", "Wella Company", undefined, "makeup", 36, 24],
  ["Clairol", "Wella Company", undefined, "haircare", 36, 12],
  ["Byredo", "Puig", undefined, "perfume", 60, 36],
  ["Penhaligon's", "Puig", undefined, "perfume", 60, 36],
  ["L'Artisan Parfumeur", "Puig", undefined, "perfume", 60, 36],
  ["Dries Van Noten", "Puig", undefined, "perfume", 60, 36],
  ["Avène", "Pierre Fabre", undefined, "skincare", 36, 12],
  ["Klorane", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["Ducray", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["A-Derma", "Pierre Fabre", undefined, "skincare", 36, 12],
  ["René Furterer", "Pierre Fabre", undefined, "haircare", 36, 12],
  ["Bioderma", "NAOS", "naos", "skincare", 36, 12],
  ["Institut Esthederm", "NAOS", undefined, "skincare", 36, 12],
  ["Cetaphil", "Galderma", undefined, "skincare", 36, 12],
  ["Alastin", "Galderma", undefined, "skincare", 36, 12],
  ["Uriage", "Uriage", undefined, "skincare", 36, 12],
  ["Embryolisse", "Embryolisse", undefined, "skincare", 36, 12],
  ["Weleda", "Weleda", undefined, "skincare", 36, 12],
  ["Dr. Hauschka", "Wala", undefined, "skincare", 36, 12],
  ["Burt's Bees", "Burt's Bees", undefined, "skincare", 36, 12],
  ["FANCL", "FANCL", undefined, "skincare", 36, 12],
  ["DHC", "DHC", undefined, "skincare", 36, 12],
  ["Albion", "Albion", undefined, "skincare", 36, 12],
  ["Canmake", "Canmake", undefined, "makeup", 36, 24],
  ["Cezanne", "Cezanne", undefined, "makeup", 36, 24],
  ["Kiss Me", "Isehan", undefined, "makeup", 36, 24],
  ["Glossier", "Glossier", undefined, "makeup", 36, 12],
  ["The Inkey List", "The Inkey List", undefined, "skincare", 36, 12],
  ["Kosas", "Kosas", undefined, "makeup", 36, 12],
  ["ILIA", "ILIA", undefined, "makeup", 36, 12],
  ["Merit", "Merit", undefined, "makeup", 36, 12],
  ["Rare Beauty", "Rare Beauty", undefined, "makeup", 36, 12],
  ["Tower 28", "Tower 28", undefined, "makeup", 36, 12],
  ["Summer Fridays", "Summer Fridays", undefined, "skincare", 36, 12],
  ["Glow Recipe", "Glow Recipe", undefined, "skincare", 36, 12],
  ["Farmacy", "Farmacy", undefined, "skincare", 36, 12],
  ["Sunday Riley", "Sunday Riley", undefined, "skincare", 36, 12],
  ["Milk Makeup", "Milk Makeup", undefined, "makeup", 36, 12],
  ["Westman Atelier", "Westman Atelier", undefined, "makeup", 36, 12],
  ["Augustinus Bader", "Augustinus Bader", undefined, "skincare", 36, 12],
  ["Medik8", "Medik8", undefined, "skincare", 36, 12],
  ["Obagi", "Obagi", undefined, "skincare", 36, 12],
  ["COSRX", "COSRX", "kbeauty", "skincare", 36, 12],
  ["Beauty of Joseon", "Beauty of Joseon", "kbeauty", "skincare", 36, 12],
  ["Anua", "Anua", "kbeauty", "skincare", 36, 12],
  ["Some By Mi", "Some By Mi", "kbeauty", "skincare", 36, 12],
  ["Torriden", "Torriden", "kbeauty", "skincare", 36, 12],
  ["Round Lab", "Round Lab", "kbeauty", "skincare", 36, 12],
  ["Isntree", "Isntree", "kbeauty", "skincare", 36, 12],
  ["Purito", "Purito", "kbeauty", "skincare", 36, 12],
  ["Klairs", "Wishcompany", "kbeauty", "skincare", 36, 12],
  ["Mixsoon", "Mixsoon", "kbeauty", "skincare", 36, 12],
  ["Medicube", "Medicube", "kbeauty", "skincare", 36, 12],
  ["Numbuzin", "Numbuzin", "kbeauty", "skincare", 36, 12],
  ["SKIN1004", "SKIN1004", "kbeauty", "skincare", 36, 12],
  ["Axis-Y", "Axis-Y", "kbeauty", "skincare", 36, 12],
  ["Pyunkang Yul", "Pyunkang Yul", "kbeauty", "skincare", 36, 12],
  ["Missha", "Able C&C", "kbeauty", "skincare", 36, 12],
  ["Tony Moly", "Tony Moly", "kbeauty", "skincare", 36, 12],
  ["Nature Republic", "Nature Republic", "kbeauty", "skincare", 36, 12],
  ["Holika Holika", "Holika Holika", "kbeauty", "makeup", 36, 24],
  ["Banila Co", "Banila Co", "kbeauty", "makeup", 36, 24],
  ["rom&nd", "rom&nd", undefined, "makeup", 36, 24],
  ["Clio", "Clio", "kbeauty", "makeup", 36, 24],
  ["Peripera", "Clio", "kbeauty", "makeup", 36, 24],
  ["Abib", "Abib", "kbeauty", "skincare", 36, 12],
  ["Goodal", "Goodal", "kbeauty", "skincare", 36, 12],
  ["VT Cosmetics", "VT Cosmetics", "kbeauty", "skincare", 36, 12],
  ["Skinfood", "Skinfood", "kbeauty", "skincare", 36, 12],
  ["d'Alba", "d'Alba", undefined, "skincare", 36, 12],
  ["Dr. Ceuracle", "Dr. Ceuracle", "kbeauty", "skincare", 36, 12],
  ["Ma:nyo", "Ma:nyo", "kbeauty", "skincare", 36, 12],
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
  // Corrected ownership (see git history): these were mapped to a parent group's
  // decoder that does not apply to them, which produced confidently wrong dates.
  // Staged out until a verified format exists — the rule is unchanged: never ship
  // a decoder we haven't verified.
  "color-wow",
  "younique",
  // Coty makeup/skin — the 4-digit YDDD fragrance format does NOT apply here.
  "sk-ii",
  "charlotte-tilbury",
  "drunk-elephant",
  "paulas-choice",
  "clarins",
  "sephora-collection",
  // Mass-market / Asian brands staged in — page resolves for SEO, hidden from
  // the picker until a tested decoder covers each one.
  "dermalogica",
  "murad",
  "hourglass",
  "living-proof",
  "tatcha",
  "ren-clean-skincare",
  "first-aid-beauty",
  "ouai",
  "la-prairie",
  "coppertone",
  "aquaphor",
  "chantecaille",
  "clean-clear",
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
  "biore",
  "sensai",
  "kanebo",
  "curel",
  "jergens",
  "john-frieda",
  "molton-brown",
  "guhl",
  "bareminerals",
  "laura-mercier",
  "sekkisei",
  "cosme-decorte",
  "jill-stuart",
  "tarte",
  "awake",
  "visee",
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
  "rom-nd",
  "dalba",
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

/** Real product photos of where the batch code is, keyed by slug. */
const CODE_IMAGES: Record<string, Brand["codeImages"]> = {
  shiseido: [
    { src: "/brands/shiseido-batch-1.jpg", width: 707, height: 720 },
    { src: "/brands/shiseido-batch-2.jpg", width: 720, height: 507 },
  ],
};

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
      codeImages: CODE_IMAGES[slug],
      blurb: `Decode ${name} batch codes to find the manufacture date, age and expiration date of your ${categoryBlurb[category]} products. Free, instant and private.`,
    };
  },
);

/** Public, verified-decode brands shown in the picker, search and listings. */
export const BRANDS: Brand[] = ALL_BRANDS.filter((b) => !b.hidden);

export const POPULAR_BRANDS = BRANDS.filter((b) => b.popular);

/**
 * A brand page is indexable only when it carries editorially written,
 * brand-specific material (see [[brand-detail]]): a decoded sample code, where
 * the code sits on that brand's packaging, and answers to the questions people
 * actually search for it. Without that, the page is one of a few hundred
 * generated from the same template per decoder family — near-duplicates, which
 * is what search engines score as scaled, low-value content. Those stay
 * `noindex, follow`: still the tool, still crawlable, just not in the index.
 */
export const INDEXED_BRANDS: Brand[] = BRANDS.filter((b) =>
  Object.hasOwn(BRAND_DETAILS, b.slug),
);

export function isIndexedBrand(brand: Brand): boolean {
  return !brand.hidden && Object.hasOwn(BRAND_DETAILS, brand.slug);
}

/**
 * AdSense inventory is deliberately narrower than the functional brand list.
 * A page is monetizable only after it has passed the same manual editorial
 * threshold required for indexing and has a verified manufacturer decoder.
 * Unreviewed brands remain useful, reachable tools — simply without ads.
 */
export function isMonetizableBrand(brand: Brand): boolean {
  return isIndexedBrand(brand) && Boolean(brand.decoderId);
}

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
