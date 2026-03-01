#!/usr/bin/env bash
# Run full QuickHire stack (backend + frontend + mongo) in dev mode.
# Usage: ./run.sh   or   ./run.sh --build

set -e
cd "$(dirname "$0")"

echo ">>> QuickHire: starting backend, frontend, and MongoDB (dev mode)..."
docker compose up --build "$@"
