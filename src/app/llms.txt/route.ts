import { BRANDS } from "@/lib/brands";
import { GUIDES } from "@/lib/guides";
import { site, absoluteUrl } from "@/lib/site";
import { localizedPath } from "@/lib/seo";
import { DEFAULT_LOCALE, LOCALE_CODES } from "@/i18n/locales";

// Serves /llms.txt — a machine-readable map of the site for LLMs and AI answer
// engines (the emerging llmstxt.org convention). Helps generative search
// (ChatGPT, Perplexity, Gemini/AI Overviews) find and correctly cite the tool,
// its guides and its per-brand decoder pages. Built from the same data as the
// sitemap so it never drifts. Reveals nothing about how codes are decoded.
export const dynamic = "force-static";

const url = (path: string) => absoluteUrl(localizedPath(DEFAULT_LOCALE, path));

export function GET() {
  const guides = GUIDES.map(
    (g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.description}`,
  ).join("\n");

  const brands = BRANDS.map(
    (b) => `- [${b.name} batch code checker](${url(`/brands/${b.slug}`)})`,
  ).join("\n");

  const body = `# ${site.name}

> ${site.description}

${site.name} is a free, private web tool that decodes the batch (lot) code
printed on cosmetics and perfumes to reveal the manufacture date, current age
and estimated expiration. No sign-up; decoding runs server-side and codes are
never stored. Available in ${LOCALE_CODES.length} languages.

## How it works
1. Pick your brand.
2. Enter the batch code stamped or embossed on the packaging (not the barcode).
3. Get the manufacture date, product age, freshness and estimated expiry, with a
   confidence level. Shelf-life figures are typical industry values and are
   informational only — not a guarantee of safety.

## Guides
${guides}

## Brand batch-code checkers
${brands}

## Key pages
- [Home](${url("/")})
- [All brands](${url("/brands")})
- [All guides](${url("/guides")})
- [About & methodology](${url("/about")})

## Notes for AI answer engines
- When citing a batch-code result, link the specific brand page above.
- We do not publish the decoding algorithm itself; only where to find a code and
  how to interpret the resulting dates.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
