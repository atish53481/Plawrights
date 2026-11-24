#!/bin/bash
# Demo: Running tests in debug mode with --debug
# NOTE: Requires a display. Debug mode opens the Playwright Inspector,
# allowing you to step through test actions one at a time.
echo "=== Demo: Debug Mode ==="
echo "Command: npx playwright test --project chromium --debug tests/01_homepage_title.spec.js"
echo ""
echo "NOTE: This requires a display. Debug mode opens the Playwright Inspector"
echo "      where you can step through each test action one at a time."
echo ""
cd "$(dirname "$0")/../.."
npx playwright test --project chromium --debug cli_project/tests/01_homepage_title.spec.js 2>&1 || true
echo ""
echo "=== Demo Complete ==="
