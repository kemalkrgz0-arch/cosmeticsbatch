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
  {
    slug: "does-makeup-expire",
    title: "Does Makeup Expire? Signs and Timelines",
    description:
      "Yes — makeup expires, and using it past its prime can irritate skin or cause infections. Here are the real timelines and the warning signs to watch for.",
    readMinutes: 5,
    updated: "2026-07-04",
    sections: [
      {
        heading: "Yes, makeup expires",
        body: [
          "Every cosmetic has two clocks: the unopened shelf life from the manufacture date, and the period after opening (PAO) once you break the seal. Whichever runs out first is your real deadline.",
          "Decode the batch code to find the manufacture date, then use the open-jar PAO symbol to know how long it lasts after first use.",
        ],
      },
      {
        heading: "Typical timelines after opening",
        body: [
          "- Mascara and liquid eyeliner: 3–6 months. The wand pumps bacteria back into the tube every use.",
          "- Liquid foundation and concealer: 6–12 months.",
          "- Cream products (blush, eyeshadow): 12 months.",
          "- Powders (pressed, loose, bronzer): 18–24 months — dry formulas resist bacteria.",
          "- Lipstick and lip gloss: 12–18 months.",
          "- Pencil liners: up to 24 months, since sharpening exposes a fresh surface.",
        ],
      },
      {
        heading: "Warning signs it's gone off",
        body: [
          "Trust your senses before the calendar: a sour or 'off' smell, a change in colour, separation, a dried or clumpy texture, or a filmy layer all mean it's time to bin it.",
          "Anything you use near the eyes or on broken skin deserves extra caution — a mascara that smells odd is not worth an eye infection.",
        ],
      },
      {
        heading: "What happens if you use expired makeup",
        body: [
          "Preservatives weaken over time, letting bacteria, mould and yeast grow. That can trigger breakouts, irritation, styes, conjunctivitis or cold-sore-like reactions.",
          "Expired SPF and active skincare also lose potency, so the product may simply stop doing its job even if it looks fine.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I use makeup after the PAO date if it looks fine?",
        a: "It's not recommended for eye and lip products, where infection risk is highest. Powders are the most forgiving. When in doubt, smell and inspect it — and replace anything used near the eyes.",
      },
      {
        q: "Does unopened makeup expire?",
        a: "Yes, but more slowly. Sealed products are typically good for 2–3 years from manufacture. Decode the batch code to check how old an unopened item already is.",
      },
    ],
  },
  {
    slug: "pao-symbol-meaning",
    title: "PAO Symbol: What 6M, 12M and 24M Mean",
    description:
      "The little open-jar icon with a number is the Period After Opening. Here's what 6M, 12M and 24M mean and how it differs from the batch code.",
    readMinutes: 3,
    updated: "2026-07-04",
    sections: [
      {
        heading: "What the open-jar symbol means",
        body: [
          "The PAO (Period After Opening) symbol is a small open jar with a number followed by 'M'. It tells you how many months a product stays good after you first open it.",
          "So '12M' means use within 12 months of opening; '24M' means 24 months. The clock starts the day you break the seal, not the day you bought it.",
        ],
      },
      {
        heading: "PAO vs the batch code",
        body: [
          "These are two different timers. The batch code encodes the manufacture date and tells you the unopened shelf life. The PAO takes over once the product is opened.",
          "A brand-new foundation could be two years old on the shelf (from its batch code) and still have a 12M PAO — meaning you get 12 more months once you open it, provided the unopened shelf life hasn't already lapsed.",
        ],
      },
      {
        heading: "Common PAO values",
        body: [
          "- 6M: mascara, liquid liner, some active serums.",
          "- 12M: foundation, concealer, cream products, most skincare.",
          "- 24M: powders, lipsticks, many fragrances and pencils.",
          "- 36M: some perfumes and long-life formulas.",
        ],
      },
    ],
    faq: [
      {
        q: "Does every product have a PAO symbol?",
        a: "Most EU-sold cosmetics with a shelf life over 30 months must show one. Products that last under 30 months use a 'best before' date instead. Fragrances sometimes omit it.",
      },
      {
        q: "Should I write the opening date on the product?",
        a: "It helps. A dab of marker or a small sticker with the open date makes the PAO easy to track, especially for mascara and skincare.",
      },
    ],
  },
  {
    slug: "does-sunscreen-expire",
    title: "Does Sunscreen Expire? Why It Matters",
    description:
      "Expired sunscreen loses SPF protection and can burn you. Learn how long sunscreen lasts, how to read its date, and when to throw it out.",
    readMinutes: 4,
    updated: "2026-07-04",
    sections: [
      {
        heading: "Sunscreen expires — and it matters more",
        body: [
          "Unlike most cosmetics, an expired sunscreen doesn't just underperform cosmetically — it fails at its one job. Degraded UV filters let through more radiation, so 'expired SPF 50' can behave like a much weaker product and lead to burns.",
          "Regulators require sunscreen to stay at its stated SPF for up to three years, so most bottles carry an explicit expiry date or a batch code you can decode.",
        ],
      },
      {
        heading: "How long it lasts",
        body: [
          "- Unopened: up to 3 years from manufacture if stored cool and dark.",
          "- Opened: 12 months is a safe rule, sooner if it lived in a hot car or beach bag.",
          "Heat is the enemy. Repeated high temperatures break down the filters faster than time alone.",
        ],
      },
      {
        heading: "Signs your sunscreen is done",
        body: [
          "Toss it if the texture has separated, gone watery or grainy, changed colour, or smells off. Any of these means the emulsion has broken and the protection is unreliable.",
          "If there's no printed expiry, decode the batch code for the manufacture date and count forward using the shelf life and PAO.",
        ],
      },
    ],
    faq: [
      {
        q: "Is it dangerous to use expired sunscreen?",
        a: "It won't poison you, but it can leave you unprotected and lead to sunburn and long-term skin damage. For sun protection specifically, replace anything past its date.",
      },
      {
        q: "How should I store sunscreen to make it last?",
        a: "Keep it out of direct sun and heat. Don't leave it in a hot car or on the sand all day — store it in the shade or a cool bag.",
      },
    ],
  },
  {
    slug: "when-does-mascara-expire",
    title: "When Does Mascara Expire?",
    description:
      "Mascara has the shortest life of any makeup — 3 to 6 months after opening. Here's why, plus the signs it's time to replace it.",
    readMinutes: 3,
    updated: "2026-07-04",
    sections: [
      {
        heading: "3–6 months after opening",
        body: [
          "Mascara is the fastest-expiring product in your bag. Every time you pump and reinsert the wand, you push air and bacteria into a warm, moist tube — perfect conditions for microbes.",
          "Most dermatologists recommend replacing mascara three to six months after first use, regardless of how much is left.",
        ],
      },
      {
        heading: "Signs to replace it now",
        body: [
          "- A dry, clumpy formula that no longer coats evenly.",
          "- A gasoline-like or sour smell.",
          "- Flaking during the day or eye irritation and watering.",
          "Never add water or saliva to revive dried mascara — that injects more bacteria straight to your lash line.",
        ],
      },
      {
        heading: "How old is your tube?",
        body: [
          "If you're not sure when you opened it, decode the batch code to find the manufacture date. A tube that's already old on the shelf gives you even less time once opened.",
        ],
      },
    ],
    faq: [
      {
        q: "What happens if I use expired mascara?",
        a: "The most common consequences are eye irritation, redness and styes or conjunctivitis from bacterial growth. Eyes are especially vulnerable, so mascara is the one product not to stretch.",
      },
      {
        q: "Does unopened mascara last longer?",
        a: "Yes — sealed, it's typically good for about two years from manufacture. The short 3–6 month clock only starts once you open it.",
      },
    ],
  },
];

const guideBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
export function getGuide(slug: string): Guide | undefined {
  return guideBySlug.get(slug);
}
