#!/bin/bash
# Demo: Generating tests with npx playwright codegen
# NOTE: Requires a display. This opens a browser window and the Playwright Inspector.
# As you interact with the browser, Playwright records your actions as test code.
echo "=== Demo: Playwright Codegen ==="
echo "Command: npx playwright codegen https://the-internet.herokuapp.com"
echo ""
echo "NOTE: This opens a browser window and the Playwright Inspector."
echo "      Interact with the browser and Playwright will generate test code."
echo "      Close the browser window when done."
echo ""
echo "Pre-recorded codegen examples are available in codegen_output/"
echo ""
cd "$(dirname "$0")/../.."
npx playwright codegen https://the-internet.herokuapp.com 2>&1 || true
echo ""
echo "=== Demo Complete ==="
