import assert from "node:assert/strict";
import test from "node:test";
import {
  checkBatchCode,
  DECODER_PROFILES,
  DECODERS,
} from "../src/lib/decoder";
import { addressLookalikeHint } from "../src/lib/result-failure-copy";

const now = new Date("2025-07-14T12:00:00Z");

const fixtures = [
  ["estee-lauder", "A56", "2026-05-15"],
  ["loreal", "22U401", "2021-04-15"],
  ["coty", "4135", "2024-05-14"],
  // 32 on the month wheel is September; the current turn is ahead of `now`,
  // so the reading is the previous turn of the 8-year wheel.
  ["chanel", "3245", "2018-09-15"],
  ["dior", "5H03", "2025-08-15"],
  ["acquadiparma", "2480Y", "2020-09-04"],
  ["julian", "24045", "2024-02-14"],
  ["creed", "A4221N01", "2021-07-01"],
  ["interparfums", "08J38J169", "2019-06-18"],
  ["embedded", "4135", "2024-05-14"],
  ["beiersdorf", "8153554", "2018-04-09"],
  ["naos", "29682", "2018-10-23"],
  ["deciem", "4A01", "2024-01-01"],
  ["shiseido", "5029KG", "2025-01-29"],
  ["pg", "2026032", "2026-02-01"],
  ["kbeauty", "231122B", "2023-11-22"],
  ["rohto", "6C2", "2026-03-01"],
  ["kenvue", "12324", "2024-05-02"],
  ["unilever", "6120X", "2026-04-30"],
] as const;

test("every registered decoder has one exact known fixture", () => {
  assert.deepEqual(
    fixtures.map(([id]) => id).sort(),
    Object.keys(DECODERS).sort(),
  );
  const fixtureNow = new Date("2026-07-14T12:00:00Z");
  for (const [id, code, expected] of fixtures) {
    const result = DECODERS[id].decode(code, { now: fixtureNow });
    assert.equal(
      result?.manufactureDate?.toISOString().slice(0, 10),
      expected,
      `${id} failed fixture ${code}`,
    );
  }
});

test("every registered decoder rejects empty and punctuation-only input", () => {
  for (const [id, decoder] of Object.entries(DECODERS)) {
    assert.equal(decoder.decode("", { now }), null, `${id} accepted empty input`);
    assert.equal(decoder.decode(" - / . ", { now }), null, `${id} accepted punctuation`);
  }
});

test("decoder profile registry is complete and internally consistent", () => {
  assert.deepEqual(Object.keys(DECODER_PROFILES).sort(), Object.keys(DECODERS).sort());
  for (const [id, profile] of Object.entries(DECODER_PROFILES)) {
    assert.equal(profile.decoderId, id);
    assert.match(profile.version, /^\d+\.\d+\.\d+$/);
    assert.ok(profile.supportedCodeFormats.length > 0, `${id} has no formats`);
    assert.ok(profile.knownLimitations.length > 0, `${id} has no limitations`);
    if (profile.verificationStatus === "VERIFIED") {
      assert.ok(profile.sourceReferences.length > 0, `${id} is VERIFIED without a source`);
      assert.ok(profile.verifiedAt, `${id} is VERIFIED without a review date`);
    }
  }
});

test("Coty accepts day 366 in a leap year", () => {
  const result = DECODERS.coty.decode("4366", { now });
  assert.equal(result?.manufactureDate?.toISOString().slice(0, 10), "2024-12-31");
});

test("Coty rejects day 366 in a non-leap year", () => {
  assert.equal(DECODERS.coty.decode("3366", { now }), null);
});

test("packed dates reject impossible calendar days", () => {
  assert.equal(DECODERS.kbeauty.decode("20230231", { now }), null);
});

test("month-precision decoder accepts the current month before its midpoint", () => {
  const result = DECODERS.loreal.decode("40Y700", { now: new Date("2024-07-02T12:00:00Z") });
  assert.equal(result?.manufactureDate?.toISOString().slice(0, 10), "2024-07-15");
});

test("normalization handles lowercase, whitespace and punctuation", () => {
  const result = DECODERS["estee-lauder"].decode("  a-5-4  ", { now });
  assert.equal(result?.manufactureDate?.toISOString().slice(0, 10), "2024-05-15");
});

test("future production months are rejected", () => {
  assert.equal(
    DECODERS["estee-lauder"].decode("AC5", { now: new Date("2025-07-14T12:00:00Z") }),
    null,
  );
});

test("an unsupported brand does not use the generic date fallback", () => {
  const result = checkBatchCode({
    brandName: "Unsupported",
    code: "24045",
    shelfLifeMonths: 36,
    category: "generic",
    now,
  });
  assert.equal(result.decoded, false);
});

test("a checksum-valid EAN-13 is rejected before substring decoding", () => {
  const result = checkBatchCode({
    brandName: "Coty",
    code: "4006381333931",
    decoderId: "coty",
    shelfLifeMonths: 60,
    category: "perfume",
    now,
  });
  assert.equal(result.decoded, false);
  assert.equal(result.failureReason, "barcode");
  assert.match(result.notes.join(" "), /retail barcode/i);
});

test("numeric retail identifiers remain classified as barcodes even with spaces", () => {
  const result = checkBatchCode({
    brandName: "Dior",
    code: "4006 3813 3393 1",
    decoderId: "dior",
    shelfLifeMonths: 60,
    category: "perfume",
    now,
  });
  assert.equal(result.decoded, false);
  assert.equal(result.failureReason, "barcode");
});

test("failed checks distinguish malformed and unresolved codes", () => {
  const input = { brandName: "Unsupported", shelfLifeMonths: 36, category: "generic" as const, now };
  assert.equal(checkBatchCode({ ...input, code: "." }).failureReason, "invalid-format");
  assert.equal(checkBatchCode({ ...input, code: "ZZ99" }).failureReason, "unresolved");
});

test("manufacture decoding and shelf-life estimation remain separate", () => {
  const result = checkBatchCode({
    brandName: "Coty",
    code: "4135",
    decoderId: "coty",
    shelfLifeMonths: 60,
    category: "perfume",
    now,
  });
  assert.equal(result.manufactureDate?.toISOString().slice(0, 10), "2024-05-14");
  assert.equal(result.expirationDate?.toISOString().slice(0, 10), "2029-05-14");
});

/*
 * Guards for the L'Oréal reader, which scans for a year letter followed by a
 * month character. Every case below is a real code from production traffic that
 * the scan used to answer with high confidence.
 */

const loreal = (code: string) =>
  checkBatchCode({
    brandName: "Vichy",
    code,
    decoderId: "loreal",
    shelfLifeMonths: 36,
    category: "skincare",
    now,
  });

test("a code too short to be a L'Oréal code is not decoded", () => {
  // "C34" read as C=2003 + month 3, on a brand that did not exist in 2003.
  assert.equal(loreal("C34").decoded, false);
  assert.equal(loreal("14YN").decoded, false);
});

test("look-alike Cyrillic and Greek letters decode as their Latin twin", () => {
  const cyrillic = checkBatchCode({
    brandName: "Clinique",
    code: "А25", // Cyrillic А + 25
    decoderId: "estee-lauder",
    shelfLifeMonths: 36,
    category: "skincare",
    now,
  });
  const latin = checkBatchCode({
    brandName: "Clinique",
    code: "A25",
    decoderId: "estee-lauder",
    shelfLifeMonths: 36,
    category: "skincare",
    now,
  });
  assert.equal(cyrillic.decoded, true);
  assert.deepEqual(cyrillic.manufactureDate, latin.manufactureDate);
});

test("a code without the documented L'Oréal shape is not read confidently", () => {
  // Letter-led: "MNX30W" reads as M=2013/N=Nov at the front and X=2023/3=Mar
  // further in. The date is still offered; the certainty is not.
  const result = loreal("MNX30W");
  assert.equal(result.decoded, true);
  assert.notEqual(result.confidence, "high");
});

test("a year letter resolving decades back is not read confidently", () => {
  // The year letter repeats every 25 years, so "26B100" can only be read as
  // 2002 — far past any shelf life, and likelier a misread letter.
  const result = loreal("26B100");
  assert.equal(result.manufactureDate?.toISOString().slice(0, 10), "2002-01-15");
  assert.equal(result.confidence, "low");
});

test("the canonical L'Oréal shape still reads at high confidence", () => {
  const result = loreal("22U401");
  assert.equal(result.confidence, "high");
  assert.equal(result.manufactureDate?.toISOString().slice(0, 10), "2021-04-15");
});

test("Paris postcodes from the address block are flagged, batch codes are not", () => {
  // Real entries: "75008" for two brands, "75116" for a third, all unresolved.
  assert.ok(addressLookalikeHint("en", "75008"));
  assert.ok(addressLookalikeHint("en", "75116"));
  assert.ok(addressLookalikeHint("tr", "75001"));
  // Not Paris, and shapes a real code can take.
  assert.equal(addressLookalikeHint("en", "75021"), null);
  assert.equal(addressLookalikeHint("en", "22U401"), null);
  assert.equal(addressLookalikeHint("en", "52911"), null);
});

test("a flagged postcode could never have decoded anyway", () => {
  // The hint must not be able to mask a real read: check it against the brands
  // whose users actually entered one.
  for (const [brandName, decoderId] of [["Dior", "dior"], ["Jean Paul Gaultier", "embedded"]] as const) {
    for (const code of ["75008", "75116"]) {
      const result = checkBatchCode({
        brandName, code, decoderId, shelfLifeMonths: 60, category: "perfume", now,
      });
      assert.equal(result.decoded, false, `${brandName} ${code} unexpectedly decoded`);
    }
  }
});

/*
 * Chanel's month wheel. Every pair below is an observed code -> date reading;
 * the previous year+day-of-year reader failed on most of them.
 */
const chanelCode = (code: string) =>
  checkBatchCode({
    brandName: "Chanel",
    code,
    decoderId: "chanel",
    shelfLifeMonths: 60,
    category: "perfume",
    now,
  });

test("Chanel codes read off the 8-year month wheel", () => {
  for (const [code, month] of [
    ["7201", "2022-01"], ["7301", "2022-02"], ["7501", "2022-04"],
    ["7704", "2022-06"], ["9303", "2023-10"],
  ] as const) {
    const result = chanelCode(code);
    assert.equal(result.manufactureDate?.toISOString().slice(0, 7), month, code);
    assert.equal(result.datePrecision, "month", code);
  }
});

test("a Chanel reading ahead of today falls back a whole wheel", () => {
  // 32 -> September on the wheel; the current turn is 2026-09, still ahead of
  // `now`, so the honest answer is the previous turn rather than a future date.
  const result = chanelCode("3245");
  assert.equal(result.manufactureDate?.toISOString().slice(0, 7), "2018-09");
});

test("a counter the Chanel wheel cannot print is not read as a date", () => {
  // The wheel only prints 00-95. Refusing 96-99 keeps the reader from dating
  // arbitrary 4-digit strings that merely look like a code.
  for (const code of ["9601", "9999"]) {
    assert.equal(chanelCode(code).decoded, false, code);
  }
});

test("the Chanel reading is never reported as certain", () => {
  // Chanel publishes no scheme and the wheel repeats every 8 years.
  assert.equal(chanelCode("7704").confidence, "low");
});
