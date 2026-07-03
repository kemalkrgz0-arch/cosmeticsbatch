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
  const d = new Date(Date.UTC(year, 0, 1));
  d.setUTCDate(doy);
  return d;
}

function inFuture(date: Date, now: Date): boolean {
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
      const date = new Date(Date.UTC(year, month - 1, 15));
      if (inFuture(date, ctx.now)) continue;
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
      manufactureDate: r.date,
      confidence: "medium",
      method: `${this.label} — ${r.method}`,
      notes: [
        "Chanel does not confirm a public code scheme; this reads the production date embedded in the code.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M / 24M) governs how long the product stays good.",
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/*  Dior / LVMH beauty                                                        */
/*  Parfums Christian Dior and sister LVMH houses (Guerlain, Givenchy, Kenzo,  */
/*  Loewe, Acqua di Parma, MFK…) print a production date on the box base /      */
/*  bottle sticker — year digit + Julian day, or a 5/6-digit date.             */
/* -------------------------------------------------------------------------- */

const dior: Decoder = {
  id: "dior",
  label: "Dior / LVMH production date",
  explanation:
    "Dior and its sister LVMH houses print the production date in the batch code — usually the last digit of the year followed by the day of the year (e.g. 4135 = the 135th day of 2024), sometimes as a 5- or 6-digit date. There is no separate month/plant cipher to memorise.",
  decode(code, ctx): DecodeAttempt | null {
    const r = readEmbeddedDate(code, ctx.now);
    if (!r) return null;
    return {
      manufactureDate: r.date,
      confidence: "medium",
      method: `${this.label} — ${r.method}`,
      notes: [
        "LVMH houses don't publish a fixed cipher; this reads the production date embedded in the code.",
        "This is the manufacture date. Once opened, the PAO symbol (open-jar icon, e.g. 12M / 24M) governs how long the product stays good.",
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
/*  Registry                                                                   */
/* -------------------------------------------------------------------------- */

export const DECODERS: Record<string, Decoder> = {
  [esteeLauder.id]: esteeLauder,
  [loreal.id]: loreal,
  [coty.id]: coty,
  [chanel.id]: chanel,
  [dior.id]: dior,
  [julian.id]: julian,
};

/** Ordered fallback chain when a brand has no dedicated decoder. */
export const FALLBACK_CHAIN: Decoder[] = [julian];

export function getDecoder(id: string | undefined): Decoder | undefined {
  return id ? DECODERS[id] : undefined;
}

export { esteeLauder, loreal, coty, chanel, dior, julian };

/** Convenience for tests. */
export function runDecoder(decoder: Decoder, code: string, ctx: DecodeContext) {
  return decoder.decode(code, ctx);
}
