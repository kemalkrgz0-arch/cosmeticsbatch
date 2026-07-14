#!/usr/bin/env bash
# One-shot redeploy on the VPS: pull latest, rebuild the image with the public
# build-time vars baked in, and replace the running container. Run from
# /opt/cosmeticsbatch. The GitHub Actions workflow runs this same script, so the
# build config has exactly one source of truth.
#
#   ./deploy.sh              # pull + build + restart
#   SKIP_PULL=1 ./deploy.sh  # caller already pulled (CI)
#
# Every NEXT_PUBLIC_* value is inlined into the JS bundle at build time, so it
# must be a --build-arg; passing it at runtime with -e does nothing. The values
# live in .env.build on the VPS (untracked) — see .env.build.example.
set -euo pipefail

# The whole script is one function: bash parses it fully before running a line,
# so the `git pull` that rewrites this file mid-run cannot corrupt execution.
main() {
  cd "$(dirname "$0")"

  if [ "${SKIP_PULL:-0}" != "1" ]; then
    echo "→ Pulling latest…"
    git pull --ff-only
  fi

  local env_file="${ENV_FILE:-.env.build}"
  if [ ! -f "$env_file" ]; then
    echo "✗ $env_file not found. Copy .env.build.example to $env_file and fill it in." >&2
    exit 1
  fi
  # GitHub Actions injects runtime secrets into the SSH environment. Preserve
  # those values across sourcing the VPS file, whose older copies may not have
  # these keys (or may contain blank placeholders).
  local injected_resend_api_key="${RESEND_API_KEY-}"
  local injected_notify_email="${SUBMISSION_NOTIFY_EMAIL-}"
  local injected_from_email="${SUBMISSION_FROM_EMAIL-}"
  local injected_cf_access_aud="${CF_ACCESS_AUD-}"
  local injected_cf_access_team_domain="${CF_ACCESS_TEAM_DOMAIN-}"
  local injected_reviewer_emails="${REVIEWER_EMAILS-}"
  set -a
  # shellcheck disable=SC1090
  . "./$env_file"
  set +a
  if [ -n "$injected_resend_api_key" ]; then
    RESEND_API_KEY="$injected_resend_api_key"
  fi
  if [ -n "$injected_notify_email" ]; then
    SUBMISSION_NOTIFY_EMAIL="$injected_notify_email"
  fi
  if [ -n "$injected_from_email" ]; then
    SUBMISSION_FROM_EMAIL="$injected_from_email"
  fi
  if [ -n "$injected_cf_access_aud" ]; then
    CF_ACCESS_AUD="$injected_cf_access_aud"
  fi
  if [ -n "$injected_cf_access_team_domain" ]; then
    CF_ACCESS_TEAM_DOMAIN="$injected_cf_access_team_domain"
  fi
  if [ -n "$injected_reviewer_emails" ]; then
    REVIEWER_EMAILS="$injected_reviewer_emails"
  fi

  # Blank optional vars degrade gracefully (no analytics, ad placeholders), but a
  # blank site URL breaks canonicals/sitemap — fail loudly on that one.
  : "${NEXT_PUBLIC_SITE_URL:?must be set in $env_file}"
  : "${RESEND_API_KEY:?must be set through GitHub Actions or $env_file}"
  : "${SUBMISSION_NOTIFY_EMAIL:?must be set through GitHub Actions or $env_file}"
  : "${SUBMISSION_FROM_EMAIL:?must be set through GitHub Actions or $env_file}"
  : "${CF_ACCESS_AUD:?must be set through GitHub Actions or $env_file}"
  : "${CF_ACCESS_TEAM_DOMAIN:?must be set through GitHub Actions or $env_file}"
  : "${REVIEWER_EMAILS:?must be set through GitHub Actions or $env_file}"

  local build_args=()
  local v
  for v in \
    NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ADSENSE_CLIENT \
    NEXT_PUBLIC_ADSENSE_SLOT_HOME \
    NEXT_PUBLIC_ADSENSE_SLOT_RESULT \
    NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE \
    NEXT_PUBLIC_ADSENSE_SLOT_BRAND \
    NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_YM_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_BING_SITE_VERIFICATION
  do
    build_args+=(--build-arg "$v=${!v-}")
  done

  echo "→ Building image…"
  docker build -t cosmeticsbatch:latest "${build_args[@]}" .

  echo "→ Restarting container…"
  docker rm -f cosmeticsbatch 2>/dev/null || true
  # DATASET_DIR must be a host bind mount: the container is replaced on every
  # deploy, so anything written inside it is lost.
  #
  # The container runs as the unprivileged nextjs user (uid 1001, gid 65533 —
  # see the Dockerfile), and a bind mount keeps the *host* directory's owner. A
  # root-owned mount therefore silently rejects every write: dataset.ts swallows
  # the EACCES so a failed log can never break a decode, which is right, but it
  # also means the only symptom is an empty directory. Own the mount to the
  # container's uid so that can't happen again.
  mkdir -p /opt/cosmeticsbatch-data
  chown 1001:65533 /opt/cosmeticsbatch-data
  chmod 775 /opt/cosmeticsbatch-data

  docker run -d --name cosmeticsbatch \
    --network yerelatlas_default \
    --restart unless-stopped \
    -e DATASET_DIR=/data \
    -e SUBMISSIONS_DIR=/data/submissions \
    -e RESEND_API_KEY \
    -e SUBMISSION_NOTIFY_EMAIL \
    -e SUBMISSION_FROM_EMAIL \
    -e CF_ACCESS_AUD \
    -e CF_ACCESS_TEAM_DOMAIN \
    -e REVIEWER_EMAILS \
    -v /opt/cosmeticsbatch-data:/data \
    cosmeticsbatch:latest

  # Reclaim space from the previous build (safe: only dangling images).
  docker image prune -f >/dev/null

  echo "→ Status:"
  docker ps | grep cosmeticsbatch
  echo "✓ Done. $NEXT_PUBLIC_SITE_URL"
}

main "$@"
