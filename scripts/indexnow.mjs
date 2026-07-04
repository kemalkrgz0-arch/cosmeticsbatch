#!/usr/bin/env node
// Submit the site's sitemap URLs to IndexNow (Bing, Yandex, Seznam, … share it).
// Run after deploying new/changed pages:  node scripts/indexnow.mjs
//
// The key file must already be live at https://<host>/<key>.txt — IndexNow
// fetches it to verify ownership before accepting the submission.

const HOST = process.env.INDEXNOW_HOST ?? "cosmeticsbatch.com";
const KEY = process.env.INDEXNOW_KEY ?? "715ba8a10adef9245df5834883c56c2f";
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function collectUrls(url, seen = new Set()) {
  const xml = await fetch(url).then((r) => r.text());
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const urls = [];
  for (const loc of locs) {
    if (loc.endsWith(".xml") && !seen.has(loc)) {
      seen.add(loc);
      urls.push(...(await collectUrls(loc, seen))); // nested sitemap index
    } else {
      urls.push(loc);
    }
  }
  return urls;
}

const urls = [...new Set(await collectUrls(SITEMAP))].filter((u) =>
  u.startsWith(`https://${HOST}`),
);
console.log(`Collected ${urls.length} URLs from ${SITEMAP}`);

// IndexNow accepts up to 10 000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: batch,
    }),
  });
  console.log(`Submitted ${batch.length} URLs → HTTP ${res.status} ${res.statusText}`);
  if (!res.ok) console.log(await res.text());
}
