#!/bin/bash
# Demo: Filtering tests with --grep
echo "=== Demo: Running Tests with --grep ==="
echo ""
cd "$(dirname "$0")/../.."
echo "--- Running only 'homepage' tests ---"
npx playwright test --project chromium --grep "homepage" 2>&1 || true
echo ""
echo "--- Running tests excluding 'FAIL' ---"
npx playwright test --project chromium --grep-invert "INTENTIONAL" 2>&1 || true
echo ""
echo "=== Demo Complete ==="
