#!/bin/bash
# Demo: Basic test execution with npx playwright test
echo "=== Demo: Running All Tests ==="
echo "Command: npx playwright test --config=../../playwright.config.js"
echo ""
cd "$(dirname "$0")/../.."
npx playwright test --project chromium 2>&1 || true
echo ""
echo "=== Demo Complete ==="
