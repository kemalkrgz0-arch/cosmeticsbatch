export type EucerinProductReference = {
  article: string;
  productName: string;
  sourceUrl: string;
};

const REFERENCES: Record<string, EucerinProductReference> = {
  "66883": {
    article: "66883",
    productName: "Eucerin Anti-Pigment Dual Serum, 30 ml",
    sourceUrl: "https://www.eucerin.de/produkte/anti-pigment/dual-serum",
  },
  "69767": {
    article: "69767",
    productName: "Eucerin Oil Control Face Sun Gel-Creme SPF 50+, 50 ml",
    sourceUrl: "https://www.eucerin.de/produkte/sonnenschutz/oil-control-face-sun-gel-creme-lsf-50-plus",
  },
};

export function getEucerinProductReference(brandSlug: string, value: string) {
  if (brandSlug !== "eucerin") return null;
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/^(\d{5})(?:000[A-Z]{2}\d{2})?$/);
  return match ? REFERENCES[match[1]] ?? null : null;
}

export const EUCERIN_PRODUCT_REFERENCES = Object.freeze(Object.values(REFERENCES));
