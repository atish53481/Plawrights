# Exercise 5: Build a CLI Toolkit

## Objective
Create a complete developer toolkit around Playwright CLI: npm scripts for every common task, a CI simulation shell script, and a Makefile for convenience commands.

---

## Prerequisites
- A working Playwright project with tests
- Familiarity with npm scripts and basic shell scripting
- Tests that cover at least 2 browser targets

---

## Step 1: Add npm Scripts to package.json

Update the `"scripts"` section of your `package.json`:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:chrome": "npx playwright test --project chromium",
    "test:firefox": "npx playwright test --project firefox",
    "test:webkit": "npx playwright test --project webkit",
    "test:all-browsers": "npx playwright test --project chromium --project firefox --project webkit",
    "test:smoke": "npx playwright test --grep @smoke",
    "test:regression": "npx playwright test --grep @regression",
    "test:retry": "npx playwright test --retries 2",
    "codegen": "npx playwright codegen",
    "codegen:app": "npx playwright codegen http://localhost:3000",
    "report": "npx playwright show-report",
    "trace": "npx playwright show-trace",
    "install:browsers": "npx playwright install --with-deps"
  }
}
```

Verify each script works:
```bash
npm test
npm run test:headed
npm run test:chrome
npm run codegen
npm run report
```

---

## Step 2: Create CI Simulation Script

Create `ci_simulation.sh`:

```bash
#!/bin/bash
set -e

echo "========================================="
echo "  Playwright CI Simulation"
echo "========================================="
echo ""

# Step 1: Install dependencies
echo "[1/6] Installing dependencies..."
npm ci
npx playwright install --with-deps chromium

# Step 2: Run linting (if available)
echo "[2/6] Running lint checks..."
npm run lint 2>/dev/null || echo "No lint script found, skipping..."

# Step 3: Run tests with retries and JSON output
echo "[3/6] Running tests (shard 1/2)..."
npx playwright test --shard 1/2 --retries 2 --reporter json > test-results/shard1.json 2>&1 || true

echo "[4/6] Running tests (shard 2/2)..."
npx playwright test --shard 2/2 --retries 2 --reporter json > test-results/shard2.json 2>&1 || true

# Step 4: Generate HTML report
echo "[5/6] Generating HTML report..."
npx playwright test --reporter html 2>/dev/null || true

# Step 5: Check results
echo "[6/6] Checking results..."
FAILURES=$(npx playwright test --reporter json 2>/dev/null | node -e "
  let data = '';
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.on('end', () => {
    try {
      const results = JSON.parse(data);
      const failed = results.suites?.reduce((acc, s) =>
        acc + s.specs?.filter(sp => sp.ok === false).length, 0) || 0;
      console.log(failed);
    } catch(e) { console.log('unknown'); }
  });
")

echo ""
echo "========================================="
if [ "$FAILURES" = "0" ]; then
  echo "  ALL TESTS PASSED"
  echo "========================================="
  exit 0
else
  echo "  TESTS COMPLETED WITH FAILURES: $FAILURES"
  echo "========================================="
  echo "  Check report: npx playwright show-report"
  exit 1
fi
```

Make it executable:
```bash
chmod +x ci_simulation.sh
```

---

## Step 3: Create a Makefile

Create `Makefile`:

```makefile
.PHONY: test debug report codegen ci install clean help

# Default target
help:
	@echo "Playwright CLI Toolkit"
	@echo "======================"
	@echo ""
	@echo "  make test       - Run all tests headless"
	@echo "  make test-headed - Run all tests with browser visible"
	@echo "  make debug      - Run tests in debug mode"
	@echo "  make ui         - Open Playwright UI mode"
	@echo "  make chrome     - Run tests on Chromium only"
	@echo "  make firefox    - Run tests on Firefox only"
	@echo "  make webkit     - Run tests on WebKit only"
	@echo "  make codegen    - Launch Playwright codegen"
	@echo "  make report     - Open last HTML report"
	@echo "  make trace FILE=<path> - Open a trace file"
	@echo "  make ci         - Run full CI simulation"
	@echo "  make install    - Install browsers"
	@echo "  make clean      - Remove test results and reports"
	@echo ""

test:
	npx playwright test

test-headed:
	npx playwright test --headed

debug:
	npx playwright test --debug

ui:
	npx playwright test --ui

chrome:
	npx playwright test --project chromium

firefox:
	npx playwright test --project firefox

webkit:
	npx playwright test --project webkit

codegen:
	npx playwright codegen

report:
	npx playwright show-report

trace:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make trace FILE=path/to/trace.zip"; \
	else \
		npx playwright show-trace $(FILE); \
	fi

ci:
	bash ci_simulation.sh

install:
	npx playwright install --with-deps

clean:
	rm -rf test-results/ playwright-report/ blob-report/
	@echo "Cleaned test results and reports."
```

---

## Step 4: Test All npm Scripts

Run each npm script and verify it works. Fill in the table:

| Script | Command | Works? | Notes |
|--------|---------|--------|-------|
| test | `npm test` | | |
| test:headed | `npm run test:headed` | | |
| test:debug | `npm run test:debug` | | |
| test:chrome | `npm run test:chrome` | | |
| test:firefox | `npm run test:firefox` | | |
| test:webkit | `npm run test:webkit` | | |
| codegen | `npm run codegen` | | |
| report | `npm run report` | | |

---

## Step 5: Run the CI Simulation

```bash
./ci_simulation.sh
```
- Does it complete successfully?
- Are shard results generated?
- Is the HTML report created?
- What is the exit code on success vs failure?

---

## Deliverables
1. Updated `package.json` with all npm scripts
2. `ci_simulation.sh` -- executable and tested
3. `Makefile` -- all targets working
4. Execution output showing at least 3 npm scripts and the CI simulation running successfully

---

## Bonus
- Add a `test:parallel` script that runs with `--fully-parallel`
- Add a `test:last-failed` script using `--last-failed`
- Add a `snapshot:update` script using `--update-snapshots`
- Create a `.env` file with `CI=true` and test its effect on Playwright behavior
