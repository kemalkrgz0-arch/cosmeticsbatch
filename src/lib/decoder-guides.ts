import { BRANDS, type Brand } from "./brands";

/**
 * Long-form documentation of each date-code family the engine can read.
 *
 * Why these pages exist: a batch-code format belongs to the *manufacturer*, not
 * the brand. Coty stamps the same YDDD code on Rimmel, Gucci and adidas; the
 * 40-odd Coty brand pages can only ever repeat the same cipher. Documenting the
 * cipher once, properly — anatomy, worked examples, packaging, limits — is the
 * only place where genuinely unique content exists, so that is where it lives.
 * Brand pages are the tool; these are the reference.
 *
 * Everything here is derived from the decoder implementation in
 * `src/lib/decoder/decoders.ts` — if a rule changes there, change it here too.
 * The examples are decoded by the real engine at render time (see the page), so
 * a broken example shows up as a broken page rather than as a silent lie.
 */
export interface CodePart {
  /** The slice of the example code this row describes, e.g. "4". */
  chars: string;
  /** What that slice encodes. */
  means: string;
}

export interface DecoderGuide {
  slug: string;
  /**
   * Decoder ids from the engine that this page documents. The first is the one
   * whose `decode()` runs the worked examples; extra ids are aliases whose brand
   * pages should link here (e.g. `embedded` shares the julian reader).
   */
  decoderIds: string[];
  title: string;
  description: string;
  updated: string;
  readMinutes: number;
  /** Character-by-character breakdown of one representative code. */
  anatomy: { code: string; parts: CodePart[] };
  /** Codes run through the real decoder on the page. */
  examples: { code: string; note?: string }[];
  sections: { heading: string; body: string[] }[];
  faq: { q: string; a: string }[];
}

export const DECODER_GUIDES: DecoderGuide[] = [
  /* ---------------------------------------------------------------- Coty -- */
  {
    slug: "coty-batch-code-format",
    decoderIds: ["coty"],
    title: "Coty Batch Codes (YDDD): How to Read Them",
    description:
      "Coty stamps a 4-digit code — one year digit plus the day of the year — on Rimmel, Bourjois, Hugo Boss, Gucci, Calvin Klein and 35 other brands. Here is the full format, worked examples and its blind spots.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "4135",
      parts: [
        { chars: "4", means: "Last digit of the production year — 2024" },
        {
          chars: "135",
          means: "Day of that year (001–366) — day 135 is 14 May",
        },
      ],
    },
    examples: [
      { code: "4135", note: "The textbook Coty code: day 135 of a year ending in 4." },
      { code: "2001", note: "Day 001 — 1 January, the lowest day number a valid code can carry." },
      { code: "4366", note: "Day 366 exists only in a leap year: 2024 had one, so this is 31 December." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Coty uses one of the shortest formats in the industry: four digits, nothing else. The first digit is the last digit of the production year. The remaining three are the Julian day — the day's position in that year, counted from 001 on 1 January to 365 (or 366 in a leap year) on 31 December.",
          "That is the entire cipher. There is no plant code, no month letter and no line number to interpret. Coty applies it across everything it manufactures, which is why the same rule reads a Rimmel mascara, a Hugo Boss eau de toilette and an adidas body spray.",
          "Because the day is encoded exactly, a Coty code gives you the manufacture date to the day — better precision than most of the industry, where month-level accuracy is the norm.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Take the first digit and find the most recent year that ends in it. A code starting with 4 read in 2026 means 2024, not 2014 — unless the product is obviously older.",
          "- Take the last three digits as a day number. Divide by roughly 30.4 to get the approximate month: day 135 ÷ 30.4 ≈ 4.4, so early in the 5th month, May.",
          "- Sanity-check the result against the product. A code that decodes to a date before the product line launched is a red flag worth taking seriously.",
        ],
      },
      {
        heading: "Where Coty prints it",
        body: [
          "On fragrance, look at the base of the outer box and at the clear sticker on the underside of the bottle — the code is usually printed in small black or grey ink on both, and the two should match. A mismatch between box and bottle is a classic sign of repackaged or grey-market stock.",
          "On colour cosmetics (Rimmel, Bourjois, Sally Hansen, Max Factor, CoverGirl) the code is stamped or embossed on the back of the pack, sometimes on the crimp of a tube. Embossed codes are unlit and low-contrast: photograph them with light raking across the surface rather than head-on.",
          "The code is never the long barcode number under the black stripes. That is the EAN, which identifies the product for sale and carries no date.",
        ],
      },
      {
        heading: "What the format cannot tell you",
        body: [
          "The year is a single digit, so it repeats every ten years. A code reading 4135 is 14 May 2024 — but it is also, on identical evidence, 14 May 2014. The decoder assumes the most recent plausible year; on a bottle that looks a decade old, subtract ten years.",
          "The code records when the product was made, not how long it stays usable once you open it. That is the PAO symbol — the open-jar icon marked 12M, 24M and so on. A three-year-old sealed bottle can be fine; a mascara opened eight months ago is not, whatever its batch code says.",
        ],
      },
    ],
    faq: [
      {
        q: "My Coty code has letters in it. Is it still readable?",
        a: "Yes. Some plants add letters around the four digits for internal tracking. The decoder isolates the 4-digit group and ignores the rest — the letters carry no date.",
      },
      {
        q: "Why does my code decode to a date in the future?",
        a: "It doesn't — the decoder rejects future dates and steps the year back a decade instead. If you are reading it by hand and land in the future, the year digit belongs to the previous decade.",
      },
      {
        q: "Do all Coty brands use this format?",
        a: "Every Coty-manufactured line we have verified does. Licensed fragrances made under contract elsewhere occasionally arrive with a different stamp; if the four digits decode to an absurd day (over 366), the code is not a Coty YDDD code.",
      },
    ],
  },

  /* ------------------------------------------------------------- L'Oréal -- */
  {
    slug: "loreal-batch-code-format",
    decoderIds: ["loreal"],
    title: "L'Oréal Batch Codes: The Year-Letter System Explained",
    description:
      "L'Oréal's 6-character code hides the year in a letter and the month in the character after it. It reads Maybelline, Lancôme, Kiehl's, CeraVe, La Roche-Posay, YSL and 30 more brands.",
    updated: "2026-07-12",
    readMinutes: 6,
    anatomy: {
      code: "22U401",
      parts: [
        { chars: "22", means: "Factory / plant identifier — no date information" },
        { chars: "U", means: "Production year, from the annual letter cycle — U = 2021" },
        { chars: "4", means: "Month: 1–9 = January–September (O/N/D = Oct/Nov/Dec) — 4 = April" },
        { chars: "01", means: "Production batch series — no bearing on shelf life" },
      ],
    },
    examples: [
      { code: "22U401", note: "Factory 22, year letter U, month 4 — April 2021." },
      { code: "40X200", note: "Year letter X — two years on from U." },
      { code: "31YO500", note: "Month O is October, not a zero." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "L'Oréal group codes are typically six characters, and unlike Coty's pure-digit stamp they mix numbers and letters. The leading digits identify the factory. The first letter is the year. The character immediately after that letter is the month. Whatever follows is an internal batch series with no date meaning.",
          "The year runs on an annual letter cycle through the alphabet with the letter V skipped, so U = 2021, W = 2022, X = 2023, Y = 2024, Z = 2025, and the cycle wraps back to A for 2026. Skipping V is a deliberate choice: it is too easily confused with U on a low-contrast stamp.",
          "The month character reuses digits 1–9 for January to September, then switches to letters for the last quarter: O = October, N = November, D = December. Those are the initials of the month names in French and English alike, which is a handy way to remember them — and a trap if you read the O as a zero.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Find the first letter in the code. That is the year. Count forward from U = 2021 through the alphabet, remembering to skip V.",
          "- Look at the very next character. A digit from 1 to 9 is the month directly. An O, N or D is October, November or December.",
          "- Ignore everything before the letter and everything after the month character. The factory number and the batch series tell you nothing about age.",
        ],
      },
      {
        heading: "Where L'Oréal prints it",
        body: [
          "On tubes and bottles, the code is usually inkjet-printed on the crimp seal at the bottom of the tube, or on the bottle's base. On cartons it sits on one of the end flaps, often next to a printed best-before or PAO symbol.",
          "L'Oréal's dermatological brands — La Roche-Posay, Vichy, CeraVe, SkinCeuticals — frequently print an explicit expiry date as well as the batch code. When a real expiry date is on the pack, trust it over any decoded estimate.",
          "The stamp is often pale grey on white plastic. Tilt the pack against a light source rather than adding more light straight on.",
        ],
      },
      {
        heading: "What the format cannot tell you",
        body: [
          "The code gives the month, not the day, so the decoder estimates mid-month. That is accurate enough for shelf-life purposes: no cosmetic's usability turns on a fortnight.",
          "The letter cycle is 25 years long, so ambiguity is far less of a problem here than with single-digit year codes — but a very old product from a previous cycle would read as a recent one. In practice, a L'Oréal product old enough to hit that ambiguity is well past using.",
          "The factory digits are sometimes read online as a date. They are not. Two products made the same week in different plants carry different leading digits.",
        ],
      },
    ],
    faq: [
      {
        q: "My L'Oréal code has no letter in it at all.",
        a: "Then it is not this format. Some L'Oréal-owned brands acquired recently (and some regional contract manufacturers) still print a plain Julian date. Our decoder falls back to reading an embedded date when the year-letter pattern isn't found.",
      },
      {
        q: "Is the first letter always the year, even if the code starts with a letter?",
        a: "Yes — the year is the first letter that appears anywhere in the code, whether or not factory digits precede it.",
      },
      {
        q: "Does this work for Maybelline and NYX too?",
        a: "Yes. Maybelline, NYX, Garnier, Essie, 3CE, Kiehl's, Lancôme, YSL Beauty, Urban Decay and the rest of the group share L'Oréal's plants and this code.",
      },
    ],
  },

  /* ------------------------------------------------------- Estée Lauder -- */
  {
    slug: "estee-lauder-batch-code-format",
    decoderIds: ["estee-lauder"],
    title: "Estée Lauder Batch Codes: Plant, Month, Year in 3 Characters",
    description:
      "The Estée Lauder group packs a plant letter, a month and a year into three characters. The same code reads Clinique, MAC, La Mer, Jo Malone, Tom Ford and Bobbi Brown.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "A56",
      parts: [
        { chars: "A", means: "Manufacturing plant — no date information" },
        { chars: "5", means: "Month: 1–9 = January–September, A/B/C = October–December — 5 = May" },
        { chars: "6", means: "Last digit of the production year" },
      ],
    },
    examples: [
      { code: "A56", note: "Plant A, month 5 (May), year ending in 6." },
      { code: "B23", note: "Month 2 — February." },
      { code: "EA4", note: "Month letter A means October, not the plant." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Estée Lauder group codes are three characters — occasionally four, when the plant identifier takes two letters. Read them from the right: the last character is the year digit, the one before it is the month, and everything to the left is the plant.",
          "The month follows the industry's most common shorthand: digits 1 to 9 for January through September, then A, B and C for October, November and December, because there are no single digits left.",
          "This is why reading the code from the left gets people into trouble. In the code EA4, the A is not a plant — it is October. The plant is E, the month is A, and the year ends in 4.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Ignore everything except the last two characters.",
          "- Second-to-last character: 1–9 is that month number; A, B or C is October, November or December.",
          "- Last character: the year's final digit. Pick the most recent year that ends in it.",
        ],
      },
      {
        heading: "Where Estée Lauder prints it",
        body: [
          "On skincare jars and bottles, the code is stamped on the base — often embossed rather than printed, so it catches light rather than ink. On MAC and Bobbi Brown colour cosmetics it is on the back of the compact or the base of the lipstick barrel.",
          "Jo Malone and Tom Ford fragrance carry it on the box base and on the bottle's underside sticker, the same convention the rest of the fragrance industry uses.",
          "Three characters is short enough that people mistake other stamps for the batch code. If what you are reading is longer than four characters, it is probably a factory line marking, not the date code.",
        ],
      },
      {
        heading: "What the format cannot tell you",
        body: [
          "Month precision only — the decoder estimates the 15th of the month. And a single-digit year repeats every decade, so a code decoding to May 2026 could in principle be May 2016. The decoder assumes the recent reading; the product's condition and packaging design usually settle which is right.",
          "The plant letter is genuinely uninformative for shelf life. It matters to Estée Lauder's quality control and to nobody else.",
        ],
      },
    ],
    faq: [
      {
        q: "Does this work for La Mer?",
        a: "Yes — La Mer, Clinique, Origins, Aveda, Smashbox, Too Faced, Dr.Jart+, Le Labo and the rest of the group all use the group's plants and this code.",
      },
      {
        q: "My code is 4 characters. Which two matter?",
        a: "The last two, always. A longer plant identifier just adds characters on the left.",
      },
      {
        q: "Is a Clinique code the same as an Estée Lauder one?",
        a: "The format is identical. The plant letter may differ because a given product is made on a given line, but the month/year rule is the same.",
      },
    ],
  },

  /* ------------------------------------------------- Dior / LVMH houses -- */
  {
    slug: "dior-lvmh-batch-code-format",
    decoderIds: ["dior", "chanel", "embedded"],
    title: "Dior, Chanel and LVMH Batch Codes: The Date Is in the Code",
    description:
      "Luxury houses don't run a secret cipher — Dior, Guerlain, Givenchy, Chanel and their siblings print the production date straight into the batch code. Here's how to see it.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "3245",
      parts: [
        { chars: "3", means: "Last digit of the production year — 2023" },
        { chars: "245", means: "Day of that year — day 245 is 2 September" },
      ],
    },
    examples: [
      { code: "3245", note: "Year digit + day of year — the most common luxury pattern." },
      { code: "24045", note: "A 5-digit variant: two year digits, then the day." },
      { code: "231122", note: "A 6-digit packed calendar date: 22 November 2023." },
    ],
    sections: [
      {
        heading: "There is no cipher to crack",
        body: [
          "The persistent myth about luxury fragrance is that the houses encrypt the date and that decoding it requires insider knowledge. They don't. Dior, Guerlain, Givenchy, Kenzo, Loewe, Acqua di Parma and Maison Francis Kurkdjian — the LVMH beauty houses — print the production date directly into the batch code. So, in practice, does Chanel, which publishes no scheme at all but stamps a readable date anyway.",
          "What varies is the packing. The date can appear as a year digit followed by the day of the year (4 characters), as two year digits followed by the day (5 characters), or as a packed calendar date in YYMMDD form (6 characters). Our decoder tries each shape and takes the most plausible reading.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Count the digits. Four means year-digit plus day-of-year. Five means two year digits plus day-of-year. Six means year, month, day.",
          "- For day-of-year forms, convert the day number to a month by dividing by about 30.4. Day 245 ÷ 30.4 ≈ 8.1 — early in the 9th month, September.",
          "- If two readings both look valid, prefer the one that produces a date the product could plausibly have: a 2023 bottle of a fragrance launched in 2024 is telling you the reading is wrong.",
        ],
      },
      {
        heading: "Where the houses print it",
        body: [
          "Fragrance: the base of the outer box, and a small sticker or laser etch on the underside of the bottle. On Chanel, the code is often laser-etched into the glass base itself and needs a raking light to read.",
          "Makeup and skincare: the base of the compact, the crimp of the tube, or the underside of the jar.",
          "The box code and the bottle code should agree. On authentic stock they nearly always do; a mismatch is one of the few genuinely reliable counterfeit signals available to a buyer.",
        ],
      },
      {
        heading: "What the format cannot tell you",
        body: [
          "A 4-digit code carries a single year digit and therefore repeats every ten years. The decoder assumes the recent decade.",
          "Because the houses publish nothing, we are reading a pattern, not a documented standard. Older stock and some regional codes do not follow it and will not decode — that is a limitation of the format, not a sign the product is fake.",
          "The date is the manufacture date. Fragrance is more forgiving than skincare: kept away from light and heat, an unopened bottle is typically good for around five years, and many improve for the first year in the bottle.",
        ],
      },
    ],
    faq: [
      {
        q: "Does Chanel really not have a batch code system?",
        a: "Chanel has never published one. What is verifiable is that current Chanel products carry a readable production date in the code, and that is what we decode — labelled as a medium-confidence read, because there is no official scheme to check it against.",
      },
      {
        q: "My Dior code has letters and won't decode.",
        a: "The decoder needs a run of 4 to 6 digits. Some older Dior codes are alphanumeric internal references with no date. Those genuinely cannot be decoded — check for a printed expiry date instead.",
      },
      {
        q: "Which brands does this cover?",
        a: "Dior, Guerlain, Givenchy Beauty, Kenzo Parfums, Loewe Perfumes, Acqua di Parma, Maison Francis Kurkdjian, Maison Margiela, Fresh, Benefit — plus Chanel, and other houses that print the date rather than encode it.",
      },
    ],
  },

  /* ------------------------------------------------------ Inter Parfums -- */
  {
    slug: "inter-parfums-batch-code-format",
    decoderIds: ["interparfums"],
    title: "Inter Parfums Batch Codes: Year Letter + Julian Day",
    description:
      "Montblanc, Jimmy Choo, Coach, Van Cleef & Arpels, Boucheron and Karl Lagerfeld fragrances share one licensed manufacturer — and one 9-character code.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "08J38J169",
      parts: [
        { chars: "08", means: "Internal reference — no date information" },
        { chars: "J", means: "Production year, from a letter cycle that skips I and O — J = 2019" },
        { chars: "38J", means: "Internal batch / line reference" },
        { chars: "169", means: "Day of the year — day 169 is 18 June" },
      ],
    },
    examples: [
      { code: "08J38J169", note: "The verified reference code: 18 June 2019." },
      { code: "12M44K210", note: "Year letter M, day 210." },
    ],
    sections: [
      {
        heading: "Why so many unrelated brands share a code",
        body: [
          "Montblanc, Jimmy Choo, Coach, Van Cleef & Arpels, Boucheron, Karl Lagerfeld, Kate Spade, Ferragamo, Moncler, Guess, Abercrombie & Fitch and Dunhill have nothing in common as fashion houses. They have everything in common as fragrances: Inter Parfums holds the licence and manufactures all of them.",
          "That is the single most useful fact about batch codes generally. The format follows the factory, not the logo on the bottle. If you know who actually makes a fragrance, you know how to read its code.",
        ],
      },
      {
        heading: "How the code is built",
        body: [
          "The code runs to about nine characters. The first letter in it is the production year, on an annual cycle that skips I and O — the two letters most easily misread as 1 and 0. That puts J at 2019, K at 2020, L at 2021, M at 2022, N at 2023, P at 2024, Q at 2025 and R at 2026.",
          "The last three digits are the day of that year. Everything in between is internal batch and line reference, and can be ignored.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Find the first letter. Count from J = 2019 forward, skipping I and O.",
          "- Take the final three digits as the day of the year and convert: divide by 30.4 for a rough month.",
          "- If the final three digits are over 366, this is not the day — on a minority of Inter Parfums codes those digits are a factory line. Treat the result as approximate in that case.",
        ],
      },
      {
        heading: "Where it's printed",
        body: [
          "Box base, and on a sticker or direct print on the underside of the bottle. Inter Parfums codes are usually printed in black on the white base sticker and are among the easier fragrance codes to read without a magnifier.",
        ],
      },
    ],
    faq: [
      {
        q: "Why skip I and O?",
        a: "Because a stamped I is indistinguishable from a 1 and an O from a 0 on a low-contrast print. Several manufacturers — Creed among them — skip the same two letters for the same reason.",
      },
      {
        q: "The last three digits give a date that seems wrong.",
        a: "On some codes those digits are a line number, not a day. If the decoded date is implausible for the bottle, that is likely what happened. The year letter is the more reliable half of the code.",
      },
    ],
  },

  /* -------------------------------------------------------------- Creed -- */
  {
    slug: "creed-batch-code-format",
    decoderIds: ["creed"],
    title: "Creed Batch Codes: One Letter, One Year",
    description:
      "A Creed batch code encodes the production year in its first letter and nothing else. Here's the full letter table and what the code cannot tell you.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "N1234",
      parts: [
        { chars: "N", means: "Production year — the letter cycle starts at A = 2010 and skips I and O, so N = 2022" },
        { chars: "1234", means: "Internal batch series — no date information" },
      ],
    },
    examples: [
      { code: "N1234", note: "Year letter N — 2022." },
      { code: "Q5501", note: "Year letter Q — two years later." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Creed's code is the simplest in this reference and the least informative. The first letter is the production year, counting from A = 2010, skipping I and O to avoid confusion with 1 and 0. That makes N = 2022, P = 2023, Q = 2024, R = 2025.",
          "Nothing else in the code is a date. The month is not encoded at all. A Creed code tells you the year the juice was bottled and stops there.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Take the first letter of the code.",
          "- Count from A = 2010, skipping I and O: A 2010, B 2011, C 2012, D 2013, E 2014, F 2015, G 2016, H 2017, J 2018, K 2019, L 2020, M 2021, N 2022, P 2023, Q 2024, R 2025.",
          "- That's it. There is no month to extract.",
        ],
      },
      {
        heading: "Why the year alone is usually enough",
        body: [
          "Fragrance is the one cosmetic category where a year of imprecision barely matters. A sealed Creed, stored away from sunlight and radiators, is typically fine for years — and the house's own reputation rests on juice that matures rather than spoils.",
          "Where the year does matter is provenance. Creed is among the most counterfeited fragrance houses in the world, and a batch code whose first letter is not in the cycle at all is a straightforward tell.",
        ],
      },
    ],
    faq: [
      {
        q: "My Creed code starts with a number.",
        a: "The decoder looks for the first letter anywhere in the code, so a leading digit is not a problem. If there is no letter at all, the code is not a Creed year code.",
      },
      {
        q: "Can I get the month from the rest of the code?",
        a: "No. The remaining characters are an internal batch series. Anyone claiming to derive a month from them is guessing.",
      },
    ],
  },

  /* --------------------------------------------------------------- P&G -- */
  {
    slug: "procter-gamble-batch-code-format",
    decoderIds: ["pg"],
    title: "Procter & Gamble Batch Codes: The Julian Date",
    description:
      "Olay, Pantene, Head & Shoulders, Old Spice and Herbal Essences all carry a Julian production date. Three code lengths, one rule.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "2026032",
      parts: [
        { chars: "2026", means: "Production year in full — unambiguous" },
        { chars: "032", means: "Day of that year — day 32 is 1 February" },
      ],
    },
    examples: [
      { code: "2026032", note: "The 7-digit form: full year, then day. No ambiguity at all." },
      { code: "6099", note: "The 4-digit form: one year digit, then day 099." },
      { code: "24045", note: "The 5-digit form: two year digits, then day 045." },
    ],
    sections: [
      {
        heading: "One rule, three lengths",
        body: [
          "A Julian date is just a day number: 1 January is day 001, 31 December is day 365 (366 in a leap year). Procter & Gamble prints that day number together with the year, and the only thing that changes between products is how much of the year they print.",
          "The seven-digit form spells the year out in full — 2026032 is the 32nd day of 2026, 1 February — and is the one to hope for, because it cannot be misread. The five-digit form uses two year digits. The four-digit form uses one, and inherits the decade ambiguity that comes with it.",
          "The decoder tries all three and prefers the longest, most specific reading it can find, because more digits of year means less guessing.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Split the code into year digits and a 3-digit day. The day is always the last three.",
          "- Convert the day: divide by about 30.4 and round up for the month. Day 099 ÷ 30.4 ≈ 3.3, so early in the 4th month, April.",
          "- If the year is a single digit, assume the most recent year ending in it unless the bottle looks a decade old.",
        ],
      },
      {
        heading: "Where P&G prints it",
        body: [
          "Usually inkjet-printed on the bottle's shoulder, on the back label, or on the crimp of a tube — grey or black ink on plastic, often at an angle. On aerosols such as Old Spice and Secret it is stamped into the base of the can.",
          "P&G products are mass-market and turn over quickly, so a code that decodes to more than two or three years ago on a shop shelf is unusual and worth a second look at the retailer.",
        ],
      },
    ],
    faq: [
      {
        q: "Which brands does this cover?",
        a: "Olay, Pantene, Head & Shoulders, Herbal Essences, Old Spice, Secret, Aussie, Native and the rest of P&G's beauty and grooming lines.",
      },
      {
        q: "Is the Julian day the same as the date on a food product?",
        a: "It's the same idea, and the same format many food and pharmaceutical manufacturers use. Once you can read a Julian date you can read a great many industrial codes.",
      },
    ],
  },

  /* ---------------------------------------------------------- Kenvue/J&J -- */
  {
    slug: "kenvue-batch-code-format",
    decoderIds: ["kenvue"],
    title: "Neutrogena, Aveeno and RoC Batch Codes: The Day Comes First",
    description:
      "Kenvue (formerly Johnson & Johnson consumer health) prints a Julian date backwards compared with most of the industry — day first, then year.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "12324",
      parts: [
        { chars: "123", means: "Day of the year — day 123 is 2 May" },
        { chars: "24", means: "Production year — 2024" },
      ],
    },
    examples: [
      { code: "12324", note: "Day 123, year 24 — 2 May 2024." },
      { code: "3654", note: "The short form: day 365, year digit 4 — the last day of the year." },
    ],
    sections: [
      {
        heading: "The same digits, the opposite order",
        body: [
          "Coty writes the year first and the day second. Kenvue does the reverse: the day of the year comes first, then the year. The digits look almost identical, which is exactly why reading a Neutrogena code with Coty's rule produces a confident, wrong answer.",
          "This is the strongest argument for knowing who manufactures a product before decoding its code. 12324 is day 123 of 2024 under Kenvue's rule and an impossible day 232 under Coty's. Sometimes the wrong rule produces a plausible-looking date rather than an obviously broken one — and then you have no way of knowing you got it wrong.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Take the first three digits as the day of the year (001–366).",
          "- Take what remains as the year: two digits is a full year (24 = 2024), one digit is the last digit of the year.",
          "- Convert the day to a month by dividing by roughly 30.4.",
        ],
      },
      {
        heading: "Where Kenvue prints it",
        body: [
          "On the crimp of the tube, the base of the bottle, or the back of the carton — usually inkjet, black on white. Neutrogena sunscreens also carry an explicit expiry date, which is required for sunscreens in most markets and should always take precedence over a decoded estimate.",
        ],
      },
    ],
    faq: [
      {
        q: "Does sunscreen really expire?",
        a: "Yes, and unlike most cosmetics it is legally required to say so. The UV filters degrade; an expired sunscreen protects less than the label claims. Use the printed expiry date, not the batch code.",
      },
      {
        q: "Kenvue or Johnson & Johnson?",
        a: "Same products. J&J spun off its consumer-health division as Kenvue in 2023; the codes did not change.",
      },
    ],
  },

  /* ----------------------------------------------------------- Unilever -- */
  {
    slug: "unilever-batch-code-format",
    decoderIds: ["unilever"],
    title: "Unilever Batch Codes (YDDD): Dove, Axe, Rexona, Vaseline",
    description:
      "Unilever's personal-care lines use a 4–5 character code: year digit, day of the year, and an optional plant letter.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "6120X",
      parts: [
        { chars: "6", means: "Last digit of the production year — 2026" },
        { chars: "120", means: "Day of that year — day 120 is 30 April" },
        { chars: "X", means: "Plant / production line — no date information" },
      ],
    },
    examples: [
      { code: "6120X", note: "Day 120 of a year ending in 6, made on line X." },
      { code: "5301", note: "The same format without a plant letter." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Unilever's mass personal-care products — Dove, Axe, Rexona, Vaseline, Sunsilk, TRESemmé, Simple, Pond's, St. Ives — use the same year-digit-plus-Julian-day pattern as Coty, with an optional trailing letter for the plant or line.",
          "The first digit is the last digit of the year. The next three are the day of that year. A trailing letter, where present, is the production line and carries no date.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First digit: the year's last digit. Pick the most recent year ending in it.",
          "- Next three digits: the day of the year. Divide by about 30.4 for the month.",
          "- Ignore any trailing letters.",
        ],
      },
      {
        heading: "The exception worth knowing",
        body: [
          "A minority of Unilever skincare plants use a month-letter-first variant rather than this format. Our decoder does not read those — it would have to guess, and guessing a date is worse than saying nothing.",
          "If a Unilever code starts with a letter rather than a digit, you are looking at that variant. Check the pack for a printed best-before date instead.",
        ],
      },
    ],
    faq: [
      {
        q: "Does deodorant really have a shelf life?",
        a: "An unopened antiperspirant is typically good for around three years; the active salts and fragrance degrade slowly. It is one of the more forgiving categories.",
      },
      {
        q: "My Dove bottle has two codes.",
        a: "Common on bottles that are moulded in one plant and filled in another. The batch code is the inkjet-printed one, not the moulded number in the plastic.",
      },
    ],
  },

  /* ------------------------------------------------------------- K-beauty -- */
  {
    slug: "korean-batch-code-format",
    decoderIds: ["kbeauty"],
    title: "Korean Beauty Batch Codes: The Manufacture Date, Printed Plainly",
    description:
      "K-beauty barely uses ciphers. Korean law requires the manufacture date on the pack, and the batch code usually starts with it — COSRX, Laneige, Innisfree, Beauty of Joseon and 40 more.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "231122B",
      parts: [
        { chars: "23", means: "Production year — 2023" },
        { chars: "11", means: "Month — November" },
        { chars: "22", means: "Day of the month" },
        { chars: "B", means: "Production line — no date information" },
      ],
    },
    examples: [
      { code: "20260118", note: "The 8-digit form: full year, month, day." },
      { code: "231122B", note: "The 6-digit form with a line letter: 22 November 2023." },
    ],
    sections: [
      {
        heading: "Why Korean codes are the easiest to read",
        body: [
          "Korea's regulator requires the manufacture date (제조) on cosmetic packaging. Manufacturers comply by printing it, and their batch codes generally lead with the same date rather than encoding it — as YYYYMMDD, YYMMDD, or occasionally YYMM followed by a line letter.",
          "So a K-beauty code is usually not a code at all. It is a date, in the order the rest of the world writes dates, with a letter stuck on the end.",
          "Many Korean packs also print the date in plain text next to the 제조 marking, or print a 까지 (\"until\") date, which is an expiry rather than a manufacture date. If both appear, the 까지 date is the one to trust.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- Eight leading digits: read them as year, month, day — 20260118 is 18 January 2026.",
          "- Six leading digits: two-digit year, month, day — 231122 is 22 November 2023.",
          "- Any trailing letters are the production line. Ignore them.",
        ],
      },
      {
        heading: "Where Korean brands print it",
        body: [
          "On the bottom of the tube or jar, on the crimp, or on the back of the carton — often alongside the 제조 label. Korean packaging is generally more forthcoming about dates than Western packaging, which is one reason K-beauty is easy to buy safely second-hand.",
        ],
      },
    ],
    faq: [
      {
        q: "What does 제조 mean?",
        a: "\"Manufactured\". The date next to it is the production date. 까지 means \"until\" and marks an expiry date instead.",
      },
      {
        q: "Which brands does this cover?",
        a: "COSRX, Laneige, Innisfree, Beauty of Joseon, Anua, Round Lab, SKIN1004, Missha, Etude, Sulwhasoo, Hera, Dr. Ceuracle and the rest of the Amorepacific and LG H&H stables, among others.",
      },
      {
        q: "My code decodes to a date a few months in the future.",
        a: "The decoder rejects future dates. If you are reading by hand and land in the future, you have probably read a day-month pair the wrong way round.",
      },
    ],
  },

  /* ---------------------------------------------------------- Beiersdorf -- */
  {
    slug: "beiersdorf-batch-code-format",
    decoderIds: ["beiersdorf"],
    title: "NIVEA, Eucerin and Labello Batch Codes: Year + Week",
    description:
      "Beiersdorf is one of the few manufacturers to encode the production week rather than the day. Here's how its 8-digit code works.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "8153554",
      parts: [
        { chars: "8", means: "Last digit of the production year — 2018" },
        { chars: "15", means: "Week of that year — week 15 falls in April" },
        { chars: "3554", means: "Internal batch reference — no date information" },
      ],
    },
    examples: [
      { code: "8153554", note: "Week 15 of a year ending in 8." },
      { code: "63450108", note: "The full 8-digit form, sometimes followed by two plant letters." },
    ],
    sections: [
      {
        heading: "Weeks, not days",
        body: [
          "Beiersdorf — NIVEA, Eucerin, Labello — is unusual in encoding the production week. The first digit is the last digit of the year; the next two are the week number, from 01 to 53.",
          "That gives you the date to within seven days, which for a body lotion or lip balm is precision to spare. The remaining digits are an internal batch reference.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First digit: last digit of the year.",
          "- Next two digits: the week number. Multiply by 7 to get a rough day of the year — week 15 is around day 105, so early April.",
          "- Ignore the rest of the code and any trailing letters.",
        ],
      },
      {
        heading: "Where Beiersdorf prints it",
        body: [
          "On the crimp of a tube (Labello, NIVEA hand cream), on the base of a tin (the classic NIVEA Creme tin has it stamped in the metal), or on the back of the carton. Eucerin, sold through pharmacies, usually carries an explicit expiry date as well — prefer that.",
        ],
      },
    ],
    faq: [
      {
        q: "Week 53?",
        a: "Valid. Some years have 53 ISO weeks. A code claiming week 54 or higher is not a Beiersdorf week code.",
      },
      {
        q: "The NIVEA tin has no printed code.",
        a: "It is stamped into the metal of the base rather than printed. Tilt it against a light — embossed codes are almost invisible under direct light.",
      },
    ],
  },

  /* --------------------------------------------------------------- NAOS -- */
  {
    slug: "bioderma-batch-code-format",
    decoderIds: ["naos"],
    title: "Bioderma Batch Codes (DDDY): Day First, Year Last",
    description:
      "Bioderma's code puts the day of the year before the year digit — the mirror image of Coty's. And most Bioderma packs print an expiry date anyway.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "29682",
      parts: [
        { chars: "296", means: "Day of the year — day 296 is 23 October" },
        { chars: "8", means: "Last digit of the production year — 2018" },
        { chars: "2", means: "Internal reference" },
      ],
    },
    examples: [
      { code: "29682", note: "Day 296, year digit 8 — 23 October 2018." },
      { code: "0455", note: "Day 045, year digit 5." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Bioderma, owned by NAOS, writes the day of the year first — three digits, 001 to 366 — followed by the last digit of the production year. It is the exact reverse of Coty's YDDD, and reading one with the other's rule gives a wrong answer that looks right.",
          "Fortunately Bioderma makes the point moot on most products by printing an explicit expiry date on the pack. When a real expiry date exists, no decoding is needed and none should be trusted over it.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First three digits: the day of the year. Divide by about 30.4 for the month.",
          "- Fourth digit: the last digit of the year.",
          "- Then check the pack for a printed expiry date, which supersedes all of the above.",
        ],
      },
    ],
    faq: [
      {
        q: "Does micellar water go off?",
        a: "It has preservatives and a long shelf life, but it is water-based, and water-based products are the ones that actually spoil. Once opened, follow the PAO symbol.",
      },
    ],
  },

  /* ------------------------------------------------------------- Deciem -- */
  {
    slug: "the-ordinary-batch-code-format",
    decoderIds: ["deciem"],
    title: "The Ordinary Batch Codes: Year Digit + Month Letter",
    description:
      "Deciem's newer codes encode a year and a month letter — and its older four-character codes cannot be decoded by anyone. Here's how to tell them apart.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "4A01",
      parts: [
        { chars: "4", means: "Last digit of the production year — 2024" },
        { chars: "A", means: "Month letter: A = January … L = December" },
        { chars: "01", means: "Production line — no date information" },
      ],
    },
    examples: [
      { code: "4A01", note: "January 2024." },
      { code: "5F02", note: "F is the 6th letter — June." },
    ],
    sections: [
      {
        heading: "Two generations of code",
        body: [
          "Deciem's newer batch codes start with a year digit, then a month letter running A for January through L for December, then a line number. 4A01 is January 2024.",
          "The older four-character codes — TGD1, 1dg1 and similar — use an internal system Deciem has never published. They are not decodable, by us or by anyone else, and any site claiming to decode them is inventing the answer. On those products, use the printed best-before date.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First character a digit and second a letter A–L? Newer format. The digit is the year, the letter is the month.",
          "- Anything else — letters first, mixed case, no leading digit — is the old format. Don't try to decode it.",
        ],
      },
      {
        heading: "Why we stop at the month",
        body: [
          "The trailing digits are ambiguous: some sources read them as a day of the month, others as a production line. We decode to the month rather than pick one and present a guessed day as fact. An unopened Ordinary serum has roughly a three-year shelf life, so a fortnight of imprecision changes nothing that matters.",
        ],
      },
    ],
    faq: [
      {
        q: "Does vitamin C from The Ordinary really go off faster?",
        a: "Pure L-ascorbic acid oxidises — that is what the yellow-to-brown colour shift tells you. Once it has turned, potency is gone regardless of what the batch code says.",
      },
    ],
  },

  /* ----------------------------------------------------------- Shiseido -- */
  {
    slug: "shiseido-batch-code-format",
    decoderIds: ["shiseido"],
    title: "Shiseido Batch Codes (YDDD): Year Digit + Julian Day",
    description:
      "Shiseido and its houses print the year digit first and the day of the year second, followed by plant letters.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "5029KG",
      parts: [
        { chars: "5", means: "Last digit of the production year — 2025" },
        { chars: "029", means: "Day of that year — day 29 is 29 January" },
        { chars: "KG", means: "Plant / line letters — no date information" },
      ],
    },
    examples: [
      { code: "5029KG", note: "Day 29 of 2025 — 29 January 2025." },
      { code: "8233", note: "The bare 4-digit form: day 233 of a year ending in 8." },
    ],
    sections: [
      {
        heading: "How the code is built",
        body: [
          "Shiseido uses the year-digit-then-Julian-day pattern, optionally followed by letters identifying the plant and line. The date is precise to the day.",
          "Japanese cosmetics regulation requires a printed expiry date on any product whose unopened shelf life is under three years. In practice that means most Shiseido skincare carries a date on the pack — the batch code is a cross-check, not the only source.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First digit: last digit of the year.",
          "- Next three: day of the year. Divide by about 30.4 for the month.",
          "- Trailing letters: plant and line. Ignore.",
        ],
      },
    ],
    faq: [
      {
        q: "Which brands does this cover?",
        a: "Shiseido, Clé de Peau Beauté, NARS, IPSA, Elixir, Anessa and the group's other houses.",
      },
    ],
  },

  /* -------------------------------------------------------------- Rohto -- */
  {
    slug: "rohto-batch-code-format",
    decoderIds: ["rohto"],
    title: "Rohto Batch Codes: Year Digit + Month Letter (Unofficial)",
    description:
      "Hada Labo, Melano CC, OXY and Sunplay follow an observed year-digit-plus-month-letter pattern that Rohto has never confirmed. We decode it, and we say so.",
    updated: "2026-07-12",
    readMinutes: 4,
    anatomy: {
      code: "6C2",
      parts: [
        { chars: "6", means: "Last digit of the production year — 2026" },
        { chars: "C", means: "Month letter: A = January … L = December, so C = March" },
        { chars: "2", means: "Production line — no date information" },
      ],
    },
    examples: [
      { code: "6C2", note: "March 2026." },
      { code: "5H1", note: "H is the 8th letter — August 2025." },
    ],
    sections: [
      {
        heading: "An observed pattern, not a published one",
        body: [
          "Rohto has never published a batch-code scheme. What exists is a pattern documented by the community across many products: a year digit, a month letter running A for January through L for December, then a line digit.",
          "We decode it, and we label the result low-confidence — because it is a reading of a pattern rather than an application of a documented rule. That distinction matters more than a confident answer does.",
        ],
      },
      {
        heading: "Reading one by hand",
        body: [
          "- First character: the year's last digit.",
          "- Second character: the month letter. A is January and L is December — all twelve letters are used, with no skips.",
          "- The result is a month, not a day.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I trust this date?",
        a: "Treat it as approximate. If the product carries a printed expiry date — many Japanese products do — use that instead.",
      },
    ],
  },

  /* ------------------------------------------------------------- Julian -- */
  {
    slug: "julian-date-codes",
    decoderIds: ["julian"],
    title: "Julian Date Codes: The Industry's Default",
    description:
      "Most manufacturers with no proprietary cipher simply print the date — as a Julian day number or a packed calendar date. This is the fallback our decoder uses when a brand has no scheme of its own.",
    updated: "2026-07-12",
    readMinutes: 5,
    anatomy: {
      code: "24045",
      parts: [
        { chars: "24", means: "Production year — 2024" },
        { chars: "045", means: "Day of that year — day 45 is 14 February" },
      ],
    },
    examples: [
      { code: "24045", note: "Two year digits, then the day — the most common form." },
      { code: "231122", note: "A packed calendar date: 22 November 2023." },
    ],
    sections: [
      {
        heading: "What a Julian date is",
        body: [
          "A Julian date, in manufacturing, is just the day's number in the year: 001 for 1 January, 032 for 1 February, 365 for 31 December in a common year. It exists because a three-digit day number is compact, unambiguous across languages, and trivially machine-readable — the same reasons food, pharmaceutical and automotive plants use it.",
          "Printed with a year, it fully specifies a date. The variations are only in the order and in how many year digits get printed: YYDDD, DDDYY, YYMMDD, DDMMYY.",
        ],
      },
      {
        heading: "Converting a day number in your head",
        body: [
          "- Divide by 30.4 and round up. Day 045 ÷ 30.4 ≈ 1.5, so the 2nd month, February.",
          "- Month starts, roughly: Jan 001, Feb 032, Mar 060, Apr 091, May 121, Jun 152, Jul 182, Aug 213, Sep 244, Oct 274, Nov 305, Dec 335. Add one to each from March onwards in a leap year.",
        ],
      },
      {
        heading: "When we use this reader",
        body: [
          "This is the fallback. When a brand has no manufacturer-specific decoder — or when its own decoder fails on a code — the engine tries to read a date embedded in the digits and reports what it found, along with the interpretation it used.",
          "If more than one interpretation is possible, it says so. A code like 120312 is a valid date read three different ways, and no amount of cleverness resolves it without knowing who made the product. That is a limitation we surface rather than hide.",
        ],
      },
    ],
    faq: [
      {
        q: "Why doesn't every brand just print the date in plain English?",
        a: "Some do, and it is the honest thing to do. Batch codes exist for recalls and quality control, not for consumers — the fact they encode a date at all is incidental. Korean regulation forces the issue; most others don't.",
      },
      {
        q: "My code doesn't decode at all.",
        a: "Then it probably has no date in it. Some manufacturers use a pure sequence number. Check the pack for a printed expiry date, and use the PAO symbol for the period after opening.",
      },
    ],
  },
];

const BY_SLUG = new Map(DECODER_GUIDES.map((g) => [g.slug, g]));
/** decoder id (incl. aliases) -> the guide page that documents it. */
const BY_DECODER_ID = new Map<string, DecoderGuide>();
for (const g of DECODER_GUIDES) {
  for (const id of g.decoderIds) BY_DECODER_ID.set(id, g);
}

export function getDecoderGuide(slug: string): DecoderGuide | undefined {
  return BY_SLUG.get(slug);
}

/** The guide documenting a brand's decoder, if we have one. */
export function guideForBrand(brand: Brand): DecoderGuide | undefined {
  return brand.decoderId ? BY_DECODER_ID.get(brand.decoderId) : undefined;
}

/** Public brands whose codes this guide explains, alphabetically. */
export function brandsForGuide(guide: DecoderGuide): Brand[] {
  return BRANDS.filter(
    (b) => b.decoderId && guide.decoderIds.includes(b.decoderId),
  ).sort((a, z) => a.name.localeCompare(z.name));
}
