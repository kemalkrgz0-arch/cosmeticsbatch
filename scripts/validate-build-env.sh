#!/usr/bin/env bash
# Validate public build-time configuration before Docker bakes it into a release.
# Values are public identifiers, but an absent or malformed value can silently
# disable CMP delivery, ads.txt, analytics or canonical metadata for the entire
# build. The deploy script sources .env.build before calling this validator.
set -euo pipefail

fail() {
  echo "build config: $*" >&2
  exit 1
}

site_url="${NEXT_PUBLIC_SITE_URL-}"
[[ "$site_url" =~ ^https://[^/]+$ ]] ||
  fail "NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a trailing slash"

case "${REQUIRE_MONETIZATION_STACK-true}" in
  true|false) ;;
  *) fail "REQUIRE_MONETIZATION_STACK must be true or false" ;;
esac

case "${NEXT_PUBLIC_GOOGLE_CMP_ENABLED-false}" in
  true|false) ;;
  *) fail "NEXT_PUBLIC_GOOGLE_CMP_ENABLED must be true or false" ;;
esac

if [ "${REQUIRE_MONETIZATION_STACK-true}" = "true" ]; then
  [[ "${NEXT_PUBLIC_ADSENSE_CLIENT-}" =~ ^ca-pub-[0-9]{16}$ ]] ||
    fail "NEXT_PUBLIC_ADSENSE_CLIENT must be a ca-pub id with 16 digits"
  [ "${NEXT_PUBLIC_GOOGLE_CMP_ENABLED-}" = "true" ] ||
    fail "NEXT_PUBLIC_GOOGLE_CMP_ENABLED must be true for a monetized production build"
  [[ "${NEXT_PUBLIC_GA_ID-}" =~ ^G-[A-Z0-9]+$ ]] ||
    fail "NEXT_PUBLIC_GA_ID must be a valid GA4 measurement id"
  [[ "${NEXT_PUBLIC_YM_ID-}" =~ ^[0-9]+$ ]] ||
    fail "NEXT_PUBLIC_YM_ID must be numeric"
fi

echo "build config: valid (${REQUIRE_MONETIZATION_STACK-true} monetization stack)"
