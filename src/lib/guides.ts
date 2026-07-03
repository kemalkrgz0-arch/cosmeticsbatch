export interface GuideSection {
  heading: string;
  /** Simple paragraphs; each string is one <p>. Use "- " prefix for list items. */
  body: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** ~ minutes to read, shown in UI + Article schema. */
  readMinutes: number;
  updated: string; // ISO date
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "what-is-a-batch-code",
    title: "What Is a Batch Code?",
    description:
      "A batch code is a manufacturer's production stamp that reveals when your cosmetic or perfume was made. Here's how to read it.",
    readMinutes: 4,
    updated: "2026-06-01",
    sections: [
      {
        heading: "The short answer",
        body: [
          "A batch code (also called a lot code or production code) is a short string of letters and numbers printed or embossed on cosmetic and perfume packaging. It identifies the exact production run of a product.",
          "Unlike a barcode — which identifies the product for sale — a batch code encodes when and often where the item was manufactured. Decoding it tells you the manufacture date, the current age, and the estimated expiration date.",
        ],
      },
      {
        heading: "Why batch codes matter",
        body: [
          "Cosmetics degrade over time. Active ingredients lose potency, preservatives weaken, and fragrances turn. Knowing the manufacture date helps you judge whether a product is still safe and effective.",
          "Batch codes are also a first line of defence against counterfeits and grey-market stock: a code that can't be decoded, or that decodes to an impossible date, is a red flag.",
        ],
      },
      {
        heading: "Where the code comes from",
        body: [
          "Manufacturers assign a code to every production batch for quality control and product recalls. There is no single global standard — each manufacturer chooses its own format.",
          "That's why a decoder has to know the rules for each brand's parent company. Estée Lauder, Coty, L'Oréal and others each stamp dates differently.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a batch code the same as an expiry date?",
        a: "No. Most cosmetics don't print an explicit expiry date. The batch code encodes the manufacture date, and the expiry is estimated from the product's typical shelf life.",
      },
      {
        q: "Can a batch code be faked?",
        a: "Counterfeiters copy codes, but they often reuse invalid or impossible ones. A code that decodes cleanly is a good sign, though not a guarantee of authenticity.",
      },
    ],
  },
  {
    slug: "how-to-find-your-batch-code",
    title: "How to Find Your Batch Code",
    description:
      "Batch codes hide in different places on different products. This guide shows exactly where to look on makeup, skincare and perfume.",
    readMinutes: 3,
    updated: "2026-06-01",
    sections: [
      {
        heading: "General rule",
        body: [
          "The batch code is usually the shorter, irregular-looking string — typically 3 to 11 characters — that is stamped, inkjet-printed or embossed rather than professionally printed with the label.",
          "Ignore the barcode number and any long marketing reference. The batch code often looks slightly out of place because it is added at the end of the production line.",
        ],
      },
      {
        heading: "Where to look by product type",
        body: [
          "- Perfume: on the bottom of the box and embossed or printed on the base of the glass bottle.",
          "- Skincare tubes: crimped at the sealed end of the tube.",
          "- Jars and pots: on the underside of the jar or the base of the box.",
          "- Makeup compacts: inside the pan or on the back of the casing.",
          "- Lipsticks and mascaras: on the bottom of the tube or bullet base.",
        ],
      },
      {
        heading: "Tips for tricky codes",
        body: [
          "Embossed codes on dark glass can be hard to read — angle it under a light or photograph it with flash and zoom in.",
          "If there are two codes, the batch code is usually the one that mixes letters and numbers. Enter it exactly, without spaces.",
        ],
      },
    ],
  },
  {
    slug: "cosmetics-shelf-life-guide",
    title: "Cosmetics Shelf Life Guide",
    description:
      "How long makeup, skincare and perfume really last — unopened and after opening — with a practical category-by-category table.",
    readMinutes: 5,
    updated: "2026-06-01",
    sections: [
      {
        heading: "Two clocks: shelf life vs PAO",
        body: [
          "Every product has two timelines. Shelf life is how long it lasts unopened, measured from the manufacture date. Period-after-opening (PAO) — the little open-jar symbol with a number like 12M — is how long it stays good once opened.",
          "Our checker estimates the unopened shelf life from the manufacture date. Once you open a product, the PAO usually becomes the limiting factor.",
        ],
      },
      {
        heading: "Typical lifespans",
        body: [
          "- Mascara & liquid liner: 3–6 months after opening — the shortest of all.",
          "- Liquid foundation & concealer: 6–12 months after opening.",
          "- Cream & gel skincare: 6–12 months after opening; 24–36 months unopened.",
          "- Powders (blush, eyeshadow, setting powder): 12–24 months after opening.",
          "- Lipstick: 12–18 months after opening.",
          "- Perfume: 3–5 years, sometimes far longer if stored well.",
        ],
      },
      {
        heading: "What shortens shelf life",
        body: [
          "Heat, sunlight, humidity and air exposure all accelerate breakdown. A bathroom shelf is one of the worst places to store products.",
          "Water and fingers introduce bacteria. Using clean tools and keeping lids closed meaningfully extends usable life.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I use makeup after its shelf life?",
        a: "It may still be usable but with reduced performance and higher irritation risk. Eye products past their PAO are the ones to be strictest about.",
      },
    ],
  },
  {
    slug: "perfume-shelf-life",
    title: "How Long Does Perfume Last?",
    description:
      "Perfume can last 3–5 years or more. Learn what affects fragrance longevity and how to tell if a scent has turned.",
    readMinutes: 4,
    updated: "2026-06-01",
    sections: [
      {
        heading: "The typical lifespan",
        body: [
          "Most fragrances last 3 to 5 years from the manufacture date. Higher concentrations (parfum, eau de parfum) and scents with heavier base notes tend to last longer than fresh, citrus-led eau de toilettes.",
          "Perfume doesn't have a hard expiry, but oxidation gradually changes the smell — the top notes fade first and the composition can turn sour or metallic.",
        ],
      },
      {
        heading: "How to tell if perfume has gone off",
        body: [
          "- The colour has darkened noticeably.",
          "- The top notes smell sharp, sour or like vinegar.",
          "- The scent projects less and disappears faster than it used to.",
        ],
      },
      {
        heading: "Making fragrance last",
        body: [
          "Store bottles in a cool, dark place — not on a sunny windowsill or in a steamy bathroom. Keep them in the original box to block light.",
          "Avoid big temperature swings. Stable, cool storage is the single biggest factor in preserving a fragrance.",
        ],
      },
    ],
  },
  {
    slug: "how-to-store-cosmetics",
    title: "How to Store Cosmetics Properly",
    description:
      "Simple storage habits that extend the life of your makeup, skincare and perfume and keep them safe to use.",
    readMinutes: 3,
    updated: "2026-06-01",
    sections: [
      {
        heading: "Keep it cool, dark and dry",
        body: [
          "Heat and light are the main enemies of cosmetic stability. Store products away from direct sun and heat sources; a bedroom drawer beats a bathroom cabinet.",
          "Some actives — vitamin C, retinoids, benzoyl peroxide — are especially light- and air-sensitive. Keep them tightly closed and consider the fridge for vitamin C serums.",
        ],
      },
      {
        heading: "Hygiene habits",
        body: [
          "Close lids fully, avoid dipping fingers into jars, and wash brushes and sponges regularly. This keeps bacteria out and preserves both the product and your skin.",
        ],
      },
    ],
  },
  {
    slug: "fake-vs-original-products",
    title: "Fake vs Original: Spotting Counterfeits",
    description:
      "How to use batch codes and packaging clues to tell genuine cosmetics and perfumes from convincing fakes.",
    readMinutes: 4,
    updated: "2026-06-01",
    sections: [
      {
        heading: "Start with the batch code",
        body: [
          "Genuine products have a batch code that decodes to a plausible recent manufacture date. Counterfeits often have missing codes, codes that don't match between the box and the bottle, or codes that decode to impossible dates.",
          "A code that fails to decode isn't proof of a fake on its own — but combined with other signs, it's a strong warning.",
        ],
      },
      {
        heading: "Packaging red flags",
        body: [
          "- Batch codes on the box and product that don't match.",
          "- Blurry printing, spelling mistakes, or misaligned labels.",
          "- Cellophane that's loose, crooked, or missing.",
          "- A price that's dramatically below retail from an unofficial seller.",
        ],
      },
      {
        heading: "Buy from trusted sources",
        body: [
          "The safest protection is buying from the brand directly or an authorised retailer. Marketplace and social-media sellers are where most counterfeits circulate.",
        ],
      },
    ],
  },
];

const guideBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
export function getGuide(slug: string): Guide | undefined {
  return guideBySlug.get(slug);
}
