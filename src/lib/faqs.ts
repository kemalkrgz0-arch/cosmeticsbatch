export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What is a batch code?",
    a: "A batch code is a short code printed on cosmetic and perfume packaging that identifies the production run. Decoding it reveals when the product was manufactured.",
  },
  {
    q: "Is this batch code checker free?",
    a: "Yes. Cosmetics Batch is completely free, requires no account, and decodes codes directly in your browser.",
  },
  {
    q: "How accurate are the results?",
    a: "We use manufacturer-specific algorithms where available and honest confidence levels elsewhere. Shelf-life estimates are typical values, not guarantees of safety.",
  },
  {
    q: "Where do I find my batch code?",
    a: "It's usually a short stamped or embossed code on the base of a bottle, the crimp of a tube, or the bottom of the box — separate from the barcode.",
  },
  {
    q: "Does an expired product mean it's unsafe?",
    a: "Not necessarily. It means the product is past its typical shelf life and may have reduced performance. Eye products and anything that smells or looks off should be discarded.",
  },
  {
    q: "What does the open-jar (PAO) symbol mean?",
    a: "The little open-jar icon with a number like 12M or 24M is the Period After Opening — how many months a product stays good once you first open it. After opening, this becomes the limit even if the batch code date is recent.",
  },
  {
    q: "What's the difference between shelf life and expiration date?",
    a: "Most cosmetics don't print an expiry date. The batch code gives the manufacture date, and we estimate the expiration by adding the product's typical unopened shelf life — usually 24–36 months for makeup and skincare, and 3–5 years for perfume.",
  },
  {
    q: "How long does perfume last?",
    a: "Most fragrances last 3 to 5 years from the manufacture date, and often longer if stored cool and away from light. Perfume rarely becomes unsafe, but oxidation slowly changes the scent — the top notes fade first.",
  },
  {
    q: "Why can't my batch code be decoded?",
    a: "Some brands change their coding over time, use region-specific formats, or don't encode the date publicly. Double-check you entered the stamped batch code (not the barcode), or try selecting the parent company instead of the sub-brand.",
  },
  {
    q: "Do you store my batch codes or personal data?",
    a: "No. Codes are decoded in your browser and we don't require an account. Nothing you type is saved to a server, so checking a code is completely private.",
  },
];
