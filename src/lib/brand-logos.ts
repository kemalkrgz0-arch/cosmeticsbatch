/**
 * Brand → primary web domain. Logos are fetched at runtime from a logo CDN by
 * domain (never bundled into the repo), so no trademarked image files are
 * stored here. Anything without a mapping — or whose logo fails to load — falls
 * back to a neutral monogram.
 */
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
};

export function getBrandDomain(slug: string): string | undefined {
  return DOMAINS[slug];
}

/**
 * Curated brand tiles for the most-recognised brands: a short wordmark on the
 * brand's colour, rendered as auto-scaling SVG text (crisp at any size, never a
 * broken image). These are original text renderings, not copied logo files.
 * Anything not listed falls back to a real favicon, then a neutral monogram.
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
 * Ordered logo sources for a domain. DuckDuckGo's icon service returns the real
 * site favicon and a proper 404 when it has none (so the <img> onError chain can
 * fall through to the monogram). Google favicons are the secondary source.
 *
 * Clearbit's logo API was retired (DNS no longer resolves) and, before that,
 * served generic placeholder images with a 200 — which loaded "successfully"
 * and masked the real logo instead of failing over. It is intentionally gone.
 */
export function logoSources(domain: string): string[] {
  return [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
}
