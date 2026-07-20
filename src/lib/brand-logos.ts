import wikidataLogos from "./wikidata-brand-logos.json";

/** Brand → primary official web domain, used to verify Wikidata entities. */
const DOMAINS: Record<string, string> = {
  // Estée Lauder Companies
  "estee-lauder": "esteelauder.com",
  clinique: "clinique.com",
  "mac-cosmetics": "maccosmetics.com",
  "bobbi-brown": "bobbibrowncosmetics.com",
  aveda: "aveda.com",
  "la-mer": "cremedelamer.com",
  "jo-malone-london": "jomalone.com",
  "tom-ford-beauty": "tomford.com",
  origins: "origins.com",
  smashbox: "smashbox.com",
  "too-faced": "toofaced.com",
  drjart: "drjart.com",
  "lab-series": "labseries.com",
  "le-labo": "lelabofragrances.com",
  "kilian-paris": "bykilian.com",
  "frederic-malle": "fredericmalle.com",
  "bumble-and-bumble": "bumbleandbumble.com",
  // Coty
  coty: "coty.com",
  "rimmel-london": "rimmellondon.com",
  bourjois: "bourjois.com",
  "sally-hansen": "sallyhansen.com",
  "max-factor": "maxfactor.com",
  covergirl: "covergirl.com",
  manhattan: "manhattan-cosmetics.com",
  "miss-sporty": "miss-sporty.com",
  "kylie-cosmetics": "kyliecosmetics.com",
  "kylie-skin": "kylieskin.com",
  younique: "youniqueproducts.com",
  lancaster: "lancaster-beauty.com",
  adidas: "adidas.com",
  "bruno-banani": "bruno-banani.com",
  mexx: "mexx.com",
  nautica: "nautica.com",
  "calvin-klein": "calvinklein.com",
  "hugo-boss": "hugoboss.com",
  "gucci-beauty": "gucci.com",
  "burberry-beauty": "burberry.com",
  "marc-jacobs-fragrances": "marcjacobs.com",
  chloe: "chloe.com",
  davidoff: "davidoff.com",
  "tiffany-co": "tiffany.com",
  "vera-wang": "verawang.com",
  "roberto-cavalli": "robertocavalli.com",
  "jil-sander": "jilsander.com",
  joop: "joop.com",
  lacoste: "lacoste.com",
  escada: "escada.com",
  chopard: "chopard.com",
  cerruti: "cerruti.com",
  "bottega-veneta": "bottegaveneta.com",
  // L'Oréal Group
  loreal: "loreal.com",
  "loreal-paris": "lorealparis.com",
  maybelline: "maybelline.com",
  garnier: "garnier.com",
  "nyx-professional-makeup": "nyxcosmetics.com",
  essie: "essie.com",
  mixa: "mixa.com",
  "3ce": "stylenanda.com",
  "la-roche-posay": "laroche-posay.com",
  cerave: "cerave.com",
  vichy: "vichy.com",
  skinceuticals: "skinceuticals.com",
  "skinbetter-science": "skinbetter.com",
  lancome: "lancome.com",
  kiehls: "kiehls.com",
  "ysl-beauty": "yslbeauty.com",
  "giorgio-armani-beauty": "armanibeauty.com",
  "prada-beauty": "pradabeauty.com",
  "valentino-beauty": "valentino-beauty.com",
  biotherm: "biotherm.com",
  "urban-decay": "urbandecay.com",
  mugler: "mugler.com",
  azzaro: "azzaro.com",
  "viktor-rolf": "viktor-rolf.com",
  "ralph-lauren-fragrances": "ralphlauren.com",
  cacharel: "cacharel.com",
  diesel: "diesel.com",
  "helena-rubinstein": "helenarubinstein.com",
  "it-cosmetics": "itcosmetics.com",
  "shu-uemura": "shuuemura.com",
  aesop: "aesop.com",
  "house-of-creed": "creedboutique.com",
  "loreal-professionnel": "lorealprofessionnel.com",
  kerastase: "kerastase.com",
  redken: "redken.com",
  matrix: "matrix.com",
  pureology: "pureology.com",
  mizani: "mizani.com",
  "color-wow": "colorwowhair.com",
  // LVMH
  dior: "dior.com",
  guerlain: "guerlain.com",
  "givenchy-beauty": "givenchybeauty.com",
  "kenzo-parfums": "kenzoparfums.com",
  "loewe-perfumes": "loewe.com",
  "acqua-di-parma": "acquadiparma.com",
  "maison-francis-kurkdjian": "franciskurkdjian.com",
  fresh: "fresh.com",
  "benefit-cosmetics": "benefitcosmetics.com",
  "make-up-for-ever": "makeupforever.com",
  "fenty-beauty": "fentybeauty.com",
  "fenty-skin": "fentyskin.com",
  // Chanel
  chanel: "chanel.com",
  "chanel-beauty": "chanel.com",
  // Independent
  nivea: "nivea.com",
  eucerin: "eucerin.com",
  "the-ordinary": "theordinary.com",
  niod: "niod.com",
  nars: "narscosmetics.com",
  shiseido: "shiseido.com",
  "sk-ii": "sk-ii.com",
  "charlotte-tilbury": "charlottetilbury.com",
  "drunk-elephant": "drunkelephant.com",
  "paulas-choice": "paulaschoice.com",
  clarins: "clarins.com",
  "sephora-collection": "sephora.com",
  // Prestige fragrance and fashion houses
  "david-beckham": "davidbeckham.com",
  "michael-kors": "michaelkors.com",
  "tommy-hilfiger": "tommy.com",
  "maison-margiela": "maisonmargiela-fragrances.us",
  creed: "creedboutique.com",
  zara: "zara.com",
  "jean-paul-gaultier": "jeanpaulgaultier.com",
  "paco-rabanne": "rabanne.com",
  rabanne: "rabanne.com",
  "carolina-herrera": "carolinaherrera.com",
  "nina-ricci": "ninaricci.com",
  montblanc: "montblanc.com",
  "jimmy-choo": "jimmychoo.com",
  coach: "coach.com",
  boucheron: "boucheron.com",
  "van-cleef-arpels": "vancleefarpels.com",
  "karl-lagerfeld": "karllagerfeld.com",
  "kate-spade": "katespade.com",
  "salvatore-ferragamo": "ferragamo.com",
  moncler: "moncler.com",
  guess: "guess.com",
  "abercrombie-fitch": "abercrombie.com",
  dunhill: "dunhill.com",
  // Unilever and P&G consumer brands
  dove: "dove.com",
  vaseline: "vaseline.com",
  axe: "axe.com",
  rexona: "rexona.com",
  sunsilk: "sunsilk.com",
  tresemme: "tresemme.com",
  simple: "simple.co.uk",
  ponds: "ponds.com",
  "st-ives": "stives.com",
  nexxus: "nexxus.com",
  olay: "olay.com",
  pantene: "pantene.com",
  "head-shoulders": "headandshoulders.com",
  "herbal-essences": "herbalessences.com",
  "old-spice": "oldspice.com",
  secret: "secret.com",
  native: "nativecos.com",
  aussie: "aussie.com",
  labello: "labello.com",
  // Dermatology and Asian beauty brands
  neutrogena: "neutrogena.com",
  aveeno: "aveeno.com",
  roc: "rocskincare.com",
  laneige: "laneige.com",
  innisfree: "innisfree.com",
  sulwhasoo: "sulwhasoo.com",
  etude: "etude.com",
  mamonde: "mamonde.com",
  hera: "hera.com",
  iope: "iope.com",
  primera: "primera.co.kr",
  espoir: "espoir.com",
  illiyoon: "illiyoon.com",
  "the-face-shop": "thefaceshop.com",
  belif: "belifusa.com",
  "cnp-laboratory": "cnpmall.com",
  "su-m37": "sum37.com",
  "o-hui": "ohui.com",
  "the-history-of-whoo": "thehistoryofwhoo.com",
  physiogel: "physiogel.com",
  vdl: "vdlcosmetics.com",
  "cle-de-peau-beaute": "cledepeaubeaute.com",
  anessa: "corp.shiseido.com",
  elixir: "corp.shiseido.com",
  ipsa: "ipsa.co.jp",
  "hada-labo": "hadalabo.com.my",
  "melano-cc": "jp.rohto.com",
  oxy: "oxy.com.my",
  sunplay: "sunplay.com.my",
  bioderma: "bioderma.com",
  cosrx: "cosrx.com",
  "beauty-of-joseon": "beautyofjoseon.com",
  anua: "anua.com",
  "some-by-mi": "somebymi.com",
  torriden: "torriden.com",
  "round-lab": "roundlab.com",
  isntree: "isntree.com",
  purito: "purito.com",
  klairs: "klairscosmetics.com",
  mixsoon: "mixsoon.us",
  medicube: "medicube.us",
  numbuzin: "numbuzin.com",
  skin1004: "skin1004.com",
  "axis-y": "axis-y.com",
  "pyunkang-yul": "pyunkangyul.com",
  missha: "misshaus.com",
  "tony-moly": "tonymoly.us",
  "nature-republic": "naturerepublic.com",
  "holika-holika": "holikaholika.ee",
  "banila-co": "banilausa.com",
  clio: "clubclio.co.kr",
  peripera: "clubclio.co.kr",
  abib: "abib.com",
  goodal: "clubclio.co.kr",
  "vt-cosmetics": "vtcosmetics.com",
  skinfood: "theskinfood.us",
  "dr-ceuracle": "drceuracle.com",
  "ma-nyo": "manyo.us",
};

export function getBrandDomain(slug: string): string | undefined {
  return DOMAINS[slug];
}

export interface WikidataBrandLogo {
  src: string;
  qid: string;
  commonsFile: string;
  domainVerified: boolean;
  /** Commons `LicenseShortName`, e.g. "Public domain" or "CC BY-SA 4.0". */
  licence?: string | null;
  licenceId?: string | null;
  /** Uploader-stated author and source — the evidence, not a guarantee. */
  licenceAuthor?: string | null;
  licenceSource?: string | null;
  /** Commons' own `AttributionRequired` flag for this file. */
  attributionRequired?: boolean;
}

/**
 * Licences that carry no attribution duty, so a logo under one of them can be
 * shipped without a credit line. Everything else has to be either attributed or
 * not used — see `PUBLIC_DOMAIN_ONLY` in the quality suite, and finding 20.
 */
export const ATTRIBUTION_FREE_LICENCES = new Set(["Public domain"]);

/** Logos whose Commons licence obliges us to credit the author. */
export function logosRequiringAttribution(): string[] {
  return Object.entries(WIKIDATA_LOGOS)
    .filter(([, logo]) => logo.attributionRequired
      || (logo.licence != null && !ATTRIBUTION_FREE_LICENCES.has(logo.licence)))
    .map(([slug]) => slug)
    .sort();
}

const WIKIDATA_LOGOS = wikidataLogos as Record<string, WikidataBrandLogo>;

/** A local logo sourced from Wikidata P154 and verified against P856. */
export function getBrandLogo(slug: string): WikidataBrandLogo | undefined {
  return WIKIDATA_LOGOS[slug];
}

export function getBrandLogoInventory(): Readonly<Record<string, WikidataBrandLogo>> {
  return WIKIDATA_LOGOS;
}

/**
 * Last-resort brand tiles used only when Wikidata has no domain-verified P154
 * logo. They must never mask an available real brand asset.
 */
export interface BrandTile {
  label: string;
  bg: string;
  fg?: string;
}

const BRAND_TILES: Record<string, BrandTile> = {
  // Estée Lauder Companies
  "estee-lauder": { label: "EL", bg: "#16233f" },
  clinique: { label: "CLINIQUE", bg: "#3c7c78" },
  "mac-cosmetics": { label: "MAC", bg: "#0a0a0a" },
  "bobbi-brown": { label: "BOBBI", bg: "#0a0a0a" },
  "la-mer": { label: "LA MER", bg: "#0b3d4f" },
  "jo-malone-london": { label: "JO", bg: "#111111" },
  "tom-ford-beauty": { label: "TF", bg: "#0a0a0a" },
  // L'Oréal Group
  loreal: { label: "L'ORÉAL", bg: "#0a0a0a" },
  "loreal-paris": { label: "L'ORÉAL", bg: "#111827" },
  maybelline: { label: "MAYBELLINE", bg: "#0a0a0a" },
  garnier: { label: "GARNIER", bg: "#5aa832" },
  "nyx-professional-makeup": { label: "NYX", bg: "#0a0a0a" },
  lancome: { label: "LANCÔME", bg: "#0a0a0a" },
  kiehls: { label: "KIEHL'S", bg: "#1c3b2e" },
  "ysl-beauty": { label: "YSL", bg: "#0a0a0a" },
  "giorgio-armani-beauty": { label: "ARMANI", bg: "#0a0a0a" },
  "urban-decay": { label: "UD", bg: "#0a0a0a" },
  vichy: { label: "VICHY", bg: "#c8102e" },
  "la-roche-posay": { label: "LRP", bg: "#009fda" },
  cerave: { label: "CERAVE", bg: "#12508f" },
  biotherm: { label: "BIOTHERM", bg: "#009aa6" },
  kerastase: { label: "KÉRASTASE", bg: "#0a0a0a" },
  redken: { label: "REDKEN", bg: "#e2231a" },
  "prada-beauty": { label: "PRADA", bg: "#0a0a0a" },
  "valentino-beauty": { label: "VLTN", bg: "#0a0a0a" },
  "viktor-rolf": { label: "V&R", bg: "#0a0a0a" },
  azzaro: { label: "AZZARO", bg: "#0a2a5e" },
  cacharel: { label: "CACHAREL", bg: "#d94f8a" },
  aesop: { label: "Aesop", bg: "#2b2b26", fg: "#efe9dd" },
  // LVMH
  dior: { label: "Dior", bg: "#0a0a0a" },
  guerlain: { label: "GUERLAIN", bg: "#0a0a0a", fg: "#caa76a" },
  "benefit-cosmetics": { label: "benefit", bg: "#ffcf01", fg: "#1a1a1a" },
  "fenty-beauty": { label: "FENTY", bg: "#0a0a0a" },
  "make-up-for-ever": { label: "MUFE", bg: "#0a0a0a" },
  // Chanel
  chanel: { label: "CHANEL", bg: "#0a0a0a" },
  "chanel-beauty": { label: "CHANEL", bg: "#0a0a0a" },
  // Coty (fragrance)
  coty: { label: "COTY", bg: "#111111" },
  "calvin-klein": { label: "CK", bg: "#0a0a0a" },
  "hugo-boss": { label: "BOSS", bg: "#0a0a0a" },
  "gucci-beauty": { label: "GUCCI", bg: "#1e5631" },
  "burberry-beauty": { label: "BURBERRY", bg: "#0a0a0a", fg: "#d3c4a8" },
};

export function getBrandTile(slug: string): BrandTile | undefined {
  return BRAND_TILES[slug];
}

/**
 * Tile palette for brands without a curated entry.
 *
 * Dark enough that white text clears WCAG AA at the sizes these render, and
 * muted rather than saturated so a directory of them reads as one grid instead
 * of a colour chart.
 */
const GENERATED_TILE_BACKGROUNDS = [
  "#0a0a0a", "#1c2b3a", "#2d2a32", "#123a35", "#3a2419",
  "#1f3326", "#332030", "#14304a", "#3a2c14", "#251f3a",
] as const;

/** Stable per-slug index, so a brand keeps its colour between deploys. */
function slugHash(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * Label for a generated tile.
 *
 * Short names read better whole than abbreviated — "COSRX" beats "C" — so the
 * whole name is kept when it fits and initials are used only when it does not.
 * The renderer scales text to the tile, so the ceiling here is about legibility
 * at a directory thumbnail's size rather than about overflow.
 */
function tileLabel(name: string): string {
  // Unicode-aware: stripping to ASCII turned "Clé de Peau Beauté" into words
  // with holes in them, and a tile reading "BEAUT " is worse than no tile.
  const cleaned = name.replace(/[^\p{L}\p{N} &']/gu, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return "?";
  const words = cleaned.split(" ");
  if (cleaned.length <= 9) return cleaned.toUpperCase();
  if (words.length === 1) return cleaned.slice(0, 8).toUpperCase();
  const initials = words.slice(0, 3).map((word) => word[0]).join("").toUpperCase();
  // A single initial is not a brand mark; prefer the first word when short.
  if (initials.length < 2 && words[0].length <= 9) return words[0].toUpperCase();
  return initials;
}

/**
 * A tile for any brand, curated where we have one and derived where we do not.
 *
 * Every brand gets a designed tile rather than bare initials on white. It is
 * also the answer to "find a logo for the rest": a brand's logo is a trademark,
 * and the freely-licensed copies of them are mostly mislabelled uploads — see
 * finding 20. Our own typography carries no such problem.
 */
export function brandTile(slug: string, name: string): BrandTile {
  const curated = BRAND_TILES[slug];
  if (curated) return curated;
  const backgrounds = GENERATED_TILE_BACKGROUNDS;
  return {
    label: tileLabel(name),
    bg: backgrounds[slugHash(slug) % backgrounds.length],
  };
}
