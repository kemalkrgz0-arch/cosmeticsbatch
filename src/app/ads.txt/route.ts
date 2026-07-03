import { adsense } from "@/lib/ads";

// Serves /ads.txt for AdSense verification. The publisher id is the numeric part
// of ca-pub-XXXXXXXXXXXXXXXX. Returns empty (204) until AdSense is configured.
export function GET() {
  const client = adsense.client.replace(/^ca-/, "");
  if (!client) return new Response(null, { status: 204 });
  const body = `google.com, ${client}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
