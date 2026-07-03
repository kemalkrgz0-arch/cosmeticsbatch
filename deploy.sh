#!/usr/bin/env bash
# One-shot redeploy on the VPS: pull latest, rebuild the image with the public
# build-time vars baked in, and replace the running container. Run from /opt/cosmeticsbatch.
#
#   ./deploy.sh
#
# NEXT_PUBLIC_* values are inlined at build time. The AdSense client id is a
# public identifier (it appears in the page source), so it is safe to keep here.
set -euo pipefail

cd "$(dirname "$0")"

echo "→ Pulling latest…"
git pull --ff-only

echo "→ Building image…"
docker build -t cosmeticsbatch:latest \
  --build-arg NEXT_PUBLIC_SITE_URL=https://cosmeticsbatch.com \
  --build-arg NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-6300134697173168 \
  .

echo "→ Restarting container…"
docker rm -f cosmeticsbatch 2>/dev/null || true
docker run -d --name cosmeticsbatch \
  --network yerelatlas_default \
  --restart unless-stopped \
  cosmeticsbatch:latest

echo "→ Status:"
docker ps | grep cosmeticsbatch
echo "✓ Done. https://cosmeticsbatch.com"
