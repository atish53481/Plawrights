#!/bin/bash
# Demo: Running tests with a specific --project
# The --project flag selects which browser project to run from playwright.config.js.
echo "=== Demo: Running Tests with --project ==="
echo ""
cd "$(dirname "$0")/../.."

echo "--- Running with Chromium ---"
echo "Command: npx playwright test --project chromium cli_project/tests/01_homepage_title.spec.js"
npx playwright test --project chromium cli_project/tests/01_homepage_title.spec.js 2>&1 || true
echo ""

echo "--- Running with Firefox ---"
echo "Command: npx playwright test --project firefox cli_project/tests/01_homepage_title.spec.js"
npx playwright test --project firefox cli_project/tests/01_homepage_title.spec.js 2>&1 || true
echo ""

echo "=== Demo Complete ==="
