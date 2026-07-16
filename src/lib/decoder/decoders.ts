import type { Decoder, DecodeAttempt, DecodeContext } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

const clean = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Resolve a single-digit year to the most recent plausible full year. */
function resolveYearDigit(digit: number, now: Date): number {
  const currentYear = now.getFullYear();
  const currentDecadeBase = Math.floor(currentYear / 10) * 10;
  let year = currentDecadeBase + digit;
  // If that lands in the future, step back a decade.
  if (year > currentYear) year -= 10;
  return year;
}

/**
 * Resolve a two-digit year (00-99) to a full 2000s year. We never fall back to
 * the 1900s: cosmetics batch codes in scope are all post-2000, and mapping a
 * "future" 2-digit year to the 1900s produced absurd dates (e.g. yy=67 -> 1967).
 * A year that lands in the future is instead rejected by the caller's inFuture
 * guard, which correctly discards the bogus interpretation.
 */
function resolveYear2(yy: number): number {
  return 2000 + yy;
}

/** Day-of-year (1-366) -> Date. */
function dateFromDayOfYear(year: number, doy: number): Date {
  // JavaScript silently rolls day 366 of a non-leap year into 1 January of the
  // next year. Return an invalid date instead so every existing caller rejects
  // the impossible production day through the shared inFuture guard.
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (doy < 1 || doy > (leap ? 366 : 365)) return new Date(Number.NaN);
  const d = new Date(Date.UTC(year, 0, 1));
  d.setUTCDate(doy);
  return d;
}

function inFuture(date: Date, now: Date): boolean {
  if (!Number.isFinite(date.getTime())) return true;
  return date.getTime() > now.getTime() + 1000 * 60 * 60 * 24;
}

/* -------------------------------------------------------------------------- */
/*  Estée Lauder companies                                                    */
/*  Format: <plant><month><year>  e.g. "A56"                                  */
/*  month: 1-9 => Jan-Sep, A/B/C => Oct/Nov/Dec.  year: last digit.           */
/*  (Clinique, MAC, Aveda, Bobbi Brown, La Mer, Jo Malone, Tom Ford, Origins) */
/* -------------------------------------------------------------------------- */

const esteeLauder: Decoder = {
  id: "estee-lauder",
  label: "Estée Lauder plant / month / year",
  explanation:
    "Estée Lauder group codes are 3 characters: the first is the manufacturing plant, the second is the month (1–9 = January–September, A/B/C = October–December), and the third is the last digit of the year.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    if (c.length < 3 || c.length > 4) return null;
    // plant, month, year — plant may be 1 char (sometimes 2 letters exist, take last 2 as m/y)
    const monthChar = c[c.length - 2];
    const yearChar = c[c.length - 1];
    if (!/[0-9]/.test(yearChar)) return null;

    let month: number | null = null;
    if (/[1-9]/.test(monthChar)) month = Number(monthChar);
    else if (monthChar === "A") month = 10;
    else if (monthChar === "B") month = 11;
    else if (monthChar === "C") month = 12;
    if (month === null) return null;

    const year = resolveYearDigit(Number(yearChar), ctx.now);
    // Guard against future codes using the first of the month, not mid-month —
    // otherwise a product made in the current month fails to decode early in
    // the month (day-15 estimate would look like a future date).
    const guardDate = new Date(Date.UTC(year, month - 1, 1));
    if (inFuture(guardDate, ctx.now)) return null;
    const date = new Date(Date.UTC(year, month - 1, 15));

    return {
      // Single-digit year is inherently ambiguous by a decade, so this is a
      // medium-confidence read rather than high.
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Estée Lauder codes give month precision; day is estimated as mid-month.",
        `The year is a single digit, so it's assumed to be the most recent match (${year}). If the product looks older, it may be from ${year - 10}.`,
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  L'Oréal group                                                             */
/*  6-char code, e.g. 22U401 / 40X200.                                         */
/*    - factory: leading digit(s) before the first letter                      */
/*    - year:    the FIRST letter (annual letter cycle, 'V' is skipped)        */
/*    - month:   the character right after it (1-9 = Jan-Sep, O/N/D = Oct/Nov/Dec) */
/*    - rest:    production batch series (no meaning for shelf life)            */
/*  Covers 35+ brands sharing L'Oréal factories (L'Oréal Paris, Maybelline,    */
/*  Garnier, NYX, Lancôme, Kiehl's, Vichy, La Roche-Posay, CeraVe, YSL…).       */
/* -------------------------------------------------------------------------- */

// Annual cycle: full alphabet with 'V' removed (25 letters). Anchor: Z = 2025.
const LOREAL_YEAR_LETTERS = "ABCDEFGHIJKLMNOPQRSTUWXYZ";

function lorealYear(letter: string, now: Date): number | null {
  const i = LOREAL_YEAR_LETTERS.indexOf(letter);
  if (i === -1) return null;
  const cycle = LOREAL_YEAR_LETTERS.length; // 25-year cycle
  const base = 2001 + i; // A=2001 … T=2020 … Z=2025 (then A wraps to 2026)
  const currentYear = now.getFullYear();
  let year = base + Math.floor((currentYear - base) / cycle) * cycle;
  if (year > currentYear) year -= cycle;
  return year;
}

function lorealMonth(ch: string): number | null {
  if (ch >= "1" && ch <= "9") return Number(ch);
  if (ch === "O") return 10; // October
  if (ch === "N") return 11; // November
  if (ch === "D") return 12; // December
  return null;
}

const loreal: Decoder = {
  id: "loreal",
  label: "L'Oréal factory / year-letter / month",
  explanation:
    "L'Oréal group codes are usually 6 characters (e.g. 22U401). The leading digits are the factory, the first letter is the production year (an annual letter cycle where 'V' is skipped, so U = 2021, W = 2022, X = 2023…), and the character right after it is the month (1–9 = January–September, O/N/D = October/November/December). The last three characters are the production batch and have no bearing on shelf life.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    if (c.length < 3) return null;
    for (let i = 0; i <= c.length - 2; i++) {
      const ch = c[i];
      if (!/[A-Z]/.test(ch)) continue; // year is the first letter
      const year = lorealYear(ch, ctx.now);
      if (year === null) continue;
      const month = lorealMonth(c[i + 1]);
      if (month === null) continue;
      // The returned day is an explicit midpoint estimate. Guard with the first
      // of the month so a valid current-month code works before day 15.
      const guardDate = new Date(Date.UTC(year, month - 1, 1));
      if (inFuture(guardDate, ctx.now)) continue;
      const date = new Date(Date.UTC(year, month - 1, 15));
      return {
        manufactureDate: date,
        confidence: "high",
        method: this.label,
        notes: [
          "L'Oréal codes give month precision; the day is estimated as mid-month.",
          "This is the manufacture date. Once the product is opened, the PAO symbol (the open-jar icon, e.g. 12M / 24M) determines how long it stays good — regardless of how fresh the batch is.",
        ],
      };
    }
    return null;
  },
};

/* -------------------------------------------------------------------------- */
/*  Coty group                                                                */
/*  4-digit code YDDD, printed on the box base / bottle-base sticker.           */
/*    - digit 1: last digit of the production year                              */
/*    - digits 2-4: Julian day-of-year (001-366)                                */
/*  e.g. 4135 => 2024, day 135 => 14 May 2024.                                  */
/*  (Rimmel, Bourjois, Sally Hansen, CK, Hugo Boss, Gucci, Burberry, adidas…)   */
/* -------------------------------------------------------------------------- */

const coty: Decoder = {
  id: "coty",
  label: "Coty year-digit + Julian day (YDDD)",
  explanation:
    "Coty fragrances carry a 4-digit code (e.g. 4135) on the box base or the clear sticker under the bottle. The first digit is the last digit of the production year, and the remaining three are the day of that year — so 4135 is the 135th day of 2024, i.e. 14 May 2024.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    // Isolate a 4-digit group (ignore surrounding letters/other batch marks).
    const m = c.match(/\d{4}/);
    if (!m) return null;
    const d = m[0];
    const year = resolveYearDigit(Number(d[0]), ctx.now);
    const doy = Number(d.slice(1));
    if (doy < 1 || doy > 366) return null;
    const date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) return null;

    return {
      // Day-of-year is precise, but the single-digit year is ambiguous by a
      // decade, so overall confidence is medium.
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Coty codes give the day precisely (year digit + day-of-year), but the year is a single digit.",
        `The year is assumed to be the most recent match (${year}). If the product looks older, it may be from ${year - 10}.`,
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M / 24M) determines how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Shared "date embedded in code" reader                                     */
/*  Used by luxury houses (Chanel, Dior/LVMH) that print a production date     */
/*  rather than a proprietary cipher. Tries, in order:                         */
/*    YDDD (4)  -> year digit + day-of-year                                     */
/*    YYDDD (5) -> 2-digit year + day-of-year                                   */
/*    YYMMDD (6)-> packed calendar date                                         */
/* -------------------------------------------------------------------------- */

function readEmbeddedDate(
  code: string,
  now: Date,
): { date: Date; method: string } | null {
  const c = clean(code);
  const m = c.match(/\d{4,6}/) ?? c.match(/\d{4}/);
  if (!m) return null;
  const digits = m[0];
  const cands: { date: Date; method: string; rank: number }[] = [];

  // 4-digit YDDD
  if (digits.length >= 4) {
    const d4 = digits.slice(0, 4);
    const year = resolveYearDigit(Number(d4[0]), now);
    const doy = Number(d4.slice(1));
    if (doy >= 1 && doy <= 366) {
      const date = dateFromDayOfYear(year, doy);
      if (!inFuture(date, now))
        cands.push({ date, method: "year digit + Julian day (YDDD)", rank: 2 });
    }
  }
  // 5-digit YYDDD
  if (digits.length >= 5) {
    const yy = Number(digits.slice(0, 2));
    const doy = Number(digits.slice(2, 5));
    if (doy >= 1 && doy <= 366) {
      const date = dateFromDayOfYear(resolveYear2(yy), doy);
      if (!inFuture(date, now))
        cands.push({ date, method: "2-digit year + Julian day (YYDDD)", rank: 3 });
    }
  }
  // 6-digit YYMMDD
  if (digits.length >= 6) {
    const yy = Number(digits.slice(0, 2));
    const mo = Number(digits.slice(2, 4));
    const da = Number(digits.slice(4, 6));
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      const date = new Date(Date.UTC(resolveYear2(yy), mo - 1, da));
      if (date.getUTCMonth() === mo - 1 && !inFuture(date, now))
        cands.push({ date, method: "packed date (YYMMDD)", rank: 3 });
    }
  }

  if (!cands.length) return null;
  cands.sort((a, b) => b.rank - a.rank || b.date.getTime() - a.date.getTime());
  return { date: cands[0].date, method: cands[0].method };
}

/* -------------------------------------------------------------------------- */
/*  Chanel                                                                    */
/*  Chanel is independent and does not publish a single date cipher. Modern    */
/*  Chanel products print a production date in the code (year + Julian day),    */
/*  which is what we read. Older/opaque codes may not be decodable.            */
/* -------------------------------------------------------------------------- */

const chanel: Decoder = {
  id: "chanel",
  label: "Chanel production date",
  explanation:
    "Chanel does not publish a fixed batch-code cipher, but current Chanel fragrances, makeup and skincare print the production date in the code — typically the last digit of the year followed by the day of the year (e.g. 4135 = day 135 of 2024). Some older or region-specific codes cannot be decoded automatically.",
  decode(code, ctx): DecodeAttempt | null {
    const r = readEmbeddedDate(code, ctx.now);
    if (!r) return null;
    return {
      // Chanel publishes no scheme and real Chanel codes often do NOT fit a
      // year+day pattern (many return nothing at all). When a code happens to
      // parse as a date it may still be coincidental, so this stays low.
      manufactureDate: r.date,
      confidence: "low",
      method: `${this.label} — ${r.method}`,
      notes: [
        "Chanel does not publish a batch-code scheme, and many genuine Chanel codes do not encode a readable date. This is a best-effort reading of the digits and may not be the true production date — treat it as an estimate only.",
        "This is an estimated manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M / 24M) governs how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Dior / LVMH beauty                                                        */
/*  Modern Dior (since 1998): [year digit][month letter][day/batch], e.g.      */
/*  5H03 = Aug 2015/2025, 9K44 = Oct 2019. The month letter runs A=Jan…M=Dec   */
/*  skipping I. The year digit repeats each decade, so the decade is inferred  */
/*  as the most recent non-future one. The trailing digits are a day OR batch  */
/*  number, so we report month precision. Older/vintage all-digit codes fall   */
/*  through to the embedded-date reader.                                       */
/* -------------------------------------------------------------------------- */

// A=Jan, B=Feb … H=Aug, J=Sep (I skipped), K=Oct, L=Nov, M=Dec.
const DIOR_MONTH_LETTERS = "ABCDEFGHJKLM";

const dior: Decoder = {
  id: "dior",
  label: "Dior / LVMH production code",
  explanation:
    "Modern Dior fragrances and cosmetics (since 1998) use a short code that starts with the last digit of the production year, followed by a letter for the month — A = January through M = December, skipping I. So 5H03 is an August 2015 or 2025 batch and 9K44 is October 2019. The two digits after the month are a day-or-batch number, and because the year is a single digit it repeats every decade, so the exact decade is read from the product itself. Some vintage bottles use a plain 5- or 6-digit date instead.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const now = ctx.now;

    // Modern letter-month code: year digit + month letter + 1-3 day/batch digits.
    const m = c.match(/^(\d)([A-Z])(\d{1,3})$/);
    if (m) {
      const monthIdx = DIOR_MONTH_LETTERS.indexOf(m[2]);
      if (monthIdx !== -1) {
        const month = monthIdx + 1;
        const digit = Number(m[1]);
        // Most recent non-future decade for this year digit.
        let year = -1;
        for (
          let y = Math.floor(now.getUTCFullYear() / 10) * 10 + digit;
          y >= 1990;
          y -= 10
        ) {
          if (!inFuture(new Date(Date.UTC(y, month - 1, 1)), now)) {
            year = y;
            break;
          }
        }
        if (year !== -1) {
          return {
            manufactureDate: new Date(Date.UTC(year, month - 1, 15)),
            confidence: "medium",
            datePrecision: "month",
            method: `${this.label} (year ${year}, month ${month})`,
            notes: [
              "Dior's code gives the year and month; the trailing digits are a day-or-batch number, so only the month is certain.",
              "The year digit repeats every decade — if this bottle is clearly older, subtract ten years.",
              "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) governs how long the product stays good.",
            ],
          };
        }
      }
    }

    // Vintage / all-digit codes: fall back to an embedded production date.
    const r = readEmbeddedDate(code, now);
    if (!r) return null;
    return {
      manufactureDate: r.date,
      confidence: "medium",
      method: `${this.label} — ${r.method}`,
      notes: [
        "This older Dior code carries a production date embedded in the digits.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) governs how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Julian / date-in-code auto-detect                                         */
/*  Handles the most common self-describing formats used across the industry: */
/*    YYDDD, DDDYY, YYMMDD, DDMMYY, MMDDYY, YYWW                              */
/* -------------------------------------------------------------------------- */

const julian: Decoder = {
  id: "julian",
  label: "Julian / calendar date embedded in code",
  explanation:
    "A large share of manufacturers print the date directly in the batch code — either as a Julian date (year + day-of-year, e.g. 24045 = the 45th day of 2024) or as a packed calendar date (YYMMDD / DDMMYY).",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    // Pull the first run of 4-6 digits to interpret.
    const m = c.match(/\d{4,6}/);
    if (!m) return null;
    const digits = m[0];
    const now = ctx.now;

    const candidates: DecodeAttempt[] = [];

    // ---- 5-digit Julian: YYDDD or DDDYY ----
    if (digits.length >= 5) {
      const d5 = digits.slice(0, 5);
      // YYDDD
      const yy1 = Number(d5.slice(0, 2));
      const doy1 = Number(d5.slice(2, 5));
      if (doy1 >= 1 && doy1 <= 366) {
        const year = resolveYear2(yy1);
        const date = dateFromDayOfYear(year, doy1);
        if (!inFuture(date, now))
          candidates.push({
            manufactureDate: date,
            confidence: "medium",
            method: "Julian date (YYDDD)",
          });
      }
      // DDDYY
      const doy2 = Number(d5.slice(0, 3));
      const yy2 = Number(d5.slice(3, 5));
      if (doy2 >= 1 && doy2 <= 366) {
        const year = resolveYear2(yy2);
        const date = dateFromDayOfYear(year, doy2);
        if (!inFuture(date, now))
          candidates.push({
            manufactureDate: date,
            confidence: "low",
            method: "Julian date (DDDYY)",
          });
      }
    }

    // ---- 6-digit packed calendar: YYMMDD / DDMMYY ----
    if (digits.length >= 6) {
      const d6 = digits.slice(0, 6);
      const tryYMD = (y: number, mo: number, da: number, method: string, conf: DecodeAttempt["confidence"]) => {
        if (mo < 1 || mo > 12 || da < 1 || da > 31) return;
        const year = resolveYear2(y);
        const date = new Date(Date.UTC(year, mo - 1, da));
        if (date.getUTCMonth() !== mo - 1) return; // invalid day rollover
        if (!inFuture(date, now))
          candidates.push({ manufactureDate: date, confidence: conf, method });
      };
      tryYMD(Number(d6.slice(0, 2)), Number(d6.slice(2, 4)), Number(d6.slice(4, 6)), "Packed date (YYMMDD)", "medium");
      tryYMD(Number(d6.slice(4, 6)), Number(d6.slice(2, 4)), Number(d6.slice(0, 2)), "Packed date (DDMMYY)", "low");
    }

    if (candidates.length === 0) return null;
    // Prefer highest confidence, then most recent plausible date.
    const rank = { high: 3, medium: 2, low: 1, none: 0 };
    candidates.sort(
      (a, b) =>
        rank[b.confidence] - rank[a.confidence] ||
        (b.manufactureDate!.getTime() - a.manufactureDate!.getTime()),
    );
    const best = candidates[0];
    return {
      ...best,
      method: `${this.label} — read as ${best.method}`,
      notes: [
        "The date was auto-detected from the numeric portion of the code.",
        candidates.length > 1
          ? "Multiple interpretations were possible; the most likely was chosen."
          : "",
      ].filter(Boolean),
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Creed                                                                     */
/*  Two real systems, year-precision only:                                     */
/*   • Classic (2013–2022): [product][YY year][batch], e.g. A4221N01 → 2021,   */
/*     L6622A01B → 2022. The year is the two digits after the 3-char product.  */
/*   • New "F" series (2023+): F + sequence, e.g. F001704, F003235. The F only */
/*     marks the post-2023 generation; the exact year is NOT encoded, so we    */
/*     report 2023 as the earliest bound with a caveat.                        */
/* -------------------------------------------------------------------------- */

const creed: Decoder = {
  id: "creed",
  label: "Creed production code",
  explanation:
    "Creed uses two batch-code systems, and both give the year only — never the month. Classic codes (2013–2022) read as a three-character product id, then the two-digit production year, then the batch series: A4221N01 is a 2021 batch, L6622A01B a 2022 one. From 2023, Creed switched to a simpler code that begins with F followed by a sequence number (F001704, F003235); the F marks the new generation but does not spell out the exact year, so only “2023 or later” is certain.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);

    // Classic 2013–2022: 3-char product ([A-Z]NN) + 2-digit year + letter-led batch.
    const classic = c.match(/^[A-Z]\d{2}(\d{2})[A-Z][A-Z0-9]*$/);
    if (classic) {
      const year = 2000 + Number(classic[1]);
      const date = new Date(Date.UTC(year, 6, 1));
      if (year < 2010 || inFuture(date, ctx.now)) return null;
      return {
        manufactureDate: date,
        confidence: "medium",
        method: `${this.label} (classic ${year})`,
        notes: [
          "Creed's classic code carries the production year (the two digits after the product id) but not the month, so the day shown is a mid-year placeholder.",
          "This is the manufacture year. Once opened, the open-jar (PAO) symbol governs how long the fragrance stays good.",
        ],
      };
    }

    // New F-series (2023+): F + sequence. Year not encoded — report the 2023 floor.
    if (/^F\d{3,6}$/.test(c)) {
      const date = new Date(Date.UTC(2023, 0, 1));
      if (inFuture(date, ctx.now)) return null;
      return {
        manufactureDate: date,
        confidence: "low",
        method: `${this.label} (F-series, 2023+)`,
        notes: [
          "This is Creed's newer F-series code. The F marks the 2023-or-later generation, but the exact year is not encoded — so this is the earliest possible production year, not a precise date. Higher sequence numbers (F003… vs F001…) are later batches.",
          "Once opened, the open-jar (PAO) symbol governs how long the fragrance stays good.",
        ],
      };
    }

    return null;
  },
};

/* -------------------------------------------------------------------------- */
/*  Inter Parfums                                                             */
/*  9-char codes (e.g. 08J38J169) for Montblanc, Jimmy Choo, Coach, Van Cleef  */
/*  & Arpels, Boucheron, Karl Lagerfeld, Kate Spade, Ferragamo, Moncler,       */
/*  Guess, Abercrombie, Dunhill. The first letter is the production year (an    */
/*  annual cycle skipping I and O: J = 2019, K = 2020 … R = 2026); the last     */
/*  three digits are the day of that year. Verified: 08J38J169 = day 169 of     */
/*  2019 = 18 June 2019.                                                        */
/* -------------------------------------------------------------------------- */

// A = 2011 … J = 2019, K = 2020, L = 2021, M = 2022, N = 2023, P = 2024,
// Q = 2025, R = 2026 — I and O removed to avoid confusion with 1 / 0.
const INTERPARFUMS_YEAR_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function interparfumsYear(letter: string, now: Date): number | null {
  const i = INTERPARFUMS_YEAR_LETTERS.indexOf(letter);
  if (i === -1) return null;
  const cycle = INTERPARFUMS_YEAR_LETTERS.length; // 24-year letter cycle
  const base = 2011 + i; // A = 2011 … J = 2019 … R = 2026
  const currentYear = now.getFullYear();
  let year = base + Math.floor((currentYear - base) / cycle) * cycle;
  if (year > currentYear) year -= cycle;
  return year;
}

const interparfums: Decoder = {
  id: "interparfums",
  label: "Inter Parfums year letter + Julian day",
  explanation:
    "Inter Parfums fragrances (Montblanc, Jimmy Choo, Coach, Van Cleef & Arpels, Boucheron, Karl Lagerfeld and others) use a code whose first letter is the production year — an annual cycle that skips I and O, so J = 2019, K = 2020, L = 2021, M = 2022, N = 2023, P = 2024, Q = 2025 and R = 2026 — and whose last three digits are the day of that year. For example, 08J38J169 is the 169th day of 2019, i.e. 18 June 2019.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const m = c.match(/[A-Z]/); // first letter is the production year
    if (!m) return null;
    const year = interparfumsYear(m[0], ctx.now);
    if (year === null) return null;
    const last3 = c.slice(-3);
    if (!/^[0-9]{3}$/.test(last3)) return null;
    const doy = Number(last3);
    if (doy < 1 || doy > 366) return null;
    const date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "The first letter gives the production year; the last three digits are read as the day of that year.",
        "On some Inter Parfums codes the last three digits are a factory line rather than a day — if the date looks off for the bottle's era, treat it as approximate.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) governs how long the fragrance stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Generic "production date in code" reader                                  */
/*  For brands that print the date in the code (year digit + Julian day, or a  */
/*  5/6-digit date) without a proprietary cipher — e.g. Zara (Puig).           */
/* -------------------------------------------------------------------------- */

const embedded: Decoder = {
  id: "embedded",
  label: "Production date in code",
  explanation:
    "This brand prints the production date inside the batch code — most often the last digit of the year followed by the day of the year (e.g. 4135 = the 135th day of 2024), sometimes as a 5- or 6-digit date. There is no separate cipher to memorise.",
  decode(code, ctx): DecodeAttempt | null {
    const r = readEmbeddedDate(code, ctx.now);
    if (!r) return null;
    return {
      manufactureDate: r.date,
      confidence: "medium",
      method: `${this.label} — ${r.method}`,
      notes: [
        "The production date was read from the numeric part of the code.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M / 24M) governs how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Registry                                                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Beiersdorf (NIVEA, Eucerin, Labello)                                       */
/*  Documented year + week code: an 8-digit batch (sometimes followed by two   */
/*  letters, e.g. "63450108 CZ") where the first digit is the last digit of    */
/*  the production year and the next two are the week of that year.            */
/*  E.g. 8153554 -> week 15 of 2018.                                           */
/* -------------------------------------------------------------------------- */

const beiersdorf: Decoder = {
  id: "beiersdorf",
  label: "Beiersdorf year + week",
  explanation:
    "Beiersdorf brands (NIVEA, Eucerin, Labello) use an 8-digit batch code, sometimes followed by two letters (e.g. 63450108 CZ). The first digit is the last digit of the production year and the next two are the week of that year, so 8153554 is week 15 of 2018.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    // Real Beiersdorf codes are a contiguous 6–8 digit run (optionally with two
    // trailing letters). Require ≥6 digits so we don't latch onto a short
    // fragment of some other code shape.
    const m = c.match(/\d{6,}/);
    if (!m) return null;
    const d = m[0];
    const week = Number(d.slice(1, 3));
    if (week < 1 || week > 53) return null;
    // Single-digit year: take the most recent match, stepping back a decade if
    // that puts the week in the future.
    let year = resolveYearDigit(Number(d[0]), ctx.now);
    const doy = (week - 1) * 7 + 1;
    let date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) {
      year -= 10;
      date = dateFromDayOfYear(year, doy);
    }
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Beiersdorf codes encode the production week (year digit + week), so the date is accurate to within that week.",
        `The year is a single digit, so it is read as the most recent match (${year}); an older-looking product may be from ${year - 10}.`,
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) determines how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  NAOS / Bioderma                                                            */
/*  Day-first Julian code: the first three digits are the day of the year and  */
/*  the fourth is the last digit of the production year (DDDY). This is the     */
/*  reverse order of Coty's YDDD. E.g. 29682 -> day 296 of 2018 (23 Oct 2018). */
/*  Bioderma also prints an expiry date directly on most products.             */
/* -------------------------------------------------------------------------- */

const naos: Decoder = {
  id: "naos",
  label: "Bioderma day-of-year + year (DDDY)",
  explanation:
    "Bioderma (NAOS) codes start with the day of the year and the last digit of the production year: the first three digits are the day (001–366) and the fourth is the year digit, so 29682 is the 296th day of 2018 (23 October 2018). Bioderma also prints an expiry date directly on most products.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const m = c.match(/\d{4,}/);
    if (!m) return null;
    const d = m[0];
    const doy = Number(d.slice(0, 3));
    if (doy < 1 || doy > 366) return null;
    let year = resolveYearDigit(Number(d[3]), ctx.now);
    let date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) {
      year -= 10;
      date = dateFromDayOfYear(year, doy);
    }
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Bioderma codes give the day precisely (day-of-year + year digit), but the year is a single digit.",
        `The year is read as the most recent match (${year}); an older-looking product may be from ${year - 10}.`,
        "Most Bioderma products also print an expiry date directly — prefer that when present. This is the manufacture date; the PAO symbol governs use after opening.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Deciem / The Ordinary                                                      */
/*  Newer codes are [year digit][month letter A–L][trailing digits], e.g.      */
/*  4A01 = January 2024. The month-letter scheme (A=Jan … L=Dec) is confirmed  */
/*  against real ground-truth codes (…F… = June, …D… = April). The trailing    */
/*  digits are ambiguous between day-of-month and a line/batch number across   */
/*  sources, so we decode to month precision (1st of the month) rather than    */
/*  guess a day. Older 4-character regional codes (TGD1, 1dg1 …) use an         */
/*  internal system and are not decodable — those return null.                 */
/* -------------------------------------------------------------------------- */

const deciem: Decoder = {
  id: "deciem",
  label: "The Ordinary year + month letter",
  explanation:
    "The Ordinary / Deciem's newer batch codes start with a year digit, then a month letter (A = January … L = December), then a line number — for example 4A01 is January 2024. We read the year and month (accurate to the month); the day isn't reliably encoded. Older 4-character codes (like TGD1) use an internal system and don't decode — check the printed best-before date on those.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    // New format only: digit, month letter A–L, then a digit (line/day).
    const m = c.match(/^(\d)([A-L])\d/);
    if (!m) return null;
    const year = resolveYearDigit(Number(m[1]), ctx.now);
    const month = m[2].charCodeAt(0) - 64; // A=1 … L=12
    let date = new Date(Date.UTC(year, month - 1, 1));
    if (inFuture(date, ctx.now)) {
      date = new Date(Date.UTC(year - 10, month - 1, 1));
    }
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "The Ordinary codes encode the year and month; we read it to the month (the day isn't reliably encoded).",
        `The year is a single digit, so it's read as the most recent match (${date.getUTCFullYear()}).`,
        "Older 4-character regional codes (e.g. TGD1) don't decode — use the best-before date printed on the pack. Unopened shelf life is about 3 years.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Shiseido                                                                   */
/*  Year-first Julian code (YDDD), like Coty: the first digit is the last      */
/*  digit of the production year and the next three are the day of that year,  */
/*  optionally followed by plant/line letters. E.g. 5029KG -> day 29 of 2025   */
/*  (29 Jan 2025); 8233 -> 21 Aug 2018.                                        */
/* -------------------------------------------------------------------------- */

const shiseido: Decoder = {
  id: "shiseido",
  label: "Shiseido year digit + Julian day (YDDD)",
  explanation:
    "Shiseido and its houses print a code that begins with the last digit of the production year and the day of that year, then plant/line letters — so 5029KG is the 29th day of 2025 (29 January 2025) and 8233 is 21 August 2018.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const m = c.match(/\d{4}/);
    if (!m) return null;
    const d = m[0];
    const doy = Number(d.slice(1));
    if (doy < 1 || doy > 366) return null;
    let year = resolveYearDigit(Number(d[0]), ctx.now);
    let date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) {
      year -= 10;
      date = dateFromDayOfYear(year, doy);
    }
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Shiseido codes give the day precisely (year digit + day-of-year), but the year is a single digit.",
        `The year is read as the most recent match (${year}); an older-looking product may be from ${year - 10}.`,
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M) determines how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Procter & Gamble (Julian)                                                  */
/*  Publicly documented industry format: a Julian production date as YJJJ      */
/*  (1 year digit + 3-digit day-of-year), YYDDD (2 + 3), or the unambiguous    */
/*  YYYYJJJ (4 + 3). e.g. 6099 = day 99 of 2016/2026; 2026032 = 1 Feb 2026.    */
/*  (Olay, Pantene, Head & Shoulders, Herbal Essences, Old Spice, Secret, …)   */
/* -------------------------------------------------------------------------- */
const pg: Decoder = {
  id: "pg",
  label: "Procter & Gamble Julian date",
  explanation:
    "Procter & Gamble prints a Julian production date: the day of the year with the year attached — as YJJJ (one year digit + day, e.g. 6099 = day 99), YYDDD, or the unambiguous seven-digit YYYYJJJ (e.g. 2026032 = the 32nd day of 2026, 1 February).",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const now = ctx.now;
    const cand: DecodeAttempt[] = [];
    const push = (year: number, doy: number, method: string, conf: DecodeAttempt["confidence"]) => {
      if (doy < 1 || doy > 366) return;
      const date = dateFromDayOfYear(year, doy);
      if (!inFuture(date, now)) cand.push({ manufactureDate: date, confidence: conf, method });
    };
    // 7-digit YYYYJJJ — unambiguous.
    const m7 = c.match(/\d{7}/);
    if (m7) {
      const d = m7[0];
      push(Number(d.slice(0, 4)), Number(d.slice(4, 7)), "Julian (YYYYJJJ)", "high");
    }
    // 5-digit YYDDD.
    const m5 = c.match(/\d{5}/);
    if (m5) {
      const d = m5[0];
      push(resolveYear2(Number(d.slice(0, 2))), Number(d.slice(2, 5)), "Julian (YYDDD)", "medium");
    }
    // 4-digit YJJJ.
    const m4 = c.match(/\d{4}/);
    if (m4) {
      const d = m4[0];
      push(resolveYearDigit(Number(d[0]), now), Number(d.slice(1, 4)), "Julian (YJJJ)", "medium");
    }
    if (!cand.length) return null;
    const rank = { high: 3, medium: 2, low: 1, none: 0 };
    cand.sort((a, b) => rank[b.confidence] - rank[a.confidence] || b.manufactureDate!.getTime() - a.manufactureDate!.getTime());
    return {
      ...cand[0],
      method: `${this.label} — ${cand[0].method}`,
      notes: [
        "P&G codes give the day precisely; a short (4-digit) code's year is a single digit, so a much older product could be from ten years earlier.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) sets how long it stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Korean beauty (manufacture date in the code)                              */
/*  Korea's MFDS requires the manufacture date (제조) on pack; K-beauty batch  */
/*  codes lead with that date as YYYYMMDD, YYMMDD, or YYMM, then a line letter.*/
/*  e.g. 20260118 or 231122B = 22 Nov 2023. (Amorepacific, LG H&H, COSRX, …)  */
/* -------------------------------------------------------------------------- */
const kbeauty: Decoder = {
  id: "kbeauty",
  label: "Korean manufacture date (YYYYMMDD / YYMMDD)",
  explanation:
    "Korean brands print the manufacture date (제조) directly, and their batch code usually begins with it — as YYYYMMDD, YYMMDD or YYMM followed by a production-line letter. So 231122B is 22 November 2023. Many Korean packs also show the date in plain text as 제조 YYYY.MM.DD.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const now = ctx.now;
    const cand: DecodeAttempt[] = [];
    const tryDate = (year: number, mo: number, da: number, method: string, conf: DecodeAttempt["confidence"]) => {
      if (mo < 1 || mo > 12 || da < 1 || da > 31) return;
      const date = new Date(Date.UTC(year, mo - 1, da));
      if (date.getUTCMonth() !== mo - 1) return; // day rolled over → invalid
      if (!inFuture(date, now)) cand.push({ manufactureDate: date, confidence: conf, method });
    };
    // 8-digit YYYYMMDD — unambiguous.
    const m8 = c.match(/\d{8}/);
    if (m8) {
      const d = m8[0];
      tryDate(Number(d.slice(0, 4)), Number(d.slice(4, 6)), Number(d.slice(6, 8)), "YYYYMMDD", "high");
    }
    // 6-digit YYMMDD.
    const m6 = c.match(/\d{6}/);
    if (m6) {
      const d = m6[0];
      tryDate(resolveYear2(Number(d.slice(0, 2))), Number(d.slice(2, 4)), Number(d.slice(4, 6)), "YYMMDD", "medium");
    }
    // 4-digit YYMM — month precision only.
    const m4 = c.match(/\d{4}/);
    if (m4 && !m6 && !m8) {
      const d = m4[0];
      tryDate(resolveYear2(Number(d.slice(0, 2))), Number(d.slice(2, 4)), 1, "YYMM", "low");
    }
    if (!cand.length) return null;
    const rank = { high: 3, medium: 2, low: 1, none: 0 };
    cand.sort((a, b) => rank[b.confidence] - rank[a.confidence] || b.manufactureDate!.getTime() - a.manufactureDate!.getTime());
    return {
      ...cand[0],
      method: `${this.label} — ${cand[0].method}`,
      notes: [
        "The manufacture date is read from the leading digits of the code.",
        "If your pack shows a plain-text 제조 date, that is the same manufacture date.",
        "Once opened, the PAO symbol (open-jar icon) determines how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Rohto (year digit + month letter)                                         */
/*  Community-documented pattern (unconfirmed by Rohto): <year digit><month    */
/*  letter A=Jan..L=Dec><production line>. e.g. 6C2 = March 2026, 5H1 = Aug     */
/*  2025. Month precision only; shipped at low confidence with a caveat.        */
/*  (Hada Labo, Melano CC, OXY, Sunplay)                                        */
/* -------------------------------------------------------------------------- */
const ROHTO_MONTHS = "ABCDEFGHIJKL"; // A=Jan … L=Dec (all 12, no skips)
const rohto: Decoder = {
  id: "rohto",
  label: "Rohto year digit + month letter",
  explanation:
    "Rohto codes are read as a year digit, a month letter (A = January … L = December), then a production-line digit — so 6C2 is March 2026 and 5H1 is August 2025. This gives the month of manufacture, not the exact day, and is a community-observed pattern rather than an official Rohto scheme.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const m = c.match(/^(\d)([A-L])/);
    if (!m) return null;
    const month = ROHTO_MONTHS.indexOf(m[2]) + 1; // 1-12
    if (month < 1 || month > 12) return null;
    let year = resolveYearDigit(Number(m[1]), ctx.now);
    let date = new Date(Date.UTC(year, month - 1, 1));
    if (inFuture(date, ctx.now)) {
      year -= 10;
      date = new Date(Date.UTC(year, month - 1, 1));
    }
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "low",
      method: this.label,
      notes: [
        "This is a community-observed format, not confirmed by Rohto — treat the date as approximate.",
        "It gives the month of manufacture; the exact day is not encoded.",
        `The year is a single digit, read as the most recent match (${year}); an older product could be from ${year - 10}.`,
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Kenvue / J&J (Julian, day-first)                                          */
/*  Documented format: the day of year FIRST, then a 1- or 2-digit year —      */
/*  DDDYY (e.g. 12324 = day 123 of 2024) or DDDY (e.g. 3654 = day 365, 2024).  */
/*  (Neutrogena, Aveeno, RoC)                                                   */
/* -------------------------------------------------------------------------- */
const kenvue: Decoder = {
  id: "kenvue",
  label: "Kenvue / J&J Julian date (day-first)",
  explanation:
    "Neutrogena, Aveeno and RoC print a Julian date with the day of the year first, then the year — as DDDYY (e.g. 12324 = the 123rd day of 2024) or DDDY (e.g. 3654 = day 365 of 2024). This is the manufacture date.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const now = ctx.now;
    const cand: DecodeAttempt[] = [];
    const push = (year: number, doy: number, method: string, conf: DecodeAttempt["confidence"]) => {
      if (doy < 1 || doy > 366) return;
      const date = dateFromDayOfYear(year, doy);
      if (!inFuture(date, now)) cand.push({ manufactureDate: date, confidence: conf, method });
    };
    const m5 = c.match(/\d{5}/);
    if (m5) {
      const d = m5[0];
      push(resolveYear2(Number(d.slice(3, 5))), Number(d.slice(0, 3)), "Julian (DDDYY)", "medium");
    }
    const m4 = c.match(/\d{4}/);
    if (m4) {
      const d = m4[0];
      push(resolveYearDigit(Number(d[3]), now), Number(d.slice(0, 3)), "Julian (DDDY)", "medium");
    }
    if (!cand.length) return null;
    const rank = { high: 3, medium: 2, low: 1, none: 0 };
    cand.sort((a, b) => rank[b.confidence] - rank[a.confidence] || b.manufactureDate!.getTime() - a.manufactureDate!.getTime());
    return {
      ...cand[0],
      method: `${this.label} — ${cand[0].method}`,
      notes: [
        "The day of manufacture is read precisely; a short (4-digit) code's year is a single digit, so a much older product could be ten years earlier.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) sets how long it stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Unilever mass personal care (YDDD)                                        */
/*  Standard 4-5 char code: year digit + 3-digit Julian day, then optional     */
/*  plant/line letters. e.g. 6120X = day 120 of 2026 (30 April). A minority of  */
/*  skincare plants use a month-letter-first variant, which we don't auto-read. */
/*  (Dove, Axe, Rexona, Vaseline, Sunsilk, TRESemmé, Simple, Pond's, St. Ives) */
/* -------------------------------------------------------------------------- */
const unilever: Decoder = {
  id: "unilever",
  label: "Unilever year digit + Julian day (YDDD)",
  explanation:
    "Unilever personal-care products use a 4–5 character code: the first digit is the last digit of the production year and the next three are the day of that year, followed by an optional plant/line letter — so 6120X is the 120th day of 2026 (30 April 2026). Some skincare plants use a month-letter-first variant instead.",
  decode(code, ctx): DecodeAttempt | null {
    const c = clean(code);
    const m = c.match(/\d{4}/);
    if (!m) return null;
    const d = m[0];
    const year = resolveYearDigit(Number(d[0]), ctx.now);
    const doy = Number(d.slice(1));
    if (doy < 1 || doy > 366) return null;
    const date = dateFromDayOfYear(year, doy);
    if (inFuture(date, ctx.now)) return null;
    return {
      manufactureDate: date,
      confidence: "medium",
      method: this.label,
      notes: [
        "Unilever codes give the day precisely (year digit + day-of-year), but the year is a single digit.",
        `The year is read as the most recent match (${year}); an older product could be from ${year - 10}.`,
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon) determines how long the product stays good.",
      ],
    };
  },
};

export const DECODERS: Record<string, Decoder> = {
  [esteeLauder.id]: esteeLauder,
  [pg.id]: pg,
  [kbeauty.id]: kbeauty,
  [rohto.id]: rohto,
  [kenvue.id]: kenvue,
  [unilever.id]: unilever,
  [loreal.id]: loreal,
  [coty.id]: coty,
  [chanel.id]: chanel,
  [dior.id]: dior,
  [creed.id]: creed,
  [interparfums.id]: interparfums,
  [beiersdorf.id]: beiersdorf,
  [naos.id]: naos,
  [deciem.id]: deciem,
  [shiseido.id]: shiseido,
  [embedded.id]: embedded,
  [julian.id]: julian,
};

/** Ordered fallback chain when a brand has no dedicated decoder. */
// Never try a different manufacturer's format after a brand decoder fails.
// Plausible-looking false positives are worse than an honest unknown result.
export const FALLBACK_CHAIN: Decoder[] = [];

export function getDecoder(id: string | undefined): Decoder | undefined {
  return id ? DECODERS[id] : undefined;
}

export { esteeLauder, loreal, coty, chanel, dior, creed, interparfums, embedded, julian };

/** Convenience for tests. */
export function runDecoder(decoder: Decoder, code: string, ctx: DecodeContext) {
  return decoder.decode(code, ctx);
}
