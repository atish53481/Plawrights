#!/bin/bash
# Demo: Retrying failed tests with --retries
# The --retries flag tells Playwright to retry failed tests a specified number of times.
# This is useful for flaky tests or transient failures.
echo "=== Demo: Running Tests with --retries ==="
echo "Command: npx playwright test --project chromium --retries 2"
echo ""
cd "$(dirname "$0")/../.."
npx playwright test --project chromium --retries 2 2>&1 || true
echo ""
echo "=== Demo Complete ==="
