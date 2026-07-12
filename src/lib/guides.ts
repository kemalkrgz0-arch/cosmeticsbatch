export interface GuideSection {
  heading: string;
  /** Simple paragraphs; each string is one <p>. Use "- " prefix for list items. */
  body: string[];
  /** Optional illustrative image shown under the section body. */
  image?: { src: string; alt: string };
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
  /**
   * Hand-picked further reading, rendered as links at the end of the guide.
   * Mostly `/decoders/*` reference pages: a guide explains the concept, the
   * reference page explains one manufacturer's cipher in full, and neither
   * should restate the other.
   */
  seeAlso?: { label: string; href: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "what-is-a-batch-code",
    title: "What Is a Batch Code?",
    description:
      "A batch code is a manufacturer's production stamp that reveals when your cosmetic or perfume was made. Here's how to read it.",
    readMinutes: 5,
    updated: "2026-07-12",
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
          "The consequence catches people out: the format follows the factory, not the logo. Rimmel, Gucci Beauty and adidas fragrance look like three unrelated products, and they carry the same four-digit Coty code because Coty makes all three. Montblanc, Coach and Jimmy Choo share a code for the same reason — Inter Parfums holds the licence. Work out who actually manufactures a product and you already know how to read it.",
        ],
      },
      {
        heading: "What a batch code is not",
        body: [
          "It is not the barcode. The long number under the black stripes is the EAN, which identifies the product for sale. Every bottle of the same product on the same shelf has the same EAN, and it contains no date at all.",
          "It is not the expiry date. Very few cosmetics print one — legally, EU products only need a date if they last under 30 months, and most last longer, so they show the open-jar PAO symbol instead. Sunscreen is the notable exception, and where a printed expiry date exists, it beats any decoded estimate.",
          "It is not a guarantee of authenticity. A code that decodes cleanly is a good sign; a code that decodes to an impossible day, or that differs between the box and the bottle, is a bad one. Neither is proof on its own.",
        ],
      },
      {
        heading: "The three shapes almost every code takes",
        body: [
          "Once you have seen a few dozen, the formats collapse into a handful of ideas:",
          "- A Julian date. The day's number in the year — 001 for 1 January, 365 for 31 December — printed next to a year digit or two. Coty, Shiseido, Unilever, P&G and Kenvue all do a version of this.",
          "- A letter that means a year. L'Oréal, Creed and Inter Parfums each run an annual letter cycle, and each skips different letters to avoid characters that look like digits.",
          "- A plain calendar date. Korean brands print the manufacture date outright, because their regulator requires it. There is nothing to decode.",
          "What varies within those ideas is the order and how many digits of year get printed — and that is exactly what makes reading a code with the wrong manufacturer's rule so dangerous. Coty writes the year first; Kenvue writes the day first. The same five digits produce two different, equally confident-looking dates.",
        ],
      },
      {
        heading: "How precise is a decoded date?",
        body: [
          "It depends on the format, and an honest decoder tells you which. A Korean YYYYMMDD code is exact. A Coty or P&G Julian code gives you the day. A L'Oréal or Estée Lauder code gives you the month, so the day is an estimate. A Creed code gives you nothing but the year.",
          "The other limit is the year digit. When a manufacturer prints only the last digit of the year — and many do, to save space — the code repeats every ten years. A code reading 4135 is 14 May 2024 on the same evidence that makes it 14 May 2014. A decoder assumes the recent reading, because a decade-old product on a shelf is rare. If the packaging looks like it came from another era, it probably did.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a batch code the same as an expiry date?",
        a: "No. Most cosmetics don't print an explicit expiry date. The batch code encodes the manufacture date, and the expiry is estimated from the product's typical shelf life.",
      },
      {
        q: "Why don't brands just print the date in plain language?",
        a: "Because batch codes are not written for you. They exist so a manufacturer can trace and recall a production run, and the date is in there incidentally. Korea's regulator forces the issue by requiring a plain manufacture date on cosmetics; most other markets don't.",
      },
      {
        q: "Two products from the same brand have completely different codes.",
        a: "That usually means they were made in different plants, or one is manufactured under licence by someone else. Fragrance especially: a fashion house rarely makes its own perfume, and the licensee's format is the one that applies.",
      },
      {
        q: "Can a batch code be faked?",
        a: "Counterfeiters copy codes, but they often reuse invalid or impossible ones. A code that decodes cleanly is a good sign, though not a guarantee of authenticity.",
      },
    ],
    seeAlso: [
      { label: "Every manufacturer's code format, explained", href: "/decoders" },
      { label: "Julian date codes: the industry's default", href: "/decoders/julian-date-codes" },
      { label: "How to find your batch code", href: "/guides/how-to-find-your-batch-code" },
    ],
  },
  {
    slug: "how-to-find-your-batch-code",
    title: "How to Find Your Batch Code",
    description:
      "Batch codes hide in different places on different products. This guide shows exactly where to look on makeup, skincare and perfume.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Telling the batch code from everything else on the pack",
        body: [
          "Packaging is crowded, and three or four different numbers can compete for your attention. Rule them out in this order:",
          "- The long number under the barcode stripes is the EAN. It is 8 or 13 digits, it is professionally printed as part of the label design, and it is identical on every unit of that product. Never the batch code.",
          "- A code beginning with a country name, an address or a recycling triangle is regulatory, not a date.",
          "- The open-jar icon with 12M or 24M beside it is the PAO — how long after opening, not when it was made.",
          "- What is left is usually the batch code: short, irregular, added by a machine after the label was printed, and often slightly crooked or faint because of it.",
          "That last property is the giveaway. A label is printed in a print shop; a batch code is sprayed on at the end of the filling line, seconds after the product went into the container. It looks like an afterthought because it is one.",
        ],
      },
      {
        heading: "Reading a code you can barely see",
        body: [
          "Embossed and laser-etched codes have no ink at all — they are a change in the surface, and they only appear when light rakes across them. Do not add more light head-on; that flattens them out. Instead tilt the product until a lamp or window catches the ridges from the side.",
          "For dark glass, a phone camera with flash and 3× zoom will often show what the naked eye cannot. Photograph, then pinch to zoom on the still image rather than squinting at the bottle.",
          "Frozen, faded or half-rubbed-off inkjet codes are common on tubes that have lived in a bag. If a character is genuinely ambiguous, try both readings in the checker: a wrong character usually produces an impossible day (over 366) or a future date, and the code that decodes cleanly is almost certainly the right one.",
        ],
      },
      {
        heading: "When there is no code at all",
        body: [
          "Some products genuinely don't carry one. Testers, samples, decants, refill pouches and travel minis frequently ship without a batch code, which is not a sign of anything sinister.",
          "Korean, Japanese and French-pharmacy products often skip the coded date because they print a plain calendar date instead — read the pack rather than hunting for a cipher.",
          "A full-size product from a Western brand with no code anywhere, and none on the box either, is a different matter. Combined with a suspiciously low price or an unofficial seller, treat it as a warning.",
        ],
      },
    ],
    faq: [
      {
        q: "Which code do I enter if there are two?",
        a: "The shorter, irregular one that mixes letters and digits. If both look plausible, try each — the wrong one typically fails to decode or returns an impossible date.",
      },
      {
        q: "The code on the box and the bottle are different.",
        a: "On genuine stock they normally match, because both are stamped in the same filling run. A mismatch means the box and the contents were paired later, which happens with repackaged and grey-market goods — and with counterfeits.",
      },
    ],
    seeAlso: [
      { label: "Where is the batch code on perfume?", href: "/guides/where-is-the-batch-code-on-perfume" },
      { label: "Where is the batch code on a tube or cream?", href: "/guides/where-is-the-batch-code-on-tubes-and-creams" },
      { label: "Every manufacturer's code format, explained", href: "/decoders" },
    ],
  },
  {
    slug: "cosmetics-shelf-life-guide",
    title: "Cosmetics Shelf Life Guide",
    description:
      "How long makeup, skincare and perfume really last — unopened and after opening — with a practical category-by-category table.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Why water is the whole story",
        body: [
          "There is one variable that predicts a product's shelf life better than any other: whether it contains water. Microbes need water to grow. A pressed powder has almost none, so it can sit in a drawer for two years and be fine. A water-based cream is a nutrient broth held back only by its preservative system, and that system weakens with every month and every finger.",
          "This is why the timelines cluster the way they do. Powders, pencils and lipstick — dry or waxy — are the forgiving end. Foundations, creams and cleansers sit in the middle. Mascara is the worst of all worlds: water-based, warm, repeatedly reinoculated by a wand that has just touched your lash line, and used on the most infection-prone part of the face.",
          "It also explains why packaging matters as much as formula. The same serum in an airless pump outlasts the same serum in an open jar, because the jar is opened to air and fingers every single day and the pump is not.",
        ],
      },
      {
        heading: "Unopened does not mean untouched",
        body: [
          "A sealed product is ageing from the day it was made, not from the day you bought it. That matters most when you buy outside the normal retail chain: discounters, marketplace sellers and clearance sites are where stock that has been sitting in a warehouse for two years goes to be sold cheaply.",
          "It is a legitimate purchase — old stock is not fake stock — but you should know what you are buying. A foundation with a 36-month shelf life that was made 30 months ago has six months of unopened life left, and a 12M PAO you will never get to use in full.",
          "Decode the batch code before you buy, not after. It is the only way to know how much of the clock has already run down.",
        ],
      },
      {
        heading: "Which clock is actually limiting you",
        body: [
          "Take the manufacture date from the batch code, add the unopened shelf life, and you get one deadline. Take the day you opened it, add the PAO months, and you get another. The earlier one wins.",
          "In practice, for anything you use regularly, the PAO wins — you will finish or bin a mascara long before its unopened shelf life becomes relevant. For the back of the drawer, the shelf life wins: that unopened backup foundation you have been saving is quietly running out of time even though the seal is intact.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I use makeup after its shelf life?",
        a: "It may still be usable but with reduced performance and higher irritation risk. Eye products past their PAO are the ones to be strictest about.",
      },
      {
        q: "Does refrigerating cosmetics extend their life?",
        a: "For a few things, meaningfully: vitamin C serums and other unstable actives oxidise more slowly when cold. For most products it makes little difference, and for emulsions and oils the cold can break the formula or cloud it. Cool and dark beats cold.",
      },
      {
        q: "The product still looks and smells fine well past its PAO.",
        a: "Preservative depletion is invisible — a product can be microbially unsafe before it looks or smells wrong. Powders and lipstick you can reasonably stretch. Eye products and anything applied to broken skin you should not.",
      },
    ],
    seeAlso: [
      { label: "PAO symbol: what 6M, 12M and 24M mean", href: "/guides/pao-symbol-meaning" },
      { label: "How to store cosmetics properly", href: "/guides/how-to-store-cosmetics" },
      { label: "What is a batch code?", href: "/guides/what-is-a-batch-code" },
    ],
  },
  {
    slug: "perfume-shelf-life",
    title: "How Long Does Perfume Last?",
    description:
      "Perfume can last 3–5 years or more. Learn what affects fragrance longevity and how to tell if a scent has turned.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Concentration changes everything",
        body: [
          "The label on the bottle is a prediction of its lifespan. Concentration is the proportion of aromatic oil to alcohol, and oil is the part that survives.",
          "- Eau de cologne (2–5% oil): the shortest-lived, often noticeably weaker after two or three years.",
          "- Eau de toilette (5–15%): three to five years is typical; citrus-led EDTs are the fastest to turn.",
          "- Eau de parfum (15–20%): five years and often more.",
          "- Parfum / extrait (20–40%): the most stable, and the most likely to still be wearable a decade on.",
          "Note that fill level matters as much as concentration once a bottle is in use. A half-empty bottle is half full of air, and oxygen is what does the damage. A fragrance you have been nursing for years is ageing faster in its last quarter than it did in its first.",
        ],
      },
      {
        heading: "The notes that go first",
        body: [
          "A fragrance does not spoil evenly. The top notes — the bright, volatile molecules you smell in the first minutes, typically citrus, aldehydes and light green notes — are the most fragile and the first to oxidise. That is why a turned bottle smells sour or sharp on the initial spray and then settles into something closer to normal.",
          "Base notes are the opposite. Woods, resins, musks and ambers are heavy, stable molecules, and they can improve with a few years in the bottle as the composition marries. This is the grain of truth behind the vintage-fragrance enthusiasm: an oriental or a chypre may genuinely be better at five years old, while an eau de cologne is simply worse.",
          "If a bottle smells wrong at the first spray but correct after ten minutes, you are smelling exactly this — dead top notes over a base that survived.",
        ],
      },
      {
        heading: "Dating a bottle you are about to buy",
        body: [
          "The second-hand and discount fragrance market is large, and the honest sellers and the dishonest ones both describe stock as \"new\". The batch code is the only thing that will tell you the truth.",
          "Most houses print a production date rather than a proprietary cipher: Coty writes a year digit and the day of the year; Dior and the other LVMH houses do the same; Inter Parfums puts the year in a letter; Creed puts the year in a letter and nothing else. Decode before you pay, especially for a discontinued or reformulated scent where age is the whole point.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I keep perfume in the fridge?",
        a: "A dedicated wine or beauty fridge at 10–15°C is genuinely good for fragrance. A kitchen fridge at 4°C is colder than necessary and subjects the bottle to a temperature swing every time you take it out. A cool, dark cupboard is nearly as good and far less trouble.",
      },
      {
        q: "Does the juice darkening mean it's ruined?",
        a: "Not on its own. Many fragrances darken with age — vanilla and amber notes especially — while smelling perfectly correct. Judge by the smell, not the colour.",
      },
    ],
    seeAlso: [
      { label: "Coty batch codes (YDDD), used by 40 fragrance brands", href: "/decoders/coty-batch-code-format" },
      { label: "Dior, Chanel and LVMH: the date is in the code", href: "/decoders/dior-lvmh-batch-code-format" },
      { label: "Where is the batch code on perfume?", href: "/guides/where-is-the-batch-code-on-perfume" },
    ],
  },
  {
    slug: "how-to-store-cosmetics",
    title: "How to Store Cosmetics Properly",
    description:
      "Simple storage habits that extend the life of your makeup, skincare and perfume and keep them safe to use.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Why the bathroom is the worst room in the house",
        body: [
          "Almost everyone stores cosmetics in the one room designed to be hot and wet. A shower turns a bathroom into a humid chamber that swings from twenty to thirty-odd degrees several times a day, and every one of those cycles pushes moist air into and out of a bottle's headspace.",
          "Heat accelerates every chemical reaction that degrades a formula. Humidity is what lets microbes take hold in a product whose preservative system is already spent. Repeated temperature swings break emulsions — the separation you see in an old foundation is not dirt, it is the oil and water phases giving up on each other.",
          "A bedroom drawer is cooler, darker, drier and more stable than any bathroom cabinet, and moving your products there is the single highest-return storage change available. Keep in the bathroom only what you use in it and replace often.",
        ],
      },
      {
        heading: "The actives that need special handling",
        body: [
          "Most products only need cool and dark. A short list needs more than that, because their active ingredient is chemically unstable by nature:",
          "- Vitamin C (L-ascorbic acid) oxidises on contact with air and light. The yellow-then-brown colour shift is the reaction happening in front of you, and once it has turned, the potency is gone. Buy small bottles, use them fast, and the fridge genuinely helps.",
          "- Retinol and retinaldehyde degrade in light and air. This is why they ship in opaque tubes and airless pumps — decanting them into a clear jar defeats the packaging.",
          "- Benzoyl peroxide and hydrogen-peroxide-based products lose strength steadily and are heat-sensitive.",
          "- Sunscreen filters degrade with heat, which is precisely what a beach bag and a hot car deliver. A bottle that spent a summer in the boot of a car is not offering the SPF on the label.",
          "The pattern: if a product is packaged in opaque, airless, or aluminium packaging, the manufacturer is telling you the formula is fragile. Treat the packaging as instructions.",
        ],
      },
      {
        heading: "Travel, and what a hot car does",
        body: [
          "The most damage most cosmetics ever take is on holiday. A car boot in summer can exceed 60°C, a checked suitcase on a runway is not much better, and a beach bag in the sun is a slow oven. A single trip can age a sunscreen more than a year on a shelf.",
          "Carry sun protection in a cool bag or in the shade, not on the sand. Keep anything with an active ingredient in hand luggage rather than the hold. And when you get home, look critically at whatever travelled: separation, a changed smell, or a texture that never quite recovered means the formula broke, regardless of what the batch code says.",
        ],
      },
    ],
    faq: [
      {
        q: "Do beauty fridges actually do anything?",
        a: "For vitamin C serums, unstable actives and anything you keep for a long time, yes — cold slows oxidation. For most creams and all powders, they change nothing. They are a nice-to-have, not a necessity, and a cool dark drawer captures most of the benefit.",
      },
      {
        q: "Is it worth decanting products into nicer containers?",
        a: "Usually not. Airless and opaque packaging exists because the formula needs it, and moving a serum into a clear glass dropper bottle exposes it to exactly the light and air the original packaging was blocking.",
      },
    ],
    seeAlso: [
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
      { label: "Does sunscreen expire?", href: "/guides/does-sunscreen-expire" },
      { label: "Can you use expired skincare?", href: "/guides/does-skincare-expire" },
    ],
  },
  {
    slug: "fake-vs-original-products",
    title: "Fake vs Original: Spotting Counterfeits",
    description:
      "How to use batch codes and packaging clues to tell genuine cosmetics and perfumes from convincing fakes.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "What a batch code can and cannot prove",
        body: [
          "Be clear about what you are actually testing. A batch code is a weak authenticity signal used well, and a useless one used badly. It is worth understanding which is which.",
          "What it can catch: a code that decodes to an impossible date — day 400 of the year, a manufacture date in the future, a year before the product line existed. Counterfeiters copy a code they saw once, or invent digits, and invented digits fail arithmetic. It can also catch a code on the box that does not match the code on the bottle, which no genuine filling line produces.",
          "What it cannot catch: a counterfeiter who copied a real code from a real bottle. That code will decode perfectly, because it is a real code. A clean decode tells you the code is well-formed. It does not tell you the liquid inside the bottle is what the label claims.",
          "Treat it as one signal among several, and the cheapest one to check. It rules things out; it does not rule them in.",
        ],
      },
      {
        heading: "The stronger signals",
        body: [
          "- The box-versus-bottle test. On genuine stock the codes match, because both were stamped minutes apart on the same line. Fakes are assembled from parts and frequently fail this.",
          "- Weight and glass. Genuine fragrance bottles are heavy, with thick, evenly moulded glass and a clean seam. Counterfeit glass is lighter, thinner and often has a rough seam or a visible bubble.",
          "- The atomiser. A real spray produces a fine, even mist. Fakes commonly squirt.",
          "- Print quality. Look at the smallest text on the box — the ingredients list, the address, the regulatory small print. Counterfeit printing tends to fall apart under magnification long before the logo does, because forgers focus on the logo.",
          "- Cellophane. Factory shrink-wrap is tight, evenly folded and heat-sealed. Hand-wrapped cellophane is loose, crooked, and often has a visible tape seam.",
          "- The smell of the box. Genuine cartons smell of cardboard and ink. A strong chemical or glue smell is a bad sign.",
        ],
      },
      {
        heading: "Grey market is not the same as counterfeit",
        body: [
          "A lot of what people report as \"fake\" turns out to be genuine product sold outside the authorised chain: old stock, discontinued batches, tester units, or goods intended for another market. The product is real. It may also be four years old, stored badly, or reformulated for a different region.",
          "This is where a batch code earns its keep. Grey-market stock decodes fine — it just decodes to an old date. If a \"new\" bottle from a discounter decodes to five years ago, nobody has lied to you about authenticity, but they have certainly let you assume something untrue about freshness.",
        ],
      },
    ],
    faq: [
      {
        q: "The code decodes fine but I still think it's fake.",
        a: "Trust that instinct over the code. A copied code decodes perfectly. Weigh the bottle, look at the atomiser spray, read the small print on the box under magnification, and compare the juice colour against a known-genuine reference.",
      },
      {
        q: "Can I check a batch code against the brand's own database?",
        a: "Most brands don't publish one. Some will confirm authenticity if you contact customer service with photographs of the product and the code — worth doing for an expensive purchase you can still return.",
      },
    ],
    seeAlso: [
      { label: "What is a batch code?", href: "/guides/what-is-a-batch-code" },
      { label: "Every manufacturer's code format, explained", href: "/decoders" },
      { label: "Where is the batch code on perfume?", href: "/guides/where-is-the-batch-code-on-perfume" },
    ],
  },
  {
    slug: "does-makeup-expire",
    title: "Does Makeup Expire? Signs and Timelines",
    description:
      "Yes — makeup expires, and using it past its prime can irritate skin or cause infections. Here are the real timelines and the warning signs to watch for.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Why the timelines differ so much",
        body: [
          "The spread — three months for mascara, two years for a bronzer — is not arbitrary. It tracks one thing: how much water the formula contains and how much contamination it receives in normal use.",
          "Bacteria need water. A pressed powder is essentially dry, so even when your brush deposits skin oil and bacteria into it, there is nothing for them to grow in. A liquid foundation is water-based and preserved, which works until the preservative system is exhausted. Mascara is water-based and re-inoculated on every single use, by a wand that has just been dragged along your lash line and then pushed back into a warm, dark, humid tube.",
          "Application method compounds it. An airless pump touches nothing. A doe-foot in a tube touches your skin and goes back in. A jar you dip fingers into is the worst case for any wet formula, which is why the same cream in a jar and in a pump have genuinely different lifespans.",
        ],
      },
      {
        heading: "Eye products deserve a stricter rule",
        body: [
          "Almost every serious consequence of expired makeup involves the eyes. The conjunctiva has no protective skin barrier, the tear film transports whatever you put near it directly across the eye's surface, and styes and conjunctivitis are the common outcomes of a contaminated mascara or liner.",
          "This is the one category where \"but it still looks fine\" should not persuade you. Bacterial load is invisible. If a mascara is more than six months old, replace it — the cost of a new tube is trivially small next to a course of antibiotic eye drops.",
          "Never top up a drying mascara with water, saline or saliva. Every one of those adds moisture and organisms to a tube whose preservative is already spent, which is precisely the wrong direction.",
        ],
      },
      {
        heading: "Working out how old something already is",
        body: [
          "The PAO clock starts when you open a product — but the shelf-life clock started the day it was made, and a product bought from a discounter may have burned through most of it before you ever saw it.",
          "Decode the batch code first. A foundation manufactured 30 months ago, with a typical 36-month unopened shelf life, has six months left regardless of what its 12M PAO promises you. The earlier of the two deadlines is the real one.",
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
      {
        q: "Does expensive makeup last longer than cheap makeup?",
        a: "No. Price buys pigment, texture and packaging, not microbiology. A £60 foundation and a £6 one have comparable preservative systems and comparable timelines — and the expensive one is the one you're more likely to nurse past its date.",
      },
    ],
    seeAlso: [
      { label: "PAO symbol: what 6M, 12M and 24M mean", href: "/guides/pao-symbol-meaning" },
      { label: "When does mascara expire?", href: "/guides/when-does-mascara-expire" },
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
    ],
  },
  {
    slug: "pao-symbol-meaning",
    title: "PAO Symbol: What 6M, 12M and 24M Mean",
    description:
      "The little open-jar icon with a number is the Period After Opening. Here's what 6M, 12M and 24M mean and how it differs from the batch code.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Where the symbol comes from",
        body: [
          "The open jar is not a brand's marketing choice — it is a legal requirement. EU cosmetics regulation requires a durability indication on every product, and gives manufacturers two ways to provide it. A product with a minimum durability of 30 months or less must print a best-before date. A product that lasts longer than 30 months prints the PAO symbol instead.",
          "That rule explains an oddity people often notice: the products with the shortest usable life after opening are the ones showing a PAO rather than a date. It is not a contradiction. The 30-month test is about the *unopened* product sitting sealed on a shelf, and a sealed mascara really does last two years. The 6M is about what happens once you introduce a wand and your lash line to it.",
          "It also explains why fragrance often has neither. Perfume is generally exempt in practice, being alcohol-based and self-preserving, which is why a bottle can carry nothing but a batch code.",
        ],
      },
      {
        heading: "The number is a manufacturer's claim, not a law of nature",
        body: [
          "A PAO is the manufacturer's own stability testing, translated into a round number. It assumes normal use and reasonable storage. It is not a guarantee and it is not a cliff-edge.",
          "Real conditions move it in both directions. A 12M cream kept in a hot bathroom and dipped into with fingers may be unusable in eight. The same cream in an airless pump in a cool drawer may be perfectly fine at eighteen. The number is a good default in the absence of better information — which is exactly what your own senses provide.",
          "For anything used near the eyes, be stricter than the number. For a powder, you can reasonably be more relaxed. The stakes are not symmetrical.",
        ],
      },
      {
        heading: "Making the PAO usable",
        body: [
          "The symbol has one practical flaw: it starts a clock nobody records the start of. Six months after opening a mascara, almost nobody remembers when they opened it.",
          "Fix it in the two seconds it takes. Write the month on the base with a fine permanent marker as you open it, or put a small dot sticker on the bottom. For skincare and mascara — the products where the PAO actually bites — this converts a symbol you cannot use into a date you can read.",
          "And if you have already lost track: decode the batch code. It won't tell you when you opened it, but it will tell you the manufacture date, and a product made four years ago is out of time regardless of when the seal broke.",
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
      {
        q: "My product has a PAO symbol and a batch code but no expiry date. Is that legal?",
        a: "Yes, and it's the norm. A product lasting more than 30 months unopened is required to show the PAO, not a date. The batch code is how you recover the manufacture date it doesn't print.",
      },
      {
        q: "Does the PAO clock start when I buy it or when I open it?",
        a: "When you open it. An unopened product is still governed by its shelf life from the manufacture date — which is why an old bottle bought cheaply can run out of unopened life before you ever get to use the PAO months.",
      },
    ],
    seeAlso: [
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
      { label: "What is a batch code?", href: "/guides/what-is-a-batch-code" },
      { label: "Does makeup expire?", href: "/guides/does-makeup-expire" },
    ],
  },
  {
    slug: "does-sunscreen-expire",
    title: "Does Sunscreen Expire? Why It Matters",
    description:
      "Expired sunscreen loses SPF protection and can burn you. Learn how long sunscreen lasts, how to read its date, and when to throw it out.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "Why sunscreen is the one product with a printed date",
        body: [
          "Walk through a bathroom cabinet and sunscreen is often the only thing carrying an explicit expiry date. That is deliberate, and it is regulatory. Sunscreen is treated as a product whose performance is a safety claim: an SPF 50 that no longer delivers SPF 50 is not merely disappointing, it is misleading in a way that ends in a burn.",
          "So regulators require manufacturers to guarantee the stated SPF for a defined period — commonly up to three years — and to print a date, rather than leaving the consumer to decode a batch code and guess.",
          "The practical consequence is simple: on sunscreen, the printed date wins over everything. A decoded manufacture date is useful context for how much of that window has already gone, but it never overrides the date on the pack.",
        ],
      },
      {
        heading: "Heat is worse than time",
        body: [
          "Sunscreen degrades on a timeline, and it degrades far faster in a hot car. UV filters — particularly the organic ones such as avobenzone — are chemically less stable at high temperatures, and the emulsion that carries them can break outright.",
          "The everyday habits that destroy sunscreen are exactly the ones the product invites: leaving the bottle on a towel in direct sun all afternoon, keeping it in the door pocket of a car through a summer, or storing it in a beach bag that reaches 50°C by midday.",
          "A bottle that has been through that is not reliable even if it is in date and looks fine. Buy sunscreen in quantities you will finish in a season, keep it in the shade or a cool bag, and treat a bottle that spent a summer in a car as decorative.",
        ],
      },
      {
        heading: "Mineral versus chemical, and what actually changes",
        body: [
          "Mineral filters — zinc oxide and titanium dioxide — are inert minerals and do not degrade in the way organic filters do. That does not make a mineral sunscreen immortal, because the emulsion holding them can still separate, and a separated sunscreen no longer spreads in the even film that the SPF number assumes. An SPF rating is a claim about a uniform 2mg/cm² layer; a broken formula cannot deliver one.",
          "Chemical filters degrade more directly, and the fastest-degrading ones are common in exactly the light, cosmetically elegant textures people prefer for daily wear.",
          "Either way, the test is the same: if it has separated, gone grainy, changed colour or smell, or will not spread evenly, its protection is not what the label says.",
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
      {
        q: "Should I use last year's half-empty bottle?",
        a: "If it's in date, was stored cool, and looks and spreads normally — yes. If it lived in a beach bag or a car through the summer, no. And a bottle you didn't finish in a season is a hint that you aren't applying enough: a full-body application is around 30ml, so a 200ml bottle is roughly six full applications.",
      },
    ],
    seeAlso: [
      { label: "Neutrogena, Aveeno and RoC batch codes", href: "/decoders/kenvue-batch-code-format" },
      { label: "How to store cosmetics properly", href: "/guides/how-to-store-cosmetics" },
      { label: "Can you use expired skincare?", href: "/guides/does-skincare-expire" },
    ],
  },
  {
    slug: "when-does-mascara-expire",
    title: "When Does Mascara Expire?",
    description:
      "Mascara has the shortest life of any makeup — 3 to 6 months after opening. Here's why, plus the signs it's time to replace it.",
    readMinutes: 4,
    updated: "2026-07-12",
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
      {
        heading: "What actually grows in a mascara tube",
        body: [
          "A mascara tube is, from a microbiologist's point of view, close to an incubator. It is warm, dark, moist, rich in the polymers and oils that make the formula work — and it is re-inoculated every single day by a wand that has been dragged along the lash line, where skin flora, sebum and the residue of the last application all live.",
          "Preservatives hold that back, and they are good at it for a while. What changes is not the bacteria's ambition but the preservative's capacity: the system is consumed as it works, and once it is spent, the population that was being suppressed is no longer being suppressed.",
          "Studies swabbing in-use mascaras consistently find bacterial contamination in a large share of tubes after three months of normal use. That is where the three-to-six-month rule comes from. It is not a marketing convention; it is the point at which the tube stops winning.",
        ],
      },
      {
        heading: "The pumping myth",
        body: [
          "Almost everyone pumps the wand in and out to load more product. It feels like it works, and it is the worst thing you can do to a mascara.",
          "Each pump drives a slug of air into the tube. That air dries the formula — which is why the mascara you have been pumping is the one that has gone clumpy — and it delivers oxygen and airborne particles into the exact environment you are trying to keep sterile.",
          "Twist the wand against the inside of the tube instead. It loads the brush just as well without acting as a bellows.",
        ],
      },
      {
        heading: "Waterproof, tubing and the rest",
        body: [
          "Waterproof formulas are more solvent-based and less water-based, which in principle makes them a slightly harsher environment for microbes. In practice the difference does not buy you meaningful extra months, because the contamination route — the wand — is unchanged.",
          "Tubing mascaras, which wrap the lash in a polymer sleeve, behave the same way. Whatever the chemistry, the tube is opened, exposed and reloaded from your lash line every day, and that is what sets the clock.",
          "Treat the three-to-six-month rule as applying across the category, and be at the strict end of it if you have ever had a stye, wear contact lenses, or have had an eye infection recently.",
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
      {
        q: "Can I share mascara if I wipe the wand?",
        a: "No. Wiping removes product, not the organisms suspended in it, and eye infections — including conjunctivitis and herpes simplex — transfer readily on a shared wand. This is the one cosmetic to be absolute about.",
      },
      {
        q: "My mascara dried out in six weeks. Is it faulty?",
        a: "Almost certainly it's the pumping. Each pump forces air in and dries the formula from the inside. Twist the wand against the tube wall instead and a tube will typically stay workable for its full life.",
      },
    ],
    seeAlso: [
      { label: "Does makeup expire?", href: "/guides/does-makeup-expire" },
      { label: "PAO symbol: what 6M, 12M and 24M mean", href: "/guides/pao-symbol-meaning" },
      { label: "Where is the batch code on lipstick & makeup?", href: "/guides/where-is-the-batch-code-on-lipstick-and-makeup" },
    ],
  },
  {
    slug: "does-skincare-expire",
    title: "Can You Use Expired Skincare?",
    description:
      "Expired serums, moisturisers and acids lose potency and can irritate skin. Here's how long skincare lasts and how to tell when it's turned.",
    readMinutes: 5,
    updated: "2026-07-12",
    sections: [
      {
        heading: "What happens to old skincare",
        body: [
          "Skincare relies on preservatives to stay safe and on active ingredients to actually work. Both fade with time. An expired product may do nothing — or, worse, grow bacteria and irritate your skin.",
          "Actives are the most fragile: vitamin C oxidises, retinol destabilises, and acids drift in strength. If a serum has turned brown or smells off, its actives are already spent.",
        ],
      },
      {
        heading: "Typical shelf life after opening",
        body: [
          "- Vitamin C serums: 3–6 months — they oxidise fast once air gets in.",
          "- Retinol and prescription-style actives: 6–12 months.",
          "- Water-based moisturisers and cleansers: 12 months.",
          "- Oils and balms: 12–24 months, though oils can go rancid.",
          "- Sunscreen: 12 months open, and never past its printed date.",
        ],
      },
      {
        heading: "Signs it's time to bin it",
        body: [
          "Toss any product that has separated, changed colour, thickened, thinned, or developed a sour, rancid or 'off' smell.",
          "Jars are worse than pumps: fingers introduce bacteria every use, so tubs of cream spoil faster than airless bottles.",
        ],
      },
      {
        heading: "How old is it really?",
        body: [
          "Products bought online or from discounters can already be near the end of their shelf life. Decode the batch code to find the true manufacture date before you count forward with the PAO.",
        ],
      },
      {
        heading: "The two failures: it stops working, or it turns on you",
        body: [
          "Expired skincare fails in two quite different ways, and conflating them is why the advice online is so contradictory.",
          "The first failure is potency. An active ingredient degrades and the product stops doing the thing you bought it for. An oxidised vitamin C serum is not dangerous — it is inert, and possibly slightly staining. A retinol that has been sitting in a warm bathroom in a clear jar for two years is a moisturiser now. Nothing bad happens; nothing good happens either.",
          "The second failure is contamination. The preservative system is exhausted, and a water-based product becomes a place where bacteria, yeast and mould can grow. This is the failure that causes breakouts, rashes and, on broken or compromised skin, real infections. It is invisible until it is not.",
          "Which failure you are facing depends on the formula. Anhydrous products — oils, balms, waxes — mostly fail the first way, going rancid rather than septic. Water-based creams, gels and cleansers can fail the second way. Jars fail it faster than pumps.",
        ],
      },
      {
        heading: "How to tell an active has died",
        body: [
          "- Vitamin C (L-ascorbic acid): the serum turns yellow, then orange, then brown. That colour change is the oxidation reaction itself. Brown means spent. This can happen in months in a poorly sealed dropper bottle.",
          "- Retinol: no reliable visual cue, which is why packaging matters so much. If it came in an opaque airless tube and has been decanted, or if it has lived in light and heat, assume it has lost strength.",
          "- Benzoyl peroxide: loses strength steadily; a product that used to sting and no longer does has likely faded.",
          "- Acids (glycolic, salicylic): relatively stable, but pH drifts over years, and pH is what makes them work.",
          "- Oils: rancidity has a distinctive smell — like old nuts or crayons. Trust your nose; rancid oils are pro-inflammatory on skin.",
        ],
      },
      {
        heading: "Packaging tells you what the brand knows",
        body: [
          "Read the container as a message. Opaque, airless, aluminium, single-dose — every one of those choices costs the manufacturer money, and they only spend it when the formula needs protecting.",
          "A vitamin C serum in a clear glass dropper bottle is fighting its own packaging from day one, and it is the strongest possible argument for buying a small size and using it quickly.",
          "Conversely, a cream in a wide-mouth jar is telling you the formula is robust enough to survive daily contact with fingers and air — or that the brand chose aesthetics over stability. Either way, a jar is the one format where scrupulous hygiene, using a spatula rather than fingers, genuinely buys you extra months.",
        ],
      },
    ],
    faq: [
      {
        q: "Is expired skincare dangerous?",
        a: "Usually it just stops working, but contaminated products — especially open jars and eye creams — can cause breakouts, rashes or infections. Replace anything that looks or smells wrong.",
      },
      {
        q: "Does unopened skincare expire?",
        a: "Yes. Sealed products typically last 2–3 years from manufacture, less for potent actives. Check the batch code to see how old an unopened item already is.",
      },
      {
        q: "My vitamin C serum turned brown in two months. Is that a faulty product?",
        a: "Usually not — it's chemistry. Pure L-ascorbic acid oxidises on contact with air and light, and a dropper bottle admits both on every use. Buy small sizes, keep it cold and dark, and expect a working life measured in months rather than years.",
      },
      {
        q: "Is 'preservative-free' skincare better?",
        a: "It's a marketing claim with a real cost. Preservatives are what stop a water-based product growing bacteria, and a genuinely preservative-free water-based product has a very short life and needs refrigeration. Anhydrous products (pure oils, balms) don't need them at all — which is the honest version of the claim.",
      },
    ],
    seeAlso: [
      { label: "The Ordinary batch codes explained", href: "/decoders/the-ordinary-batch-code-format" },
      { label: "How to store cosmetics properly", href: "/guides/how-to-store-cosmetics" },
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
    ],
  },
  {
    slug: "does-perfume-expire",
    title: "Does Perfume Expire? How to Tell",
    description:
      "Perfume doesn't have a hard expiry, but it does turn. Learn how long fragrance lasts, the signs it's gone off, and how to date a bottle.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "Perfume ages, slowly",
        body: [
          "Fragrance is one of the longest-lasting cosmetics — a sealed bottle can be good for years. But alcohol and aromatic oils do oxidise, so eventually the scent shifts and fades.",
          "Most perfumes last 3–5 years, and some heavier, resinous scents improve for a while before declining. Light, citrus-forward fragrances turn the fastest.",
        ],
      },
      {
        heading: "Signs a fragrance has turned",
        body: [
          "- The top notes smell sour, sharp or vinegary on first spray.",
          "- The colour has darkened noticeably.",
          "- The scent is flat and barely projects.",
          "A little darkening alone isn't fatal — judge mainly by the smell.",
        ],
      },
      {
        heading: "Make it last longer",
        body: [
          "Heat, light and air are what age a fragrance. Keep bottles in their box, away from windows and bathroom steam, and leave them sealed until you use them.",
          "To date a bottle, decode its batch code for the manufacture date — useful when buying vintage or discounted fragrance.",
        ],
      },
      {
        heading: "Why fragrance has no legal expiry",
        body: [
          "Perfume occupies an unusual position: it is mostly alcohol, and alcohol is a preservative. There is nothing in a typical fragrance for bacteria to grow in, which is why a bottle can sit for a decade without becoming unsafe in the way an old cream can.",
          "What happens instead is oxidation — a slow chemical rearrangement of the aromatic molecules on contact with oxygen. The liquid remains sterile. It just stops smelling the way the perfumer intended.",
          "This is why perfume typically carries neither a best-before date nor a PAO symbol, and often nothing but a batch code. The manufacturer is not being evasive; there is no meaningful safety deadline to print.",
        ],
      },
      {
        heading: "Air in the bottle is the real clock",
        body: [
          "The variable that predicts how fast a fragrance turns is not age but headspace: how much air is sitting above the liquid.",
          "A sealed, full bottle has almost none, and oxidation is correspondingly slow. A bottle you have used down to the last quarter is three-quarters full of air, refreshed with every spray, and it will degrade faster in its final year than it did in its first five.",
          "Two practical consequences. First, buy the size you will actually finish — a 100ml bottle you use twice a year will spend most of its life half-empty and oxidising. Second, a nearly empty bottle of something precious is worth decanting into a small vial with minimal headspace, which slows the process markedly.",
        ],
      },
      {
        heading: "Vintage, reformulation, and what you're actually buying",
        body: [
          "A large part of the second-hand fragrance market runs on the belief that older bottles are better. Sometimes they are — not because age improves the juice, but because the formula was changed. Regulatory restrictions on materials like oakmoss and certain musks have forced reformulations of many classics, and a bottle made before the change genuinely is a different perfume.",
          "That makes the batch code more than a freshness check. It is the only way to establish which formula you are buying. A seller describing a bottle as \"vintage\" is making a claim about the year, and the code either supports it or does not.",
          "Just be clear-eyed about the trade: an older bottle is a bottle with more oxidation. On a heavy oriental, that is often a fair price for the original formula. On a citrus eau de cologne, it rarely is.",
        ],
      },
    ],
    faq: [
      {
        q: "Is it bad to wear expired perfume?",
        a: "It's rarely harmful, but an oxidised fragrance can smell unpleasant and, in a few cases, irritate sensitive skin. If it smells sour, don't wear it.",
      },
      {
        q: "How long does unopened perfume last?",
        a: "Sealed and stored well, typically 3–5 years or more. Decode the batch code to see how old a bottle is before you buy.",
      },
      {
        q: "Why does my bottle smell wrong for the first minute and fine afterwards?",
        a: "You're smelling dead top notes over a base that survived. The volatile citrus and green notes oxidise first; the woods, resins and musks underneath are far more stable. It's the classic signature of an ageing bottle.",
      },
    ],
    seeAlso: [
      { label: "How long does perfume last?", href: "/guides/perfume-shelf-life" },
      { label: "Creed batch codes: one letter, one year", href: "/decoders/creed-batch-code-format" },
      { label: "Inter Parfums batch codes (Montblanc, Coach, Jimmy Choo)", href: "/decoders/inter-parfums-batch-code-format" },
    ],
  },
  {
    slug: "does-foundation-expire",
    title: "When Does Foundation Expire?",
    description:
      "Liquid foundation lasts 6–12 months after opening. Here's how to spot separated, oxidised or spoiled foundation before it wrecks your skin.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "6–12 months after opening",
        body: [
          "Liquid and cream foundations are water-based, so they're a friendly home for bacteria once opened. Most last 6–12 months; powder foundations stretch to 18–24.",
          "Airless pump bottles last longer than open jars or wide-neck bottles, because less air and fewer fingers reach the formula.",
        ],
      },
      {
        heading: "Signs your foundation is off",
        body: [
          "- It separates into oil and pigment that won't remix.",
          "- The colour has oxidised darker or turned patchy.",
          "- It smells sour or chalky.",
          "- The texture is gluey, dry or clumpy.",
        ],
      },
      {
        heading: "Check its age",
        body: [
          "If you can't remember when you opened it, decode the batch code to find the manufacture date, then count forward using the 6–12 month window.",
        ],
      },
      {
        heading: "Oxidation is not expiry",
        body: [
          "The most common complaint about foundation — \"it goes orange on my skin after an hour\" — is usually not an expired product. It is oxidation, and it happens to fresh foundation too.",
          "Iron oxide pigments react with air and with the oils on your skin, and the shade drifts warmer over the course of a wear. Sebum accelerates it, which is why it is worse on oily skin and worse in summer. A primer, a mattifying base or a setting powder slows it down.",
          "The distinction matters because people bin perfectly good foundation for this, and keep genuinely spoiled foundation because it has not changed colour. The expiry signs are different: separation that will not remix, a sour smell, a texture that has gone gluey or grainy. Colour drift during wear is a formula-and-skin interaction, not a date problem.",
        ],
      },
      {
        heading: "The bottle you own decides the timeline",
        body: [
          "Two identical formulas in different packaging have genuinely different lifespans, and it is the packaging that decides.",
          "- Airless pump: the best case. The formula never meets air or fingers, and 12 months is realistic.",
          "- Standard pump: good. Some air ingress through the dip tube, but no contact with skin.",
          "- Open-neck bottle you tip onto the back of your hand: air on every use, and whatever is on your hand can migrate back to the neck.",
          "- Jar or pot: worst case. Fingers, every single day, into a water-based formula. Use a clean spatula if you want to get the full PAO out of it.",
          "- Cushion compacts: a puff that touches your face and returns to a sponge soaked in product. Wash or replace the puff regularly — it is the wand-in-the-mascara problem in a different shape.",
        ],
      },
      {
        heading: "Your sponge is older than your foundation",
        body: [
          "A damp make-up sponge is a better home for bacteria than the foundation ever was. It stays wet, it lives in a warm bathroom, it holds product deep inside where it never dries, and it is pressed against your face daily.",
          "Wash sponges after every few uses with soap and warm water, dry them somewhere with air movement rather than in a closed drawer, and replace them every month or two. A brush is easier: synthetic bristles hold less product and dry faster, and a weekly wash is enough.",
          "There is little point being disciplined about a 12-month PAO on the bottle while applying it with a sponge you have had since last year. The tool is the contamination route.",
        ],
      },
      {
        heading: "Shade drift is not the same as spoilage",
        body: [
          "Foundation that no longer matches you is a different problem from foundation that has gone off, and it is worth separating them.",
          "Your skin changes with the season — most people are a shade or two darker and warmer in summer — and a foundation bought in January will genuinely be wrong in July. That is your skin moving, not the product.",
          "Oxidation during wear, described above, moves the product warmer within an hour of application. That is chemistry, and it happens to a brand-new bottle.",
          "Actual spoilage looks like separation that won't remix, a sour or chalky smell, or a texture that has gone gluey. If the shade is wrong but the formula is fine, you have a matching problem, not an expiry one — and mixing in a drop of a lighter or darker product is a perfectly reasonable answer.",
        ],
      },
    ],
    faq: [
      {
        q: "Can old foundation cause breakouts?",
        a: "Yes. Bacteria and degraded oils in old foundation are a common cause of clogged pores and irritation, especially on acne-prone skin.",
      },
      {
        q: "My foundation separated. Can I just shake it?",
        a: "If it remixes to a smooth, even emulsion and smells normal, it was probably just settling — many formulas separate on standing and are designed to be shaken. If it will not remix, or remixes and separates again within minutes, the emulsion has broken and it is finished.",
      },
      {
        q: "Does powder foundation last longer than liquid?",
        a: "Considerably — 18 to 24 months after opening, against 6 to 12 for liquid. Dry formulas have almost no water for bacteria to grow in. The limiting factor with powder is usually the brush or sponge, not the powder.",
      },
    ],
    seeAlso: [
      { label: "Does makeup expire?", href: "/guides/does-makeup-expire" },
      { label: "Estée Lauder batch codes (MAC, Clinique, Bobbi Brown)", href: "/decoders/estee-lauder-batch-code-format" },
      { label: "L'Oréal batch codes: the year-letter system", href: "/decoders/loreal-batch-code-format" },
    ],
  },
  {
    slug: "does-nail-polish-expire",
    title: "Does Nail Polish Expire?",
    description:
      "Nail polish doesn't rot, but it thickens and separates over time. Here's how long it really lasts and how to tell when to toss it.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "It doesn't spoil — it thickens",
        body: [
          "Nail polish has no water and few nutrients for bacteria, so it doesn't 'go bad' like makeup. Instead the solvents evaporate, the formula thickens, and the pigment separates.",
          "Opened polish typically stays usable for 1–2 years; unopened, well-stored bottles can last much longer.",
        ],
      },
      {
        heading: "Signs it's past it",
        body: [
          "- It's stringy, gloopy or won't level out on the nail.",
          "- The colour and pigment have separated and won't remix by rolling the bottle.",
          "- It smells strongly of chemicals or dries oddly.",
          "Thinner can revive a slightly thick polish, but not a fully separated one — never use acetone for this.",
        ],
      },
      {
        heading: "Store it right",
        body: [
          "Keep bottles upright, tightly capped, and away from heat and sunlight. Wipe the neck so the cap seals — a loose cap is what dries polish out early.",
        ],
      },
      {
        heading: "What is actually happening in the bottle",
        body: [
          "Nail polish is a suspension: pigment and a film-forming resin (traditionally nitrocellulose) carried in volatile solvents. It works by having the solvent evaporate off the nail, leaving the film behind. Everything that goes wrong with a bottle over time is a version of that happening too early.",
          "Solvent escapes past an imperfectly sealed cap, and the remaining polish thickens. Pigment, being heavier, settles out — which is normal and reversible. The resin itself can slowly stiffen, which is not.",
          "Because there is essentially no water in the formula, microbial spoilage is not a factor. This is the one product in the cabinet where \"expired\" is a performance judgement rather than a hygiene one, and the only thing at risk is your manicure.",
        ],
      },
      {
        heading: "Reviving a thick polish — and when not to",
        body: [
          "Roll the bottle between your palms rather than shaking it. Shaking whips air bubbles into the formula, and those bubbles end up as craters in the finish. Rolling redistributes settled pigment without aerating it.",
          "If it is genuinely too thick, a few drops of proper nail polish thinner will restore it. Thinner replaces the evaporated solvent.",
          "Never use nail polish remover for this. Acetone is a solvent, but it is the wrong one — it dissolves the resin film rather than carrying it, and a bottle cut with acetone will apply streaky and chip within a day. It is the single most common piece of bad advice in this area.",
          "A polish that has separated into a clear layer and a dense sludge that will not recombine after several minutes of rolling is finished. So is one that has gone stringy or gummy — that is the resin, and no solvent brings it back.",
        ],
      },
      {
        heading: "Why the cap is the whole game",
        body: [
          "Almost every polish that dies early dies of a bad seal. Polish creeps into the threads of the neck as you use it, dries there, and holds the cap fractionally open — and then the solvents leave over the following months.",
          "Wipe the neck and the threads with a lint-free pad and a little remover before you cap it. Thirty seconds, and it is the difference between a two-year bottle and a six-month one. Store upright, cool, and out of the sun, which also keeps the pigment from fading.",
        ],
      },
    ],
    faq: [
      {
        q: "Is expired nail polish harmful?",
        a: "Not really — the worst case is a lumpy, streaky manicure. It's a quality issue, not a safety one.",
      },
      {
        q: "Can I use nail polish remover to thin my polish?",
        a: "No. Acetone breaks down the resin film rather than replacing the evaporated solvent, so the polish applies streaky and chips almost immediately. Use a purpose-made nail polish thinner — a few drops is enough.",
      },
      {
        q: "Why is my new polish full of bubbles?",
        a: "Shaking. Roll the bottle between your palms instead — shaking beats air into a formula that will trap it as it dries.",
      },
    ],
    seeAlso: [
      { label: "Coty batch codes (Sally Hansen, Rimmel, Max Factor)", href: "/decoders/coty-batch-code-format" },
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
      { label: "How to dispose of expired makeup", href: "/guides/how-to-dispose-of-expired-makeup" },
    ],
  },
  {
    slug: "how-to-dispose-of-expired-makeup",
    title: "How to Dispose of Expired Makeup",
    description:
      "Old cosmetics shouldn't just go in the bin. Here's how to empty, sort and recycle expired makeup and skincare responsibly.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "Empty before you toss",
        body: [
          "Scrape or wash out leftover product first — most recyclers won't take containers with residue. Liquids can go down the drain in small amounts; solids go in general waste.",
          "Never pour large amounts of oil-based product down the sink, as it can clog pipes.",
        ],
      },
      {
        heading: "Sort the packaging",
        body: [
          "- Glass bottles and jars: rinse and recycle with glass.",
          "- Plastic tubes and pumps: check the resin code; pumps often aren't recyclable and go to general waste.",
          "- Compacts and mirrors: usually mixed materials — separate the metal pan if you can.",
          "- Aerosols (dry shampoo, setting spray): empty fully, then recycle with metals where accepted.",
        ],
      },
      {
        heading: "Take-back and recycling programs",
        body: [
          "Several beauty retailers and brands run in-store take-back schemes for hard-to-recycle cosmetic packaging. Dropping empties there is the cleanest option.",
          "Going forward, decoding batch codes when you buy helps you use products up before they expire — less waste to dispose of in the first place.",
        ],
      },
      {
        heading: "Why cosmetic packaging defeats normal recycling",
        body: [
          "A shampoo bottle is one material and recycles easily. Almost nothing else in a make-up bag is one material.",
          "A pump is a plastic body, a metal spring, a smaller plastic dip tube and often a gasket — four materials fused into a component nobody can separate at speed on a sorting line, so the whole thing goes to landfill. A compact is plastic, a glued metal pan and a glass mirror. A mascara is a tube, a wiper, a wand and a cap in different plastics. A lipstick bullet is a barrel, a swivel mechanism and a spring.",
          "This is why so much cosmetic packaging is technically recyclable and practically is not: recycling depends on being able to sort a material, and mixed-material items cannot be sorted. Where you can pull the components apart — unscrew a pump, prise the metal pan out of a compact — you convert an unrecyclable object into two or three recyclable ones. Where you cannot, general waste is the honest destination and pretending otherwise contaminates the recycling stream.",
        ],
      },
      {
        heading: "What to do with the product itself",
        body: [
          "- Water-based liquids (toner, micellar water, light lotions): small quantities down the drain with plenty of water.",
          "- Oils, balms and thick creams: do not pour these down the sink. Scrape into general waste — oil congeals in pipes and is a genuine cause of blockages.",
          "- Powders: tip into general waste. Rinse the pan afterwards.",
          "- Aerosols: never puncture or crush them, and never put a part-full can in with metals. Empty by discharging in a ventilated space, then recycle where cans are accepted, or take to a household hazardous waste point if not.",
          "- Acetone, nail polish and remover: these are classed as hazardous waste in most jurisdictions and should go to a civic amenity site rather than a kerbside bin.",
          "- Anything containing an active drug — prescription retinoids, some acne products — should go back to a pharmacy where a take-back scheme exists.",
        ],
      },
      {
        heading: "The best disposal is not needing to dispose",
        body: [
          "The majority of cosmetics that get thrown away were never finished. They were bought, used a few times, and drifted past their date in a drawer — and the environmental cost of that is far larger than any decision about which bin the empty goes in.",
          "The habits that fix it are unglamorous: buy the size you will realistically use, check a batch code before buying discounted stock so you know how much life it has left, and keep the products with the shortest clocks — mascara, vitamin C, sunscreen — visible rather than buried.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I put a half-full aerosol in the recycling?",
        a: "No. A pressurised can is a hazard on a sorting line and in a bin lorry. Discharge it fully in a ventilated space first, or take it to a household hazardous waste point.",
      },
      {
        q: "Do brand take-back schemes actually recycle the packaging?",
        a: "The good ones do, and they exist precisely because kerbside recycling cannot handle mixed-material beauty packaging. They are the right destination for pumps, compacts, mascaras and anything you cannot pull apart.",
      },
    ],
    seeAlso: [
      { label: "Cosmetics shelf life guide", href: "/guides/cosmetics-shelf-life-guide" },
      { label: "How to store cosmetics properly", href: "/guides/how-to-store-cosmetics" },
      { label: "Does nail polish expire?", href: "/guides/does-nail-polish-expire" },
    ],
  },
  {
    slug: "brands-that-print-the-date",
    title: "Brands That Print the Date Directly (Korean & French Pharmacy)",
    description:
      "Many Korean, Japanese and French-pharmacy brands stamp the manufacture or expiry date on the pack in plain numbers — here's how to read it without a batch-code decoder.",
    readMinutes: 5,
    updated: "2026-07-12",
    sections: [
      {
        heading: "Not every brand hides the date in a code",
        body: [
          "Western conglomerates (Estée Lauder, L'Oréal, Coty, LVMH and others) stamp a coded production date that needs decoding. But a large share of the market does the opposite: they print the manufacture or expiry date on the packaging as a plain calendar date.",
          "This is especially common with Korean and Japanese skincare and with French-pharmacy brands. For these products you don't need a batch-code decoder at all — the date is right there once you know what to look for.",
        ],
      },
      {
        heading: "How to read the printed date",
        body: [
          "Look on the base of the bottle or jar, the crimp at the end of a tube, or the flap of the box. You'll usually see two short dates or labels.",
          "- Manufacture date: marked MFG, MFD, MAN, MD, M, or 제조 (Korean), 生産日期 (Chinese), 製造 (Japanese).",
          "- Expiry / best-before: marked EXP, E, BB, or 까지 (Korean), 保质期 / 消费期限.",
          "Common formats are YYYY.MM.DD, YYYY-MM-DD or DD.MM.YYYY. If only one date is shown, Korean and Japanese products usually print the manufacture date, while EU products more often print the expiry (period-of-minimum-durability) date.",
        ],
      },
      {
        heading: "Which brands print the date directly",
        body: [
          "Korean skincare and makeup — for example Laneige, Innisfree, COSRX, Beauty of Joseon, Anua, Some By Mi, Torriden, Round Lab, Missha and most K-beauty labels.",
          "Japanese brands such as Hada Labo, FANCL and DHC, and French-pharmacy lines such as Avène, Bioderma, Klorane, Ducray, A-Derma and Weleda, also print a readable date (some, like Bioderma, additionally encode it in the code).",
          "Because these dates are printed in plain text, we don't run them through a decoder — reading the pack is faster and more reliable than any tool.",
        ],
      },
      {
        heading: "Two dates, and which one to believe",
        body: [
          "Products that print dates often print two, and people routinely read the wrong one. The rule is simple: a manufacture date tells you how fresh the product was; an expiry date is the manufacturer's own guarantee. Where both exist, the expiry date wins, because it already accounts for the shelf life the manufacturer tested.",
          "Where only one exists, its identity depends on where the product came from. Korean and Japanese packs usually print the manufacture date. EU packs, when they print a date at all, usually print a period-of-minimum-durability — a best-before. A bare date with no label is more likely to be an expiry in Europe and a manufacture date in Asia.",
          "And a date beats a decode every time. Our checker exists to recover a manufacture date that a brand chose not to print. When the brand did print one, there is nothing to recover.",
        ],
      },
      {
        heading: "Why the difference exists at all",
        body: [
          "This is a regulatory divide, not a cultural one. Korea's MFDS requires cosmetics to carry a manufacture date, so Korean manufacturers print it — on the pack, in the batch code, usually both.",
          "EU regulation asks a different question. It requires a durability indication, and gives two ways to satisfy it: a best-before date if the product lasts 30 months or less, or the open-jar PAO symbol if it lasts longer. Since most cosmetics comfortably exceed 30 months sealed, most European products show a PAO and no date whatsoever — and the manufacture date survives only inside the batch code, which is where the decoding problem comes from in the first place.",
          "French-pharmacy brands are the interesting middle case. They sit under the same EU rules as everyone else, but their products are sold in a pharmacy context where dates are expected, so many print one voluntarily. Bioderma both prints a date and encodes it in the code — belt and braces.",
        ],
      },
    ],
    faq: [
      {
        q: "My Korean skincare has no batch code I can decode — is that normal?",
        a: "Yes. Most Korean and Japanese brands print the manufacture date (제造) and often the expiry date directly on the pack instead of hiding it in a coded batch number, so there's nothing to decode — just read the printed date.",
      },
      {
        q: "If both a manufacture and an expiry date are printed, which do I trust?",
        a: "The expiry (or best-before) date is the manufacturer's own guarantee, so prefer it. The manufacture date tells you how fresh the product was and, with the open-jar PAO symbol, how long you have after opening.",
      },
      {
        q: "What does the Korean word 제조 mean on my product?",
        a: "제조 means 'manufactured' — the date next to it is the production date. 까지 means 'until', marking the expiry date.",
      },
      {
        q: "Why do Korean brands print the date when Western ones don't?",
        a: "Regulation. Korea's MFDS requires a manufacture date on cosmetics, so brands print it. Most Western markets require only a durability indication, which a manufacturer can satisfy with the open-jar PAO symbol — so they do, and the date stays hidden in the batch code.",
      },
    ],
    seeAlso: [
      { label: "Korean beauty batch codes, explained", href: "/decoders/korean-batch-code-format" },
      { label: "Bioderma batch codes (DDDY)", href: "/decoders/bioderma-batch-code-format" },
      { label: "Rohto batch codes (Hada Labo, Melano CC)", href: "/decoders/rohto-batch-code-format" },
    ],
  },
  {
    slug: "where-is-the-batch-code-on-perfume",
    title: "Where Is the Batch Code on Perfume?",
    description:
      "The batch code on a perfume is a short stamp on the box and the bottle — here's exactly where to look on the packaging and how to read it.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "On the box",
        body: [
          "The quickest place to find a perfume batch code is the outer box. Look on the bottom flap or one of the side panels, usually printed in small type near the ingredients list or the \"made in\" line.",
          "It is a short, separate code of 4–8 letters and numbers — not the long barcode. It is often ink-jet printed, so it can look faint or slightly smudged.",
        ],
        image: {
          src: "/where/perfume.jpg",
          alt: "Batch code circled on the side panel of a perfume box, next to the made-in line",
        },
      },
      {
        heading: "On the bottle",
        body: [
          "If you no longer have the box, check the bottle itself. The code is usually laser-etched or printed on the base of the bottle, or on the clear sticker underneath it.",
          "On tester and travel bottles the code can be on the crimp around the spray collar. Turn the bottle in good light — etched codes catch the light rather than showing as ink.",
        ],
      },
      {
        heading: "How to read it",
        body: [
          "Most fragrance houses encode the production date. Coty, Dior and many others use a year digit plus the day of the year (e.g. 4135 = the 135th day of 2024).",
          "You don't need to decode it by hand — pick your brand on the home page, type the code, and the checker returns the manufacture date, age and estimated expiry.",
        ],
      },
      {
        heading: "Match the box code to the bottle code",
        body: [
          "When you have both, compare them. On genuine stock the two agree, because the box and the bottle were coded minutes apart at the end of the same filling line.",
          "A mismatch means the box and the contents were brought together somewhere else. That happens with counterfeits, and it also happens with entirely legitimate repackaged and grey-market goods — a returned item reboxed, a tester rehoused, a bottle sold on without its original carton. Either way, it tells you that the pairing you are holding is not the one the factory shipped.",
          "It is the single most useful check available to a buyer, it takes ten seconds, and it needs no tool.",
        ],
      },
      {
        heading: "Whose rule applies to your bottle",
        body: [
          "Fragrance is the category where the name on the bottle tells you least about who made it. Fashion houses license their perfumes, and the licensee's factory sets the format.",
          "- Coty makes Hugo Boss, Calvin Klein, Gucci, Burberry, Chloé, Davidoff, Lacoste, Marc Jacobs, adidas and around thirty others. A flat four-digit code.",
          "- Inter Parfums makes Montblanc, Jimmy Choo, Coach, Van Cleef & Arpels, Boucheron, Karl Lagerfeld, Kate Spade and Ferragamo. A nine-character code whose first letter is the year.",
          "- L'Oréal makes Giorgio Armani, Prada, Valentino, Mugler, Azzaro, Viktor & Rolf, Ralph Lauren, Cacharel and Diesel fragrance. A year letter and a month character.",
          "- LVMH's own houses — Dior, Guerlain, Givenchy, Kenzo, Loewe, Acqua di Parma — print the date rather than encoding it.",
          "- Creed puts the year in a single letter and nothing else.",
          "Select the brand in the checker and it applies the right rule automatically. If you want to understand what it is doing, each format has a page of its own.",
        ],
      },
    ],
    faq: [
      {
        q: "Is the perfume batch code the same as the barcode?",
        a: "No. The barcode is the long striped EAN number used at checkout and is identical on every bottle. The batch code is a separate short stamp that changes with each production run and encodes the date.",
      },
      {
        q: "My perfume has no visible code — why?",
        a: "Some codes are etched faintly on the glass base or hidden under the peel-off sticker. If there's genuinely no code, the bottle may be a tester, a refill, or a counterfeit.",
      },
      {
        q: "The code is etched into the glass and I can't read it.",
        a: "Laser etching has no ink — it only appears when light rakes across it from the side. Don't shine a light straight at it; tilt the bottle against a lamp or window until the characters catch. A phone camera with flash and zoom often captures what the eye can't.",
      },
    ],
    seeAlso: [
      { label: "Coty batch codes (YDDD)", href: "/decoders/coty-batch-code-format" },
      { label: "Dior, Chanel and LVMH: the date is in the code", href: "/decoders/dior-lvmh-batch-code-format" },
      { label: "Does perfume expire?", href: "/guides/does-perfume-expire" },
    ],
  },
  {
    slug: "where-is-the-batch-code-on-tubes-and-creams",
    title: "Where Is the Batch Code on a Tube or Cream?",
    description:
      "On tubes the batch code sits on the crimp at the sealed end; on jars and creams it's stamped on the base or lid. Here's where to look and how to read it.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "On a tube",
        body: [
          "For creams, cleansers and sunscreens in a tube, look at the crimp — the flat sealed end opposite the cap. The batch code is embossed or printed there, often together with the expiry or a factory mark.",
          "It's a short code of letters and numbers. On soft tubes it can be pressed into the metal or plastic, so tilt it under light to read it.",
        ],
        image: {
          src: "/where/tube.jpg",
          alt: "Batch code highlighted on the crimp at the sealed end of a cosmetic tube",
        },
      },
      {
        heading: "On a jar or pot",
        body: [
          "For creams in a jar, the code is usually stamped on the base of the jar or on the underside of the lid — not on the paper label.",
          "It sits near the open-jar PAO symbol (e.g. 12M), which tells you how many months the product lasts once opened.",
        ],
      },
      {
        heading: "How to read it",
        body: [
          "Skincare houses each stamp dates differently — L'Oréal, Beiersdorf (Nivea, Eucerin) and Korean brands all use their own format.",
          "Choose the brand on the home page and enter the code; the checker applies that brand's rule and shows the manufacture date and estimated shelf life.",
        ],
      },
      {
        heading: "Reading a code pressed into metal or plastic",
        body: [
          "Tube crimps are the hardest surface in the cabinet to read, because the code is usually pressed rather than printed — there is no ink, only a deformation of the material.",
          "The instinct is to shine more light at it. That is exactly wrong: light from the front flattens the impression and makes it disappear. What you want is light from the side, so the ridges cast small shadows. Tilt the crimp under a lamp or towards a window and rotate it slowly; the characters will appear at one particular angle and vanish at every other.",
          "For an aluminium crimp, a phone camera with flash held slightly off-axis works well. Photograph it, then zoom into the still image. Failing that, a soft pencil rubbed lightly across a piece of thin paper laid over the crimp will take a rubbing, the same way it does with a coin.",
        ],
      },
      {
        heading: "The three codes on a skincare tube",
        body: [
          "A crimp often carries more than one marking, and only one of them is the batch code.",
          "- The batch code: irregular, alphanumeric, added at fill time.",
          "- A best-before or expiry date: printed as a plain date. Where this exists, it supersedes any decoded estimate — it is the manufacturer's own guarantee.",
          "- A mould or tooling number: a fixed number identifying the tube itself, not the batch. It never changes between production runs, which is how you can tell it apart if you have two of the same product.",
          "French-pharmacy skincare — La Roche-Posay, Vichy, Avène, Bioderma — very often prints a genuine expiry date alongside the code. Use it, and treat the batch code as a way of knowing how fresh the product was when you bought it.",
        ],
      },
    ],
    faq: [
      {
        q: "What is the crimp on a tube?",
        a: "The crimp is the flat, sealed end of a tube opposite the cap. Manufacturers stamp the batch code and often the expiry date into this seam.",
      },
      {
        q: "The code on my tube rubbed off — what now?",
        a: "Ink-jet codes on tubes can wear away. Check the box if you still have it; otherwise the open-jar PAO symbol is your best guide to remaining shelf life.",
      },
      {
        q: "There are two numbers on my crimp. Which is the batch code?",
        a: "The irregular alphanumeric one. A number that is purely numeric and identical across two units of the same product is a mould or tooling number, not a batch code — it identifies the tube, not the production run.",
      },
    ],
    seeAlso: [
      { label: "L'Oréal batch codes (CeraVe, La Roche-Posay, Vichy)", href: "/decoders/loreal-batch-code-format" },
      { label: "NIVEA, Eucerin and Labello: year + week codes", href: "/decoders/beiersdorf-batch-code-format" },
      { label: "Korean beauty batch codes, explained", href: "/decoders/korean-batch-code-format" },
    ],
  },
  {
    slug: "where-is-the-batch-code-on-lipstick-and-makeup",
    title: "Where Is the Batch Code on Lipstick & Makeup?",
    description:
      "On lipstick the batch code is on the base of the case; on compacts and palettes it's inside or on the back. Here's where to find it and how to read it.",
    readMinutes: 4,
    updated: "2026-07-12",
    sections: [
      {
        heading: "On lipstick",
        body: [
          "Twist the lipstick closed and look at the flat bottom of the case — the batch code is printed or stamped there, sometimes alongside the shade number and, on Korean products, a plain 제조 (manufacture) date.",
          "It's a short code separate from the shade name. Good light helps: on glossy cases the print can be low-contrast.",
        ],
        image: {
          src: "/where/lipstick.jpg",
          alt: "Batch code highlighted on the flat base of a lipstick case",
        },
      },
      {
        heading: "On compacts, palettes and mascara",
        body: [
          "For powders, blushes and palettes, check the back of the compact or the inside of the lid. For mascara and liquid liners, the code is on the bottom of the tube or where the label wraps.",
          "As with all makeup, the code sits near or under the open-jar PAO symbol.",
        ],
      },
      {
        heading: "How to read it",
        body: [
          "Makeup makers such as Estée Lauder (MAC, Bobbi Brown), Coty (Rimmel, Max Factor, Bourjois) and L'Oréal each use their own date format.",
          "Enter the code with the brand selected on the home page and the checker returns the manufacture date, age and how much shelf life is left.",
        ],
      },
      {
        heading: "The code hides in a different place on each format",
        body: [
          "Makeup is the most varied packaging category there is, and the code moves accordingly:",
          "- Lipstick bullet: the flat base of the case, usually stamped into the plastic. Twist the bullet fully down first so the case sits flat.",
          "- Liquid lipstick and gloss: around the base of the tube, or on the shoulder where the label ends.",
          "- Pressed powder, blush, bronzer: the back of the compact. On some brands it is inside, under the pan — you can see it only when the powder is used up.",
          "- Palettes: the back of the case, or on the cardboard sleeve if it shipped with one.",
          "- Mascara and liquid liner: the base of the tube, or printed vertically where the label wraps.",
          "- Cushion compacts: on the underside of the outer case, and often a second code inside on the refill itself.",
          "The rule that holds across all of them: the code is near the open-jar PAO symbol, because both are added at the same stage of production.",
        ],
      },
      {
        heading: "Why a MAC code looks nothing like a Rimmel code",
        body: [
          "Two lipsticks, both bought in the same shop, can carry codes that look like they come from different planets — because they do. The format belongs to whoever manufactured the product.",
          "A MAC, Clinique or Bobbi Brown code is three characters, like A56: a plant letter, a month and a year digit. Read it from the right, because the plant is the part that varies in length.",
          "A Rimmel, Bourjois, Max Factor, CoverGirl or Sally Hansen code is four digits, like 4135: a year digit followed by the day of the year. All of them are Coty.",
          "A Maybelline, NYX, Urban Decay, Essie or 3CE code is six characters with a letter in the middle, like 22U401: the letter is the year and the character after it is the month. All of them are L'Oréal.",
          "Learn those three and you can read most of a make-up bag by eye.",
        ],
      },
    ],
    faq: [
      {
        q: "Where is the batch code on a MAC or Estée Lauder lipstick?",
        a: "On the base of the bullet case — a short plant-month-year code (e.g. A56). Enter it with the brand selected to decode the manufacture date.",
      },
      {
        q: "Does makeup show an expiry date?",
        a: "Rarely. Most makeup only carries a batch code plus the open-jar PAO symbol, so the code is how you find out when it was made.",
      },
      {
        q: "My compact has no code on the outside.",
        a: "Check inside the lid, and under the pan. Some brands print it on the metal pan itself, which only becomes visible once the powder is low — annoying, but it is there.",
      },
    ],
    seeAlso: [
      { label: "Estée Lauder batch codes (MAC, Clinique, Bobbi Brown)", href: "/decoders/estee-lauder-batch-code-format" },
      { label: "Coty batch codes (Rimmel, Max Factor, Bourjois)", href: "/decoders/coty-batch-code-format" },
      { label: "L'Oréal batch codes (Maybelline, NYX, Urban Decay)", href: "/decoders/loreal-batch-code-format" },
    ],
  },
];

const guideBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
export function getGuide(slug: string): Guide | undefined {
  return guideBySlug.get(slug);
}
