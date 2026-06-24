#!/usr/bin/env bash
# Server-side deploy script for paydochub. Triggered by GHA via SSH.
# Lives at /opt/paydochub/deploy.sh on Hetzner (as.on.tc).
#
# Flow: git fetch + reset --hard origin/main → pnpm install --frozen-lockfile → pnpm build → systemctl restart
#
# NEVER bypass with scp/rsync — GHA workflow does `git reset --hard` which wipes uncommitted changes.

set -euo pipefail

REPO_DIR="/opt/paydochub"
SERVICE="paydochub"
PNPM="$(command -v pnpm || echo /usr/bin/pnpm)"

cd "$REPO_DIR"

echo "==> [1/4] git fetch + reset"
git fetch --depth=1 origin main
PREV=$(git rev-parse HEAD)
git reset --hard origin/main
NEW=$(git rev-parse HEAD)

if [ "$PREV" = "$NEW" ]; then
  echo "    No new commits ($PREV)"
else
  echo "    $PREV -> $NEW"
  git log --oneline -1
fi

echo "==> [2/4] pnpm install (frozen)"
$PNPM install --frozen-lockfile --prefer-offline

echo "==> [3/4] pnpm build"
export NODE_OPTIONS="--max-old-space-size=3072"
$PNPM build

echo "==> [4/4] restart $SERVICE"
sudo /usr/bin/systemctl restart $SERVICE
sleep 2
sudo /usr/bin/systemctl is-active $SERVICE

echo "==> deploy OK (sha: $NEW)"
