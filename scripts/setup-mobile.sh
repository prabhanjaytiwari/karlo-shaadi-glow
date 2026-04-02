#!/usr/bin/env bash
# setup-mobile.sh — Initialises native iOS and Android projects for Karlo Shaadi
# Run once locally after cloning, before the first CI run.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Installing Node dependencies..."
npm ci

echo "==> Building web app..."
npm run build

echo "==> Installing Capacitor CLI..."
npm install -g @capacitor/cli@8

echo "==> Adding iOS platform..."
if [ ! -d "ios" ]; then
  npx cap add ios
  echo "    iOS project created."
else
  echo "    iOS project already exists, skipping."
fi

echo "==> Adding Android platform..."
if [ ! -d "android" ]; then
  npx cap add android
  echo "    Android project created."
else
  echo "    Android project already exists, skipping."
fi

echo "==> Syncing Capacitor (copies web build to native projects)..."
npx cap sync

echo ""
echo "✓ Native projects are ready."
echo ""
echo "Next steps:"
echo "  iOS:     open ios/App/App.xcworkspace in Xcode"
echo "  Android: open android/ in Android Studio"
echo ""
echo "Remember to commit ios/ and android/ to git before CI runs!"
