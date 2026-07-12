/**
 * Guards the decoder reference pages: every example code printed on a
 * /decoders page must actually decode with the decoder that page documents.
 *
 * The pages exist because they are *true* — a worked example that doesn't
 * decode is an invented fact, which is exactly what we refuse to publish. This
 * script is the check that keeps them honest.
 *
 *   npx tsx scripts/verify-decoder-examples.ts
 *
 * Exits non-zero if any anatomy or example code fails to decode, or if a
 * decoder in the engine has no reference page.
 */
import { readFileSync } from "node:fs";
import { DECODER_GUIDES, brandsForGuide } from "../src/lib/decoder-guides";
import { BRAND_DETAILS } from "../src/lib/brand-detail";
import { getBrand } from "../src/lib/brands";
import { DECODERS } from "../src/lib/decoder";

const now = new Date();
let failures = 0;

for (const guide of DECODER_GUIDES) {
  const id = guide.decoderIds[0];
  const decoder = DECODERS[id];
  if (!decoder) {
    console.log(`✗ ${guide.slug}: unknown decoder id "${id}"`);
    failures++;
    continue;
  }

  const brands = brandsForGuide(guide);
  console.log(`\n[${guide.slug}]  decoder=${id}  brands=${brands.length}`);

  for (const code of [guide.anatomy.code, ...guide.examples.map((e) => e.code)]) {
    const result = decoder.decode(code, { now });
    if (!result?.manufactureDate) {
      console.log(`   ✗ ${code} → does not decode`);
      failures++;
    } else {
      const date = result.manufactureDate.toISOString().slice(0, 10);
      console.log(`   ✓ ${code} → ${date}  (${result.confidence})`);
    }
  }
}

const documented = new Set(DECODER_GUIDES.flatMap((g) => g.decoderIds));
const undocumented = Object.keys(DECODERS).filter((id) => !documented.has(id));
if (undocumented.length) {
  console.log(`\n✗ decoders with no reference page: ${undocumented.join(", ")}`);
  failures += undocumented.length;
}

/* -- Indexable brand pages: sample code must decode with that brand's decoder,
      and the page must actually have prose to show. A brand page is only in the
      index because it carries this material; if the material is missing or the
      example is broken, the page is a duplicate again. ---------------------- */
const en = JSON.parse(
  readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"),
) as { brandDetail?: Record<string, Record<string, string>> };

console.log("\n--- indexable brand pages ---");
for (const [slug, { sampleCode }] of Object.entries(BRAND_DETAILS)) {
  const brand = getBrand(slug);
  if (!brand) {
    console.log(`   ✗ ${slug}: no such brand`);
    failures++;
    continue;
  }
  const decoder = DECODERS[brand.decoderId ?? ""];
  const result = decoder?.decode(sampleCode, { now });
  const copy = en.brandDetail?.[slug];
  const problems: string[] = [];
  if (!decoder) problems.push(`brand has no decoder (${brand.decoderId})`);
  else if (!result?.manufactureDate)
    problems.push(`sample ${sampleCode} does not decode with "${brand.decoderId}"`);
  if (!copy?.where1) problems.push("no where1 copy in messages/en.json");
  if (!copy?.faq1q) problems.push("no faq1q copy in messages/en.json");

  if (problems.length) {
    console.log(`   ✗ ${slug}: ${problems.join("; ")}`);
    failures += problems.length;
  } else {
    const date = result!.manufactureDate!.toISOString().slice(0, 10);
    console.log(`   ✓ ${slug}: ${sampleCode} → ${date} (${brand.decoderId})`);
  }
}

console.log(failures ? `\n${failures} failure(s)` : "\nAll examples decode.");
process.exit(failures ? 1 : 0);
