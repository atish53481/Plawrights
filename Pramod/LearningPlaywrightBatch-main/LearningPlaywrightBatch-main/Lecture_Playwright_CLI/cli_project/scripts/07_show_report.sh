#!/bin/bash
# Demo: Generating and viewing the HTML report
# First runs the tests to generate report data, then opens the HTML report viewer.
echo "=== Demo: HTML Report ==="
echo ""
cd "$(dirname "$0")/../.."

echo "--- Step 1: Running tests to generate report ---"
npx playwright test --project chromium 2>&1 || true
echo ""

echo "--- Step 2: Opening HTML report ---"
echo "Command: npx playwright show-report cli_project/reports/html-report"
npx playwright show-report cli_project/reports/html-report 2>&1 || true
echo ""
echo "=== Demo Complete ==="
