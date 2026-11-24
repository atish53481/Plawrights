#!/bin/bash
# Demo: Recording and viewing trace files
# Runs a test with tracing enabled, then shows how to view the trace file.
echo "=== Demo: Trace Viewer ==="
echo ""
cd "$(dirname "$0")/../.."

echo "--- Step 1: Running a test with trace enabled ---"
echo "Command: npx playwright test --project chromium --trace on cli_project/tests/01_homepage_title.spec.js"
npx playwright test --project chromium --trace on cli_project/tests/01_homepage_title.spec.js 2>&1 || true
echo ""

echo "--- Step 2: Finding trace files ---"
echo "Trace files are stored in the test-results/ directory as .zip files."
TRACE_FILE=$(find test-results -name "trace.zip" 2>/dev/null | head -1)
if [ -n "$TRACE_FILE" ]; then
  echo "Found trace: $TRACE_FILE"
  echo ""
  echo "--- Step 3: Opening trace viewer ---"
  echo "Command: npx playwright show-trace $TRACE_FILE"
  npx playwright show-trace "$TRACE_FILE" 2>&1 || true
else
  echo "No trace file found. Trace files are generated in test-results/ when tests run with --trace on."
fi
echo ""
echo "=== Demo Complete ==="
