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
import { DECODER_GUIDES, brandsForGuide } from "../src/lib/decoder-guides";
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

console.log(failures ? `\n${failures} failure(s)` : "\nAll examples decode.");
process.exit(failures ? 1 : 0);
