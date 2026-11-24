# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**ALWAYS read [rules/](./rules/) before changing code.**

## Hard rules

### Adding/modifying tests under `src/tests/**`

After ANY test file change, you MUST run:

```bash
npm run typecheck
npm run lint
```

Both must pass (exit 0) before reporting task complete. See [rules/test-quality-checks.md](./rules/test-quality-checks.md).

Also: smoke-run the changed spec (`npx playwright test path/to/spec.ts --project=chromium`).

## Commands

```bash
npm test                                    # all tests, all projects
npx playwright test src/tests/e2e/saucedemo-journey.spec.ts --project=chromium   # single spec
npx playwright test -g "part of test title"                                      # by title
npm run test:e2e / test:p0 / test:p1        # tag-filtered (@e2e, @p0, @p1)
npm test -- --project=api                   # API tests only
npm run test:headed / test:ui / test:debug  # headed / UI mode / inspector
npm run test:report                         # open Playwright HTML report
npm run test:allure                         # generate + open Allure
npm run typecheck && npm run lint           # required gate after test changes
npm run lint:fix / format                   # autofix
```

Note: this folder is nested one level inside the repo checkout (`AdvancePlaywrightFramework1x-main/AdvancePlaywrightFramework1x-main`). Run all commands from this inner folder — `package.json` and `playwright.config.ts` live here.

## Architecture

Two independent test stacks share one Playwright install, split by project in `playwright.config.ts`:

- **`api` project** — `testMatch` on `src/tests/apiTests/**`; no browser. Targets Restful Booker (`API_BASE_URL`, default `https://restful-booker.herokuapp.com`). Specs escalate in abstraction: `01_*` raw `APIRequestContext` → `02_*` via `ApiHelper` (`@utils/ApiHelper`, HTTP verb wrapper + retry) → `03_*` via `booker.fixture.ts` (fixture-injected `BookingApi` client from `src/api/`) → `04_*` jsonpath-plus queries → `05_*` Ajv schema validation (`@utils/schemaValidator` + `src/testdata/schemas/`).
- **`chromium` project** — everything else (`testIgnore` on apiTests). UI tests target saucedemo.com; `baseURL` = `BASE_URL` env or `https://www.saucedemo.com` (`.env` loaded by dotenv in the config).

### UI test flow (POM)

Spec → fixtures → Page Objects → `UtilElementLocator`:

- Specs import `test`/`expect` from `@fixtures/test-base`, which hands over constructed (not opened) Page Objects — specs call `.open()` or navigate themselves.
- Page Objects (`src/pages/`) extend `BasePage` (gives `page`, `el`, `log`, `goto`). Each declares its own `private readonly` Locators using `[data-test="…"]` attributes; a static `PATH` constant holds the baseURL-relative route.
- All actions go through `this.el` (`UtilElementLocator`) which wraps click/fill/etc. with logging and waits.
- Login creds come from `@config/credentials` (reads `.env`: `SAUCE_USERNAME` / `SAUCE_PASSWORD`); never hardcode creds in specs.
- When adding a Page Object: extend `BasePage`, register a fixture for it in `src/fixtures/test-base.ts` (import + `TestFixture` type + fixture entry), and re-export from `src/pages/index.ts`.

### Reporting chain

`CustomReporter.ts` (first entry in the config's `reporter` array) renders a real-time console box plus a self-contained HTML report in `custom-report/` per run. It maps attachments named `step-<index>-<slug>` back to `test.step` entries — that name contract is produced by `@utils/visualStep` (a `test.step` wrapper that screenshots at step end). Winston `logger` output (stdout) is captured per test and distributed into matching steps. Allure, Playwright HTML, and JSON reporters run alongside.

## Conventions

- Every test title carries at least one tag: `@p0`, `@p1`, `@e2e`, `@smoke`, `@lor` (drives `--grep` scripts and Allure labels).
- No `test.only` / `test.skip` in commits without a ticket reference.
- POM only in UI specs — no raw selectors in spec files; the sole acceptable raw `page` use is URL assertions.
- Use `logger` from `@utils/logger`, not `console.log`.
- Path aliases (tsconfig): `@api/*`, `@config/*`, `@fixtures/*`, `@pages/*`, `@testdata/*`, `@tests/*`, `@utils/*` — no `../../../` relative imports.
- CommonJS project — dependencies must ship CJS builds (e.g. Faker pinned to v8 because v9+ is ESM-only).
