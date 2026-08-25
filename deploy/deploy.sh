#!/usr/bin/env bash
# Draai dit ON de VPS, in /opt/streunding, om te deployen/updaten.
# Eerste keer: zie deploy/README.md voor de rest van de VPS-inrichting.
set -euo pipefail

cd "$(dirname "$0")/.."

git pull
npm ci
npm run build
sudo systemctl restart streunding
sudo systemctl status streunding --no-pager -l
