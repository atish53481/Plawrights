#!/bin/bash
# Demo: Running tests in headed mode with --headed
# NOTE: Requires a display (will not work in headless CI environments).
# Headed mode opens a visible browser window so you can watch the test execute.
echo "=== Demo: Running Tests in Headed Mode ==="
echo "Command: npx playwright test --project chromium --headed tests/01_homepage_title.spec.js"
echo ""
echo "NOTE: This requires a display. It will not work in headless CI environments."
echo ""
cd "$(dirname "$0")/../.."
npx playwright test --project chromium --headed cli_project/tests/01_homepage_title.spec.js 2>&1 || true
echo ""
echo "=== Demo Complete ==="
