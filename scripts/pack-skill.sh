#!/usr/bin/env bash
# Builds keel-skill.zip for Claude (web/desktop): Settings → Capabilities → Skills → Upload.
# Contains the skill, its references, and the component + token source so Claude can copy real code.
set -euo pipefail
cd "$(dirname "$0")/.."
out="${1:-dist-skill}"
rm -rf "$out" && mkdir -p "$out/keel/assets"
cp skills/keel/SKILL.md "$out/keel/SKILL.md"
cp -r skills/keel/references "$out/keel/references"
cp -r components "$out/keel/assets/components"
cp -r tokens "$out/keel/assets/tokens"
cp -r templates "$out/keel/assets/templates"
rm -f "$out/keel/assets/tokens/"*.json
root="$(pwd)"; (cd "$out" && zip -qr "$root/keel-skill.zip" keel)
echo "keel-skill.zip ready"
